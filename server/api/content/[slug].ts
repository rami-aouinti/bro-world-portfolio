import { defineEventHandler, getRouterParam, readBody, createError, getQuery } from "h3";
import { assertContentSlug, readContent, writeContent } from "~/server/utils/content-storage";
import { assertCsrf } from "~/server/utils/session";
import { resolveLocale } from "~/utils/i18n/locales";

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug");
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: "Slug requis." });
  }

  assertContentSlug(slug);

  const query = getQuery(event);
  const locale = resolveLocale(typeof query.locale === "string" ? query.locale : undefined);

  switch (event.method) {
    case "GET":
      return await readContent(slug, locale);
    case "PUT":
    case "PATCH": {
      await assertCsrf(event);
      const body = await readBody(event);
      return await writeContent(slug, locale, body);
    }
    default:
      throw createError({ statusCode: 405, statusMessage: "Méthode non autorisée." });
  }
});
