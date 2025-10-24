<script setup lang="ts">
import { computed } from "vue";

import { LampEffect } from "~/components/Ui/lamp-effect";
import { resolveLocalizedRouteTarget } from "~/utils/i18n/resolve-target";

const { data: cta } = useContentBlock("cta");
const { data: navlinks } = useContentBlock("navlinks");
const { t } = useI18n();
const localePath = useLocalePath();

const ctaContent = computed(() => cta.value);
const links = computed(() =>
  (navlinks.value ?? []).map((link) => ({
    ...link,
    to: resolveLocalizedRouteTarget(link.url, localePath),
  })),
);
</script>

<template>
  <section v-if="ctaContent" id="lamp-callout" class="lamp-callout">
    <LampEffect
      class="lamp-callout__wrapper"
      content-class="lamp-callout__content"
      :delay="0.4"
      :duration="1.1"
    >
      <span class="lamp-callout__eyebrow">{{ t("portfolio.cta.eyebrow") }}</span>

      <h2 class="lamp-callout__title">{{ ctaContent.label }}</h2>

      <p class="lamp-callout__description">{{ ctaContent.description }}</p>

      <div class="lamp-callout__actions">
        <Button
          :label="t('portfolio.cta.primaryCta')"
          :to="resolveLocalizedRouteTarget('/contact', localePath)"
          variant="btn-dark"
        />
      </div>

      <ul v-if="links.length" class="lamp-callout__links">
        <li v-for="link in links" :key="link.title">
          <NuxtLink :to="link.to" class="lamp-callout__link">{{ link.title }}</NuxtLink>
        </li>
      </ul>
    </LampEffect>
  </section>
</template>

<style scoped>
.lamp-callout {
  margin-block: 6rem;
}

.lamp-callout__wrapper {
  min-height: clamp(420px, 70vh, 600px);
  padding-block: clamp(48px, 8vw, 72px);
}

.lamp-callout__content {
  transform: translateY(-7rem);
  gap: clamp(20px, 4vw, 28px);
  text-align: center;
  max-width: min(90vw, 640px);
  color: rgb(226 232 240);
}

.lamp-callout__eyebrow {
  font-size: 0.875rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(94, 234, 212, 0.9);
}

.lamp-callout__title {
  font-size: clamp(2rem, 4.8vw, 3.2rem);
  font-weight: 700;
  color: #f8fafc;
}

.lamp-callout__description {
  font-size: clamp(1rem, 2.2vw, 1.15rem);
  color: rgba(226, 232, 240, 0.78);
}

.lamp-callout__actions {
  display: flex;
  justify-content: center;
}

.lamp-callout__links {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 20px;
  justify-content: center;
  margin: 0;
  padding: 0;
  list-style: none;
}

.lamp-callout__link {
  color: rgba(191, 219, 254, 0.9);
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s ease;
}

.lamp-callout__link:hover {
  color: #f8fafc;
}

@media (max-width: 768px) {
  .lamp-callout__content {
    transform: translateY(-5.5rem);
  }
}
</style>
