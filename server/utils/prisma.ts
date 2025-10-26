import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

type PrismaClientInstance = import("@prisma/client").PrismaClient;
type PrismaClientConstructor = new () => PrismaClientInstance;

let prismaConstructor: PrismaClientConstructor | null = null;
let prismaModuleMissing = false;

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClientInstance | null;
};

let cachedClient: PrismaClientInstance | null = globalForPrisma.prisma ?? null;
let isDisabled = false;

function hasDatabaseUrl() {
  const url = process.env.DATABASE_URL?.trim();
  return typeof url === "string" && url.length > 0;
}

function resolvePrismaConstructor(): PrismaClientConstructor | null {
  if (prismaConstructor || prismaModuleMissing) {
    return prismaConstructor;
  }

  try {
    const prismaModule = require("@prisma/client") as typeof import("@prisma/client");
    prismaConstructor = prismaModule.PrismaClient;
    return prismaConstructor;
  } catch (error) {
    prismaModuleMissing = true;
    console.warn("[prisma] @prisma/client module is not available. Prisma client disabled.");
    return null;
  }
}

function createClient(): PrismaClientInstance | null {
  if (!hasDatabaseUrl()) {
    console.warn("[prisma] DATABASE_URL is not configured. Prisma client disabled.");
    isDisabled = true;
    return null;
  }

  const PrismaClient = resolvePrismaConstructor();
  if (!PrismaClient) {
    isDisabled = true;
    return null;
  }

  try {
    const client = new PrismaClient();

    if (process.env.NODE_ENV !== "production") {
      globalForPrisma.prisma = client;
    }

    return client;
  } catch (error) {
    console.error("[prisma] Failed to initialize client", error);
    isDisabled = true;
    return null;
  }
}

export function usePrisma(): PrismaClientInstance | null {
  if (isDisabled) {
    return null;
  }

  if (cachedClient) {
    return cachedClient;
  }

  cachedClient = createClient();
  return cachedClient;
}

export function isPrismaAvailable() {
  return usePrisma() !== null;
}
