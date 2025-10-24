import type { AsyncDataOptions } from "#app";
import type { WatchSource } from "vue";
import type { ContentRecord, ContentSlug } from "~/types/content";

export function useContentBlock<TSlug extends ContentSlug>(
  slug: TSlug,
  options: AsyncDataOptions<ContentRecord[TSlug]> = {},
) {
  const { locale } = useI18n();

  const watchOption = options.watch;
  let watchSources: AsyncDataOptions<ContentRecord[TSlug]>["watch"];

  if (watchOption === false) {
    watchSources = false;
  }
  else {
    const normalized: WatchSource[] = [];
    if (Array.isArray(watchOption)) {
      normalized.push(...watchOption);
    }
    else if (watchOption) {
      normalized.push(watchOption as WatchSource);
    }
    normalized.push(locale);
    watchSources = normalized;
  }

  return useAsyncData(
    () => `content-${slug}-${locale.value}`,
    () => $fetch<ContentRecord[TSlug]>(`/api/content/${slug}`, { query: { locale: locale.value } }),
    {
      ...options,
      watch: watchSources,
    },
  );
}
