<script setup lang="ts">
import { computed } from 'vue'
import ScrollSmooth from '~/components/Layout/ScrollSmooth.vue'

import { resolveLocalizedRouteTarget } from '~/utils/i18n/resolve-target'
import { Text3d } from '../Ui/text-3d'
import CustomGlowCard from "~/components/CustomGlowCard.vue";

const { data: personal } = useContentBlock('hero')
const { data: work } = useContentBlock('work')
const { t } = useI18n()
const localePath = useLocalePath()

const personalContent = computed(() => personal.value)
const workItems = computed(() => work.value?.works ?? [])
const personalCards = computed(() =>
    workItems.value.map((item, index) => ({
      item,
      variant: glowCardVariantCycle[index % glowCardVariantCycle.length]
    }))
)
const enrichedWorkDetails: Record<string, {
  description: string
  highlights: string[]
  impact?: string
}> = {
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
}
</script>

<template>
<section id="personal" class="personal">
    <div class="personal__background" aria-hidden="true">
      <span class="personal__glow personal__glow--one"></span>
      <span class="personal__glow personal__glow--two"></span>
      <span class="personal__glow personal__glow--three"></span>
      <span class="personal__spark personal__spark--one"></span>
      <span class="personal__spark personal__spark--two"></span>
      <span class="personal__spark personal__spark--three"></span>
    </div>
    <ScrollSmooth>
      <v-container class="personal__container py-6 my-auto py-md-24" v-if="personalContent">
        <v-row justify="center" class="text-center">
          <v-col cols="12" md="10" lg="8" class="personal__content mt-8">
            <Text3d
                class="text-8xl font-bold max-md:text-7xl"
                shadow-color="primary"
            >
              <h1 class="personal__headline">
                {{ personalContent.headline }}
              </h1>
            </Text3d>

            <p class="personal__description text-foreground">
              {{ personalContent.subline }}
            </p>
            <div class="personal__actions">
              <Button
                :label="t('portfolio.personal.viewProjects')"
                :to="resolveLocalizedRouteTarget('/work', localePath)"
              />
              <Button
                :label="t('portfolio.personal.contact')"
                :to="resolveLocalizedRouteTarget('/contact', localePath)"
              />
            </div>
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

        <v-slide-group show-arrows class="personal__carousel">
          <v-slide-group-item v-for="card in personalCards" :key="card.item.name">
            <CustomGlowCard
                class="personal__card"
                :title="card.item.name"
                :badge="card.item.type"
                :variant="card.variant"
            >
              <template #media>
                <v-img
                    :src="`/images/work/${card.item.thumbnails}`"
                    :alt="card.item.name"
                    height="200"
                    cover
                    class="personal__image"
                />
              </template>
              <template #footer>
                <div class="personal__footer">
                  <span class="personal__footer-label">{{ t('portfolio.personal.viewProjectLabel') }}</span>
                  <v-btn
                      :to="card.item.live_demo"
                      target="_blank"
                      color="primary"
                      variant="text"
                      class="text-none"
                  >
                    {{ t('portfolio.personal.viewProjectCta') }}
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

<style scoped>

.personal {
  position: relative;
  overflow-x: hidden;
}


.personal__spark--one {
  top: 28%;
  left: 18%;
  animation-delay: 0.4s;
}

.personal__spark--two {
  top: 62%;
  right: 22%;
  animation-delay: 1.2s;
}

.personal__spark--three {
  top: 48%;
  left: 72%;
  animation-delay: 2.4s;
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
  font-size: clamp(2.5rem, 4vw + 1rem, 4.75rem);
  line-height: 1.1;
  font-weight: 800;
  text-shadow: 0 16px 36px rgba(15, 23, 42, 0.6);
}

.personal__description {
  padding: 30px;
  max-width: 680px;
  font-size: clamp(1.05rem, 1vw + 1rem, 1.25rem);
  line-height: 1.7;
}

.personal__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 10px;
  gap: 18px;
}

.personal__carousel {
  margin-top: clamp(32px, 6vw, 64px);
}

.personal__card {
  display: block;
  margin: 12px;
  width: clamp(260px, 58vw, 320px);
}

.personal__image {
  border-radius: 18px;
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

.personal__background {
  inset: 0;
  pointer-events: none;
  position: absolute;
  z-index: 0;
}

.personal__glow {
  position: absolute;
  filter: blur(120px);
  opacity: 0.7;
  border-radius: 999px;
}

.personal__glow--one {
  background: rgba(59, 130, 246, 0.6);
  height: 420px;
  width: 420px;
  top: -120px;
  left: -160px;
}

.personal__glow--two {
  background: rgba(14, 165, 233, 0.55);
  height: 320px;
  width: 320px;
  top: 180px;
  right: -140px;
}

.personal__glow--three {
  background: rgba(168, 85, 247, 0.45);
  height: 260px;
  width: 260px;
  bottom: 80px;
  left: 40%;
}

.personal__spark {
  position: absolute;
  width: 2px;
  height: 2px;
  background: rgba(255, 255, 255, 0.75);
  border-radius: 50%;
  box-shadow: 0 0 16px rgba(255, 255, 255, 0.55);
  animation: twinkle 6s ease-in-out infinite;
}
</style>
