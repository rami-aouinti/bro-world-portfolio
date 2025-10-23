<script setup lang="ts">
import { computed, ref } from 'vue'

import { resolveLocalizedRouteTarget } from '~/utils/i18n/resolve-target'

const { data: navlinks } = useContentBlock('navlinks')

const drawer = ref(false)
const localePath = useLocalePath()
const rawLinks = computed(() => navlinks.value ?? [])
const links = computed(() =>
  rawLinks.value.map((link) => ({
    ...link,
    to: resolveLocalizedRouteTarget(link.url, localePath)
  })),
)
const contactLink = computed(() => resolveLocalizedRouteTarget('/contact', localePath))
</script>

<template>
  <v-app-bar
    class="hero-app-bar"
    color="transparent"
    flat
    density="comfortable"
    height="80"
  >
    <v-app-bar-nav-icon class="d-md-none" @click="drawer = !drawer" />
    <v-toolbar-title class="font-weight-semibold">Bro World</v-toolbar-title>
    <v-spacer />
    <div class="d-none d-md-flex align-center" style="gap: 8px;">
      <v-btn
        v-for="link in links"
        :key="link.url"
        :to="link.to"
        color="primary"
        variant="text"
        class="text-none"
      >
        {{ link.label }}
      </v-btn>
    </div>
    <Button
      class="d-none d-md-inline-flex hero-contact"
      style="margin-left: 16px;"
      label="Connect Me"
      to="/contact"
      variant="btn-dark"
    />
  </v-app-bar>

  <v-navigation-drawer v-model="drawer" temporary location="top" width="100%">
    <v-list nav>
      <v-list-item
        v-for="link in links"
        :key="link.url"
        :to="link.to"
        @click="drawer = false"
      >
        <v-list-item-title>{{ link.label }}</v-list-item-title>
      </v-list-item>
    </v-list>
    <div class="pa-4">
      <v-btn block color="primary" :to="contactLink" class="text-none" @click="drawer = false">
        Connect Me
      </v-btn>
    </div>
  </v-navigation-drawer>
</template>

<style scoped>
.hero-app-bar {
  --nav-max-width: min(1040px, calc(100% - 32px));
  background: rgba(9, 13, 25, 0.78);
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 999px;
  backdrop-filter: blur(18px);
  box-shadow: 0 24px 60px -40px rgba(15, 23, 42, 0.9);
  margin: 20px auto 0;
  max-width: var(--nav-max-width);
  padding-inline: clamp(16px, 4vw, 32px);
}

.hero-app-bar :deep(.v-toolbar-title) {
  font-weight: 700;
  letter-spacing: 0.02em;
  color: #f8fafc;
}

.hero-app-bar :deep(.v-app-bar-nav-icon) {
  color: #f8fafc;
}

.hero-app-bar :deep(.v-btn) {
  border-radius: 999px;
  font-weight: 600;
  text-transform: none;
}

.hero-contact :deep(.v-btn__content) {
  letter-spacing: 0.02em;
}

@media (max-width: 600px) {
  .hero-app-bar {
    border-radius: 24px;
    margin-top: 12px;
  }
}
</style>
