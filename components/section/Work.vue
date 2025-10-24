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
          <v-col v-for="card in workCards" :key="card.item.slug" cols="12" md="4">
            <CardContainer class="w-full">
              <CardBody class="work-card-body">
                <NuxtLink
                  :to="card.route"
                  class="absolute inset-0 z-0 text-center"
                  :aria-label="t('portfolio.work.thumbnailAlt', { name: card.item.name })"
                />
                <div class="relative z-10 flex h-full flex-col gap-5">
                  <CardItem
                    as="div"
                    :translateZ="60"
                    class="work-card-media"
                  >
                    <NuxtImg
                      :src="`/images/work/${card.item.thumbnails}`"
                      :alt="t('portfolio.work.thumbnailAlt', { name: card.item.name })"
                      height="220"
                      cover
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
@reference "../../assets/styles/index.css";
.work-card-body {
  position: relative;
  height: 100%;
  width: 100%;
  border-radius: 28px;
  border: 1px solid;
  padding: 1.5rem;
  box-shadow: 0 20px 60px -30px rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-color: hsl(var(--border) / 0.4);
  background-color: hsl(var(--background) / 0.8);
}

.work-card-media {
  overflow: hidden;
  border-radius: 1rem;
  border: 1px solid;
  box-shadow: 0 20px 45px -35px rgba(15, 23, 42, 0.75);
  border-color: hsl(var(--border) / 0.4);
}

.work-card-badge {
  width: fit-content;
  border-radius: 9999px;
  padding: 0.25rem 1rem;
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.35em;
  color: hsl(var(--primary));
  background-color: hsl(var(--primary) / 0.1);
}

.work-card-footer-label {
  font-size: 0.75rem;
  line-height: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.35em;
  color: hsl(var(--muted-foreground));
}
</style>
