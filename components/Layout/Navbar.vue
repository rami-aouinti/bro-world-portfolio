<script setup lang="ts">
import { useDisplay } from "vuetify";
import { resolveLocalizedRouteTarget } from "~/utils/i18n/resolve-target"

import type { LocaleObject } from "@nuxtjs/i18n";
import ThemePopover from "~/components/ThemePopover.vue";
import DarkModeToggle from "~/components/DarkModeToggle.vue";

const { data: navlinks } = useContentBlock('navlinks')

const drawer = ref(false)
const display = useDisplay()
const config = useConfig();
const localePath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()
const { locales, locale, t } = useI18n()
const rawLinks = computed(() => navlinks.value ?? [])
const links = computed(() =>
  rawLinks.value.map((link) => ({
    ...link,
    to: resolveLocalizedRouteTarget(link.url, localePath)
  })),
)

type LanguageItem = LocaleObject & { to: string }

const languageItems = computed<LanguageItem[]>(() => {
  const availableLocales = (locales.value ?? []) as LocaleObject[]

  return availableLocales.map((language) => ({
    ...language,
    to: switchLocalePath(language.code) ?? localePath("/"),
  }))
})

const currentLanguage = computed(() =>
  languageItems.value.find((language) => language.code === locale.value),
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
        <DarkModeToggle v-if="config.header.darkModeToggle" />
        <v-menu transition="fade-transition" :offset="[0, 8]">
          <template #activator="{ props }">
            <v-btn
              class="hero-app-bar__button hero-app-bar__button--right hero-app-bar__language-button"
              color="primary"
              variant="outlined"
              v-bind="props"
            >
              <span
                v-if="currentLanguage?.icon"
                class="hero-app-bar__language-flag"
                aria-hidden="true"
              >
                <span class="fi" :class="currentLanguage.icon" />
              </span>
              <span
                v-else
                class="hero-app-bar__language-code"
                aria-hidden="true"
              >
                {{ currentLanguage?.code?.toUpperCase() }}
              </span>
              <v-icon icon="mdi-menu-down" size="16" class="hero-app-bar__language-icon" />
            </v-btn>
          </template>

          <v-list class="hero-app-bar__language-list" density="compact" style="  background: linear-gradient(135deg, rgba(94, 234, 212, 0.12), rgba(59, 130, 246, 0.08));">
            <v-list-item
              v-for="language in languageItems"
              :key="language.code"
              :to="language.to"
              class="hero-app-bar__language-list-item"
              :class="{
                'hero-app-bar__language-list-item--active': language.code === locale,
              }"
            >
              <div class="hero-app-bar__language-item">
                <span
                  v-if="language.icon"
                  class="hero-app-bar__language-flag"
                  aria-hidden="true"
                >
                  <span class="fi" :class="language.icon" />
                </span>
                <span
                  v-else
                  class="hero-app-bar__language-code"
                  aria-hidden="true"
                >
                  {{ language.code.toUpperCase() }}
                </span>
                <div class="hero-app-bar__language-info">
                  <span class="hero-app-bar__language-name">{{ language.name }}</span>
                </div>
                <v-icon
                  v-if="language.code === locale"
                  icon="mdi-check"
                  size="16"
                  class="hero-app-bar__language-check"
                />
              </div>
            </v-list-item>
          </v-list>
        </v-menu>
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

.hero-app-bar__language-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding-inline: 16px;
}

.hero-app-bar__language-button .hero-app-bar__language-label {
  font-weight: 600;
  letter-spacing: 0.01em;
}

.hero-app-bar__language-flag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  overflow: hidden;
}

.hero-app-bar__language-flag .fi {
  border-radius: 50%;
  width: 100%;
  height: 100%;
}

.hero-app-bar__language-code {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.08);
  color: #f8fafc;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.hero-app-bar__language-label {
  font-weight: 600;
}

.hero-app-bar__language-icon {
  margin-left: 4px;
}

.hero-app-bar__language-list {
  --menu-background: rgba(15, 23, 42, 0.6);
  padding-block: 4px;
  background: linear-gradient(135deg, rgba(94, 234, 212, 0.12), rgba(59, 130, 246, 0.08));
  border: 1px solid rgba(148, 163, 184, 0.25);
  border-radius: 16px;
  box-shadow: 0 20px 45px -20px rgba(15, 23, 42, 0.65);
}

.hero-app-bar__language-list-item {
  min-height: unset;
  border-radius: 12px;
}

.hero-app-bar__language-list-item:hover {
  background-color: rgba(148, 163, 184, 0.1);
}

.hero-app-bar__language-list-item--active {
  background: rgba(94, 234, 212, 0.18);
  box-shadow: inset 0 0 0 1px rgba(94, 234, 212, 0.35);
}

.hero-app-bar__language-item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.hero-app-bar__language-name {
  font-weight: 500;
}

.hero-app-bar__language-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  color: #e2e8f0;
  font-size: 0.8rem;
  line-height: 1.1;
}

.hero-app-bar__language-short-code {
  font-size: 0.7rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(226, 232, 240, 0.72);
}

.hero-app-bar__language-check {
  margin-left: auto;
  color: rgba(94, 234, 212, 0.85);
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
