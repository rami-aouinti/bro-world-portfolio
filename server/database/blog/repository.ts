import type { Prisma } from "@prisma/client";
import type { BlogPost, BlogPostPreview, BlogPostSection } from "~/types/blog";
import { usePrisma } from "~/server/utils/prisma";
import { deleteCachedValue, getCachedValue, setCachedValue } from "~/server/utils/cache";

const LIST_CACHE_KEY = "blog:posts:list";
const POST_CACHE_KEY_PREFIX = "blog:post:";

type PrismaBlogPost = Prisma.BlogPostGetPayload<{
  include: { author: true; stats: true; sections: true };
}>;

function getPostCacheKey(slug: string) {
  return `${POST_CACHE_KEY_PREFIX}${slug}`;
}

function resolveAuthorId(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function mapSection(section: { type: string; data: unknown }): BlogPostSection {
  const payload = section.data as BlogPostSection;
  if (payload?.type !== section.type) {
    return { ...(payload as BlogPostSection), type: section.type as BlogPostSection["type"] };
  }
  return payload;
}

function mapPost(record: PrismaBlogPost): BlogPost {
  if (!record.author) {
    throw new Error(`Missing author for post ${record.slug}`);
  }

  if (!record.stats) {
    throw new Error(`Missing stats for post ${record.slug}`);
  }

  return {
    id: record.id,
    slug: record.slug,
    title: record.title,
    excerpt: record.excerpt,
    description: record.description,
    coverImage: record.coverImage,
    heroImage: record.heroImage ?? undefined,
    category: record.category,
    tags: record.tags,
    readingTimeMinutes: record.readingTimeMinutes,
    publishedAt: record.publishedAt.toISOString(),
    updatedAt: record.updatedAt?.toISOString() ?? undefined,
    featured: record.featured,
    author: {
      name: record.author.name,
      role: record.author.role,
      avatar: record.author.avatar,
    },
    stats: {
      views: record.stats.views,
      reactions: record.stats.reactions,
    },
    sections: record.sections
      .sort((a, b) => a.order - b.order)
      .map((section) => mapSection({ type: section.type, data: section.data })),
  } satisfies BlogPost;
}

async function fetchPostFromDatabase(slug: string) {
  const prisma = usePrisma();
  const record = await prisma.blogPost.findUnique({
    where: { slug },
    include: {
      author: true,
      stats: true,
      sections: true,
    },
  });

  return record ? mapPost(record as PrismaBlogPost) : null;
}

export async function listPosts() {
  const cached = await getCachedValue<BlogPost[]>(LIST_CACHE_KEY);
  if (cached) {
    return cached;
  }

  const prisma = usePrisma();
  const records = await prisma.blogPost.findMany({
    orderBy: { publishedAt: "desc" },
    include: {
      author: true,
      stats: true,
      sections: true,
    },
  });

  const posts = records.map((record) => mapPost(record as PrismaBlogPost));

  await setCachedValue(LIST_CACHE_KEY, posts);
  await Promise.all(posts.map((post) => setCachedValue(getPostCacheKey(post.slug), post)));

  return posts;
}

export async function findPostBySlug(slug: string) {
  const cacheKey = getPostCacheKey(slug);
  const cached = await getCachedValue<BlogPost>(cacheKey);
  if (cached) {
    return cached;
  }

  const post = await fetchPostFromDatabase(slug);
  if (post) {
    await setCachedValue(cacheKey, post);
  }
  return post;
}

export async function upsertPost(payload: BlogPost) {
  const prisma = usePrisma();
  const authorId = resolveAuthorId(payload.author.name);

  await prisma.$transaction(async (tx) => {
    await tx.blogAuthor.upsert({
      where: { id: authorId },
      update: {
        name: payload.author.name,
        role: payload.author.role,
        avatar: payload.author.avatar,
      },
      create: {
        id: authorId,
        name: payload.author.name,
        role: payload.author.role,
        avatar: payload.author.avatar,
      },
    });

    await tx.blogPost.upsert({
      where: { id: payload.id },
      update: {
        slug: payload.slug,
        title: payload.title,
        excerpt: payload.excerpt,
        description: payload.description,
        coverImage: payload.coverImage,
        heroImage: payload.heroImage ?? null,
        category: payload.category,
        tags: payload.tags,
        readingTimeMinutes: payload.readingTimeMinutes,
        publishedAt: new Date(payload.publishedAt),
        updatedAt: payload.updatedAt ? new Date(payload.updatedAt) : null,
        featured: Boolean(payload.featured),
        authorId: authorId,
      },
      create: {
        id: payload.id,
        slug: payload.slug,
        title: payload.title,
        excerpt: payload.excerpt,
        description: payload.description,
        coverImage: payload.coverImage,
        heroImage: payload.heroImage ?? null,
        category: payload.category,
        tags: payload.tags,
        readingTimeMinutes: payload.readingTimeMinutes,
        publishedAt: new Date(payload.publishedAt),
        updatedAt: payload.updatedAt ? new Date(payload.updatedAt) : null,
        featured: Boolean(payload.featured),
        authorId: authorId,
      },
    });

    await tx.blogPostStats.upsert({
      where: { postId: payload.id },
      update: {
        views: payload.stats.views,
        reactions: payload.stats.reactions,
      },
      create: {
        postId: payload.id,
        views: payload.stats.views,
        reactions: payload.stats.reactions,
      },
    });

    await tx.blogSection.deleteMany({ where: { postId: payload.id } });
    if (payload.sections.length > 0) {
      await tx.blogSection.createMany({
        data: payload.sections.map((section, index) => ({
          postId: payload.id,
          order: index,
          type: section.type,
          data: section,
        })),
      });
    }
  });

  const cacheKey = getPostCacheKey(payload.slug);
  await deleteCachedValue([LIST_CACHE_KEY, cacheKey]);
  await setCachedValue(cacheKey, payload);
}

export function toPreview(post: BlogPost): BlogPostPreview {
  const { sections, ...preview } = post;
  return preview;
}
