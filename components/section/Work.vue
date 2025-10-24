<script setup lang="ts">
import { computed } from 'vue'

import CustomGlowCard from '~/components/CustomGlowCard.vue'
import { glowCardVariantCycle } from '~/utils/glowCardVariants'
import ScrollSmooth from "~/components/Layout/ScrollSmooth.vue";
import { resolveLocalizedRouteTarget } from '~/utils/i18n/resolve-target'

const { data: work } = useContentBlock('work')
const { t } = useI18n()
const localePath = useLocalePath()
const content = computed(() => work.value)
const workCards = computed(() => {
  const items = content.value?.works ?? []

  return items.map((item, index) => ({
    item,
    route: resolveLocalizedRouteTarget(`/work/${item.slug}`, localePath),
    variant: glowCardVariantCycle[index % glowCardVariantCycle.length]
  }))
})
</script>

<template>
  <section id="work">
    <ScrollSmooth>
      <v-container v-if="content" class="mt-10">
        <h2 class="text-h4 text-foreground">{{ content.headline }}</h2>
        <p class="text-body-1 text-foreground mt-4" style="max-width: 600px;">
          {{ content.subline }}
        </p>

        <v-row class="mt-12" dense>
          <v-col v-for="card in workCards" :key="card.item.slug" cols="12" md="6">
            <CustomGlowCard
              class="work__card"
              :title="card.item.name"
              :description="card.item.description"
              :badge="card.item.type"
              :to="card.route"
              :variant="card.variant"
            >
              <template #media>
                <v-img
                  :src="`/images/work/${card.item.thumbnails}`"
                  :alt="t('portfolio.work.thumbnailAlt', { name: card.item.name })"
                  height="220"
                  cover
                  class="work__image"
                />
              </template>
              <template #footer>
                <div class="work__footer">
                  <span class="work__footer-label">{{ t('portfolio.work.footerLabel') }}</span>
                  <v-btn
                    :to="card.item.live_demo"
                    target="_blank"
                    color="primary"
                    variant="text"
                    class="text-none"
                    @click.stop
                    @keydown.stop
                  >
                    {{ t('portfolio.work.liveDemo') }}
                  </v-btn>
                </div>
              </template>
            </CustomGlowCard>
          </v-col>
        </v-row>
      </v-container>
    </ScrollSmooth>
  </section>
</template>

<style scoped>
.work__card {
  height: 100%;
}

.work__image {
  border-radius: 18px;
}

.work__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.work__footer-label {
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.75rem;
  color: color-mix(in srgb, var(--card-text-color) 65%, white 35%);
}
</style>
