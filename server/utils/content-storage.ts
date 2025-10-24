import { DEFAULT_CONTENT } from "~/utils/content";
import type { ContentRecord, ContentSlug } from "~/types/content";
import { contentSchemas, parseContentBySlug } from "~/types/content";
import { createError } from "h3";
import { useStorage } from "#imports";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type LocaleCode } from "~/utils/i18n/locales";

const CONTENT_FILE_EXTENSION = ".json" as const;

type LocalizedContentEntry = [LocaleCode, ContentRecord];

type StorageKey = `${LocaleCode}/${ContentSlug}${typeof CONTENT_FILE_EXTENSION}`;

function getContentKey(locale: LocaleCode, slug: ContentSlug): StorageKey {
  return `${locale}/${slug}${CONTENT_FILE_EXTENSION}`;
}

function getContentStorage() {
  return useStorage("content");
}

function getDefaultContent(locale: LocaleCode, slug: ContentSlug) {
  const localized = DEFAULT_CONTENT[locale] ?? DEFAULT_CONTENT[DEFAULT_LOCALE];
  return localized[slug];
}

export async function ensureContentDefaults() {
  const storage = getContentStorage();

  const entries = Object.entries(DEFAULT_CONTENT) as LocalizedContentEntry[];

  await Promise.all(
    entries.flatMap(([locale, record]) =>
      (Object.keys(record) as ContentSlug[]).map(async (slug) => {
        const key = getContentKey(locale, slug);
        const existing = await storage.getItem(key);
        if (existing === null) {
          await storage.setItem(key, record[slug]);
        }
      }),
    ),
  );
}

export async function listAllContent(locale: LocaleCode) {
  const record: Partial<ContentRecord> = {};
  const localizedContent = DEFAULT_CONTENT[locale] ?? DEFAULT_CONTENT[DEFAULT_LOCALE];

  await Promise.all(
    (Object.keys(localizedContent) as ContentSlug[]).map(async (slug) => {
      record[slug] = await readContent(slug, locale);
    }),
  );

  return record as ContentRecord;
}

export async function readContent<TSlug extends ContentSlug>(slug: TSlug, locale: LocaleCode) {
  const storage = getContentStorage();
  const key = getContentKey(locale, slug);
  const raw = await storage.getItem(key);

  if (raw === null) {
    const fallback = getDefaultContent(locale, slug);
    await storage.setItem(key, fallback);
    return fallback;
  }

  const schema = contentSchemas[slug];
  const parsed = schema.safeParse(raw);

  if (parsed.success) {
    return parsed.data;
  }

  console.error(`Impossible de valider le bloc “${slug}”.`, parsed.error);

  const fallback = getDefaultContent(locale, slug);
  await storage.setItem(key, fallback);
  return fallback;
}

export async function writeContent<TSlug extends ContentSlug>(slug: TSlug, locale: LocaleCode, payload: unknown) {
  const storage = getContentStorage();
  try {
    const parsed = parseContentBySlug(slug, payload);
    await storage.setItem(getContentKey(locale, slug), parsed);
    return parsed;
  }
  catch (error) {
    throw createError({
      statusCode: 400,
      statusMessage: `Le contenu fourni pour “${slug}” est invalide.`,
      data: error,
    });
  }
}

export function assertContentSlug(value: string): asserts value is ContentSlug {
  if (!(value in contentSchemas)) {
    throw createError({
      statusCode: 404,
      statusMessage: "Section introuvable.",
    });
  }
}

export function assertLocaleCode(value: string): asserts value is LocaleCode {
  if (!SUPPORTED_LOCALES.includes(value as LocaleCode)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Langue non prise en charge.",
    });
  }
}
