import type { AsyncDataOptions } from '#app'
import type { ContentRecord, ContentSlug } from '~/types/content'

export function useContentBlock<TSlug extends ContentSlug>(
  slug: TSlug,
  options: AsyncDataOptions<ContentRecord[TSlug]> = {}
) {
  return useAsyncData(
    `content-${slug}`,
    () => $fetch<ContentRecord[TSlug]>(`/api/content/${slug}`),
    options
  )
}
