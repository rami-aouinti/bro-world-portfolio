<script setup lang="ts">
import { computed } from 'vue'

import ScrollSmooth from "~/components/Layout/ScrollSmooth.vue";
import { resolveLocalizedRouteTarget } from '~/utils/i18n/resolve-target'
import { CardBody, CardContainer, CardItem } from "~/components/Ui/card-3d";
const { data: work } = useContentBlock('work')
const { t } = useI18n()
const localePath = useLocalePath()
const content = computed(() => work.value)
const workCards = computed(() => {
  const items = content.value?.works ?? []

  return items.map((item) => ({
    item,
    route: resolveLocalizedRouteTarget(`/work/${item.slug}`, localePath),
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
            <CardContainer class="w-full">
              <CardBody class="work-card-body">
                <NuxtLink
                  :to="card.route"
                  class="absolute inset-0 z-0"
                  :aria-label="t('portfolio.work.thumbnailAlt', { name: card.item.name })"
                />
                <div class="relative z-10 flex h-full flex-col gap-5">
                  <CardItem
                    as="div"
                    :translateZ="60"
                    class="work-card-media"
                  >
                    <v-img
                      :src="`/images/work/${card.item.thumbnails}`"
                      :alt="t('portfolio.work.thumbnailAlt', { name: card.item.name })"
                      height="220"
                      cover
                      class="h-full w-full object-cover"
                    />
                  </CardItem>
                  <div class="flex flex-col gap-3">
                    <CardItem
                      as="span"
                      :translateZ="40"
                      class="work-card-badge"
                    >
                      {{ card.item.type }}
                    </CardItem>
                    <CardItem
                      as="h3"
                      :translateZ="55"
                      class="text-2xl font-semibold text-foreground"
                    >
                      {{ card.item.name }}
                    </CardItem>
                    <CardItem
                      as="p"
                      :translateZ="35"
                      class="text-sm leading-relaxed text-muted-foreground"
                    >
                      {{ card.item.description }}
                    </CardItem>
                  </div>
                  <CardItem
                    as="div"
                    :translateZ="25"
                    class="mt-auto flex items-center justify-between gap-4 pt-4"
                  >
                    <span class="work-card-footer-label">
                      {{ t('portfolio.work.footerLabel') }}
                    </span>
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
                  </CardItem>
                </div>
              </CardBody>
            </CardContainer>
          </v-col>
        </v-row>
      </v-container>
    </ScrollSmooth>
  </section>
</template>

<style scoped>
.work-card-body {
  @apply relative h-full w-full rounded-[28px] border border-border/40 bg-background/80 p-6 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.45)] backdrop-blur;
}

.work-card-media {
  @apply overflow-hidden rounded-2xl border border-border/40 shadow-[0_20px_45px_-35px_rgba(15,23,42,0.75)];
}

.work-card-badge {
  @apply w-fit rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-primary;
}

.work-card-footer-label {
  @apply text-xs uppercase tracking-[0.35em] text-muted-foreground;
}
</style>
