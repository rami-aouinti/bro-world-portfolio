import { defineEventHandler, getQuery } from "h3";
import { listPosts, toPreview } from "~/server/database/blog/repository";
import type { BlogPostPreview, BlogPostsMeta, BlogPostsResponse } from "~/types/blog";

function normalize(value: string) {
  return value.trim().toLowerCase();
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const category = typeof query.category === "string" ? normalize(query.category) : null;
  const tag = typeof query.tag === "string" ? normalize(query.tag) : null;
  const limit =
    typeof query.limit === "string" && query.limit ? Number.parseInt(query.limit, 10) : null;
  const normalizedLimit = Number.isFinite(limit) && (limit ?? 0) > 0 ? (limit as number) : null;

  const posts = await listPosts();

  const filtered = posts.filter((post) => {
    const matchesCategory = category ? normalize(post.category) === category : true;
    const matchesTag = tag ? post.tags.map(normalize).includes(tag) : true;
    return matchesCategory && matchesTag;
  });

  const limited = normalizedLimit ? filtered.slice(0, normalizedLimit) : filtered;

  const categoriesMap = new Map<string, { id: string; label: string; count: number }>();
  const tagsMap = new Map<string, { id: string; label: string; count: number }>();

  for (const post of filtered) {
    const key = normalize(post.category);
    const existingCategory = categoriesMap.get(key);
    if (existingCategory) {
      existingCategory.count += 1;
    } else {
      categoriesMap.set(key, { id: key, label: post.category, count: 1 });
    }

    for (const currentTag of post.tags) {
      const tagKey = normalize(currentTag);
      const existingTag = tagsMap.get(tagKey);
      if (existingTag) {
        existingTag.count += 1;
      } else {
        tagsMap.set(tagKey, { id: tagKey, label: currentTag, count: 1 });
      }
    }
  }

  const data = limited.map((post) => toPreview(post));

  const meta: BlogPostsMeta = {
    total: filtered.length,
    categories: Array.from(categoriesMap.values()).sort((a, b) => a.label.localeCompare(b.label)),
    tags: Array.from(tagsMap.values()).sort((a, b) => a.label.localeCompare(b.label)),
    featured: (() => {
      const selected = filtered.find((post) => post.featured) ?? filtered[0] ?? null;
      return selected ? (toPreview(selected) as BlogPostPreview) : null;
    })(),
  };

  return {
    data,
    meta,
  } satisfies BlogPostsResponse;
});
