<script setup lang="ts">
import { computed } from 'vue'

const { data: experiences } = useContentBlock('experiences')

const experiencesContent = computed(() => experiences.value)
</script>

<template>
  <LayoutScrollSmooth>
    <v-container v-if="experiencesContent" class="py-16">
      <v-chip color="primary" variant="outlined" class="text-uppercase mb-4">
        {{ experiencesContent.label }}
      </v-chip>
      <h2 class="text-h4 font-weight-semibold">{{ experiencesContent.headline }}</h2>

      <v-timeline class="mt-10" density="compact">
        <v-timeline-item
          v-for="position in experiencesContent.positions"
          :key="position.role + position.company"
          dot-color="primary"
        >
          <v-card elevation="1">
            <v-card-title class="d-flex flex-column flex-sm-row align-sm-start justify-space-between">
              <div>
                <div class="text-h6">{{ position.role }}</div>
                <div class="text-medium-emphasis">{{ position.company }}</div>
              </div>
              <div class="text-caption text-medium-emphasis mt-2 mt-sm-0">
                {{ position.timeframe }}
              </div>
            </v-card-title>
            <v-card-text>
              <v-list density="compact">
                <v-list-item
                  v-for="achievement in position.achievements"
                  :key="achievement"
                  prepend-icon="mdi-check-circle-outline"
                >
                  <v-list-item-title>{{ achievement }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-timeline-item>
      </v-timeline>
    </v-container>
  </LayoutScrollSmooth>
</template>
