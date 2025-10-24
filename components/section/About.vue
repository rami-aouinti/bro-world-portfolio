<script setup lang="ts">
import { computed } from 'vue'

import CustomGlowCard from '~/components/CustomGlowCard.vue'
import ScrollSmooth from "~/components/Layout/ScrollSmooth.vue";

const { data: about } = useContentBlock('about')
const { data: profile } = useContentBlock('profile')

const aboutContent = computed(() => about.value)
const profileContent = computed(() => profile.value)
const fullname = computed(() => {
  if (!profileContent.value) {
    return ''
  }
  return `${profileContent.value.firstname} ${profileContent.value.lastname}`
})
const profileDescription = computed(() => {
  if (!profileContent.value) {
    return ''
  }

  return (
    aboutContent.value?.introduce?.[0] ??
    'Building reliable backend systems with PHP, Symfony, and clean architecture.'
  )
})
</script>

<template>
  <section id="about">
    <ScrollSmooth>
      <v-container v-if="aboutContent" class="py-6">
        <v-row align="center" justify="center" class="g-8">
          <v-col cols="12" md="6">
            <v-chip color="primary" variant="outlined" class="text-uppercase mb-4">
              {{ aboutContent.label }}
            </v-chip>
            <h2 class="text-h4 text-white mb-4">{{ fullname || ' ' }}</h2>
            <div class="text-body-1 text-white d-flex flex-column" style="gap: 12px;">
              <p v-for="intro in aboutContent.introduce" :key="intro">
                {{ intro }}
              </p>
            </div>
            <Button class="mt-8" label="Connect Me" to="/contact" variant="btn-dark" />
          </v-col>
          <v-col cols="12" md="6" v-if="profileContent">
            <CustomGlowCard
              class="about__card"
              :title="profileContent.role"
              :eyebrow="fullname"
              :description="profileDescription"
              variant="teal"
            >
              <template #media>
                <v-img
                  :src="profileContent.avatar"
                  :alt="`${fullname} - ${profileContent.role}`"
                  height="360"
                  cover
                  class="about__image"
                />
              </template>
            </CustomGlowCard>
          </v-col>
        </v-row>
      </v-container>
    </ScrollSmooth>
  </section>
</template>

<style scoped>
.about__card {
  height: 100%;
}

.about__image {
  border-radius: 18px;
}
</style>
