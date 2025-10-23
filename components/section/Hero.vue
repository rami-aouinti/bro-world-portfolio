<script setup lang="ts">
import { computed } from 'vue'
import ScrollSmooth from "~/components/Layout/ScrollSmooth.vue";

const { data: hero } = useContentBlock('hero')
const { data: work } = useContentBlock('work')

const heroContent = computed(() => hero.value)
const workItems = computed(() => work.value?.works ?? [])
</script>

<template>
  <ScrollSmooth>
    <v-container class="py-16" v-if="heroContent">
      <v-row justify="center" class="text-center">
        <v-col cols="12" md="10" lg="8">
          <v-chip v-if="heroContent?.badge" color="primary" variant="outlined" class="text-uppercase mb-4">
            {{ heroContent.badge }}
          </v-chip>
          <h1 class="text-h4 text-md-h3 text-lg-h2 font-weight-bold">
            {{ heroContent.headline }}
          </h1>
          <p class="text-body-1 text-medium-emphasis mt-4">
            {{ heroContent.subline }}
          </p>
          <div class="d-flex justify-center mt-8 flex-wrap" style="gap: 16px;">
            <Button label="View Work" to="/work" />
            <Button label="Contact Me" to="/contact" variant="btn-dark" />
          </div>
        </v-col>
      </v-row>

      <v-slide-group show-arrows class="mt-12">
        <v-slide-group-item v-for="item in workItems" :key="item.name">
          <v-card class="ma-3" max-width="320">
            <v-img :src="`/images/work/${item.thumbnails}`" :alt="item.name" height="200" cover />
            <v-card-title>{{ item.name }}</v-card-title>
            <v-card-subtitle>{{ item.type }}</v-card-subtitle>
            <v-card-text class="text-body-2">
              {{ item.description }}
            </v-card-text>
            <v-card-actions>
              <v-btn :to="item.live_demo" target="_blank" color="primary" variant="text" class="text-none">
                See project
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-slide-group-item>
      </v-slide-group>
    </v-container>
  </ScrollSmooth>
</template>
