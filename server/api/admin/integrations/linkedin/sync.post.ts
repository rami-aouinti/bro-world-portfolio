import { createError, defineEventHandler, readBody } from "h3";
import { z } from "zod";

import { resolveLinkedinToken, syncLinkedinContent } from "~/server/utils/linkedin";
import { getIntegrationSetting } from "~/server/utils/integration-settings";
import { assertCsrf, requireAdminSession } from "~/server/utils/session";
import { resolveLocale } from "~/utils/i18n/locales";

const syncSchema = z.object({
  locale: z.string().optional(),
});

export default defineEventHandler(async (event) => {
  await assertCsrf(event);
  await requireAdminSession(event);

  const payload = await readBody(event);
  const { locale } = syncSchema.parse(payload ?? {});
  const resolvedLocale = resolveLocale(locale);

  const token = await resolveLinkedinToken();
  if (!token) {
    throw createError({ statusCode: 400, statusMessage: "Aucun compte LinkedIn connecté." });
  }

  const [result, connectedAtSetting] = await Promise.all([
    syncLinkedinContent(token, resolvedLocale),
    getIntegrationSetting("linkedin", "connectedAt"),
  ]);

  return {
    connected: true,
    locale: resolvedLocale,
    profile: result.profile,
    experiences: result.experiences,
    education: result.education,
    lastSyncedAt: new Date().toISOString(),
    connectedAt: connectedAtSetting?.value ?? new Date().toISOString(),
    lastSyncError: null,
  };
});
