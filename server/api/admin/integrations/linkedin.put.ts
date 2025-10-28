import { defineEventHandler, readBody } from "h3";
import { z } from "zod";

import {
  connectLinkedinIntegration,
  resolveLinkedinToken,
  syncLinkedinContent,
} from "~/server/utils/linkedin";
import { getIntegrationSetting } from "~/server/utils/integration-settings";
import { assertCsrf, requireAdminSession } from "~/server/utils/session";
import { resolveLocale } from "~/utils/i18n/locales";

const connectSchema = z.object({
  token: z.string().trim().min(1, "Le token LinkedIn est requis."),
  locale: z.string().optional(),
});

export default defineEventHandler(async (event) => {
  await assertCsrf(event);
  await requireAdminSession(event);

  const payload = await readBody(event);
  const { token, locale } = connectSchema.parse(payload);
  const resolvedLocale = resolveLocale(locale);

  const profile = await connectLinkedinIntegration(token);
  const syncResult = await syncLinkedinContent(token, resolvedLocale);

  const [persistedToken, connectedAtSetting] = await Promise.all([
    resolveLinkedinToken(),
    getIntegrationSetting("linkedin", "connectedAt"),
  ]);

  return {
    connected: Boolean(persistedToken),
    locale: resolvedLocale,
    profile: syncResult.profile ?? profile,
    experiences: syncResult.experiences,
    education: syncResult.education,
    lastSyncedAt: new Date().toISOString(),
    connectedAt: connectedAtSetting?.value ?? new Date().toISOString(),
    lastSyncError: null,
  };
});
