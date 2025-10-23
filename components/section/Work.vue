<script setup lang="ts">
import { computed } from 'vue'

const { data: work } = useContentBlock('work')
const content = computed(() => work.value)
</script>

<template>
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
        <v-col v-for="item in content.works" :key="item.name" cols="12" md="6">
          <v-card elevation="2" class="h-100 d-flex flex-column">
            <v-img :src="`/images/work/${item.thumbnails}`" :alt="`Thumbnail ${item.name}`" height="220" cover />
            <v-card-title class="d-flex flex-column" style="align-items: flex-start;">
              <span class="text-h6">{{ item.name }}</span>
              <span class="text-caption text-medium-emphasis">{{ item.type }}</span>
            </v-card-title>
            <v-card-text class="text-body-2 text-medium-emphasis">
              {{ item.description }}
            </v-card-text>
            <v-card-actions class="mt-auto">
              <v-btn :to="item.live_demo" target="_blank" color="primary" variant="text" class="text-none">
                View live demo
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </LayoutScrollSmooth>
</template>
