import { createError } from "h3";

import { usePrisma } from "./prisma";

export interface IntegrationSettingRecord {
  id: string;
  provider: string;
  key: string;
  value: string;
  isSecret: boolean;
  createdAt: Date;
  updatedAt: Date;
}

async function getPrismaOrThrow() {
  const prisma = usePrisma();
  if (!prisma) {
    throw createError({
      statusCode: 503,
      statusMessage: "Le stockage des intégrations est indisponible.",
    });
  }
  return prisma;
}

export async function getIntegrationSetting(provider: string, key: string) {
  const prisma = usePrisma();
  if (!prisma) {
    return null;
  }

  const record = await prisma.integrationSetting.findUnique({
    where: { provider_key: { provider, key } },
  });

  return record as IntegrationSettingRecord | null;
}

export async function setIntegrationSetting(
  provider: string,
  key: string,
  value: string,
  options: { isSecret?: boolean } = {},
) {
  const prisma = await getPrismaOrThrow();

  const record = await prisma.integrationSetting.upsert({
    where: { provider_key: { provider, key } },
    create: { provider, key, value, isSecret: Boolean(options.isSecret) },
    update: { value, isSecret: Boolean(options.isSecret) },
  });

  return record as IntegrationSettingRecord;
}

export async function deleteIntegrationSetting(provider: string, key: string) {
  const prisma = usePrisma();
  if (!prisma) {
    return;
  }

  await prisma.integrationSetting.delete({
    where: { provider_key: { provider, key } },
  }).catch(() => undefined);
}

export async function listIntegrationSettings(provider: string) {
  const prisma = usePrisma();
  if (!prisma) {
    return [] as IntegrationSettingRecord[];
  }

  const records = await prisma.integrationSetting.findMany({
    where: { provider },
  });

  return records as IntegrationSettingRecord[];
}
