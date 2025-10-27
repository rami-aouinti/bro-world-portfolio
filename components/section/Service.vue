<template>
  <section id="service">
    <ScrollSmooth>
      <v-container
        v-if="content"
        class="mt-2 text-center"
      >
        <BlurReveal
          :delay="0.5"
          :duration="0.75"
          class="p-8"
        >
          <h2 class="text-h4 text-foreground">{{ content.headline }}</h2>
          <p class="text-body-1 text-foreground mt-4">
            {{ content.subline }}
          </p>
        </BlurReveal>
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
import ScrollSmooth from "~/components/layout/ScrollSmooth.vue";
import { BlurReveal } from "~/components/ui/blur-reveal";

const { data: service } = useContentBlock("service");
const content = computed(() => service.value);
const { t } = useI18n();

function formatBadge(label?: string) {
  if (!label) {
    return undefined;
  }

  return label
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/(\d+)/g, " $1")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const serviceCards = computed(() => {
  const items = content.value?.services ?? [];

  return items.map((item, index) => {
    const prefix = t("portfolio.service.eyebrowPrefix");

    return {
      item,
      eyebrow: `${prefix} ${String(index + 1).padStart(2, "0")}`,
      badge: formatBadge(item.icon),
    };
  });
});
</script>
