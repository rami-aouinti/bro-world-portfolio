<template>
  <NuxtLink
    :to="`/blog/${post.slug}`"
    class="blog-post-card"
  >
    <v-card
      class="rounded-xl overflow-hidden"
      elevation="variant === 'featured' ? 8 : 2"
      border
    >
      <v-img
        :src="post.coverImage"
        :height="variant === 'featured' ? 320 : 200"
        cover
        class="blog-post-card__image"
      >
        <template #placeholder>
          <div class="blog-post-card__image-placeholder" />
        </template>
      </v-img>

      <v-card-text class="blog-post-card__body">
        <div class="blog-post-card__meta">
          <span class="blog-post-card__category">{{ post.category }}</span>
          <span class="blog-post-card__dot" />
          <span>{{ formattedPublishedAt }}</span>
          <span class="blog-post-card__dot" />
          <span>{{
            t("portfolio.blog.list.readingTime", { minutes: post.readingTimeMinutes })
          }}</span>
        </div>

        <h3 class="blog-post-card__title">
          {{ post.title }}
        </h3>

        <p class="blog-post-card__excerpt">
          {{ post.excerpt }}
        </p>

        <div class="blog-post-card__tags">
          <v-chip
            v-for="tag in post.tags"
            :key="`${post.id}-${tag}`"
            size="small"
            class="text-capitalize"
            color="primary"
            variant="tonal"
          >
            #{{ tag }}
          </v-chip>
        </div>
      </v-card-text>

      <v-card-actions class="blog-post-card__footer">
        <div class="blog-post-card__author">
          <v-avatar size="36">
            <v-img
              :src="post.author.avatar"
              alt=""
            />
          </v-avatar>
          <div>
            <p class="blog-post-card__author-name">{{ post.author.name }}</p>
            <span class="blog-post-card__author-role">{{ post.author.role }}</span>
          </div>
        </div>

        <v-btn
          variant="text"
          color="primary"
          class="text-none"
        >
          {{ t("portfolio.blog.list.readMore") }}
          <v-icon
            icon="mdi-arrow-right"
            class="ml-2"
          />
        </v-btn>
      </v-card-actions>
    </v-card>
  </NuxtLink>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { BlogPostPreview } from "~/types/blog";

const props = defineProps<{
  post: BlogPostPreview;
  variant?: "default" | "featured";
}>();

const { t, locale } = useI18n();

const variant = computed(() => props.variant ?? "default");

const formattedPublishedAt = computed(() => {
  const date = new Date(props.post.publishedAt);
  return new Intl.DateTimeFormat(locale.value, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
});
</script>

<style scoped>
.blog-post-card {
  display: block;
  text-decoration: none;
  color: inherit;
}

.blog-post-card__image-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.6));
}

.blog-post-card__body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.blog-post-card__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  font-size: 0.875rem;
  color: rgba(148, 163, 184, 0.9);
}

.blog-post-card__category {
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 600;
  color: var(--v-theme-primary);
}

.blog-post-card__dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: rgba(148, 163, 184, 0.6);
}

.blog-post-card__title {
  margin: 0;
  font-size: clamp(1.25rem, 2vw, 1.5rem);
  font-weight: 700;
  line-height: 1.3;
  color: var(--v-theme-foreground);
}

.blog-post-card__excerpt {
  margin: 0;
  color: rgba(203, 213, 225, 0.9);
}

.blog-post-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.blog-post-card__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px 24px;
}

.blog-post-card__author {
  display: flex;
  align-items: center;
  gap: 12px;
}

.blog-post-card__author-name {
  margin: 0;
  font-weight: 600;
  color: var(--v-theme-foreground);
}

.blog-post-card__author-role {
  font-size: 0.875rem;
  color: rgba(148, 163, 184, 0.9);
}
</style>
