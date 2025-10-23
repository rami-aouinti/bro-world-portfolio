<script setup lang="ts">
import { computed } from 'vue'

const { data: service } = useContentBlock('service')
const content = computed(() => service.value)
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
        <v-col v-for="item in content.services" :key="item.name" cols="12" md="4">
          <v-card class="h-100" elevation="1">
            <v-card-text class="d-flex flex-column" style="gap: 16px;">
              <v-avatar color="primary" size="56">
                <span class="text-white text-h6 font-weight-medium">
                  {{ item.name.charAt(0) }}
                </span>
              </v-avatar>
              <div>
                <h4 class="text-h6 font-weight-semibold mb-2">{{ item.name }}</h4>
                <p class="text-body-2 text-medium-emphasis">{{ item.description }}</p>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </LayoutScrollSmooth>
</template>
