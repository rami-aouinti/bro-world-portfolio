<script setup lang="ts">
import { computed } from 'vue'

const { data: skills } = useContentBlock('skills')

const skillsContent = computed(() => skills.value)
</script>

<template>
  <section id="skills">
    <LayoutScrollSmooth>
      <v-container v-if="skillsContent" class="py-16">
        <v-chip color="primary" variant="outlined" class="text-uppercase mb-4">
          {{ skillsContent.label }}
        </v-chip>
        <h2 class="text-h4 font-weight-semibold">{{ skillsContent.headline }}</h2>
        <p class="text-body-1 text-medium-emphasis mt-4" style="max-width: 600px;">
          {{ skillsContent.subline }}
        </p>

        <v-row class="mt-10" dense>
          <v-col v-for="category in skillsContent.categories" :key="category.name" cols="12" md="4">
            <v-card elevation="1" class="h-100">
              <v-card-title>{{ category.name }}</v-card-title>
              <v-card-text>
                <v-chip-group column>
                  <v-chip
                    v-for="skill in category.skills"
                    :key="skill"
                    class="ma-1"
                    color="primary"
                    variant="tonal"
                  >
                    {{ skill }}
                  </v-chip>
                </v-chip-group>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </LayoutScrollSmooth>
  </section>
</template>
