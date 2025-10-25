<template>
  <nav
    class="dock-navbar"
    :class="{ 'dock-navbar--mobile': isMobile }"
  >
    <template v-if="isMobile">
      <button
        class="dock-navbar__drawer-button"
        type="button"
        @click="isDrawerOpen = true"
      >
        <v-icon
          icon="mdi-menu"
          size="28"
          aria-hidden="true"
        />
        <span class="sr-only">{{ t("navigation.openMenu") }}</span>
      </button>

      <v-navigation-drawer
        v-model="isDrawerOpen"
        class="dock-navbar__drawer"
        location="left"
        temporary
        scrim
      >
        <div class="dock-navbar__drawer-inner">
          <div class="dock-navbar__drawer-header">
            <span class="dock-navbar__drawer-title">{{ t("navigation.title") }}</span>
            <button
              class="dock-navbar__drawer-close"
              type="button"
              @click="closeDrawer"
            >
              <v-icon
                icon="mdi-close"
                size="24"
                aria-hidden="true"
              />
              <span class="sr-only">{{ t("navigation.closeMenu") }}</span>
            </button>
          </div>

          <v-divider class="dock-navbar__drawer-divider" />

          <v-list
            class="dock-navbar__drawer-links"
            density="comfortable"
          >
            <v-list-item
              v-for="link in links"
              :key="link.url"
              :to="link.to"
              link
              class="dock-navbar__drawer-link"
              :class="{ 'dock-navbar__drawer-link--active': isActiveLink(link.to) }"
              @click="closeDrawer"
            >
              <template #prepend>
                <v-icon
                  :icon="link.icon"
                  size="24"
                  aria-hidden="true"
                />
              </template>
              <v-list-item-title>{{ link.label }}</v-list-item-title>
            </v-list-item>
          </v-list>

          <div
            v-if="hasControls"
            class="dock-navbar__drawer-controls"
          >
            <div
              v-if="config.header.darkModeToggle"
              class="dock-navbar__drawer-control"
            >
              <DarkModeToggle class="dock-navbar__toggle" />
            </div>

            <div
              v-if="hasLanguageMenu"
              class="dock-navbar__drawer-languages"
            >
              <span class="dock-navbar__drawer-control-label">
                {{ t("navigation.language") }}
              </span>
              <v-list
                class="dock-navbar__drawer-language-list"
                density="compact"
              >
                <v-list-item
                  v-for="language in languageItems"
                  :key="language.code"
                  :to="language.to"
                  link
                  class="dock-navbar__drawer-language-item"
                  :class="{
                    'dock-navbar__drawer-language-item--active': language.code === locale,
                  }"
                  @click="closeDrawer"
                >
                  <div class="dock-navbar__language-item">
                    <span
                      v-if="language.icon"
                      class="dock-navbar__language-flag"
                      aria-hidden="true"
                    >
                      <span
                        class="fi"
                        :class="language.icon"
                      />
                    </span>
                    <span
                      v-else
                      class="dock-navbar__language-code"
                      aria-hidden="true"
                    >
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
            </div>
          </div>
        </div>
      </v-navigation-drawer>
    </template>

    <template v-else>
      <Dock
        class="dock-navbar__dock"
        :magnification="72"
        :distance="160"
      >
        <DockIcon
          v-for="link in links"
          :key="link.url"
        >
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
          <v-menu
            transition="fade-transition"
            :offset="[0, 12]"
          >
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
                  <span
                    class="fi"
                    :class="currentLanguage.icon"
                  />
                </span>
                <span
                  v-else
                  class="dock-navbar__language-code"
                  aria-hidden="true"
                >
                  {{ currentLanguage?.code?.toUpperCase() }}
                </span>
                <v-icon
                  icon="mdi-menu-down"
                  size="16"
                  class="dock-navbar__language-icon"
                />
                <span class="sr-only">{{ t("navigation.language") }}</span>
              </button>
            </template>

            <v-list
              class="dock-navbar__language-list"
              density="compact"
            >
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
                    <span
                      class="fi"
                      :class="language.icon"
                    />
                  </span>
                  <span
                    v-else
                    class="dock-navbar__language-code"
                    aria-hidden="true"
                  >
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
    </template>
  </nav>
</template>

<script setup lang="ts">
import { resolveLocalizedRouteTarget } from "~/utils/i18n/resolve-target";

import { useMediaQuery } from "@vueuse/core";
import type { LocaleObject } from "@nuxtjs/i18n";
import DarkModeToggle from "~/components/DarkModeToggle.vue";
import { Dock, DockIcon, DockSeparator } from "~/components/ui/dock";

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
  "/projects": "mdi-github",
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
const hasControls = computed(() => config.value.header.darkModeToggle || hasLanguageMenu.value);

const isDrawerOpen = ref(false);
const isMobile = useMediaQuery("(max-width: 960px)");

watch(isMobile, (value) => {
  if (!value) {
    isDrawerOpen.value = false;
  }
});

function closeDrawer() {
  isDrawerOpen.value = false;
}

const EXTERNAL_PATTERN = /^(?:[a-z][a-z+.-]*:|\/\/)/i;

function isActiveLink(target: string) {
  if (!target || EXTERNAL_PATTERN.test(target)) {
    return false;
  }

  const [path] = target.split("#");
  return route.path === path;
}
</script>
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

.dock-navbar--mobile {
  justify-content: flex-end;
  margin-top: 16px;
  pointer-events: auto;
}

.dock-navbar__drawer-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border: none;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.6);
  color: #e2e8f0;
  box-shadow: 0 20px 35px -20px rgba(15, 23, 42, 0.9);
  cursor: pointer;
  pointer-events: auto;
  transition:
    background 0.2s ease,
    color 0.2s ease;
}

.dock-navbar__drawer-button:hover {
  background: rgba(94, 234, 212, 0.25);
  color: #0f172a;
}

:deep(.dock-navbar__drawer) {
  background: transparent;
  border: none;
  box-shadow: none;
}

:deep(.dock-navbar__drawer .v-navigation-drawer__content) {
  padding: 0;
}

.dock-navbar__drawer-inner {
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100%;
  padding: 24px;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.75));
  border: 1px solid rgba(148, 163, 184, 0.25);
  box-shadow: 0 30px 60px -35px rgba(15, 23, 42, 0.85);
}

.dock-navbar__drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.dock-navbar__drawer-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #e2e8f0;
}

.dock-navbar__drawer-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.16);
  color: #e2e8f0;
  cursor: pointer;
  transition:
    background 0.2s ease,
    color 0.2s ease;
}

.dock-navbar__drawer-close:hover {
  background: rgba(94, 234, 212, 0.25);
  color: #0f172a;
}

.dock-navbar__drawer-divider {
  border-color: rgba(148, 163, 184, 0.25) !important;
}

.dock-navbar__drawer-links {
  background: transparent;
  color: #e2e8f0;
  padding: 0;
}

.dock-navbar__drawer-link {
  border-radius: 16px;
  margin-bottom: 4px;
  transition:
    background 0.2s ease,
    color 0.2s ease;
}

.dock-navbar__drawer-link:hover {
  background: rgba(148, 163, 184, 0.12);
}

.dock-navbar__drawer-link--active {
  background: rgba(94, 234, 212, 0.18);
  box-shadow: inset 0 0 0 1px rgba(94, 234, 212, 0.35);
}

.dock-navbar__drawer-controls {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: auto;
}

.dock-navbar__drawer-control,
.dock-navbar__drawer-languages {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.dock-navbar__drawer-control-label {
  font-size: 0.9rem;
  font-weight: 500;
  color: #cbd5f5;
}

.dock-navbar__drawer-language-list {
  padding: 0;
  background: transparent;
}

.dock-navbar__drawer-language-item {
  border-radius: 12px;
  margin-bottom: 4px;
  transition:
    background 0.2s ease,
    color 0.2s ease;
}

.dock-navbar__drawer-language-item:hover {
  background: rgba(148, 163, 184, 0.12);
}

.dock-navbar__drawer-language-item--active {
  background: rgba(94, 234, 212, 0.18);
  box-shadow: inset 0 0 0 1px rgba(94, 234, 212, 0.35);
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
  color: #e2e8f0;
  border: none;
  font-weight: 600;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition:
    background 0.2s ease,
    color 0.2s ease;
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

  .dock-navbar__drawer-button {
    width: 48px;
    height: 48px;
  }
}
</style>
