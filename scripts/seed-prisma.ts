import { PrismaClient } from "@prisma/client";
import { BLOG_POSTS } from "../server/database/blog/posts";
import { LIVE_CONTENT } from "../utils/content";
import { SUPPORTED_LOCALES, type LocaleCode } from "../utils/i18n/locales";

const prisma = new PrismaClient();

function resolveAuthorId(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

async function ensureDatabaseSchema() {
  const lookup = await prisma.$queryRaw<{ name: string | null }[]>`
    SELECT to_regclass('public."Locale"')::text AS "name";
  `;

  if (lookup[0]?.name) {
    return;
  }

  const statements = [
    `CREATE TABLE "Locale" (
      "code" TEXT PRIMARY KEY,
      "label" TEXT NOT NULL
    )`,
    `CREATE TABLE "ContentBlock" (
      "id" TEXT PRIMARY KEY,
      "slug" TEXT NOT NULL,
      "localeCode" TEXT NOT NULL,
      "payload" JSONB NOT NULL,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE "BlogAuthor" (
      "id" TEXT PRIMARY KEY,
      "name" TEXT NOT NULL,
      "role" TEXT NOT NULL,
      "avatar" TEXT NOT NULL
    )`,
    `CREATE TABLE "BlogPost" (
      "id" TEXT PRIMARY KEY,
      "slug" TEXT NOT NULL,
      "title" TEXT NOT NULL,
      "excerpt" TEXT NOT NULL,
      "description" TEXT NOT NULL,
      "coverImage" TEXT NOT NULL,
      "heroImage" TEXT,
      "category" TEXT NOT NULL,
      "tags" TEXT[] NOT NULL,
      "readingTimeMinutes" INTEGER NOT NULL,
      "publishedAt" TIMESTAMP(3) NOT NULL,
      "updatedAt" TIMESTAMP(3),
      "featured" BOOLEAN NOT NULL DEFAULT false,
      "authorId" TEXT NOT NULL,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAtInternal" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE "BlogPostStats" (
      "postId" TEXT PRIMARY KEY,
      "views" INTEGER NOT NULL,
      "reactions" INTEGER NOT NULL
    )`,
    `CREATE TABLE "BlogSection" (
      "id" TEXT PRIMARY KEY,
      "postId" TEXT NOT NULL,
      "order" INTEGER NOT NULL,
      "type" TEXT NOT NULL,
      "data" JSONB NOT NULL
    )`,
    `CREATE TABLE "AdminUser" (
      "id" TEXT PRIMARY KEY,
      "email" TEXT NOT NULL,
      "name" TEXT NOT NULL,
      "role" TEXT NOT NULL,
      "passwordHash" TEXT NOT NULL,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE "Session" (
      "token" TEXT PRIMARY KEY,
      "userId" TEXT NOT NULL,
      "role" TEXT NOT NULL,
      "csrfToken" TEXT NOT NULL,
      "expiresAt" TIMESTAMP(3) NOT NULL,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE UNIQUE INDEX "ContentBlock_slug_localeCode_key" ON "ContentBlock" ("slug", "localeCode")`,
    `CREATE UNIQUE INDEX "BlogPost_slug_key" ON "BlogPost" ("slug")`,
    `CREATE UNIQUE INDEX "BlogSection_postId_order_key" ON "BlogSection" ("postId", "order")`,
    `CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser" ("email")`,
    `ALTER TABLE "ContentBlock" ADD CONSTRAINT "ContentBlock_localeCode_fkey" FOREIGN KEY ("localeCode") REFERENCES "Locale"("code") ON DELETE CASCADE ON UPDATE CASCADE`,
    `ALTER TABLE "BlogPost" ADD CONSTRAINT "BlogPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "BlogAuthor"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    `ALTER TABLE "BlogPostStats" ADD CONSTRAINT "BlogPostStats_postId_fkey" FOREIGN KEY ("postId") REFERENCES "BlogPost"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    `ALTER TABLE "BlogSection" ADD CONSTRAINT "BlogSection_postId_fkey" FOREIGN KEY ("postId") REFERENCES "BlogPost"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    `ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "AdminUser"("id") ON DELETE CASCADE ON UPDATE CASCADE`
  ];

  for (const statement of statements) {
    await prisma.$executeRawUnsafe(statement);
  }
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
  await ensureDatabaseSchema();
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
