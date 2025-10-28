<template>
  <CustomGlowCard
    class="blog-post-card"
    :title="post.title"
    :eyebrow="post.category"
    :to="`/blog/${post.slug}`"
    :variant="cardVariant"
    :heading-level="2"
  >
    <template #media>
      <NuxtImg
        :src="post.coverImage"
        :alt="post.title"
        :height="variant === 'featured' ? 320 : 220"
        width="1280"
        sizes="(min-width: 1280px) 360px, (min-width: 960px) 33vw, (min-width: 640px) 50vw, 90vw"
        densities="1x, 2x"
        class="blog-post-card__image"
        loading="lazy"
      />
    </template>

    <template #default>
      <div class="blog-post-card__meta">
        <span>{{ formattedPublishedAt }}</span>
        <span class="blog-post-card__dot" />
        <span>{{ readingTimeLabel }}</span>
      </div>

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
    </template>

    <template #footer>
      <div class="blog-post-card__footer">
        <div class="blog-post-card__author">
          <v-avatar size="36">
            <NuxtImg
              :src="post.author.avatar"
              :alt="post.author.name"
              width="72"
              height="72"
              densities="1x, 2x"
              loading="lazy"
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
      </div>
    </template>
  </CustomGlowCard>
</template>

<script setup lang="ts">
import { computed } from "vue";
import CustomGlowCard from "~/components/CustomGlowCard.vue";
import type { GlowCardVariant } from "~/utils/glowCardVariants";
import type { BlogPostPreview } from "~/types/blog";

const props = defineProps<{
  post: BlogPostPreview;
  variant?: "default" | "featured";
}>();

const { t, locale } = useI18n();

const variant = computed(() => props.variant ?? "default");
const variantMap: Record<"default" | "featured", GlowCardVariant> = {
  default: "cyan",
  featured: "rose",
};

const cardVariant = computed(() => variantMap[variant.value] ?? "cyan");

const formattedPublishedAt = computed(() => {
  const date = new Date(props.post.publishedAt);
  return new Intl.DateTimeFormat(locale.value, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
});

const readingTimeLabel = computed(() =>
  t("portfolio.blog.list.readingTime", { minutes: props.post.readingTimeMinutes }),
);
</script>

<style scoped>
.blog-post-card {
  height: 100%;
}

.blog-post-card__image {
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: calc(var(--card-border-radius, 24px) - 10px);
}

.blog-post-card__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  font-size: 0.875rem;
  color: color-mix(in srgb, var(--card-text-color, #f8fafc) 70%, rgba(15, 23, 42, 0.5) 30%);
}

.blog-post-card__dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: color-mix(in srgb, var(--card-accent, #2563eb) 25%, rgba(15, 23, 42, 0.35));
}

.blog-post-card__excerpt {
  margin: 0;
  font-size: clamp(0.95rem, 2.2vw, 1.05rem);
  line-height: 1.6;
  color: color-mix(in srgb, var(--card-text-color, #f8fafc) 82%, rgba(15, 23, 42, 0.6) 18%);
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
  gap: 12px;
}

.blog-post-card__author {
  display: flex;
  align-items: center;
  gap: 12px;
}

.blog-post-card__author-name {
  margin: 0;
  font-weight: 600;
  color: color-mix(in srgb, var(--card-text-color, #f8fafc) 90%, rgba(15, 23, 42, 0.4) 10%);
}

.blog-post-card__author-role {
  font-size: 0.875rem;
  color: color-mix(in srgb, var(--card-text-color, #f8fafc) 70%, rgba(15, 23, 42, 0.5) 30%);
}
</style>
