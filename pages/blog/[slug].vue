<template>
  <ScrollSmooth>
    <div class="blog-article">
      <div
        v-if="pending"
        class="blog-article__loading"
      >
        <v-skeleton-loader
          type="image"
          class="blog-article__hero-skeleton"
        />
        <v-container class="py-8">
          <v-skeleton-loader type="article" />
        </v-container>
      </div>

      <div
        v-else-if="post"
        class="blog-article__content"
      >
        <section class="blog-article__hero">
          <v-img
            :src="post.heroImage ?? post.coverImage"
            height="420"
            cover
            class="blog-article__hero-img"
          >
            <template #placeholder>
              <div class="blog-article__hero-placeholder" />
            </template>

            <div class="blog-article__hero-overlay">
              <h1 class="blog-article__title">{{ post.title }}</h1>
              <p class="blog-article__excerpt">{{ post.description }}</p>
              <div class="blog-article__meta">
                <span>{{ publishedLabel }}</span>
                <span class="blog-article__meta-dot" />
                <span>{{ readingTimeLabel }}</span>
                <template v-if="post.updatedAt">
                  <span class="blog-article__meta-dot" />
                  <span>{{ updatedLabel }}</span>
                </template>
              </div>
            </div>
          </v-img>
        </section>

        <v-container class="blog-article__body">
          <v-row>
            <v-col
              cols="12"
              lg="8"
            >
              <article class="blog-article__prose">
                <template
                  v-for="(section, index) in post.sections"
                  :key="index"
                >
                  <component
                    :is="`h${section.level}`"
                    v-if="section.type === 'heading'"
                    :id="section.anchor"
                    class="blog-article__heading"
                  >
                    {{ section.title }}
                  </component>

                  <p
                    v-else-if="section.type === 'paragraph'"
                    :class="[
                      'blog-article__paragraph',
                      { 'blog-article__paragraph--highlight': section.highlight },
                    ]"
                  >
                    {{ section.text }}
                  </p>

                  <div
                    v-else-if="section.type === 'list'"
                    class="blog-article__list"
                  >
                    <p
                      v-if="section.title"
                      class="blog-article__list-title"
                    >
                      {{ section.title }}
                    </p>
                    <component :is="section.ordered ? 'ol' : 'ul'">
                      <li
                        v-for="item in section.items"
                        :key="item"
                      >
                        {{ item }}
                      </li>
                    </component>
                  </div>

                  <figure
                    v-else-if="section.type === 'quote'"
                    class="blog-article__quote"
                  >
                    <blockquote>“{{ section.text }}”</blockquote>
                    <figcaption v-if="section.attribution">— {{ section.attribution }}</figcaption>
                  </figure>

                  <div
                    v-else-if="section.type === 'code'"
                    class="blog-article__code"
                  >
                    <header>
                      <span>{{ section.language }}</span>
                    </header>
                    <pre><code>{{ section.code }}</code></pre>
                    <footer v-if="section.caption">{{ section.caption }}</footer>
                  </div>
                </template>
              </article>
            </v-col>

            <v-col
              cols="12"
              lg="4"
            >
              <aside class="blog-article__sidebar">
                <v-sheet
                  elevation="0"
                  border
                  class="blog-article__panel"
                >
                  <p class="blog-article__panel-heading">{{ t("portfolio.blog.meta.heading") }}</p>

                  <div class="blog-article__panel-entry">
                    <span>{{ t("portfolio.blog.meta.published") }}</span>
                    <strong>{{ publishedLabel }}</strong>
                  </div>
                  <div
                    v-if="post.updatedAt"
                    class="blog-article__panel-entry"
                  >
                    <span>{{ t("portfolio.blog.meta.updated") }}</span>
                    <strong>{{ updatedLabel }}</strong>
                  </div>
                  <div class="blog-article__panel-entry">
                    <span>{{ t("portfolio.blog.meta.readingTime") }}</span>
                    <strong>{{ readingTimeLabel }}</strong>
                  </div>

                  <div class="blog-article__tags">
                    <v-chip
                      v-for="tag in post.tags"
                      :key="`${post.id}-${tag}`"
                      size="small"
                      color="primary"
                      variant="tonal"
                      class="text-capitalize"
                    >
                      #{{ tag }}
                    </v-chip>
                  </div>

                  <v-btn
                    :prepend-icon="copied ? 'mdi-check' : 'mdi-content-copy'"
                    class="text-none"
                    color="primary"
                    variant="flat"
                    @click="copyShareLink"
                  >
                    {{
                      copied
                        ? t("portfolio.blog.meta.linkCopied")
                        : t("portfolio.blog.meta.copyLink")
                    }}
                  </v-btn>
                </v-sheet>
              </aside>
            </v-col>
          </v-row>
        </v-container>

        <v-container
          v-if="relatedPosts.length"
          class="blog-article__related"
        >
          <div class="blog-article__related-header">
            <h2>{{ t("portfolio.blog.related") }}</h2>
            <NuxtLink
              :to="localePath('/blog')"
              class="blog-article__back"
              >{{ t("portfolio.blog.meta.backToList") }}</NuxtLink
            >
          </div>
          <v-row dense>
            <v-col
              v-for="item in relatedPosts"
              :key="item.id"
              cols="12"
              md="4"
            >
              <BlogPostCard :post="item" />
            </v-col>
          </v-row>
        </v-container>
      </div>

      <v-container
        v-else
        class="blog-article__empty py-16"
      >
        <v-sheet
          class="blog-article__empty-card"
          elevation="0"
        >
          <v-icon
            icon="mdi-alert-circle-outline"
            size="48"
            color="warning"
          />
          <h2>{{ t("portfolio.blog.notFound.title") }}</h2>
          <p>{{ t("portfolio.blog.notFound.description") }}</p>
          <v-btn
            :to="localePath('/blog')"
            color="primary"
            class="text-none"
            >{{ t("portfolio.blog.notFound.cta") }}</v-btn
          >
        </v-sheet>
      </v-container>
    </div>
  </ScrollSmooth>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import type { BlogPostPreview, BlogPostResponse, BlogPostsResponse } from "~/types/blog";
import ScrollSmooth from "~/components/layout/ScrollSmooth.vue";
import BlogPostCard from "~/components/blog/BlogPostCard.vue";

const route = useRoute();
const localePath = useLocalePath();
const { t, locale } = useI18n();
const requestURL = useRequestURL();

const slug = computed(() => String(route.params.slug ?? ""));

const { data, pending } = await useAsyncData<BlogPostResponse>(
  () => `blog-post-${slug.value}`,
  () => $fetch(`/api/blog/posts/${slug.value}`),
  { watch: [() => slug.value] },
);

const { data: relatedData } = await useAsyncData<BlogPostsResponse>("blog-related", () =>
  $fetch("/api/blog/posts", { params: { limit: 6 } }),
);

const post = computed(() => data.value?.data ?? null);

const relatedPosts = computed<BlogPostPreview[]>(() => {
  const items = relatedData.value?.data ?? [];
  return items.filter((item) => item.slug !== slug.value).slice(0, 3);
});

const publishedLabel = computed(() => {
  if (!post.value) {
    return "";
  }
  return new Intl.DateTimeFormat(locale.value, {
    dateStyle: "medium",
  }).format(new Date(post.value.publishedAt));
});

const updatedLabel = computed(() => {
  if (!post.value?.updatedAt) {
    return "";
  }
  return new Intl.DateTimeFormat(locale.value, {
    dateStyle: "medium",
  }).format(new Date(post.value.updatedAt));
});

const readingTimeLabel = computed(() =>
  t("portfolio.blog.list.readingTime", { minutes: post.value?.readingTimeMinutes ?? 0 }),
);

const shareLink = computed(() => new URL(route.fullPath, requestURL.origin).toString());

const copied = ref(false);

async function copyShareLink() {
  if (!import.meta.client) {
    return;
  }

  try {
    await navigator.clipboard.writeText(shareLink.value);
    copied.value = true;
    window.setTimeout(() => {
      copied.value = false;
    }, 2500);
  } catch (error) {
    console.error("Unable to copy link", error);
  }
}

useSeoMeta(() => ({
  title: post.value?.title ?? t("portfolio.blog.badge"),
  description: post.value?.description ?? t("portfolio.blog.description"),
  ogTitle: post.value?.title,
  ogDescription: post.value?.description,
  ogImage: post.value?.heroImage ?? post.value?.coverImage,
  twitterCard: "summary_large_image",
}));
</script>

<style scoped>
.blog-article__loading {
  display: grid;
}

.blog-article__hero-skeleton {
  height: 420px;
}

.blog-article__hero {
  position: relative;
  border-radius: 0 0 32px 32px;
  overflow: hidden;
}

.blog-article__hero-img :deep(img) {
  filter: brightness(0.7);
}

.blog-article__hero-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.6));
}

.blog-article__hero-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 16px;
  padding: clamp(32px, 6vw, 64px);
  color: #fff;
  background: linear-gradient(120deg, rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.2));
}

.blog-article__title {
  margin: 0;
  font-size: clamp(2.25rem, 4vw, 3.25rem);
  font-weight: 700;
}

.blog-article__excerpt {
  max-width: 720px;
  font-size: 1.1rem;
  color: rgba(226, 232, 240, 0.92);
}

.blog-article__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  font-size: 0.95rem;
  color: rgba(226, 232, 240, 0.92);
}

.blog-article__meta-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: rgba(226, 232, 240, 0.6);
}

.blog-article__body {
  margin-top: clamp(32px, 6vw, 56px);
}

.blog-article__prose {
  display: flex;
  flex-direction: column;
  gap: clamp(16px, 2vw, 24px);
}

.blog-article__heading {
  margin: 32px 0 12px;
  font-weight: 700;
  color: var(--v-theme-foreground);
}

.blog-article__paragraph {
  margin: 0;
  font-size: 1.05rem;
  line-height: 1.75;
  color: rgba(226, 232, 240, 0.95);
}

.blog-article__paragraph--highlight {
  padding: 20px;
  border-left: 4px solid var(--v-theme-primary);
  background: color-mix(in srgb, var(--v-theme-primary) 12%, transparent);
  border-radius: 16px;
}

.blog-article__list ul,
.blog-article__list ol {
  margin: 0;
  padding-left: 20px;
  display: grid;
  gap: 8px;
}

.blog-article__list-title {
  margin: 0 0 8px;
  font-weight: 600;
  color: rgba(148, 163, 184, 0.95);
}

.blog-article__quote {
  margin: 0;
  padding: 24px;
  border-radius: 20px;
  background: linear-gradient(145deg, rgba(59, 130, 246, 0.15), rgba(14, 165, 233, 0.08));
  color: rgba(226, 232, 240, 0.95);
}

.blog-article__quote blockquote {
  margin: 0 0 12px;
  font-size: 1.3rem;
  font-style: italic;
}

.blog-article__quote figcaption {
  margin: 0;
  font-size: 0.9rem;
  color: rgba(148, 163, 184, 0.9);
}

.blog-article__code {
  border-radius: 18px;
  overflow: hidden;
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.blog-article__code header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 18px;
  font-size: 0.9rem;
  color: rgba(148, 163, 184, 0.9);
  background: rgba(30, 41, 59, 0.8);
}

.blog-article__code pre {
  margin: 0;
  padding: 20px;
  overflow-x: auto;
  font-family: "Fira Code", "JetBrains Mono", monospace;
  font-size: 0.95rem;
  color: rgba(226, 232, 240, 0.95);
}

.blog-article__code footer {
  padding: 12px 18px 16px;
  font-size: 0.85rem;
  color: rgba(148, 163, 184, 0.85);
  border-top: 1px solid rgba(59, 130, 246, 0.15);
}

.blog-article__sidebar {
  position: sticky;
  top: 120px;
}

.blog-article__panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: clamp(24px, 4vw, 32px);
  border-radius: 24px;
  background: rgba(15, 23, 42, 0.6);
}

.blog-article__panel-heading {
  margin: 0;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(148, 163, 184, 0.9);
}

.blog-article__panel-entry {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  font-size: 0.95rem;
  color: rgba(148, 163, 184, 0.9);
}

.blog-article__panel-entry strong {
  color: rgba(226, 232, 240, 0.95);
}

.blog-article__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.blog-article__related {
  margin-top: clamp(40px, 6vw, 72px);
}

.blog-article__related-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.blog-article__related-header h2 {
  margin: 0;
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 700;
}

.blog-article__back {
  color: var(--v-theme-primary);
  text-decoration: none;
  font-weight: 600;
}

.blog-article__empty {
  display: flex;
  justify-content: center;
}

.blog-article__empty-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
  padding: clamp(32px, 6vw, 48px);
  border-radius: 28px;
  background: linear-gradient(
    140deg,
    color-mix(in srgb, var(--v-theme-primary) 16%, transparent),
    color-mix(in srgb, var(--v-theme-surface) 85%, transparent)
  );
}

@media (max-width: 1279px) {
  .blog-article__sidebar {
    position: static;
    margin-top: 32px;
  }
}
</style>
