<template>
  <section
    id="personal"
    class="personal"
  >
    <div class="personal__background">
      <ClientOnly>
        <HeroScene
          v-if="heroSceneEnabled"
          class="personal__hero"
          v-bind="heroSceneProps"
        />
      </ClientOnly>
      <div
        v-if="!heroSceneEnabled"
        class="personal__background-fallback"
        :style="heroFallbackStyle"
      />
      <div class="personal__background-overlay" />
    </div>
    <ScrollSmooth initially-visible>
      <v-container
        v-if="personalContent"
        class="personal__container py-6 my-auto py-md-24"
      >
        <v-row
          justify="center"
          class="text-center"
        >
          <v-col
            cols="12"
            md="10"
            lg="8"
            class="personal__content mt-8"
          >
            <Text3d
              class="text-8xl font-bold max-md:text-7xl"
              shadow-color="primary"
              :stroke-size="headlineStrokeSize"
              :shadow1-size="headlineShadowOneSize"
              :shadow2-size="headlineShadowTwoSize"
              :letter-spacing="headlineLetterSpacing"
            >
              <h1 class="personal__headline">
                {{ personalContent.headline }}
              </h1>
            </Text3d>

            <p class="personal__description text-foreground">
              {{ personalContent.subline }}
            </p>
            <v-chip
              v-if="personalContent?.badge"
              color="primary"
              variant="outlined"
              class="personal__badge text-uppercase"
            >
              {{ personalContent.badge }}
            </v-chip>
          </v-col>
        </v-row>

        <v-slide-group
          :show-arrows="!isCompactViewport"
          class="personal__carousel"
          :mobile="isCompactViewport"
          center-active
        >
          <v-slide-group-item
            v-for="card in personalCards"
            :key="card.item.name"
          >
            <CustomGlowCard
              class="personal__card"
              :title="card.item.name"
              :badge="card.item.type"
              :variant="card.variant"
              :heading-level="2"
            >
              <template #media>
                <NuxtImg
                  :src="`/images/work/${card.item.thumbnails}`"
                  :alt="card.item.name"
                  width="640"
                  height="400"
                  sizes="(min-width: 1280px) 320px, (min-width: 960px) 280px, (min-width: 640px) 50vw, 90vw"
                  densities="1x, 2x"
                  class="personal__image"
                  loading="lazy"
                />
              </template>
              <template #footer>
                <div class="personal__footer">
                  <span class="personal__footer-label">{{
                    t("portfolio.personal.viewProjectLabel")
                  }}</span>
                  <v-btn
                    :to="card.item.live_demo"
                    target="_blank"
                    color="primary"
                    variant="text"
                    class="text-none"
                  >
                    {{ t("portfolio.personal.viewProjectCta") }}
                  </v-btn>
                </div>
              </template>
            </CustomGlowCard>
          </v-slide-group-item>
        </v-slide-group>
      </v-container>
    </ScrollSmooth>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useMediaQuery, useMounted } from "@vueuse/core";
import ScrollSmooth from "~/components/layout/ScrollSmooth.vue";

import { Text3d } from "~/components/ui/text-3d";
import CustomGlowCard from "~/components/CustomGlowCard.vue";
import HeroScene from "~/components/visual/HeroScene.vue";
import { HERO_SCENE_DEFAULTS, type HeroSceneSettings } from "~/types/content";

const { data: personal } = useContentBlock("hero");
const { data: work } = useContentBlock("work");
const { t } = useI18n();

const personalContent = computed(() => personal.value);
const workItems = computed(() => work.value?.works ?? []);
const personalCards = computed(() =>
  workItems.value.map((item, index) => ({
    item,
    variant: glowCardVariantCycle[index % glowCardVariantCycle.length],
  })),
);

const heroSceneSettings = computed<HeroSceneSettings>(() => ({
  ...HERO_SCENE_DEFAULTS,
  ...(personalContent.value?.scene ?? {}),
}));

const heroSceneEnabled = computed(() => heroSceneSettings.value.enabled !== false);

const heroSceneProps = computed(() => ({
  enabled: heroSceneEnabled.value,
  primaryColor: heroSceneSettings.value.primaryColor,
  secondaryColor: heroSceneSettings.value.secondaryColor,
  accentColor: heroSceneSettings.value.accentColor,
  particleDensity: heroSceneSettings.value.particleDensity,
  bloomIntensity: heroSceneSettings.value.bloomIntensity,
  rotationSpeed: heroSceneSettings.value.rotationSpeed,
  noiseStrength: heroSceneSettings.value.noiseStrength,
}));

const heroFallbackStyle = computed(() => ({
  background:
    `radial-gradient(circle at 24% 28%, ${heroSceneSettings.value.secondaryColor}33 0%, transparent 58%), ` +
    `radial-gradient(circle at 78% 18%, ${heroSceneSettings.value.accentColor}2b 0%, transparent 54%), ` +
    `linear-gradient(120deg, ${heroSceneSettings.value.primaryColor}3a, rgba(15, 23, 42, 0.85))`,
}));

const isMounted = useMounted();
const compactViewportQuery = useMediaQuery("(max-width: 640px)", {
  initialValue: false,
});
const isCompactViewport = computed(() => isMounted.value && compactViewportQuery.value);

const headlineStrokeSize = computed(() => (isCompactViewport.value ? 8 : 20));
const headlineShadowOneSize = computed(() => (isCompactViewport.value ? 4 : 7));
const headlineShadowTwoSize = computed(() => (isCompactViewport.value ? 6 : 10));
const headlineLetterSpacing = computed(() => (isCompactViewport.value ? -0.05 : -0.1));

const enrichedWorkDetails: Record<
  string,
  {
    description: string;
    highlights: string[];
    impact?: string;
  }
> = {
  "microservices-tkdeutschland": {
    description:
      "Designed a distributed Symfony microservice platform for TKDeutschland’s insurance back office, aligning internal tooling with partner-facing APIs.",
    highlights: [
      "Modeled asynchronous messaging with Symfony Messenger and RabbitMQ to keep services resilient under peak load.",
      "Implemented OAuth2 security, audit logging, and fine-grained permissions for partner integrations.",
      "Containerized workloads with Docker and GitLab CI to ensure predictable deployments across environments.",
    ],
    impact: "Impact: 30% faster partner onboarding and zero-downtime releases.",
  },
  "ecommerce-plattformen-hinke-gmbh": {
    description:
      "Delivered modular e-commerce storefronts for Hinke GmbH using Shopware and Symfony, tailored for B2B buyers and marketing teams.",
    highlights: [
      "Customized catalogue, pricing tiers, and checkout flows to match complex procurement journeys.",
      "Integrated ERP inventory feeds and automated fulfillment notifications to keep logistics in sync.",
      "Profiled SQL hotspots and added Redis caching to sustain product launches without slowdowns.",
    ],
    impact: "Impact: Revenue-critical flows stayed below 200ms even during campaign surges.",
  },
  "shopware-integrationen-wizmo-gmbh": {
    description:
      "Developed a suite of Shopware extensions for Wizmo GmbH’s international clients with a focus on reliability and reuse.",
    highlights: [
      "Engineered REST connectors that synchronized orders and customer data with external CRMs.",
      "Published reusable plugin scaffolding with comprehensive unit and integration tests.",
      "Set up observability dashboards and alerting to monitor plugin health after release.",
    ],
    impact: "Impact: Reduced integration lead time from weeks to just a few days.",
  },
  "monitoring-analytics-automatisierung": {
    description:
      "Automated marketing analytics and observability pipelines so growth teams could respond to live customer behaviour.",
    highlights: [
      "Implemented event streaming from web properties into Google Analytics 4 and BigQuery.",
      "Delivered Looker Studio dashboards with actionable health metrics for marketing stakeholders.",
      "Built alerting workflows that surfaced anomalies before campaigns were affected.",
    ],
    impact: "Impact: Teams detected conversion drops within minutes instead of hours.",
  },
  "leistungsoptimierung-legacy-systeme": {
    description:
      "Stabilized and modernized legacy PHP and Symfony services without disrupting day-to-day operations.",
    highlights: [
      "Refactored brittle modules into well-tested, service-oriented components.",
      "Introduced static analysis, PHPStan, and regression suites to guard against regressions.",
      "Optimized critical SQL queries and added caching to cut response times dramatically.",
    ],
    impact: "Impact: Average API latency dropped by 45% while boosting developer confidence.",
  },
  "dockerisierte-entwicklungsumgebungen": {
    description:
      "Standardized containerized development environments that mirrored production for distributed teams.",
    highlights: [
      "Composed Docker setups covering web, worker, and database services for fast onboarding.",
      "Scripted CI pipelines that ran unit, integration, and smoke tests in parallel.",
      "Documented health checks and playbooks enabling self-service troubleshooting.",
    ],
    impact: "Impact: New engineers shipped production-ready code in their first sprint.",
  },
};
</script>

<style scoped>
.personal {
  position: relative;
}

.personal__background {
  position: absolute;
  inset: clamp(12px, 3vw, 22px);
  pointer-events: none;
  z-index: 0;
}

.personal__background-overlay {
  position: absolute;
  inset: 0;
  border-radius: clamp(18px, 5vw, 32px);
  background: linear-gradient(180deg, rgba(2, 6, 23, 0.35) 0%, rgba(2, 6, 23, 0.78) 65%);
  mix-blend-mode: screen;
}

.personal__background-fallback {
  position: absolute;
  inset: 0;
  border-radius: clamp(18px, 5vw, 32px);
}

.personal__hero {
  inset: 0;
}

.personal__container {
  min-height: clamp(560px, 82vh, 760px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  z-index: 1;
}

.personal__badge {
  align-items: center;
  border-color: rgba(148, 163, 184, 0.4);
  background: rgba(15, 23, 42, 0.4);
  color: #cbd5f5;
  font-weight: 600;
  letter-spacing: 0.18em;
  padding-inline: 18px;
}

.personal__headline {
  font-size: clamp(2.2rem, 5vw + 1.1rem, 4.75rem);
  line-height: 1.1;
  font-weight: 800;
  text-shadow: 0 16px 36px rgba(15, 23, 42, 0.6);
}

.personal__description {
  padding: clamp(16px, 6vw, 30px);
  max-width: 680px;
  font-size: clamp(1.05rem, 1vw + 1rem, 1.25rem);
  line-height: 1.7;
}

.personal__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: clamp(12px, 4vw, 20px);
  gap: 18px;
}

.personal__carousel {
  margin-top: clamp(32px, 6vw, 64px);
  --carousel-inline-padding: clamp(18px, 6vw, 36px);
}

.personal__carousel :deep(.v-slide-group__content) {
  display: grid;
  grid-auto-flow: column;
  align-items: stretch;
  gap: clamp(16px, 4vw, 28px);
  padding-inline: var(--carousel-inline-padding);
  scroll-snap-type: x proximity;
}

.personal__carousel :deep(.v-slide-group__slide) {
  scroll-snap-align: start;
}

.personal__card {
  display: block;
  margin: 12px;
  width: clamp(260px, 58vw, 320px);
}

.personal__image {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 18px;
  aspect-ratio: 16 / 10;
  object-fit: cover;
}

.personal__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.personal__footer-label {
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.75rem;
  color: color-mix(in srgb, var(--card-text-color) 60%, white 40%);
}

@media (max-width: 1024px) {
  .personal__container {
    min-height: auto;
    padding-block: clamp(48px, 18vw, 96px);
  }

  .personal__description {
    padding: 18px 0 24px;
  }

  .personal__carousel {
    margin-top: clamp(24px, 10vw, 48px);
  }

  .personal__background {
    inset: clamp(8px, 4vw, 18px);
  }
}

@media (max-width: 640px) {
  .personal__container {
    padding-inline: 1.25rem;
  }

  .personal__background {
    inset: clamp(4px, 4vw, 16px);
  }

  .personal__carousel {
    --carousel-inline-padding: 1rem;
    scroll-padding: 1rem;
  }

  .personal__card {
    margin: 8px 4px;
    width: min(320px, 88vw);
  }

  .personal__footer {
    align-items: stretch;
  }

  .personal__footer-label {
    font-size: 0.7rem;
    letter-spacing: 0.12em;
  }
}

@keyframes twinkle {
  0%,
  100% {
    opacity: 0.4;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.8);
  }
}
</style>
