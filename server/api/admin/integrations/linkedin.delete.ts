import { defineEventHandler } from "h3";

import { disconnectLinkedinIntegration } from "~/server/utils/linkedin";
import { assertCsrf, requireAdminSession } from "~/server/utils/session";
import { DEFAULT_LOCALE } from "~/utils/i18n/locales";

export default defineEventHandler(async (event) => {
  await assertCsrf(event);
  await requireAdminSession(event);

  await disconnectLinkedinIntegration();

  return {
    connected: false,
    locale: DEFAULT_LOCALE,
    profile: null,
    experiences: [],
    education: [],
    lastSyncedAt: null,
    connectedAt: null,
    lastSyncError: null,
  };
});
