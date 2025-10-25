<script setup lang="ts">
import { resolveLocalizedRouteTarget } from "~/utils/i18n/resolve-target";

import type { LocaleObject } from "@nuxtjs/i18n";
import DarkModeToggle from "~/components/DarkModeToggle.vue";
import { Dock, DockIcon, DockSeparator } from "~/components/Ui/dock";

const { data: navlinks } = useContentBlock("navlinks");

const config = useConfig();
const localePath = useLocalePath();
const switchLocalePath = useSwitchLocalePath();
const { locales, locale, t } = useI18n();
const route = useRoute();

const rawLinks = computed(() => navlinks.value ?? []);
const navIconMap: Record<string, string> = {
  "/": "mdi-home-variant-outline",
  "/about": "mdi-account-badge-outline",
  "/skills": "mdi-star-circle-outline",
  "/experience": "mdi-briefcase-outline",
  "/education": "mdi-school-outline",
  "/work": "mdi-rocket-launch-outline",
  "/service": "mdi-cog-outline",
  "/blog": "mdi-post-outline",
  "/contact": "mdi-email-fast-outline",
};

const links = computed(() =>
  rawLinks.value.map((link) => ({
    ...link,
    to: resolveLocalizedRouteTarget(link.url, localePath),
    icon: link.icon ?? navIconMap[link.url as keyof typeof navIconMap] ?? "mdi-dots-grid",
  })),
);

type LanguageItem = LocaleObject & { to: string };

const languageItems = computed<LanguageItem[]>(() => {
  const availableLocales = (locales.value ?? []) as LocaleObject[];

  return availableLocales.map((language) => ({
    ...language,
    to: switchLocalePath(language.code) ?? localePath("/"),
  }));
});

const currentLanguage = computed(() =>
  languageItems.value.find((language) => language.code === locale.value),
);

const hasLanguageMenu = computed(() => languageItems.value.length > 0);
const hasControls = computed(
  () => config.value.header.darkModeToggle || hasLanguageMenu.value,
);

const EXTERNAL_PATTERN = /^(?:[a-z][a-z+.-]*:|\/\/)/i;

function isActiveLink(target: string) {
  if (!target || EXTERNAL_PATTERN.test(target)) {
    return false;
  }

  const [path] = target.split("#");
  return route.path === path;
}
</script>

<template>
  <nav class="dock-navbar">
    <Dock class="dock-navbar__dock" :magnification="72" :distance="160">
      <DockIcon v-for="link in links" :key="link.url">
        <NuxtLink
          :to="link.to"
          class="dock-navbar__link"
          :class="{ 'dock-navbar__link--active': isActiveLink(link.to) }"
        >
          <v-icon
            :icon="link.icon"
            size="28"
            class="dock-navbar__link-icon"
            aria-hidden="true"
          />
          <span class="sr-only">{{ link.label }}</span>
        </NuxtLink>
      </DockIcon>

      <DockSeparator v-if="hasControls" />

      <DockIcon v-if="config.header.darkModeToggle">
        <DarkModeToggle class="dock-navbar__toggle" />
      </DockIcon>

      <DockIcon v-if="hasLanguageMenu">
        <v-menu transition="fade-transition" :offset="[0, 12]">
          <template #activator="{ props }">
            <button
              class="dock-navbar__language-button"
              type="button"
              v-bind="props"
            >
              <span
                v-if="currentLanguage?.icon"
                class="dock-navbar__language-flag"
                aria-hidden="true"
              >
                <span class="fi" :class="currentLanguage.icon" />
              </span>
              <span v-else class="dock-navbar__language-code" aria-hidden="true">
                {{ currentLanguage?.code?.toUpperCase() }}
              </span>
              <v-icon icon="mdi-menu-down" size="16" class="dock-navbar__language-icon" />
              <span class="sr-only">{{ t("navigation.language") }}</span>
            </button>
          </template>

          <v-list class="dock-navbar__language-list" density="compact">
            <v-list-item
              v-for="language in languageItems"
              :key="language.code"
              :to="language.to"
              class="dock-navbar__language-list-item"
              :class="{
                'dock-navbar__language-list-item--active': language.code === locale,
              }"
            >
              <div class="dock-navbar__language-item">
                <span
                  v-if="language.icon"
                  class="dock-navbar__language-flag"
                  aria-hidden="true"
                >
                  <span class="fi" :class="language.icon" />
                </span>
                <span v-else class="dock-navbar__language-code" aria-hidden="true">
                  {{ language.code.toUpperCase() }}
                </span>
                <div class="dock-navbar__language-info">
                  <span class="dock-navbar__language-name">{{ language.name }}</span>
                </div>
                <v-icon
                  v-if="language.code === locale"
                  icon="mdi-check"
                  size="16"
                  class="dock-navbar__language-check"
                />
              </div>
            </v-list-item>
          </v-list>
        </v-menu>
      </DockIcon>
    </Dock>
  </nav>
</template>
<style scoped>
.dock-navbar {
  position: sticky;
  top: 16px;
  z-index: 30;
  display: flex;
  justify-content: center;
  margin: 24px 0;
  padding: 0 16px;
  pointer-events: none;
}

.dock-navbar__dock {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.6), rgba(30, 41, 59, 0.35));
  border: 1px solid rgba(148, 163, 184, 0.25);
  box-shadow: 0 30px 60px -30px rgba(15, 23, 42, 0.9);
  padding: 12px;
  backdrop-filter: blur(16px);
  pointer-events: auto;
}

.dock-navbar__link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 999px;
  padding: 0;
  color: #e2e8f0;
  background: rgba(148, 163, 184, 0.12);
  text-decoration: none;
  transition: all 0.2s ease;
}

.dock-navbar__link:hover {
  background: rgba(94, 234, 212, 0.18);
  color: #0f172a;
}

.dock-navbar__link--active {
  background: linear-gradient(135deg, rgba(94, 234, 212, 0.45), rgba(59, 130, 246, 0.3));
  color: #0f172a;
  box-shadow: 0 10px 25px -15px rgba(94, 234, 212, 0.8);
}

.dock-navbar__link-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.dock-navbar__toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
}

.dock-navbar__language-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  gap: 0;
  width: 56px;
  height: 56px;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.12);
  color: #e2e8f0;
  border: none;
  font-weight: 600;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;
  padding: 0;
}

.dock-navbar__language-button:hover {
  background: rgba(94, 234, 212, 0.18);
  color: #0f172a;
}

.dock-navbar__language-flag,
.dock-navbar__language-code {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  overflow: hidden;
  background: rgba(148, 163, 184, 0.16);
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
}

.dock-navbar__language-flag .fi {
  border-radius: 50%;
  width: 100%;
  height: 100%;
}

.dock-navbar__language-icon {
  position: absolute;
  right: 6px;
  bottom: 6px;
  color: currentColor;
}

.dock-navbar__language-list {
  padding: 6px;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 64, 175, 0.65));
  border: 1px solid rgba(148, 163, 184, 0.25);
  border-radius: 16px;
  box-shadow: 0 30px 60px -35px rgba(15, 23, 42, 0.85);
}

.dock-navbar__language-list-item {
  min-height: unset;
  border-radius: 12px;
}

.dock-navbar__language-list-item:hover {
  background: rgba(148, 163, 184, 0.12);
}

.dock-navbar__language-list-item--active {
  background: rgba(94, 234, 212, 0.18);
  box-shadow: inset 0 0 0 1px rgba(94, 234, 212, 0.35);
}

.dock-navbar__language-item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.dock-navbar__language-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  color: #e2e8f0;
  font-size: 0.8rem;
  line-height: 1.1;
}

.dock-navbar__language-name {
  font-weight: 500;
}

.dock-navbar__language-check {
  margin-left: auto;
  color: rgba(94, 234, 212, 0.9);
}

.dock-navbar :deep(.v-overlay__content) {
  border-radius: 18px;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}

@media (max-width: 960px) {
  .dock-navbar {
    margin-top: 16px;
    padding: 0 8px;
  }

  .dock-navbar__dock {
    width: min(100%, 520px);
    justify-content: space-between;
    overflow-x: auto;
  }

  .dock-navbar__link,
  .dock-navbar__toggle,
  .dock-navbar__language-button {
    width: 48px;
    height: 48px;
  }
}
</style>
