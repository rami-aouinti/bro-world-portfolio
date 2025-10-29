import { randomUUID } from "node:crypto";
import { createError, deleteCookie, getCookie, setCookie } from "h3";
import { useRuntimeConfig } from "#imports";
import { usePrisma } from "./prisma";
import type { AdminUser } from "./user-store";
import { findUserById, toPublicUser } from "./user-store";

interface SessionRecord {
  token: string;
  userId: string;
  role: AdminUser["role"];
  csrfToken: string;
  expiresAt: number;
  createdAt: number;
}

type AuthSession = {
  token: string;
  csrfToken: string;
  user: ReturnType<typeof toPublicUser>;
};

function mapSession(record: {
  token: string;
  userId: string;
  role: string;
  csrfToken: string;
  expiresAt: Date;
  createdAt: Date;
}): SessionRecord {
  return {
    token: record.token,
    userId: record.userId,
    role: record.role as AdminUser["role"],
    csrfToken: record.csrfToken,
    expiresAt: record.expiresAt.getTime(),
    createdAt: record.createdAt.getTime(),
  };
}

function createDevAuthSession(config: ReturnType<typeof useRuntimeConfig>): AuthSession {
  const now = new Date().toISOString();

  return {
    token: "dev-session-token",
    csrfToken: "dev-csrf-token",
    user: {
      id: "dev-admin",
      email: config.admin.defaultEmail,
      name: "Developer Admin",
      role: "admin",
      createdAt: now,
      updatedAt: now,
    },
  };
}

export async function createSession(event: Parameters<typeof setCookie>[0], user: AdminUser) {
  const config = useRuntimeConfig();
  const prisma = usePrisma();
  if (!prisma) {
    throw createError({
      statusCode: 503,
      statusMessage: "Le service d'authentification est indisponible.",
    });
  }
  const token = randomUUID();
  const csrfToken = randomUUID();
  const maxAge = config.auth.sessionMaxAge;
  const now = new Date();
  const expiresAt = new Date(now.getTime() + maxAge * 1000);

  const record = await prisma.session.create({
    data: {
      token,
      userId: user.id,
      role: user.role,
      csrfToken,
      expiresAt,
    },
  });

  setCookie(event, config.auth.sessionCookieName, token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  });

  setCookie(event, config.auth.csrfCookieName, csrfToken, {
    httpOnly: false,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  });

  return mapSession(record);
}

export async function getAuthSession(event: Parameters<typeof getCookie>[0]) {
  const config = useRuntimeConfig();
  let devSession: AuthSession | null = null;

  if (import.meta.dev) {
    devSession = createDevAuthSession(config);
  }

  const prisma = usePrisma();
  if (!prisma) {
    return devSession;
  }
  const token = getCookie(event, config.auth.sessionCookieName);
  if (!token) {
    return devSession;
  }

  const record = await prisma.session.findUnique({ where: { token } });
  if (!record) {
    return devSession;
  }

  if (record.expiresAt.getTime() < Date.now()) {
    await prisma.session.delete({ where: { token } });
    deleteCookie(event, config.auth.sessionCookieName);
    deleteCookie(event, config.auth.csrfCookieName);
    return devSession;
  }

  const user = await findUserById(record.userId);
  if (!user) {
    await prisma.session.delete({ where: { token } });
    return devSession;
  }

  return {
    token,
    csrfToken: record.csrfToken,
    user: toPublicUser(user),
  };
}

export async function requireAdminSession(event: Parameters<typeof getCookie>[0]) {
  const session = await getAuthSession(event);
  if (!session || session.user.role !== "admin") {
    if (import.meta.dev) {
      return createDevAuthSession(useRuntimeConfig());
    }
    throw createError({ statusCode: 401, statusMessage: "Authentification requise." });
  }
  return session;
}

export async function destroySession(event: Parameters<typeof getCookie>[0]) {
  const config = useRuntimeConfig();
  const prisma = usePrisma();
  if (!prisma) {
    return;
  }
  const token = getCookie(event, config.auth.sessionCookieName);
  if (!token) {
    return;
  }

  await prisma.session.delete({ where: { token } }).catch(() => {});
  deleteCookie(event, config.auth.sessionCookieName);
  deleteCookie(event, config.auth.csrfCookieName);
}

export async function assertCsrf(event: Parameters<typeof getCookie>[0]) {
  const config = useRuntimeConfig();
  const headerToken = event.node.req.headers["x-csrf-token"];
  if (!headerToken) {
    throw createError({ statusCode: 400, statusMessage: "Token CSRF manquant." });
  }

  const session = await requireAdminSession(event);
  if (Array.isArray(headerToken) || headerToken !== session.csrfToken) {
    throw createError({ statusCode: 400, statusMessage: "Token CSRF invalide." });
  }
}
