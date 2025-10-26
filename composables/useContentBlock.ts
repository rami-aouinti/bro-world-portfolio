import type { AsyncDataOptions } from "#app";
import type { WatchSource } from "vue";
import type { ContentRecord, ContentSlug } from "~/types/content";
import { DEFAULT_CONTENT } from "~/utils/content";
import { DEFAULT_LOCALE, resolveLocale, type LocaleCode } from "~/utils/i18n/locales";

const LEGACY_PROFILE_ROLES: Partial<Record<LocaleCode, string[]>> = {
  en: ["FullStack Developer (PHP & Vue)", "Fullstack Developer (PHP & Vue)", "Fullstack Developer"],
};

function resolveFallbackContent<TSlug extends ContentSlug>(
  slug: TSlug,
  localeCode: LocaleCode,
): ContentRecord[TSlug] {
  const localized = DEFAULT_CONTENT[localeCode] ?? DEFAULT_CONTENT[DEFAULT_LOCALE];
  return localized[slug];
}

function normalizeContentPayload<TSlug extends ContentSlug>(
  slug: TSlug,
  localeCode: LocaleCode,
  payload: ContentRecord[TSlug],
): ContentRecord[TSlug] {
  if (slug === "profile") {
    const profilePayload = { ...(payload as ContentRecord["profile"]) };
    const fallback = resolveFallbackContent("profile", localeCode);
    const legacyRoles = LEGACY_PROFILE_ROLES[localeCode] ?? [];

    if (legacyRoles.includes(profilePayload.role)) {
      profilePayload.role = fallback.role;
      return profilePayload as ContentRecord[TSlug];
    }

    return profilePayload as ContentRecord[TSlug];
  }

  return payload;
}

export function useContentBlock<TSlug extends ContentSlug>(
  slug: TSlug,
  options: AsyncDataOptions<ContentRecord[TSlug]> = {},
) {
  const { locale } = useI18n();

  const watchOption = options.watch;
  let watchSources: AsyncDataOptions<ContentRecord[TSlug]>["watch"];

  if (watchOption === false) {
    watchSources = false;
  } else {
    const normalized: WatchSource[] = [];
    if (Array.isArray(watchOption)) {
      normalized.push(...watchOption);
    } else if (watchOption) {
      normalized.push(watchOption as WatchSource);
    }
    normalized.push(locale);
    watchSources = normalized;
  }

  return useAsyncData(
    () => `content-${slug}-${locale.value}`,
    async () => {
      const localeCode = resolveLocale(locale.value);

      try {
        const payload = await $fetch<ContentRecord[TSlug]>(`/api/content/${slug}`, {
          query: { locale: localeCode },
        });

        const resolved = payload ?? resolveFallbackContent(slug, localeCode);
        return normalizeContentPayload(slug, localeCode, resolved);
      } catch (error) {
        if (import.meta.dev) {
          console.warn(
            `[useContentBlock] Failed to load "${slug}" content for locale "${localeCode}". Falling back to defaults.`,
            error,
          );
        }

        return normalizeContentPayload(slug, localeCode, resolveFallbackContent(slug, localeCode));
      }
    },
    {
      ...options,
      watch: watchSources,
      default: () => {
        const initialLocale = resolveLocale(locale.value);
        const fallback = resolveFallbackContent(slug, initialLocale);
        return normalizeContentPayload(slug, initialLocale, { ...fallback });
      },
    },
  );
}
