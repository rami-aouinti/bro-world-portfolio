<script setup lang="ts">
import { computed } from 'vue'
import CustomGlowCard from '~/components/CustomGlowCard.vue'
import ScrollSmooth from "~/components/Layout/ScrollSmooth.vue";

const { data: service } = useContentBlock('service')
const content = computed(() => service.value)
const { t } = useI18n()

const accentPalette = ['#7c3aed', '#0ea5e9', '#f97316', '#22d3ee', '#f472b6', '#34d399']

function hexToRgba(hex: string, alpha = 1) {
  const sanitized = hex.replace('#', '').trim()
  const normalized = sanitized.length === 3 ? sanitized.split('').map((char) => `${char}${char}`).join('') : sanitized
  const numeric = Number.parseInt(normalized, 16)

  if (Number.isNaN(numeric)) {
    return `rgba(124, 58, 237, ${alpha})`
  }

  const red = (numeric >> 16) & 255
  const green = (numeric >> 8) & 255
  const blue = numeric & 255

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`
}

function formatBadge(label?: string) {
  if (!label) {
    return undefined
  }

  return label
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/(\d+)/g, ' $1')
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

const serviceCards = computed(() => {
  const items = content.value?.services ?? []

  return items.map((item, index) => {
    const accent = accentPalette[index % accentPalette.length]
    const prefix = t('portfolio.service.eyebrowPrefix')

    return {
      item,
      accent,
      background: `linear-gradient(135deg, rgba(15, 23, 42, 0.94) 0%, ${hexToRgba(accent, 0.35)} 100%)`,
      glow: hexToRgba(accent, 0.55),
      eyebrow: `${prefix} ${String(index + 1).padStart(2, '0')}`,
      badge: formatBadge(item.icon)
    }
  })
})
</script>

<template>
  <section id="service">
    <ScrollSmooth>
      <v-container
        v-if="content"
        class="mt-10"
      >
        <h2 class="text-h4 text-foreground">{{ content.headline }}</h2>
        <p
          class="text-body-1 text-foreground mt-4"
          style="max-width: 600px"
        >
          {{ content.subline }}
        </p>

        <v-row
          class="mt-12"
          dense
        >
          <v-col
            v-for="card in serviceCards"
            :key="card.item.name"
            cols="12"
            md="6"
            lg="4"
          >
            <CustomGlowCard
              :title="card.item.name"
              :description="card.item.description"
              :eyebrow="card.eyebrow"
              :badge="card.badge"
              :accent-color="card.accent"
              :background="card.background"
              :glow-color="card.glow"
              padding="clamp(22px, 3vw, 28px)"
              border-radius="26px"
              outline-color="rgba(148, 163, 184, 0.18)"
              :gradient-sheen-angle="140"
              :gradient-sheen-opacity="0.55"
            >
              <template #footer>
                <div
                  class="d-flex align-center justify-space-between text-caption text-high-emphasis"
                >
                  <span>
                    {{ t("portfolio.service.footerLabel") }}
                    {{ card.item.icon ? card.badge : t("portfolio.service.footerFallback") }}
                  </span>
                  <span
                    class="text-uppercase"
                    style="letter-spacing: 0.08em"
                    >{{ t("portfolio.service.footerStatus") }}</span
                  >
                </div>
              </template>
            </CustomGlowCard>
          </v-col>
        </v-row>
      </v-container>
    </ScrollSmooth>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import CustomGlowCard from "~/components/CustomGlowCard.vue";
import ScrollSmooth from "~/components/Layout/ScrollSmooth.vue";

const { data: service } = useContentBlock("service");
const content = computed(() => service.value);
const { t } = useI18n();

const accentPalette = ["#7c3aed", "#0ea5e9", "#f97316", "#22d3ee", "#f472b6", "#34d399"];

const hexToRgba = (hex: string, alpha = 1) => {
  const sanitized = hex.replace("#", "").trim();
  const normalized =
    sanitized.length === 3
      ? sanitized
          .split("")
          .map((char) => `${char}${char}`)
          .join("")
      : sanitized;
  const numeric = Number.parseInt(normalized, 16);

  if (Number.isNaN(numeric)) {
    return `rgba(124, 58, 237, ${alpha})`;
  }

  const red = (numeric >> 16) & 255;
  const green = (numeric >> 8) & 255;
  const blue = numeric & 255;

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
};

const formatBadge = (label?: string) => {
  if (!label) {
    return undefined;
  }

  return label
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/(\d+)/g, " $1")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const serviceCards = computed(() => {
  const items = content.value?.services ?? [];

  return items.map((item, index) => {
    const accent = accentPalette[index % accentPalette.length];
    const prefix = t("portfolio.service.eyebrowPrefix");

    return {
      item,
      accent,
      background: `linear-gradient(135deg, rgba(15, 23, 42, 0.94) 0%, ${hexToRgba(accent, 0.35)} 100%)`,
      glow: hexToRgba(accent, 0.55),
      eyebrow: `${prefix} ${String(index + 1).padStart(2, "0")}`,
      badge: formatBadge(item.icon),
    };
  });
});
</script>
