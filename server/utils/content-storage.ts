import { createError } from "h3";
import { DEFAULT_CONTENT } from "~/utils/content";
import type { ContentRecord, ContentSlug } from "~/types/content";
import { contentSchemas, parseContentBySlug } from "~/types/content";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type LocaleCode } from "~/utils/i18n/locales";
import { usePrisma } from "./prisma";
import { deleteCachedValue, getCachedValue, setCachedValue } from "./cache";

const CONTENT_ENTRY_CACHE_PREFIX = "content:entry:";
const CONTENT_LIST_CACHE_PREFIX = "content:list:";

type LocalizedContentEntry = [LocaleCode, ContentRecord];

type CacheableContent<TSlug extends ContentSlug> = ContentRecord[TSlug];

type StorageKey = `${LocaleCode}:${ContentSlug}`;

function getEntryCacheKey(locale: LocaleCode, slug: ContentSlug): StorageKey {
  return `${locale}:${slug}`;
}

function getListCacheKey(locale: LocaleCode) {
  return `${CONTENT_LIST_CACHE_PREFIX}${locale}`;
}

function getEntryCacheKeyWithPrefix(locale: LocaleCode, slug: ContentSlug) {
  return `${CONTENT_ENTRY_CACHE_PREFIX}${getEntryCacheKey(locale, slug)}`;
}

function getDefaultContent(locale: LocaleCode, slug: ContentSlug) {
  const localized = DEFAULT_CONTENT[locale] ?? DEFAULT_CONTENT[DEFAULT_LOCALE];
  return localized[slug];
}

async function ensureLocales() {
  const prisma = usePrisma();
  await Promise.all(
    SUPPORTED_LOCALES.map((code) =>
      prisma.locale.upsert({
        where: { code },
        update: { label: code },
        create: { code, label: code },
      }),
    ),
  );
}

export async function ensureContentDefaults() {
  const prisma = usePrisma();
  await ensureLocales();

  const entries = Object.entries(DEFAULT_CONTENT) as LocalizedContentEntry[];

  await prisma.$transaction(async (tx) => {
    for (const [locale, record] of entries) {
      const slugs = Object.keys(record) as ContentSlug[];
      for (const slug of slugs) {
        await tx.contentBlock.upsert({
          where: { slug_localeCode: { slug, localeCode: locale } },
          update: {},
          create: {
            slug,
            localeCode: locale,
            payload: record[slug],
          },
        });
      }
    }
  });

  const listKeys = SUPPORTED_LOCALES.map((locale) => getListCacheKey(locale));
  await deleteCachedValue(listKeys);
}

export async function listAllContent(locale: LocaleCode) {
  const cacheKey = getListCacheKey(locale);
  const cached = await getCachedValue<ContentRecord>(cacheKey);
  if (cached) {
    return cached;
  }

  const localizedContent = DEFAULT_CONTENT[locale] ?? DEFAULT_CONTENT[DEFAULT_LOCALE];
  const record: Partial<ContentRecord> = {};

  for (const slug of Object.keys(localizedContent) as ContentSlug[]) {
    record[slug] = await readContent(slug, locale);
  }

  const parsed = record as ContentRecord;
  await setCachedValue(cacheKey, parsed);
  return parsed;
}

export async function readContent<TSlug extends ContentSlug>(slug: TSlug, locale: LocaleCode) {
  const cacheKey = getEntryCacheKeyWithPrefix(locale, slug);
  const cached = await getCachedValue<CacheableContent<TSlug>>(cacheKey);
  if (cached) {
    return cached;
  }

  const prisma = usePrisma();
  const block = await prisma.contentBlock.findUnique({
    where: { slug_localeCode: { slug, localeCode: locale } },
  });

  const schema = contentSchemas[slug];

  if (block) {
    const parsed = schema.safeParse(block.payload);
    if (parsed.success) {
      await setCachedValue(cacheKey, parsed.data);
      return parsed.data;
    }

    console.error(`Impossible de valider le bloc “${slug}”.`, parsed.error);
  }

  const fallback = getDefaultContent(locale, slug);

  await prisma.contentBlock.upsert({
    where: { slug_localeCode: { slug, localeCode: locale } },
    update: {
      payload: fallback,
    },
    create: {
      slug,
      localeCode: locale,
      payload: fallback,
    },
  });

  await setCachedValue(cacheKey, fallback);
  await deleteCachedValue(getListCacheKey(locale));
  return fallback as CacheableContent<TSlug>;
}

export async function writeContent<TSlug extends ContentSlug>(
  slug: TSlug,
  locale: LocaleCode,
  payload: unknown,
) {
  const parsed = parseContentBySlug(slug, payload);
  const prisma = usePrisma();

  await prisma.contentBlock.upsert({
    where: { slug_localeCode: { slug, localeCode: locale } },
    update: {
      payload: parsed,
    },
    create: {
      slug,
      localeCode: locale,
      payload: parsed,
    },
  });

  const entryKey = getEntryCacheKeyWithPrefix(locale, slug);
  await deleteCachedValue([entryKey, getListCacheKey(locale)]);
  await setCachedValue(entryKey, parsed);
  return parsed;
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
