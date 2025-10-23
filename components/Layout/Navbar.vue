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
  <v-app-bar color="surface" flat density="comfortable">
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
    <Button class="d-none d-md-inline-flex" style="margin-left: 16px;" label="Connect Me" to="/contact" variant="btn-dark" />
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
