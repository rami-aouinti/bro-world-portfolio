import { defineEventHandler, getQuery } from "h3";
import { listAllContent } from "~/server/utils/content-storage";
import { resolveLocale } from "~/utils/i18n/locales";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const locale = resolveLocale(typeof query.locale === "string" ? query.locale : undefined);
  return await listAllContent(locale);
});
