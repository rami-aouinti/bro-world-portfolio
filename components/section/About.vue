<script setup lang="ts">
import { computed } from 'vue'

import CustomGlowCard from '~/components/CustomGlowCard.vue'
import ScrollSmooth from "~/components/layout/ScrollSmooth.vue";
import { resolveLocalizedRouteTarget } from '~/utils/i18n/resolve-target'

const { data: about } = useContentBlock('about')
const { data: profile } = useContentBlock('profile')
const { t } = useI18n()
const localePath = useLocalePath()

const aboutContent = computed(() => about.value)
const profileContent = computed(() => profile.value)
const hobbies = computed(() => aboutContent.value?.hobbies ?? [])
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
    t('portfolio.about.fallbackProfileDescription')
  )
})
</script>

<template>
  <section id="about">
    <ScrollSmooth>
      <v-container v-if="aboutContent" class="py-6">
        <v-row align="center" justify="center" class="g-8">
          <v-col cols="12" md="6">
            <h2 class="text-h4 text-foreground mb-4">{{ fullname || ' ' }}</h2>
            <div class="text-body-1 text-foreground d-flex flex-column" style="gap: 12px;">
              <p v-for="intro in aboutContent.introduce" :key="intro">
                {{ intro }}
              </p>
            </div>
            <div v-if="hobbies.length" class="about__hobbies">
              <h3 class="text-subtitle-1 text-foreground mb-3">
                {{ t('portfolio.about.hobbiesTitle') }}
              </h3>
              <div class="about__chips">
                <v-chip
                  v-for="hobby in hobbies"
                  :key="hobby"
                  color="primary"
                  variant="tonal"
                  size="small"
                  class="about__chip"
                >
                  {{ hobby }}
                </v-chip>
              </div>
            </div>
            <Button
              class="mt-8"
              :label="t('portfolio.about.cta')"
              :to="resolveLocalizedRouteTarget('/contact', localePath)"
              variant="btn-dark"
            />
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

.about__hobbies {
  margin-top: 32px;
}

.about__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.about__chip {
  text-transform: none;
}

.about__image {
  border-radius: 18px;
}
</style>
