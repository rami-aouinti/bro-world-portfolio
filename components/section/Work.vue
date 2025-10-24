<script setup lang="ts">
import { computed } from 'vue'

import CustomGlowCard from '~/components/CustomGlowCard.vue'
import { glowCardVariantCycle } from '~/utils/glowCardVariants'

const { data: work } = useContentBlock('work')
const content = computed(() => work.value)
const workCards = computed(() => {
  const items = content.value?.works ?? []

  return items.map((item, index) => ({
    item,
    variant: glowCardVariantCycle[index % glowCardVariantCycle.length]
  }))
})
</script>

<template>
  <section id="work">
    <LayoutScrollSmooth>
      <v-container v-if="content" class="py-16">
        <v-chip color="primary" variant="outlined" class="text-uppercase mb-4">
          {{ content.label }}
        </v-chip>
        <h2 class="text-h4 font-weight-semibold">{{ content.headline }}</h2>
        <p class="text-body-1 text-medium-emphasis mt-4" style="max-width: 600px;">
          {{ content.subline }}
        </p>

        <v-row class="mt-12" dense>
          <v-col v-for="card in workCards" :key="card.item.name" cols="12" md="6">
            <CustomGlowCard
              class="work__card"
              :title="card.item.name"
              :description="card.item.description"
              :badge="card.item.type"
              :variant="card.variant"
            >
              <template #media>
                <v-img
                  :src="`/images/work/${card.item.thumbnails}`"
                  :alt="`Thumbnail ${card.item.name}`"
                  height="220"
                  cover
                  class="work__image"
                />
              </template>
              <template #footer>
                <div class="work__footer">
                  <span class="work__footer-label">Live project</span>
                  <v-btn
                    :to="card.item.live_demo"
                    target="_blank"
                    color="primary"
                    variant="text"
                    class="text-none"
                  >
                    View live demo
                  </v-btn>
                </div>
              </template>
            </CustomGlowCard>
          </v-col>
        </v-row>
      </v-container>
    </LayoutScrollSmooth>
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
