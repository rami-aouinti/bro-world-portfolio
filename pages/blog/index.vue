<template>
  <ScrollSmooth>
    <v-container class="blog-page py-16">
      <v-sheet
        class="blog-page__filters"
        elevation="0"
        border
      >
        <v-text-field
          v-model="searchTerm"
          :label="t('portfolio.blog.filters.search')"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          hide-details
          clearable
          class="blog-page__search"
        />

        <div class="blog-page__filter-group">
          <p class="blog-page__filter-label">
            {{ t("portfolio.blog.filters.categories") }}
          </p>
          <v-chip-group
            v-model="selectedCategory"
            selected-class="blog-page__chip--active"
            class="blog-page__chip-group"
            column
          >
            <v-chip
              v-for="category in categories"
              :key="category.id"
              :value="category.id"
              variant="tonal"
              color="primary"
              class="text-capitalize"
            >
              {{ category.label }}
              <span class="blog-page__chip-count">{{ category.count }}</span>
            </v-chip>
          </v-chip-group>
        </div>

        <div class="blog-page__filter-group">
          <p class="blog-page__filter-label">
            {{ t("portfolio.blog.filters.tags") }}
          </p>
          <v-chip-group
            v-model="selectedTag"
            selected-class="blog-page__chip--active"
            class="blog-page__chip-group"
            column
          >
            <v-chip
              v-for="tag in tags"
              :key="tag.id"
              :value="tag.id"
              variant="tonal"
              color="secondary"
              class="text-capitalize"
            >
              <template v-if="tag.id === 'all'">{{ tag.label }}</template>
              <template v-else>#{{ tag.label }}</template>
              <span class="blog-page__chip-count">{{ tag.count }}</span>
            </v-chip>
          </v-chip-group>
        </div>
      </v-sheet>

      <div
        v-if="pending"
        class="blog-page__loading"
      >
        <v-skeleton-loader
          type="image, article, actions"
          class="blog-page__skeleton"
        />
        <v-skeleton-loader
          v-for="n in 3"
          :key="n"
          type="image, article, actions"
          class="blog-page__skeleton"
        />
      </div>

      <div v-else>
        <div
          v-if="highlightPost"
          class="blog-page__featured"
        >
          <BlogPostCard
            :post="highlightPost"
            variant="featured"
          />
        </div>

        <v-row
          v-if="otherPosts.length"
          class="blog-page__grid"
          dense
        >
          <v-col
            v-for="post in otherPosts"
            :key="post.id"
            cols="12"
            md="6"
          >
            <BlogPostCard :post="post" />
          </v-col>
        </v-row>

        <v-sheet
          v-if="!highlightPost"
          class="blog-page__empty"
          elevation="0"
        >
          <v-icon
            icon="mdi-file-search-outline"
            size="48"
            class="blog-page__empty-icon"
          />
          <h2 class="blog-page__empty-title">{{ t("portfolio.blog.list.empty.title") }}</h2>
          <p class="blog-page__empty-description">
            {{ t("portfolio.blog.list.empty.description") }}
          </p>
          <v-btn
            :to="contactLink"
            color="primary"
            class="text-none blog-page__empty-cta"
          >
            {{ t("portfolio.blog.empty.cta") }}
          </v-btn>
        </v-sheet>
      </div>
    </v-container>
  </ScrollSmooth>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import type { BlogPostPreview, BlogPostsMeta, BlogPostsResponse } from "~/types/blog";
import { LOCALIZED_PAGE_META } from "~/utils/i18n/routes";
import { resolveLocalizedRouteTarget } from "~/utils/i18n/resolve-target";
import ScrollSmooth from "~/components/layout/ScrollSmooth.vue";
import BlogPostCard from "~/components/blog/BlogPostCard.vue";

definePageMeta({
  ...LOCALIZED_PAGE_META.blog,
});

const { t } = useI18n();
const localePath = useLocalePath();

const searchTerm = ref("");
const selectedCategory = ref<string>("all");
const selectedTag = ref<string>("all");

const { data, pending } = await useAsyncData<BlogPostsResponse>("blog-posts", () =>
  $fetch("/api/blog/posts"),
);

const posts = computed<BlogPostPreview[]>(() => data.value?.data ?? []);
const meta = computed<BlogPostsMeta>(
  () => data.value?.meta ?? { total: 0, categories: [], tags: [], featured: null },
);

const normalizedSearch = computed(() => searchTerm.value.trim().toLowerCase());

const filteredPosts = computed(() => {
  let items = posts.value;

  if (selectedCategory.value !== "all") {
    items = items.filter((post) => post.category.toLowerCase() === selectedCategory.value);
  }

  if (selectedTag.value !== "all") {
    items = items.filter((post) =>
      post.tags.some((tag) => tag.toLowerCase() === selectedTag.value),
    );
  }

  if (normalizedSearch.value) {
    items = items.filter((post) => {
      const haystack = [post.title, post.excerpt, post.tags.join(" ")].join(" ").toLowerCase();
      return haystack.includes(normalizedSearch.value);
    });
  }

  return items;
});

const highlightPost = computed(() => {
  if (!filteredPosts.value.length) {
    return null;
  }

  const isDefaultFilters =
    selectedCategory.value === "all" && selectedTag.value === "all" && !normalizedSearch.value;

  if (isDefaultFilters && meta.value.featured) {
    const match = filteredPosts.value.find((post) => post.id === meta.value.featured?.id);
    if (match) {
      return match;
    }
  }

  return filteredPosts.value[0];
});

const otherPosts = computed(() => {
  if (!highlightPost.value) {
    return [] as BlogPostPreview[];
  }

  return filteredPosts.value.filter((post) => post.id !== highlightPost.value?.id);
});

const categories = computed(() => {
  const records = meta.value.categories ?? [];
  const total = meta.value.total ?? 0;
  return [{ id: "all", label: t("portfolio.blog.filters.all"), count: total }, ...records];
});

const tags = computed(() => {
  const records = meta.value.tags ?? [];
  return [
    { id: "all", label: t("portfolio.blog.filters.all"), count: meta.value.total ?? 0 },
    ...records,
  ];
});

const contactLink = computed(() => resolveLocalizedRouteTarget("/contact", localePath));
</script>

<style scoped>
.blog-page {
  max-width: 1200px;
}

.blog-page__header {
  text-align: center;
  margin: 0 auto 48px;
  max-width: 720px;
}

.blog-page__badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 14px;
  border-radius: 999px;
  font-weight: 600;
  font-size: 0.875rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  background: color-mix(in srgb, var(--v-theme-primary) 12%, transparent);
  color: var(--v-theme-primary);
}

.blog-page__title {
  margin: 16px 0 12px;
  font-size: clamp(2.25rem, 3vw, 3rem);
  font-weight: 700;
}

.blog-page__description {
  margin: 0;
  color: rgba(226, 232, 240, 0.85);
}

.blog-page__filters {
  display: grid;
  gap: 24px;
  padding: clamp(24px, 4vw, 32px);
  border-radius: 24px;
  background: rgba(15, 23, 42, 0.6);
  margin-bottom: clamp(32px, 6vw, 48px);
}

.blog-page__search {
  max-width: 420px;
}

.blog-page__filter-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.blog-page__filter-label {
  margin: 0;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: rgba(148, 163, 184, 0.9);
}

.blog-page__chip-group {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.blog-page__chip-count {
  margin-left: 8px;
  font-size: 0.8rem;
  color: rgba(226, 232, 240, 0.9);
}

.blog-page__chip--active {
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--v-theme-primary) 35%, transparent);
}

.blog-page__featured {
  margin-bottom: clamp(32px, 5vw, 48px);
}

.blog-page__grid {
  row-gap: 24px;
  column-gap: 24px;
}

.blog-page__loading {
  display: grid;
  gap: 24px;
}

.blog-page__skeleton {
  border-radius: 20px;
}

.blog-page__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 16px;
  padding: clamp(32px, 6vw, 48px);
  border-radius: 28px;
  background: linear-gradient(
    140deg,
    color-mix(in srgb, var(--v-theme-primary) 16%, transparent),
    color-mix(in srgb, var(--v-theme-surface) 85%, transparent)
  );
}

.blog-page__empty-icon {
  color: var(--v-theme-primary);
}

.blog-page__empty-title {
  margin: 0;
  font-size: clamp(1.5rem, 2.5vw, 2rem);
  font-weight: 600;
}

.blog-page__empty-description {
  margin: 0;
  max-width: 520px;
  color: rgba(226, 232, 240, 0.85);
}

.blog-page__empty-cta {
  margin-top: 12px;
}

@media (min-width: 960px) {
  .blog-page__filters {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-items: start;
  }

  .blog-page__search {
    grid-column: 1 / -1;
  }
}
</style>
