import Prisma from "@prisma/client";

const { PrismaClient } = Prisma;

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const prismaClient = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prismaClient;
}

export function usePrisma() {
  return prismaClient;
}
