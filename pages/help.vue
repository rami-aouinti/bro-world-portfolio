<template>
  <ScrollSmooth>
    <v-container class="py-12">
      <v-row justify="center">
        <v-col
          cols="12"
          md="8"
        >
          <section class="help__intro">
            <p class="help__eyebrow">{{ t("portfolio.help.eyebrow") }}</p>
            <h1 class="help__title">{{ pageTitle }}</h1>
            <p class="help__subtitle">{{ pageSubtitle }}</p>
            <p class="help__body">
              {{ pageBody }}
            </p>
          </section>

          <v-divider class="my-10" />

          <section>
            <h2 class="help__faq-title">{{ t("portfolio.help.faqTitle") }}</h2>
            <p class="help__faq-description">
              {{ t("portfolio.help.faqDescription") }}
            </p>
            <v-expansion-panels
              variant="accordion"
              class="help__faq-panels"
            >
              <v-expansion-panel
                v-for="faq in faqs"
                :key="faq.question"
              >
                <v-expansion-panel-title class="help__faq-question">
                  {{ faq.question }}
                </v-expansion-panel-title>
                <v-expansion-panel-text class="help__faq-answer">
                  {{ faq.answer }}
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </section>

          <v-card
            class="help__contact-card mt-12"
            color="surface"
            variant="tonal"
          >
            <v-card-text>
              <h3 class="help__contact-title">{{ t("portfolio.help.contact.title") }}</h3>
              <p class="help__contact-description">
                {{ t("portfolio.help.contact.description") }}
              </p>
              <v-btn
                class="text-none mt-4"
                color="primary"
                :to="localePath({ name: 'contact' })"
              >
                {{ t("portfolio.help.contact.cta") }}
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </ScrollSmooth>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";

import ScrollSmooth from "~/components/layout/ScrollSmooth.vue";
import { LOCALIZED_PAGE_META } from "~/utils/i18n/routes";

const localePath = useLocalePath();
const { t } = useI18n();

definePageMeta({
  ...LOCALIZED_PAGE_META.help,
});

const { data: helpContent } = useContentBlock("help");

const pageTitle = computed(
  () => helpContent.value?.title ?? t("portfolio.help.fallbackTitle"),
);
const pageSubtitle = computed(
  () => helpContent.value?.subtitle ?? t("portfolio.help.fallbackSubtitle"),
);
const pageBody = computed(
  () => helpContent.value?.body ?? t("portfolio.help.fallbackBody"),
);

const faqs = computed(() => {
  const keys = ["overview", "customization", "content", "support"] as const;

  return keys.map((key) => ({
    question: t(`portfolio.help.faqs.${key}.question`),
    answer: t(`portfolio.help.faqs.${key}.answer`),
  }));
});
</script>

<style scoped>
.help__intro {
  text-align: center;
  display: grid;
  gap: 16px;
}

.help__eyebrow {
  color: var(--v-theme-primary);
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-size: 0.875rem;
}

.help__title {
  font-size: clamp(2rem, 2.4vw, 2.5rem);
  font-weight: 700;
  color: rgb(var(--v-theme-foreground));
}

.help__subtitle,
.help__body {
  color: color-mix(in srgb, rgb(var(--v-theme-foreground)) 82%, transparent);
  font-size: 1rem;
}

.help__faq-title {
  font-size: clamp(1.5rem, 2vw, 2rem);
  font-weight: 700;
  color: rgb(var(--v-theme-foreground));
}

.help__faq-description {
  margin-top: 8px;
  color: color-mix(in srgb, rgb(var(--v-theme-foreground)) 75%, transparent);
}

.help__faq-panels {
  margin-top: 24px;
}

.help__faq-question {
  font-weight: 600;
  color: rgb(var(--v-theme-foreground));
}

.help__faq-answer {
  color: color-mix(in srgb, rgb(var(--v-theme-foreground)) 75%, transparent);
}

.help__contact-card {
  border-radius: 24px;
  border: 1px solid color-mix(in srgb, rgb(var(--v-theme-primary)) 18%, transparent);
  background: color-mix(in srgb, rgb(var(--v-theme-primary)) 8%, transparent);
}

.help__contact-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: rgb(var(--v-theme-foreground));
}

.help__contact-description {
  margin-top: 8px;
  color: color-mix(in srgb, rgb(var(--v-theme-foreground)) 78%, transparent);
}
</style>
