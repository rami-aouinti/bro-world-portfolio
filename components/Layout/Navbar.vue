<script setup lang="ts">
import { useDisplay } from "vuetify";
import { resolveLocalizedRouteTarget } from '~/utils/i18n/resolve-target'

const { data: navlinks } = useContentBlock('navlinks')

const drawer = ref(false)
const display = useDisplay()
const localePath = useLocalePath()
const rawLinks = computed(() => navlinks.value ?? [])
const links = computed(() =>
  rawLinks.value.map((link) => ({
    ...link,
    to: resolveLocalizedRouteTarget(link.url, localePath)
  })),
)
const contactLink = computed(() => resolveLocalizedRouteTarget('/contact', localePath))

watchEffect(() => {
  if (display.mdAndUp.value) {
    drawer.value = false
  }
})
</script>

<template>
  <v-app-bar
    class="hero-app-bar"
    color="transparent"
    flat
    density="compact"
    height="64"
  >
    <div class="hero-app-bar__content">
      <v-app-bar-nav-icon class="d-md-none" @click="drawer = !drawer" />
      <v-toolbar-title class="font-weight-semibold">Bro World</v-toolbar-title>
      <div class="hero-app-bar__links d-none d-md-flex align-center">
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
        label="Connect Me"
        to="/contact"
        variant="btn-dark"
      />
    </div>
  </v-app-bar>
</template>
<style scoped>
.hero-app-bar {
  --nav-max-width: min(900px, calc(100% - 24px));
  background: rgba(9, 13, 25, 0.78);
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 999px;
  backdrop-filter: blur(18px);
  box-shadow: 0 24px 60px -40px rgba(15, 23, 42, 0.9);
  margin: 16px auto 0;
  max-width: var(--nav-max-width);
  padding-inline: clamp(12px, 3vw, 24px);
}

.hero-app-bar__content {
  display: flex;
  align-items: center;
  gap: clamp(12px, 3vw, 24px);
  width: 100%;
}

.hero-app-bar__links {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-inline: auto;
}

.hero-app-bar :deep(.v-toolbar-title) {
  font-weight: 700;
  letter-spacing: 0.02em;
  color: #f8fafc;
}

.hero-app-bar :deep(.v-toolbar-title),
.hero-contact {
  flex-shrink: 0;
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

  .hero-app-bar__content {
    justify-content: space-between;
  }
}
</style>
