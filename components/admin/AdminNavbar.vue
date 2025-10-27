<template>
  <nav
    class="dock-navbar"
    :class="{ 'dock-navbar--mobile': isMobile }"
    :style="controlStyles"
  >
    <template v-if="isMobile">
      <div class="dock-navbar__mobile-bar">
        <button
          class="dock-navbar__drawer-button"
          type="button"
          @click="isDrawerOpen = true"
        >
          <v-icon
            icon="mdi-menu"
            :size="controlIconSize"
            aria-hidden="true"
          />
          <span class="sr-only">{{ t('navigation.openMenu') }}</span>
        </button>

        <NuxtLink
          class="dock-navbar__logo"
          to="/admin"
        >
          <img
            src="/logo.png"
            alt="BroWorld"
            class="dock-navbar__logo-image"
          />
        </NuxtLink>

        <div class="dock-navbar__mobile-right">
          <DarkModeToggle
            v-if="config.header.darkModeToggle"
            class="dock-navbar__toggle"
            :icon-size="controlIconSize"
          />

          <v-menu
            v-if="hasLanguageMenu"
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
                  :size="controlChevronSize"
                  class="dock-navbar__language-icon"
                />
                <span class="sr-only">{{ t('navigation.language') }}</span>
              </button>
            </template>

            <v-list
              class="dock-navbar__language-list"
              density="compact"
              tag="ul"
            >
              <v-list-item
                v-for="language in languageItems"
                :key="language.code"
                tag="li"
                class="dock-navbar__language-list-item"
                :class="{
                  'dock-navbar__language-list-item--active': language.code === locale,
                }"
              >
                <NuxtLink
                  :to="language.to"
                  class="dock-navbar__language-link"
                >
                  <div class="dock-navbar__language-item">
                    <div class="dock-navbar__language-info">
                      <span class="dock-navbar__language-name">{{ language.name }}</span>
                    </div>
                    <v-icon
                      v-if="language.code === locale"
                      icon="mdi-check"
                      :size="controlChevronSize"
                      class="dock-navbar__language-check"
                    />
                  </div>
                </NuxtLink>
              </v-list-item>
            </v-list>
          </v-menu>

          <button
            class="dock-navbar__drawer-button dock-navbar__drawer-button--logout"
            type="button"
            @click="handleLogout"
          >
            <v-icon
              icon="mdi-logout"
              :size="controlIconSize"
              aria-hidden="true"
            />
            <span class="sr-only">{{ t('admin.dashboard.session.logout') }}</span>
          </button>
        </div>
      </div>

      <v-navigation-drawer
        v-model="isDrawerOpen"
        class="dock-navbar__drawer"
        location="left"
        temporary
        scrim
      >
        <div class="dock-navbar__drawer-inner">
          <div class="dock-navbar__drawer-header">
            <span class="dock-navbar__drawer-title">{{ t('navigation.title') }}</span>
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
              <span class="sr-only">{{ t('navigation.closeMenu') }}</span>
            </button>
          </div>

          <v-divider class="dock-navbar__drawer-divider" />

          <v-list
            class="dock-navbar__drawer-links"
            density="compact"
            tag="ul"
          >
            <v-list-item
              v-for="link in baseLinks"
              :key="link.url"
              tag="li"
              density="compact"
              class="dock-navbar__drawer-link"
              :class="{ 'dock-navbar__drawer-link--active': isActiveLink(link.to) }"
            >
              <NuxtLink
                :to="link.to"
                class="dock-navbar__drawer-link-button"
                :aria-current="isActiveLink(link.to) ? 'page' : undefined"
                @click="closeDrawer"
              >
                <v-icon
                  :icon="link.icon"
                  size="24"
                  class="dock-navbar__drawer-link-icon"
                  aria-hidden="true"
                />
                <span class="dock-navbar__drawer-link-label">{{ link.label }}</span>
              </NuxtLink>
            </v-list-item>
          </v-list>

          <template v-if="sectionLinks.length">
            <v-divider class="dock-navbar__drawer-divider" />
            <p class="dock-navbar__drawer-section-title">{{ contentSectionTitle }}</p>
            <v-list
              class="dock-navbar__drawer-links"
              density="compact"
              tag="ul"
            >
              <v-list-item
                v-for="link in sectionLinks"
                :key="link.url"
                tag="li"
                density="compact"
                class="dock-navbar__drawer-link"
                :class="{ 'dock-navbar__drawer-link--active': isActiveLink(link.to) }"
              >
                <NuxtLink
                  :to="link.to"
                  class="dock-navbar__drawer-link-button"
                  :aria-current="isActiveLink(link.to) ? 'page' : undefined"
                  @click="closeDrawer"
                >
                  <v-icon
                    :icon="link.icon"
                    size="24"
                    class="dock-navbar__drawer-link-icon"
                    aria-hidden="true"
                  />
                  <span class="dock-navbar__drawer-link-label">{{ link.label }}</span>
                </NuxtLink>
              </v-list-item>
            </v-list>
          </template>

          <v-divider class="dock-navbar__drawer-divider" />
          <v-list
            class="dock-navbar__drawer-links"
            density="compact"
            tag="ul"
          >
            <v-list-item
              tag="li"
              density="compact"
              class="dock-navbar__drawer-link"
            >
              <button
                class="dock-navbar__drawer-link-button"
                type="button"
                @click="handleLogout"
              >
                <v-icon
                  icon="mdi-logout"
                  size="24"
                  class="dock-navbar__drawer-link-icon"
                  aria-hidden="true"
                />
                <span class="dock-navbar__drawer-link-label">{{ t('admin.dashboard.session.logout') }}</span>
              </button>
            </v-list-item>
          </v-list>
        </div>
      </v-navigation-drawer>
    </template>

    <template v-else>
      <Dock
        class="dock-navbar__dock"
        :magnification="72"
        :distance="160"
      >
        <DockIcon>
          <NuxtLink
            to="/admin"
            class="dock-navbar__link dock-navbar__link--logo"
          >
            <img
              src="/logo.png"
              alt="BroWorld"
              class="dock-navbar__logo-image"
            />
            <span class="sr-only">BroWorld</span>
          </NuxtLink>
        </DockIcon>

        <DockIcon
          v-for="link in baseLinks"
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

        <DockSeparator v-if="sectionLinks.length" />

        <DockIcon
          v-for="link in sectionLinks"
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

        <DockSeparator />

        <DockIcon v-if="config.header.darkModeToggle">
          <DarkModeToggle
            class="dock-navbar__toggle"
            :icon-size="controlIconSize"
          />
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
                <span class="sr-only">{{ t('navigation.language') }}</span>
              </button>
            </template>

            <v-list
              class="dock-navbar__language-list"
              density="compact"
              tag="ul"
            >
              <v-list-item
                v-for="language in languageItems"
                :key="language.code"
                tag="li"
                class="dock-navbar__language-list-item"
                :class="{
                  'dock-navbar__language-list-item--active': language.code === locale,
                }"
              >
                <NuxtLink
                  :to="language.to"
                  class="dock-navbar__language-link"
                >
                  <div class="dock-navbar__language-item">
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
                </NuxtLink>
              </v-list-item>
            </v-list>
          </v-menu>
        </DockIcon>

        <DockIcon>
          <button
            class="dock-navbar__link dock-navbar__link--action"
            type="button"
            @click="handleLogout"
          >
            <v-icon
              icon="mdi-logout"
              size="28"
              class="dock-navbar__link-icon"
              aria-hidden="true"
            />
            <span class="sr-only">{{ t('admin.dashboard.session.logout') }}</span>
          </button>
        </DockIcon>
      </Dock>
    </template>
  </nav>
</template>

<script setup lang="ts">
import { useLocalePath, useSwitchLocalePath } from "#i18n";
import type { LocaleObject } from "@nuxtjs/i18n";
import { useMediaQuery } from "@vueuse/core";
import { computed, onMounted, ref, watch } from "vue";
import DarkModeToggle from "~/components/DarkModeToggle.vue";
import { Dock, DockIcon, DockSeparator } from "~/components/ui/dock";

const config = useConfig();
const localePath = useLocalePath();
const switchLocalePath = useSwitchLocalePath();
const { locales, locale, t } = useI18n();
const route = useRoute();
const router = useRouter();

const baseLinks = computed(() => [
  {
    url: "home",
    to: localePath("/"),
    label: translate("admin.navigation.home", "Home"),
    icon: "mdi-home-variant-outline",
  },
  {
    url: "dashboard",
    to: "/admin",
    label: translate("admin.navigation.dashboard", "Dashboard"),
    icon: "mdi-view-dashboard-outline",
  },
  {
    url: "settings",
    to: "/admin/settings",
    label: translate("admin.navigation.settings", "Settings"),
    icon: "mdi-cog-outline",
  },
  {
    url: "design",
    to: "/admin/design",
    label: translate("admin.navigation.design", "Design"),
    icon: "mdi-palette-outline",
  },
]);

const sectionDefinitions = computed(() => [
  {
    slug: "profile",
    icon: "mdi-account-circle-outline",
    label: translate("admin.dashboard.sections.profile.title", "Profile"),
  },
  {
    slug: "hero",
    icon: "mdi-star",
    label: translate("admin.dashboard.sections.hero.title", "Hero"),
  },
  {
    slug: "service",
    icon: "mdi-clipboard-check-outline",
    label: translate("admin.dashboard.sections.service.title", "Services"),
  },
  {
    slug: "work",
    icon: "mdi-rocket-launch-outline",
    label: translate("admin.dashboard.sections.work.title", "Projects"),
  },
  {
    slug: "about",
    icon: "mdi-text-box-outline",
    label: translate("admin.dashboard.sections.about.title", "About"),
  },
  {
    slug: "cta",
    icon: "mdi-email-outline",
    label: translate("admin.dashboard.sections.cta.title", "Call to action"),
  },
  {
    slug: "contact",
    icon: "mdi-card-account-phone-outline",
    label: translate("admin.dashboard.sections.contact.title", "Contact"),
  },
  {
    slug: "navlinks",
    icon: "mdi-compass-outline",
    label: translate("admin.dashboard.sections.navlinks.title", "Navigation"),
  },
  {
    slug: "skills",
    icon: "mdi-lightbulb-on-outline",
    label: translate("admin.dashboard.sections.skills.title", "Skills"),
  },
  {
    slug: "experiences",
    icon: "mdi-briefcase-search-outline",
    label: translate("admin.dashboard.sections.experiences.title", "Experiences"),
  },
  {
    slug: "education",
    icon: "mdi-school-outline",
    label: translate("admin.dashboard.sections.education.title", "Education"),
  },
]);

const sectionLinks = computed(() =>
  sectionDefinitions.value.map((section) => ({
    url: section.slug,
    to: `/admin/content/${section.slug}`,
    label: section.label,
    icon: section.icon,
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
const contentSectionTitle = computed(() => translate("admin.navigation.content", "Content"));

const requestHeaders = import.meta.server
  ? useRequestHeaders(["user-agent", "sec-ch-ua-mobile"])
  : undefined;

const initialMobileState = computed(() => {
  if (!import.meta.server || !requestHeaders) {
    return false;
  }

  const clientHint = requestHeaders["sec-ch-ua-mobile"];

  if (typeof clientHint === "string") {
    return clientHint === "?1";
  }

  if (Array.isArray(clientHint)) {
    return clientHint.includes("?1");
  }

  const userAgentHeader = requestHeaders["user-agent"];
  const userAgent = Array.isArray(userAgentHeader)
    ? userAgentHeader.join(" ")
    : (userAgentHeader ?? "");

  return /Mobi|Android|iPhone|iPad|iPod/i.test(userAgent);
});

const isDrawerOpen = ref(false);
const isHydrated = ref(false);
const mobileQuery = useMediaQuery("(max-width: 960px)", {
  initialValue: initialMobileState.value,
});
const isMobile = computed(() => (isHydrated.value ? mobileQuery.value : initialMobileState.value));

onMounted(() => {
  isHydrated.value = true;
});

const controlButtonSize = computed(() => (isMobile.value ? 48 : 56));
const controlIconSize = computed(() => (isMobile.value ? 24 : 28));
const controlChevronSize = computed(() => Math.round(controlIconSize.value * 0.57));
const controlStyles = computed(() => ({
  "--dock-navbar-control-size": `${controlButtonSize.value}px`,
  "--dock-navbar-control-icon-size": `${controlIconSize.value}px`,
  "--dock-navbar-control-chevron-size": `${controlChevronSize.value}px`,
}));

watch(isMobile, (value) => {
  if (!value) {
    isDrawerOpen.value = false;
  }
});

function closeDrawer() {
  isDrawerOpen.value = false;
}

const EXTERNAL_PATTERN = /^(?:[a-z][a-z+.-]*:|\/\/)/i;

function translate(key: string, fallback: string) {
  const value = t(key);
  return value === key ? fallback : value;
}

function isActiveLink(target: string) {
  if (!target || EXTERNAL_PATTERN.test(target)) {
    return false;
  }

  const [path] = target.split("#");
  return route.path === path;
}

async function handleLogout() {
  await $fetch("/api/auth/logout", { method: "POST" });
  await router.replace("/admin/login");
}
</script>

<style scoped>
.dock-navbar {
  position: sticky;
  top: 24px;
  z-index: 30;
  display: flex;
  justify-content: center;
  pointer-events: none;
}

.dock-navbar__dock {
  position: relative;
  padding: 12px;
  border-radius: var(--admin-control-radius, 999px);
  background: color-mix(in srgb, var(--admin-glass-surface, rgba(30, 41, 59, 0.88)) 94%, transparent);
  backdrop-filter: blur(var(--admin-glass-blur, 18px)) saturate(125%);
  border: 1px solid var(--admin-glass-border, rgba(148, 163, 184, 0.25));
  box-shadow:
    0 20px 50px -25px var(--admin-surface-shadow, rgba(15, 23, 42, 0.75)),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  pointer-events: auto;
  transition:
    backdrop-filter 0.3s ease,
    background 0.3s ease,
    border-color 0.3s ease,
    box-shadow 0.3s ease;
}

.dock-navbar__link {
  width: var(--dock-navbar-control-size);
  height: var(--dock-navbar-control-size);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(148, 163, 184, 0.08);
  color: rgb(226, 232, 240);
  transition:
    transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
    background 0.3s ease,
    box-shadow 0.3s ease;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.05),
    0 12px 25px -18px rgba(15, 23, 42, 0.75);
  position: relative;
}

.dock-navbar__link::before {
  content: "";
  position: absolute;
  inset: -2px;
  border-radius: inherit;
  background: linear-gradient(180deg, rgba(148, 163, 184, 0.35), transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.dock-navbar__link:hover,
.dock-navbar__link:focus-visible {
  background: rgba(96, 165, 250, 0.2);
  transform: translateY(-6px);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    0 15px 35px -25px rgba(59, 130, 246, 0.9);
}

.dock-navbar__link:hover::before,
.dock-navbar__link:focus-visible::before {
  opacity: 1;
}

.dock-navbar__link:focus-visible {
  outline: 2px solid rgba(59, 130, 246, 0.75);
  outline-offset: 4px;
}

.dock-navbar__link--active {
  background: rgba(59, 130, 246, 0.3);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.15),
    0 18px 35px -20px rgba(59, 130, 246, 0.85);
}

.dock-navbar__link-icon {
  color: currentColor;
  opacity: 0.95;
  transition: opacity 0.3s ease;
}

.dock-navbar__link:hover .dock-navbar__link-icon,
.dock-navbar__link:focus-visible .dock-navbar__link-icon {
  opacity: 1;
}

.dock-navbar__toggle {
  width: var(--dock-navbar-control-size);
  height: var(--dock-navbar-control-size);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(148, 163, 184, 0.08);
  color: rgb(226, 232, 240);
  transition: transform 0.3s ease;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.05),
    0 12px 25px -18px rgba(15, 23, 42, 0.75);
}

.dock-navbar__toggle:hover,
.dock-navbar__toggle:focus-visible {
  transform: translateY(-6px);
}

.dock-navbar__language-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0 16px;
  height: var(--dock-navbar-control-size);
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.08);
  color: rgb(226, 232, 240);
  border: none;
  cursor: pointer;
  transition: transform 0.3s ease;
  font-weight: 500;
  letter-spacing: 0.03em;
}

.dock-navbar__language-button:hover,
.dock-navbar__language-button:focus-visible {
  transform: translateY(-6px);
  background: rgba(96, 165, 250, 0.2);
}

.dock-navbar__language-icon {
  opacity: 0.75;
}

.dock-navbar__language-flag {
  display: inline-flex;
  align-items: center;
  font-size: 20px;
}

.dock-navbar__language-code {
  text-transform: uppercase;
  font-size: 0.9rem;
}

.dock-navbar__language-list {
  padding: 8px;
  min-width: 200px;
}

.dock-navbar__language-list-item {
  border-radius: 10px;
}

.dock-navbar__language-list-item--active {
  background: rgba(96, 165, 250, 0.15);
}

.dock-navbar__language-link {
  display: block;
  padding: 10px 14px;
  color: inherit;
  text-decoration: none;
}

.dock-navbar__language-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.dock-navbar__language-check {
  color: rgba(59, 130, 246, 0.95);
}

.dock-navbar__mobile-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 18px;
  background: color-mix(in srgb, var(--admin-glass-surface, rgba(30, 41, 59, 0.88)) 94%, transparent);
  border: 1px solid var(--admin-glass-border, rgba(148, 163, 184, 0.25));
  box-shadow:
    0 18px 40px -30px var(--admin-surface-shadow, rgba(15, 23, 42, 0.75)),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  pointer-events: auto;
}

.dock-navbar__mobile-right {
  display: inline-flex;
  align-items: center;
  gap: 12px;
}

.dock-navbar__drawer-button {
  width: var(--dock-navbar-control-size);
  height: var(--dock-navbar-control-size);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(148, 163, 184, 0.08);
  border: none;
  color: rgb(226, 232, 240);
  cursor: pointer;
  transition: transform 0.3s ease;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.05),
    0 12px 25px -18px rgba(15, 23, 42, 0.75);
}

.dock-navbar__drawer-button:hover,
.dock-navbar__drawer-button:focus-visible {
  transform: translateY(-4px);
  background: rgba(96, 165, 250, 0.2);
}

.dock-navbar__drawer-button:focus-visible {
  outline: 2px solid rgba(59, 130, 246, 0.75);
  outline-offset: 4px;
}

.dock-navbar__drawer-button--logout {
  background: rgba(248, 113, 113, 0.15);
}

.dock-navbar__drawer-button--logout:hover,
.dock-navbar__drawer-button--logout:focus-visible {
  background: rgba(248, 113, 113, 0.25);
}

.dock-navbar__drawer {
  border-radius: 24px 0 0 24px;
  background: color-mix(in srgb, var(--admin-glass-surface, rgba(15, 23, 42, 0.92)) 96%, transparent);
  backdrop-filter: blur(calc(var(--admin-glass-blur, 18px) * 0.85));
  border-right: 1px solid var(--admin-glass-border, rgba(148, 163, 184, 0.25));
}

.dock-navbar__drawer-inner {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.dock-navbar__drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
}

.dock-navbar__drawer-title {
  font-weight: 600;
  color: rgb(226, 232, 240);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.dock-navbar__drawer-close {
  background: rgba(148, 163, 184, 0.08);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  color: rgb(226, 232, 240);
  cursor: pointer;
}

.dock-navbar__drawer-divider {
  margin: 0 16px;
  border-color: rgba(148, 163, 184, 0.12);
}

.dock-navbar__drawer-links {
  padding: 12px 10px;
  gap: 6px;
}

.dock-navbar__drawer-link {
  border-radius: 12px;
  margin: 4px 0;
}

.dock-navbar__drawer-link--active {
  background: rgba(59, 130, 246, 0.12);
}

.dock-navbar__drawer-link-button {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  padding: 12px 16px;
  border-radius: 12px;
  color: rgb(226, 232, 240);
  text-decoration: none;
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: left;
  font-weight: 500;
  letter-spacing: 0.02em;
}

.dock-navbar__drawer-link-button:hover,
.dock-navbar__drawer-link-button:focus-visible {
  background: rgba(96, 165, 250, 0.15);
}

.dock-navbar__drawer-link-icon {
  color: rgba(148, 163, 184, 0.95);
}

.dock-navbar__drawer-link-label {
  flex: 1;
}

.dock-navbar__drawer-section-title {
  padding: 12px 24px 0;
  margin: 0;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(148, 163, 184, 0.75);
}

.dock-navbar--mobile {
  padding: 12px 16px;
  top: 0;
}

.dock-navbar__logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--dock-navbar-control-size);
  height: var(--dock-navbar-control-size);
  border-radius: 50%;
  background: rgba(148, 163, 184, 0.08);
  pointer-events: auto;
}

.dock-navbar__logo-image {
  width: calc(var(--dock-navbar-control-size) - 12px);
  height: calc(var(--dock-navbar-control-size) - 12px);
  object-fit: contain;
}

.dock-navbar__link--logo {
  background: rgba(148, 163, 184, 0.12);
}

@media (max-width: 600px) {
  .dock-navbar__mobile-bar {
    gap: 8px;
    padding: 10px 12px;
  }

  .dock-navbar__drawer-links {
    padding: 8px;
  }
}
</style>
