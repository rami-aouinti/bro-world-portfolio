import { defineEventHandler, getQuery } from "h3";

import { getLinkedinIntegrationState } from "~/server/utils/linkedin";
import { requireAdminSession } from "~/server/utils/session";
import { resolveLocale } from "~/utils/i18n/locales";

export default defineEventHandler(async (event) => {
  await requireAdminSession(event);

  const query = getQuery(event);
  const locale = resolveLocale(typeof query.locale === "string" ? query.locale : undefined);

  try {
    const state = await getLinkedinIntegrationState(locale);
    return state;
  } catch (error) {
    console.error("[linkedin] Failed to resolve integration state", error);
    return {
      connected: false,
      locale,
      profile: null,
      experiences: [],
      education: [],
      lastSyncedAt: null,
      connectedAt: null,
      lastSyncError: "Impossible de récupérer les données LinkedIn.",
    };
  }
});
