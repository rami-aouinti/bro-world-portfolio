import { useRuntimeConfig } from "#imports";
import type { AdminUser as PrismaAdminUser } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { hashPassword, verifyPassword } from "./password";
import { usePrisma } from "./prisma";
import { deleteCachedValue, getCachedValue, setCachedValue } from "./cache";

export type UserRole = "admin";

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  passwordHash: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAdminUserInput {
  email: string;
  name: string;
  password: string;
  role?: UserRole;
}

export interface UpdateAdminUserInput {
  email?: string;
  name?: string;
  password?: string;
  role?: UserRole;
}

const USER_BY_ID_CACHE_PREFIX = "user:id:";
const USER_BY_EMAIL_CACHE_PREFIX = "user:email:";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function getIdCacheKey(id: string) {
  return `${USER_BY_ID_CACHE_PREFIX}${id}`;
}

function getEmailCacheKey(email: string) {
  return `${USER_BY_EMAIL_CACHE_PREFIX}${normalizeEmail(email)}`;
}

function mapAdminUser(record: PrismaAdminUser): AdminUser {
  return {
    id: record.id,
    email: record.email,
    name: record.name,
    role: record.role as UserRole,
    passwordHash: record.passwordHash,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

async function cacheUser(user: AdminUser) {
  await Promise.all([
    setCachedValue(getIdCacheKey(user.id), user),
    setCachedValue(getEmailCacheKey(user.email), user),
  ]);
}

export async function listUsers() {
  const prisma = usePrisma();
  const users = await prisma.adminUser.findMany();
  const mapped = users.map((user) => mapAdminUser(user));
  await Promise.all(mapped.map((user) => cacheUser(user)));
  return mapped;
}

export async function createAdminUser(data: CreateAdminUserInput) {
  const prisma = usePrisma();
  const email = normalizeEmail(data.email);

  const record = await prisma.adminUser.create({
    data: {
      email,
      name: data.name,
      role: data.role ?? "admin",
      passwordHash: hashPassword(data.password),
    },
  });

  const user = mapAdminUser(record);
  await cacheUser(user);
  return user;
}

export async function updateAdminUser(id: string, data: UpdateAdminUserInput) {
  const prisma = usePrisma();

  const existing = await prisma.adminUser.findUnique({ where: { id } });
  if (!existing) {
    return null;
  }

  const updateData: Prisma.AdminUserUpdateInput = {};

  if (typeof data.email === "string" && data.email.trim()) {
    const normalizedEmail = normalizeEmail(data.email);
    if (normalizedEmail !== existing.email) {
      updateData.email = normalizedEmail;
    }
  }

  if (typeof data.name === "string" && data.name.trim() && data.name !== existing.name) {
    updateData.name = data.name;
  }

  if (typeof data.password === "string" && data.password) {
    updateData.passwordHash = hashPassword(data.password);
  }

  if (typeof data.role === "string" && data.role !== existing.role) {
    updateData.role = data.role;
  }

  if (Object.keys(updateData).length === 0) {
    return mapAdminUser(existing);
  }

  const record = await prisma.adminUser.update({
    where: { id },
    data: updateData,
  });

  const cacheKeys = [getIdCacheKey(id), getEmailCacheKey(existing.email)];
  if ("email" in updateData && typeof updateData.email === "string") {
    cacheKeys.push(getEmailCacheKey(updateData.email));
  }
  await deleteCachedValue(cacheKeys);

  const user = mapAdminUser(record);
  await cacheUser(user);
  return user;
}

export async function deleteAdminUser(id: string) {
  const prisma = usePrisma();

  const existing = await prisma.adminUser.findUnique({ where: { id } });
  if (!existing) {
    return null;
  }

  await prisma.adminUser.delete({ where: { id } });

  await deleteCachedValue([getIdCacheKey(id), getEmailCacheKey(existing.email)]);

  return mapAdminUser(existing);
}

export async function findUserByEmail(email: string) {
  const cacheKey = getEmailCacheKey(email);
  const cached = await getCachedValue<AdminUser>(cacheKey);
  if (cached) {
    return cached;
  }

  const prisma = usePrisma();
  const record = await prisma.adminUser.findUnique({ where: { email: normalizeEmail(email) } });
  if (!record) {
    return null;
  }

  const user = mapAdminUser(record);
  await cacheUser(user);
  return user;
}

export async function ensureDefaultAdmin() {
  const config = useRuntimeConfig();
  const prisma = usePrisma();

  const existing = await prisma.adminUser.findFirst({ where: { role: "admin" } });
  if (existing) {
    return;
  }

  const email = normalizeEmail(config.admin.defaultEmail);
  const password = config.admin.defaultPassword;

  const created = await prisma.adminUser.create({
    data: {
      email,
      name: "Administrator",
      role: "admin",
      passwordHash: hashPassword(password),
    },
  });

  await deleteCachedValue([getEmailCacheKey(email), getIdCacheKey(created.id)]);
  await cacheUser(mapAdminUser(created));
}

export async function verifyUserCredentials(email: string, password: string) {
  const user = await findUserByEmail(email);
  if (!user) {
    return null;
  }

  const isValid = verifyPassword(password, user.passwordHash);
  if (!isValid) {
    return null;
  }

  return user;
}

export async function findUserById(id: string) {
  const cacheKey = getIdCacheKey(id);
  const cached = await getCachedValue<AdminUser>(cacheKey);
  if (cached) {
    return cached;
  }

  const prisma = usePrisma();
  const record = await prisma.adminUser.findUnique({ where: { id } });
  if (!record) {
    return null;
  }

  const user = mapAdminUser(record);
  await cacheUser(user);
  return user;
}

export function toPublicUser(user: AdminUser) {
  const { passwordHash: _passwordHash, ...rest } = user;
  return rest;
}
