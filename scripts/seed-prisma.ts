import Prisma from "@prisma/client";
import { BLOG_POSTS } from "../server/database/blog/posts";
import { LIVE_CONTENT } from "../utils/content";
import { SUPPORTED_LOCALES, type LocaleCode } from "../utils/i18n/locales";

const { PrismaClient } = Prisma;

const prisma = new PrismaClient();

function resolveAuthorId(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

async function seedLocales() {
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

async function seedContent() {
  const entries = Object.entries(LIVE_CONTENT) as [LocaleCode, typeof LIVE_CONTENT[LocaleCode]][];

  for (const [locale, record] of entries) {
    const slugs = Object.keys(record);
    for (const slug of slugs) {
      await prisma.contentBlock.upsert({
        where: { slug_localeCode: { slug, localeCode: locale } },
        update: {
          payload: record[slug as keyof typeof record],
        },
        create: {
          slug,
          localeCode: locale,
          payload: record[slug as keyof typeof record],
        },
      });
    }
  }
}

async function seedBlog() {
  for (const post of BLOG_POSTS) {
    const authorId = resolveAuthorId(post.author.name);

    await prisma.blogAuthor.upsert({
      where: { id: authorId },
      update: {
        name: post.author.name,
        role: post.author.role,
        avatar: post.author.avatar,
      },
      create: {
        id: authorId,
        name: post.author.name,
        role: post.author.role,
        avatar: post.author.avatar,
      },
    });

    await prisma.blogPost.upsert({
      where: { id: post.id },
      update: {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        description: post.description,
        coverImage: post.coverImage,
        heroImage: post.heroImage ?? null,
        category: post.category,
        tags: post.tags,
        readingTimeMinutes: post.readingTimeMinutes,
        publishedAt: new Date(post.publishedAt),
        updatedAt: post.updatedAt ? new Date(post.updatedAt) : null,
        featured: Boolean(post.featured),
        authorId,
      },
      create: {
        id: post.id,
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        description: post.description,
        coverImage: post.coverImage,
        heroImage: post.heroImage ?? null,
        category: post.category,
        tags: post.tags,
        readingTimeMinutes: post.readingTimeMinutes,
        publishedAt: new Date(post.publishedAt),
        updatedAt: post.updatedAt ? new Date(post.updatedAt) : null,
        featured: Boolean(post.featured),
        authorId,
      },
    });

    await prisma.blogPostStats.upsert({
      where: { postId: post.id },
      update: {
        views: post.stats.views,
        reactions: post.stats.reactions,
      },
      create: {
        postId: post.id,
        views: post.stats.views,
        reactions: post.stats.reactions,
      },
    });

    await prisma.blogSection.deleteMany({ where: { postId: post.id } });
    if (post.sections.length > 0) {
      await prisma.blogSection.createMany({
        data: post.sections.map((section, index) => ({
          postId: post.id,
          order: index,
          type: section.type,
          data: section,
        })),
      });
    }
  }
}

async function main() {
  await seedLocales();
  await seedContent();
  await seedBlog();
  console.info("Prisma seed completed successfully.");
}

main()
  .catch((error) => {
    console.error("Failed to seed Prisma database", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
