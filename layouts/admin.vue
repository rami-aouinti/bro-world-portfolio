<template>
  <v-app>
    <v-main class="app-layout">
      <ParticlesBg
        class="app-layout__particles"
        :color="particlesColor"
        :quantity="160"
        :staticity="55"
        :ease="45"
      />
      <div
        v-if="showGridOverlay"
        class="app-layout__grid"
        aria-hidden="true"
      />
      <AdminNavbar v-if="isChromeVisible" />
      <div class="app-layout__inner">
        <header
          v-if="isChromeVisible"
          class="admin-header"
        >
          <div class="admin-header__surface">
            <div class="admin-header__breadcrumbs" aria-label="Navigation">
              <nav aria-label="Fil d'Ariane">
                <ol>
                  <li v-for="(breadcrumb, index) in breadcrumbs" :key="breadcrumb.label">
                    <span v-if="breadcrumb.to" class="admin-header__breadcrumb-link">
                      <NuxtLink :to="breadcrumb.to">
                        {{ breadcrumb.label }}
                      </NuxtLink>
                    </span>
                    <span v-else class="admin-header__breadcrumb-label">{{ breadcrumb.label }}</span>
                    <v-icon
                      v-if="index < breadcrumbs.length - 1"
                      icon="mdi-chevron-right"
                      size="18"
                      class="admin-header__breadcrumb-separator"
                      aria-hidden="true"
                    />
                  </li>
                </ol>
              </nav>
            </div>

            <div class="admin-header__body">
              <div class="admin-header__title-group">
                <h1 class="admin-header__title">{{ pageTitle }}</h1>
                <p class="admin-header__description">{{ pageDescription }}</p>
              </div>

              <div class="admin-header__actions">
                <DarkModeToggle
                  class="admin-header__toggle"
                  :icon-size="22"
                />
                <div class="admin-header__quick-actions">
                  <v-btn
                    v-for="action in quickActions"
                    :key="action.label"
                    :to="action.to"
                    :href="action.href"
                    :target="action.href ? '_blank' : undefined"
                    :rel="action.href ? 'noopener' : undefined"
                    color="primary"
                    class="text-none admin-header__action"
                    variant="tonal"
                    :append-icon="action.icon"
                  >
                    {{ action.label }}
                  </v-btn>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div class="app-layout__content">
          <slot />
        </div>
      </div>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { computed } from "vue";
import AdminNavbar from "~/components/admin/AdminNavbar.vue";
import DarkModeToggle from "~/components/DarkModeToggle.vue";
import { ParticlesBg } from "~/components/ui/particles-bg";
import { useCookieColorMode } from "~/composables/useCookieColorMode";
import { useAdminDesignSettings } from "~/composables/useAdminDesignSettings";

const colorMode = useCookieColorMode();
const { settings: designSettings } = useAdminDesignSettings();
const route = useRoute();
const { t } = useI18n();

const isDark = computed(() => {
  if (colorMode.value === "dark") {
    return true;
  }

  if (colorMode.value === "light") {
    return false;
  }

  return colorMode.system?.value === "dark";
});

const particlesColor = computed(() => (isDark.value ? "#FFFFFF" : "#0F172A"));
const showGridOverlay = computed(() => designSettings.value.showGrid);

const isChromeVisible = computed(() => !route.path.includes("/admin/login"));

function translate(key: string, fallback: string) {
  const value = t(key);
  return value === key ? fallback : value;
}

const contentSections = computed(() => ({
  profile: {
    title: t("admin.dashboard.sections.profile.title"),
    description: t("admin.dashboard.sections.profile.description"),
  },
  hero: {
    title: t("admin.dashboard.sections.hero.title"),
    description: t("admin.dashboard.sections.hero.description"),
  },
  service: {
    title: t("admin.dashboard.sections.service.title"),
    description: t("admin.dashboard.sections.service.description"),
  },
  work: {
    title: t("admin.dashboard.sections.work.title"),
    description: t("admin.dashboard.sections.work.description"),
  },
  about: {
    title: t("admin.dashboard.sections.about.title"),
    description: t("admin.dashboard.sections.about.description"),
  },
  cta: {
    title: t("admin.dashboard.sections.cta.title"),
    description: t("admin.dashboard.sections.cta.description"),
  },
  contact: {
    title: t("admin.dashboard.sections.contact.title"),
    description: t("admin.dashboard.sections.contact.description"),
  },
  navlinks: {
    title: t("admin.dashboard.sections.navlinks.title"),
    description: t("admin.dashboard.sections.navlinks.description"),
  },
  skills: {
    title: t("admin.dashboard.sections.skills.title"),
    description: t("admin.dashboard.sections.skills.description"),
  },
  experiences: {
    title: t("admin.dashboard.sections.experiences.title"),
    description: t("admin.dashboard.sections.experiences.description"),
  },
  education: {
    title: t("admin.dashboard.sections.education.title"),
    description: t("admin.dashboard.sections.education.description"),
  },
}));

function formatSlug(slug: string) {
  return slug
    .split("-")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

const breadcrumbs = computed(() => {
  const segments = route.path.split("/").filter(Boolean);
  const items: Array<{ label: string; to?: string }> = [
    {
      label: translate("admin.shell.breadcrumbs.dashboard", t("admin.navigation.dashboard")),
      to: "/admin",
    },
  ];

  if (segments.length <= 1) {
    return items;
  }

  const [, section, maybeSlug] = segments;

  if (section === "design") {
    items.push({
      label: translate("admin.shell.breadcrumbs.design", t("admin.navigation.design")),
      to: "/admin/design",
    });
  } else if (section === "settings") {
    items.push({
      label: translate("admin.shell.breadcrumbs.settings", t("admin.navigation.settings")),
      to: "/admin/settings",
    });
  } else if (section === "content") {
    items.push({
      label: translate("admin.shell.breadcrumbs.content", t("admin.navigation.content")),
    });

    if (typeof maybeSlug === "string") {
      const descriptor = contentSections.value[maybeSlug as keyof typeof contentSections.value];
      items.push({
        label: descriptor?.title ?? formatSlug(maybeSlug),
      });
    }
  }

  return items;
});

const pageDescriptor = computed(() => {
  const segments = route.path.split("/").filter(Boolean);

  if (segments.length <= 1) {
    return {
      title: t("admin.dashboard.hero.title"),
      description: t("admin.dashboard.hero.subtitle"),
    };
  }

  const [, section, maybeSlug] = segments;

  if (section === "design") {
    return {
      title: t("admin.navigation.design"),
      description: t("admin.dashboard.settings.subtitle"),
    };
  }

  if (section === "settings") {
    return {
      title: t("admin.navigation.settings"),
      description: t("admin.dashboard.settings.subtitle"),
    };
  }

  if (section === "content" && typeof maybeSlug === "string") {
    const descriptor = contentSections.value[maybeSlug as keyof typeof contentSections.value];
    if (descriptor) {
      return descriptor;
    }

    return {
      title: formatSlug(maybeSlug),
      description: translate("admin.shell.context.defaultDescription", "Gérez le contenu de cette section et publiez vos mises à jour."),
    };
  }

  return {
    title: translate("admin.shell.context.fallbackTitle", t("admin.navigation.dashboard")),
    description: translate(
      "admin.shell.context.defaultDescription",
      "Pilotez les sections de votre portfolio et gardez tout synchronisé.",
    ),
  };
});

const pageTitle = computed(() => pageDescriptor.value.title);
const pageDescription = computed(() => pageDescriptor.value.description);

const quickActions = computed(() => [
  {
    label: translate("admin.shell.actions.newContent", "Nouveau contenu"),
    icon: "mdi-plus",
    to: "/admin/content/profile",
  },
  {
    label: translate("admin.shell.actions.design", "Personnaliser le design"),
    icon: "mdi-palette-outline",
    to: "/admin/design",
  },
  {
    label: translate("admin.shell.actions.preview", "Voir le site"),
    icon: "mdi-open-in-new",
    href: "/",
  },
]);
</script>

<style scoped>
:global(:root) {
  --admin-glass-blur: 18px;
  --admin-glass-surface: rgba(15, 23, 42, 0.88);
  --admin-glass-border: rgba(148, 163, 184, 0.25);
  --admin-surface-shadow: rgba(15, 23, 42, 0.75);
  --admin-surface-radius: 28px;
  --admin-control-radius: 999px;
  --admin-accent-glow-opacity: 1;
}

.app-layout {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background:
    radial-gradient(circle at top left, rgba(59, 130, 246, 0.16), transparent 45%),
    radial-gradient(circle at bottom right, rgba(244, 114, 182, 0.18), transparent 42%),
    linear-gradient(160deg, rgb(10, 12, 27), rgb(15, 23, 42) 55%, rgb(15, 23, 42));
}

.app-layout__content {
  position: relative;
  z-index: 1;
}

.app-layout__inner {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1480px;
  margin: 0 auto;
  padding: 32px clamp(16px, 3vw, 48px) 56px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.app-layout__particles {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.app-layout__grid {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background-image:
    linear-gradient(
      rgba(148, 163, 184, 0.15) 1px,
      transparent 1px
    ),
    linear-gradient(
      90deg,
      rgba(148, 163, 184, 0.15) 1px,
      transparent 1px
    );
  background-size: 120px 120px;
  opacity: 0.16;
  mix-blend-mode: overlay;
  transition: opacity 0.4s ease;
}

.admin-header {
  position: sticky;
  top: 24px;
  z-index: 2;
}

.admin-header__surface {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 28px clamp(18px, 3vw, 36px);
  border-radius: calc(var(--admin-surface-radius, 28px) + 8px);
  background: color-mix(in srgb, var(--admin-glass-surface, rgba(15, 23, 42, 0.88)) 92%, transparent);
  border: 1px solid var(--admin-glass-border, rgba(148, 163, 184, 0.2));
  backdrop-filter: blur(var(--admin-glass-blur, 18px));
  box-shadow: 0 30px 80px -45px rgba(15, 23, 42, 0.55);
}

.admin-header__breadcrumbs ol {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 13px;
  color: rgba(226, 232, 240, 0.72);
}

.admin-header__breadcrumb-link a {
  color: inherit;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.12);
  transition: background 0.2s ease;
}

.admin-header__breadcrumb-link a:hover {
  background: rgba(148, 163, 184, 0.2);
}

.admin-header__breadcrumb-label {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.18);
}

.admin-header__breadcrumb-separator {
  color: rgba(226, 232, 240, 0.4);
}

.admin-header__body {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 24px;
  justify-content: space-between;
}

.admin-header__title-group {
  max-width: 640px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.admin-header__title {
  margin: 0;
  font-size: clamp(1.75rem, 3vw, 2.4rem);
  font-weight: 700;
  color: rgb(241, 245, 249);
}

.admin-header__description {
  margin: 0;
  color: rgba(226, 232, 240, 0.72);
  font-size: 0.95rem;
  line-height: 1.7;
}

.admin-header__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
}

.admin-header__toggle {
  border-radius: var(--admin-control-radius, 999px);
  background: rgba(148, 163, 184, 0.14);
  padding: 6px;
}

.admin-header__quick-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.admin-header__action {
  border-radius: var(--admin-control-radius, 999px);
  backdrop-filter: blur(calc(var(--admin-glass-blur, 18px) / 1.4));
}

@media (max-width: 960px) {
  .admin-header {
    top: 12px;
  }

  .app-layout__inner {
    padding: 24px 16px 48px;
  }

  .admin-header__actions {
    width: 100%;
    justify-content: flex-start;
  }
}
</style>
