<script setup lang="ts">
import { computed } from 'vue'

const { data: education } = useContentBlock('education')

const educationContent = computed(() => education.value)
</script>

<template>
  <LayoutScrollSmooth>
    <v-container v-if="educationContent" class="py-16">
      <v-chip color="primary" variant="outlined" class="text-uppercase mb-4">
        {{ educationContent.label }}
      </v-chip>
      <h2 class="text-h4 font-weight-semibold">{{ educationContent.headline }}</h2>

      <v-row class="mt-10" dense>
        <v-col v-for="school in educationContent.schools" :key="school.degree + school.institution" cols="12" md="6">
          <v-card elevation="1" class="h-100">
            <v-card-subtitle class="text-uppercase text-caption">{{ school.timeframe }}</v-card-subtitle>
            <v-card-title>{{ school.degree }}</v-card-title>
            <v-card-subtitle>{{ school.institution }}</v-card-subtitle>
            <v-card-text>{{ school.details }}</v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </LayoutScrollSmooth>
</template>
