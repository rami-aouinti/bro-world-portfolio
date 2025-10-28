<template>
  <v-container class="admin-dashboard">
    <v-row justify="center">
      <v-col
        cols="12"
        lg="10"
        class="d-flex flex-column"
        style="gap: 32px"
      >
        <v-card
          class="dashboard-hero"
          elevation="0"
          rounded="xl"
        >
          <div class="dashboard-hero__glow" />
          <v-card-text class="dashboard-hero__content">
            <div class="dashboard-hero__intro">
              <div class="dashboard-hero__eyebrow">
                <span class="dashboard-hero__dot" />
                <span>{{ t("admin.dashboard.hero.eyebrow") }}</span>
              </div>
              <h1 class="dashboard-hero__title">{{ t("admin.dashboard.hero.title") }}</h1>
              <p class="dashboard-hero__subtitle">
                {{ t("admin.dashboard.hero.subtitle") }}
              </p>
            </div>
            <div class="dashboard-session text-foreground text-end">
              <div class="dashboard-session__avatar">
                <v-avatar
                  size="64"
                  color="white"
                  class="mb-3"
                >
                  <v-icon
                    icon="mdi-shield-account"
                    color="primary"
                    size="36"
                  />
                </v-avatar>
                <span class="dashboard-session__status">
                  <span class="dashboard-session__status-dot" />
                  {{ t("admin.dashboard.session.status.online") }}
                </span>
              </div>
              <p class="text-subtitle-2 mb-1 text-high-emphasis">{{ userDisplayName }}</p>
              <p class="text-body-2 text-foreground text-medium-emphasis">
                {{ t("admin.dashboard.session.role") }}
              </p>
              <div class="dashboard-session-actions">
                <v-btn
                  color="white"
                  variant="outlined"
                  class="text-none"
                  prepend-icon="mdi-logout"
                  @click="handleLogout"
                >
                  {{ t("admin.dashboard.session.logout") }}
                </v-btn>
              </div>
            </div>
          </v-card-text>
        </v-card>

        <v-row
          class="dashboard-metrics"
          dense
        >
          <v-col
            v-for="metric in metrics"
            :key="metric.id"
            cols="12"
            md="4"
          >
            <v-card
              class="dashboard-metric"
              elevation="0"
              rounded="xl"
            >
              <div class="dashboard-metric__beam" />
              <v-card-text class="dashboard-metric__content">
                <div class="dashboard-metric__icon">
                  <v-icon
                    :icon="metric.icon"
                    size="28"
                    color="primary"
                  />
                </div>
                <div class="dashboard-metric__values">
                  <span class="dashboard-metric__label">{{ metric.label }}</span>
                  <strong class="dashboard-metric__value">{{ metric.value }}</strong>
                  <span class="dashboard-metric__helper">{{ metric.helper }}</span>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-row
          class="dashboard-grid"
          dense
        >
          <v-col cols="12">
            <v-card
              class="site-settings-card"
              elevation="0"
              rounded="xl"
            >
              <div class="site-settings-card__glow" />
              <v-card-text class="site-settings-card__content">
                <div class="site-settings-card__header">
                  <div>
                    <p class="site-settings-card__eyebrow text-caption">
                      {{ t("admin.dashboard.settings.eyebrow") }}
                    </p>
                    <h2 class="site-settings-card__title">
                      {{ t("admin.dashboard.settings.title") }}
                    </h2>
                    <p class="site-settings-card__subtitle">
                      {{ t("admin.dashboard.settings.subtitle") }}
                    </p>
                  </div>
                  <div class="site-settings-card__icon">
                    <v-icon
                      icon="mdi-tune"
                      size="28"
                      color="primary"
                      @click="openSetting = !openSetting"
                    />
                  </div>
                </div>
                <div
                  v-if="openSetting"
                  class="site-settings-card__customizer"
                >
                  <ClientOnly>
                    <template #fallback>
                      <div class="site-settings-card__loading">
                        {{ t("admin.dashboard.settings.customizer.prepare") }}
                      </div>
                    </template>
                    <Suspense>
                      <template #default>
                        <ThemeCustomizer v-if="shouldRenderThemeCustomizer" />
                        <div
                          v-else
                          class="site-settings-card__loading"
                        >
                          {{ t("admin.dashboard.settings.customizer.prepare") }}
                        </div>
                      </template>
                      <template #fallback>
                        <div class="site-settings-card__loading">
                          {{ t("admin.dashboard.settings.customizer.loading") }}
                        </div>
                      </template>
                    </Suspense>
                  </ClientOnly>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col
            v-for="section in sections"
            :key="section.slug"
            cols="12"
            md="6"
            xl="4"
          >
            <v-hover v-slot="{ isHovering, props }">
              <v-card
                v-bind="props"
                class="dashboard-card h-100 d-flex flex-column"
                :elevation="isHovering ? 12 : 2"
                rounded="xl"
              >
                <div class="dashboard-card__beam" />
                <v-card-text class="flex-grow-1">
                  <div class="dashboard-card__head">
                    <div class="dashboard-card__icon">
                      <v-icon
                        :icon="section.icon"
                        color="primary"
                        size="28"
                      />
                    </div>
                    <v-chip
                      color="primary"
                      variant="tonal"
                      size="small"
                      class="text-none dashboard-card__chip"
                    >
                      {{ t("admin.dashboard.cards.sectionLabel") }}
                    </v-chip>
                  </div>
                  <h2 class="dashboard-card__title">{{ section.title }}</h2>
                  <p class="dashboard-card__description">{{ section.description }}</p>
                </v-card-text>
                <v-card-actions class="dashboard-card__actions">
                  <div class="dashboard-card__meta">
                    <span class="dashboard-card__meta-dot" />
                    {{ t("admin.dashboard.cards.pendingUpdate") }}
                  </div>
                  <v-btn
                    :to="`/admin/content/${section.slug}`"
                    color="primary"
                    variant="tonal"
                    class="text-none"
                    append-icon="mdi-arrow-right"
                  >
                    {{ t("admin.dashboard.cards.edit") }}
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-hover>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, onMounted, ref } from "vue";

definePageMeta({
  middleware: "auth",
  layout: "admin",
});

const router = useRouter();
const { t } = useI18n();

const openSetting = ref(false);

const ThemeCustomizer = defineAsyncComponent(() => import("~/components/ThemeCustomizer.vue"));
const shouldRenderThemeCustomizer = ref(false);

function translate(key: string, fallback: string) {
  const value = t(key);
  return value === key ? fallback : value;
}

function activateThemeCustomizer() {
  if (shouldRenderThemeCustomizer.value) {
    return;
  }

  shouldRenderThemeCustomizer.value = true;
}

onMounted(() => {
  if (typeof window === "undefined") {
    return;
  }

  const { requestIdleCallback } = window as Window & {
    requestIdleCallback?: (callback: () => void) => number;
  };

  if (typeof requestIdleCallback === "function") {
    requestIdleCallback(activateThemeCustomizer);
    return;
  }

  window.setTimeout(activateThemeCustomizer, 300);
});

const sections = computed(() => [
  {
    slug: "profile",
    title: t("admin.dashboard.sections.profile.title"),
    description: t("admin.dashboard.sections.profile.description"),
    icon: "mdi-account-circle-outline",
  },
  {
    slug: "hero",
    title: t("admin.dashboard.sections.hero.title"),
    description: t("admin.dashboard.sections.hero.description"),
    icon: "mdi-star",
  },
  {
    slug: "service",
    title: t("admin.dashboard.sections.service.title"),
    description: t("admin.dashboard.sections.service.description"),
    icon: "mdi-clipboard-check-outline",
  },
  {
    slug: "work",
    title: t("admin.dashboard.sections.work.title"),
    description: t("admin.dashboard.sections.work.description"),
    icon: "mdi-rocket-launch-outline",
  },
  {
    slug: "about",
    title: t("admin.dashboard.sections.about.title"),
    description: t("admin.dashboard.sections.about.description"),
    icon: "mdi-text-box-outline",
  },
  {
    slug: "cta",
    title: t("admin.dashboard.sections.cta.title"),
    description: t("admin.dashboard.sections.cta.description"),
    icon: "mdi-email-outline",
  },
  {
    slug: "contact",
    title: t("admin.dashboard.sections.contact.title"),
    description: t("admin.dashboard.sections.contact.description"),
    icon: "mdi-card-account-phone-outline",
  },
  {
    slug: "navlinks",
    title: t("admin.dashboard.sections.navlinks.title"),
    description: t("admin.dashboard.sections.navlinks.description"),
    icon: "mdi-compass-outline",
  },
  {
    slug: "skills",
    title: t("admin.dashboard.sections.skills.title"),
    description: t("admin.dashboard.sections.skills.description"),
    icon: "mdi-lightbulb-on-outline",
  },
  {
    slug: "experiences",
    title: t("admin.dashboard.sections.experiences.title"),
    description: t("admin.dashboard.sections.experiences.description"),
    icon: "mdi-briefcase-search-outline",
  },
  {
    slug: "education",
    title: t("admin.dashboard.sections.education.title"),
    description: t("admin.dashboard.sections.education.description"),
    icon: "mdi-school-outline",
  },
]);

const metrics = computed(() => [
  {
    id: "sections",
    label: translate("admin.dashboard.metrics.sections.label", "Sections actives"),
    value: sections.value.length.toString().padStart(2, "0"),
    helper: translate("admin.dashboard.metrics.sections.helper", "Modules synchronisés"),
    icon: "mdi-view-grid-plus",
  },
  {
    id: "drafts",
    label: translate("admin.dashboard.metrics.drafts.label", "Brouillons"),
    value: "03",
    helper: translate("admin.dashboard.metrics.drafts.helper", "Contenus à finaliser"),
    icon: "mdi-pencil-outline",
  },
  {
    id: "themes",
    label: translate("admin.dashboard.metrics.themes.label", "Thèmes enregistrés"),
    value: "05",
    helper: translate("admin.dashboard.metrics.themes.helper", "Variations de palette"),
    icon: "mdi-palette-swatch-outline",
  },
]);

const { data: session } = await useAsyncData("admin-session", () => $fetch("/api/auth/session"));

const userDisplayName = computed(
  () => session.value?.user?.name || session.value?.user?.email || t("admin.dashboard.session.fallback"),
);

async function handleLogout() {
  await $fetch("/api/auth/logout", { method: "POST" });
  await router.replace("/admin/login");
}
</script>

<style scoped>
.admin-dashboard__decor,
.admin-dashboard::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.admin-dashboard > * {
  position: relative;
}

.dashboard-hero {
  background: linear-gradient(135deg, #1d4ed8, #2563eb 55%, #4f46e5);
  color: white;
  overflow: hidden;
  border-radius: var(--admin-surface-radius, 28px);
  box-shadow: 0 40px 80px -50px var(--admin-surface-shadow, rgba(37, 99, 235, 0.75));
}

.dashboard-hero__glow {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.25), transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.3), transparent 55%);
  mix-blend-mode: screen;
  pointer-events: none;
  opacity: var(--admin-accent-glow-opacity, 1);
  transition: opacity 0.3s ease;
}

.dashboard-hero__content {
  display: flex;
  flex-direction: column;
  gap: 32px;
  position: relative;
  z-index: 1;
}

.dashboard-metrics {
  gap: 20px 0;
}

.dashboard-metric {
  position: relative;
  overflow: hidden;
  border-radius: var(--admin-surface-radius, 28px);
  border: 1px solid rgba(148, 163, 184, 0.14);
  background: color-mix(in srgb, rgba(15, 23, 42, 0.88) 96%, transparent);
  backdrop-filter: blur(calc(var(--admin-glass-blur, 18px) / 1.4));
  box-shadow: 0 22px 45px -32px rgba(15, 23, 42, 0.55);
}

.dashboard-metric__beam {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at top right, rgba(79, 70, 229, 0.24), transparent 60%);
  opacity: var(--admin-accent-glow-opacity, 1);
  pointer-events: none;
}

.dashboard-metric__content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 24px 26px;
}

.dashboard-metric__icon {
  width: 56px;
  height: 56px;
  border-radius: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(59, 130, 246, 0.16);
  box-shadow: inset 0 0 0 1px rgba(59, 130, 246, 0.25);
}

.dashboard-metric__values {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.dashboard-metric__label {
  font-size: 0.85rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(191, 219, 254, 0.82);
}

.dashboard-metric__value {
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: rgb(248, 250, 252);
}

.dashboard-metric__helper {
  font-size: 0.9rem;
  color: rgba(226, 232, 240, 0.7);
}

.dashboard-hero__intro {
  flex: 1 1 0;
}

.dashboard-hero__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 18px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.85rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 24px;
}

.dashboard-hero__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #facc15;
  box-shadow: 0 0 0 8px rgba(250, 204, 21, 0.15);
}

.dashboard-hero__title {
  font-size: clamp(2rem, 4vw, 2.5rem);
  margin-bottom: 12px;
  font-weight: 700;
}

.dashboard-hero__subtitle {
  margin: 0;
  max-width: 520px;
  color: rgba(255, 255, 255, 0.82);
  font-size: 1rem;
}

.dashboard-session {
  min-width: 220px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
}

.dashboard-session__avatar {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.dashboard-session__status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.88);
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.dashboard-session__status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #4ade80;
  box-shadow: 0 0 0 4px rgba(74, 222, 128, 0.35);
}

.dashboard-session-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-end;
  margin-top: 16px;
}

.dashboard-grid {
  row-gap: 24px !important;
}

.site-settings-card {
  position: relative;
  overflow: hidden;
  border-radius: var(--admin-surface-radius, 28px);
  border: 1px solid var(--admin-glass-border, rgba(37, 99, 235, 0.18));
  background: color-mix(in srgb, var(--admin-glass-surface, rgba(15, 23, 42, 0.92)) 94%, transparent);
  box-shadow: 0 34px 70px -45px var(--admin-surface-shadow, rgba(37, 99, 235, 0.75));
}

.site-settings-card__glow {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 15% 25%, rgba(59, 130, 246, 0.35), transparent 55%),
    radial-gradient(circle at 85% 15%, rgba(129, 140, 248, 0.25), transparent 60%),
    radial-gradient(circle at 60% 85%, rgba(59, 130, 246, 0.2), transparent 65%);
  pointer-events: none;
  opacity: var(--admin-accent-glow-opacity, 1);
  transition: opacity 0.3s ease;
}

.site-settings-card__content {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.site-settings-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
}

.site-settings-card__eyebrow {
  margin: 0 0 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(226, 232, 240, 0.75);
}

.site-settings-card__title {
  font-size: clamp(1.4rem, 3vw, 1.75rem);
  margin: 0 0 8px;
  font-weight: 600;
  color: rgba(226, 232, 240, 0.96);
}

.site-settings-card__subtitle {
  margin: 0;
  color: rgba(226, 232, 240, 0.7);
  max-width: 520px;
}

.site-settings-card__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  background: rgba(59, 130, 246, 0.2);
  border-radius: 20px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.site-settings-card__customizer {
  position: relative;
  border-radius: 24px;
  border: 1px solid rgba(59, 130, 246, 0.2);
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(14px);
  padding: 32px 24px;
}

.site-settings-card__loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 16px;
  border-radius: 20px;
  color: rgba(226, 232, 240, 0.75);
  font-size: 0.9rem;
  text-align: center;
}

:deep(.site-settings-card__customizer .text-card-foreground) {
  position: relative;
  background: transparent;
}

.site-settings-card__customizer :deep(.absolute) {
  z-index: 0;
}

.site-settings-card__customizer :deep(.grid) {
  position: relative;
  z-index: 1;
}

.dashboard-card {
  position: relative;
  overflow: hidden;
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    border-color 0.25s ease;
  border-radius: calc(var(--admin-surface-radius, 28px) - 6px);
  border: 1px solid var(--admin-glass-border, rgba(37, 99, 235, 0.12));
  background: color-mix(in srgb, var(--admin-glass-surface, rgba(15, 23, 42, 0.85)) 96%, transparent);
}

.dashboard-card:hover {
  transform: translateY(-8px);
}

.dashboard-card__beam {
  position: absolute;
  inset: -30% -40% auto;
  height: 140%;
  background: linear-gradient(120deg, rgba(96, 165, 250, 0.25), rgba(129, 140, 248, 0.05));
  transform: rotate(12deg);
  filter: blur(0.5px);
  transition: opacity 0.3s ease;
  opacity: calc(var(--admin-accent-glow-opacity, 1) * 0.75);
}

.dashboard-card:hover .dashboard-card__beam {
  opacity: var(--admin-accent-glow-opacity, 1);
}

.dashboard-card__head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 28px;
}

.dashboard-card__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 18px;
  background: rgba(37, 99, 235, 0.16);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.06),
    0 18px 35px -28px rgba(37, 99, 235, 0.9);
}

.dashboard-card__chip {
  border-radius: 999px;
  letter-spacing: 0.08em;
}

.dashboard-card__title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 10px;
  color: rgba(226, 232, 240, 0.96);
}

.dashboard-card__description {
  margin: 0;
  color: rgba(226, 232, 240, 0.72);
  font-size: 0.95rem;
}

.dashboard-card__actions {
  margin-top: auto;
  justify-content: space-between;
  align-items: center;
  padding-inline: 24px;
  padding-bottom: 24px;
}

.dashboard-card__meta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.78rem;
  color: rgba(226, 232, 240, 0.5);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.dashboard-card__meta-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #38bdf8;
  box-shadow: 0 0 0 4px rgba(56, 189, 248, 0.24);
}

.text-high-emphasis {
  color: rgba(255, 255, 255, 0.92) !important;
}

@media (max-width: 959px) {
  .dashboard-session {
    text-align: left !important;
  }

  .dashboard-session-actions {
    align-items: flex-start;
  }

  .dashboard-card__actions {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .site-settings-card__header {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (min-width: 960px) {
  .dashboard-hero__content {
    flex-direction: row;
    align-items: center;
  }

  .dashboard-hero__intro {
    max-width: 560px;
  }
}
</style>
