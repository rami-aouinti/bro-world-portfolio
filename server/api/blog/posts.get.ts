import { defineEventHandler, getQuery } from "h3";
import { BLOG_POSTS } from "~/server/database/blog/posts";
import type { BlogPost, BlogPostPreview, BlogPostsMeta, BlogPostsResponse } from "~/types/blog";

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function buildPreview(post: BlogPost): BlogPostPreview {
  const { sections, ...rest } = post;
  return rest;
}

export default defineEventHandler((event) => {
  const query = getQuery(event);
  const category = typeof query.category === "string" ? normalize(query.category) : null;
  const tag = typeof query.tag === "string" ? normalize(query.tag) : null;
  const limit =
    typeof query.limit === "string" && query.limit
      ? Number.parseInt(query.limit, 10)
      : null;
  const normalizedLimit = Number.isFinite(limit) && (limit ?? 0) > 0 ? (limit as number) : null;

  const sorted = [...BLOG_POSTS].sort(
    (a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt),
  );

  const filtered = sorted.filter((post) => {
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

  const data = limited.map((post) => buildPreview(post));

  const meta: BlogPostsMeta = {
    total: filtered.length,
    categories: Array.from(categoriesMap.values()).sort((a, b) => a.label.localeCompare(b.label)),
    tags: Array.from(tagsMap.values()).sort((a, b) => a.label.localeCompare(b.label)),
    featured: (() => {
      const selected = filtered.find((post) => post.featured) ?? filtered[0] ?? null;
      return selected ? buildPreview(selected) : null;
    })(),
  };

  return {
    data,
    meta,
  } satisfies BlogPostsResponse;
});
