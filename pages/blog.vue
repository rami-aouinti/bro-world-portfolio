<template>
  <ScrollSmooth>
    <v-container class="blog-page py-16">
      <div class="blog-page__header text-foreground">
        <span class="blog-page__badge">{{ t("portfolio.blog.badge") }}</span>
        <h1 class="blog-page__title">{{ t("portfolio.blog.title") }}</h1>
        <p class="blog-page__description">
          {{ t("portfolio.blog.description") }}
        </p>
      </div>

      <v-sheet
        class="blog-page__empty"
        elevation="0"
      >
        <v-icon
          icon="mdi-notebook-outline"
          size="48"
          class="blog-page__empty-icon"
        />
        <h2 class="blog-page__empty-title">{{ t("portfolio.blog.empty.title") }}</h2>
        <p class="blog-page__empty-description">
          {{ t("portfolio.blog.empty.description") }}
        </p>
        <v-btn
          :to="contactLink"
          color="primary"
          class="text-none blog-page__empty-cta"
        >
          {{ t("portfolio.blog.empty.cta") }}
        </v-btn>
      </v-sheet>
    </v-container>
  </ScrollSmooth>
</template>

<script setup lang="ts">
import { computed } from "vue";

import { LOCALIZED_PAGE_META } from "~/utils/i18n/routes";
import { resolveLocalizedRouteTarget } from "~/utils/i18n/resolve-target";
import ScrollSmooth from "~/components/Layout/ScrollSmooth.vue";

definePageMeta(LOCALIZED_PAGE_META.blog);

const { t } = useI18n();
const localePath = useLocalePath();

const contactLink = computed(() => resolveLocalizedRouteTarget("/contact", localePath));
</script>

<style scoped>
.blog-page {
  max-width: 960px;
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
</style>
