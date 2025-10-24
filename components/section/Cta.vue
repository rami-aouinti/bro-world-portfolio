<script setup lang="ts">
import { computed } from 'vue'

import { resolveLocalizedRouteTarget } from '~/utils/i18n/resolve-target'

const { data: cta } = useContentBlock('cta')
const { data: navlinks } = useContentBlock('navlinks')
const { data: profile } = useContentBlock('profile')

const localePath = useLocalePath()
const ctaContent = computed(() => cta.value)
const rawLinks = computed(() => navlinks.value ?? [])
const links = computed(() =>
  rawLinks.value.map((link) => ({
    ...link,
    to: resolveLocalizedRouteTarget(link.url, localePath)
  })),
)
const profileName = computed(() => {
  if (!profile.value) {
    return ''
  }
  return `${profile.value.firstname} ${profile.value.lastname}`
})
</script>

<template>
  <LayoutScrollSmooth>
    <v-container class="py-16" v-if="ctaContent">
      <v-row justify="center">
        <v-col cols="12" md="8">
          <v-card elevation="2" class="text-center" style="padding: 48px 24px;">
            <h2 class="text-h4 font-weight-semibold">{{ ctaContent.label }}</h2>
            <p class="text-body-1 text-medium-emphasis mt-4">
              {{ ctaContent.description }}
            </p>
            <div class="mt-8">
              <Button to="/contact" variant="btn-dark" label="Start Collaboration" />
            </div>
            <v-divider class="my-8" />
            <div class="d-flex flex-wrap justify-center" style="gap: 16px;">
              <v-btn
                v-for="link in links"
                :key="link.url"
                :to="link.to"
                variant="text"
                color="primary"
                class="text-none"
              >
                {{ link.label }}
              </v-btn>
            </div>
            <p class="text-caption text-medium-emphasis mt-8">&copy; {{ new Date().getFullYear() }} {{ profileName }}</p>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </LayoutScrollSmooth>
</template>
