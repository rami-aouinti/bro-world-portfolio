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

watchEffect(() => {
  if (display.mdAndUp.value) {
    drawer.value = false
  }
})
</script>

<template>
  <v-app-bar
    class="hero-app-bar mx-auto"
    color="transparent"
    density="compact"
    height="60"
    :elevation="0"
    rounded="xl"
  >
    <div class="hero-app-bar__content">
      <div class="hero-app-bar__side hero-app-bar__side--left">
        <v-btn
          class="hero-app-bar__button hero-app-bar__button--left"
          color="primary"
          variant="outlined"
          to="/contact"
        >
          Contact
        </v-btn>
        <v-app-bar-nav-icon class="d-md-none" @click="drawer = !drawer" />
      </div>
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
      <div class="hero-app-bar__side hero-app-bar__side--right">
        <v-btn
          class="hero-app-bar__button hero-app-bar__button--right"
          color="primary"
          variant="outlined"
          to="/contact"
        >
          Language
        </v-btn>
      </div>
    </div>
  </v-app-bar>
</template>
<style scoped>
.hero-app-bar {
  backdrop-filter: blur(38px);
  margin: 6px auto 0;
  padding-inline: clamp(12px, 3vw, 24px);
  inset-inline: auto;
}

.hero-app-bar__content {
  display: flex;
  align-items: center;
  width: 100%;
}

.hero-app-bar__side {
  display: flex;
  align-items: center;
  gap: 8px;
}

.hero-app-bar__side--right {
  margin-left: auto;
}

.hero-app-bar__button {
  border-radius: 999px;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.hero-app-bar__links {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-inline: auto;
  flex: 1;
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
    width: calc(100% - 24px);
    left: 50%;
    transform: translateX(-50%);
  }

  .hero-app-bar__content {
    justify-content: space-between;
  }
}
</style>
