<template>
  <v-container class="admin-settings mt-6">
    <v-row justify="center">
      <v-col
        cols="12"
        lg="8"
      >
        <v-card
          class="admin-settings__card"
          elevation="0"
          rounded="xl"
        >
          <div class="admin-settings__glow" />
          <v-card-text class="admin-settings__content">
            <div class="admin-settings__header">
              <div>
                <p class="admin-settings__eyebrow text-caption">
                  {{ t('admin.settings.siteSettings') }}
                </p>
                <h1 class="admin-settings__title">
                  {{ t('admin.navigation.settings') }}
                </h1>
                <p class="admin-settings__subtitle">
                  {{ t('admin.dashboard.settings.subtitle') }}
                </p>
              </div>
            </div>

            <v-card
              class="admin-settings__panel"
              elevation="0"
              rounded="lg"
            >
              <v-card-text>
                <p class="admin-settings__panel-title">
                  {{ t('admin.settings.quickAccess') }}
                </p>
                <v-list
                  class="admin-settings__list"
                  density="comfortable"
                >
                  <v-list-item
                    v-for="link in quickLinks"
                    :key="link.to"
                    :to="link.to"
                    class="admin-settings__list-item"
                    :append-icon="link.icon"
                  >
                    <div class="admin-settings__list-content">
                      <p class="admin-settings__list-title">{{ link.label }}</p>
                      <p class="admin-settings__list-description">{{ link.description }}</p>
                    </div>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { computed } from "vue";

definePageMeta({
  middleware: "auth",
  layout: "admin",
});

const { t } = useI18n();

const quickLinks = computed(() => [
  {
    to: "/admin/design",
    icon: "mdi-palette-outline",
    label: t("admin.navigation.design"),
    description: t("admin.dashboard.settings.subtitle"),
  },
  {
    to: "/admin/content/navlinks",
    icon: "mdi-compass-outline",
    label: t("admin.dashboard.sections.navlinks.title"),
    description: t("admin.dashboard.sections.navlinks.description"),
  },
  {
    to: "/admin/content/profile",
    icon: "mdi-account-circle-outline",
    label: t("admin.dashboard.sections.profile.title"),
    description: t("admin.dashboard.sections.profile.description"),
  },
]);
</script>

<style scoped>
.admin-settings__card {
  position: relative;
  overflow: hidden;
  border-radius: var(--admin-surface-radius, 28px);
  border: 1px solid var(--admin-glass-border, rgba(37, 99, 235, 0.18));
  background: color-mix(in srgb, var(--admin-glass-surface, rgba(15, 23, 42, 0.92)) 94%, transparent);
  box-shadow: 0 34px 70px -45px var(--admin-surface-shadow, rgba(37, 99, 235, 0.75));
}

.admin-settings__glow {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 10% 30%, rgba(59, 130, 246, 0.35), transparent 55%),
    radial-gradient(circle at 80% 70%, rgba(79, 70, 229, 0.3), transparent 65%);
  pointer-events: none;
  opacity: var(--admin-accent-glow-opacity, 1);
  transition: opacity 0.3s ease;
}

.admin-settings__content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.admin-settings__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.admin-settings__eyebrow {
  color: rgba(191, 219, 254, 0.9);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 12px;
}

.admin-settings__title {
  margin: 0 0 8px;
  font-size: clamp(1.75rem, 3vw, 2.25rem);
  color: rgb(226, 232, 240);
}

.admin-settings__subtitle {
  margin: 0;
  color: rgba(226, 232, 240, 0.75);
  max-width: 520px;
}

.admin-settings__panel {
  background: rgba(15, 23, 42, 0.65);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: calc(var(--admin-surface-radius, 28px) - 10px);
}

.admin-settings__panel-title {
  margin: 0 0 16px;
  font-weight: 600;
  color: rgb(226, 232, 240);
  letter-spacing: 0.05em;
  text-transform: uppercase;
  font-size: 0.85rem;
}

.admin-settings__list {
  padding: 0;
}

.admin-settings__list-item {
  border-radius: 12px;
  margin-bottom: 12px;
}

.admin-settings__list-item:hover,
.admin-settings__list-item:focus-visible {
  background: rgba(96, 165, 250, 0.1);
}

.admin-settings__list-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.admin-settings__list-title {
  margin: 0;
  font-weight: 600;
  color: rgb(226, 232, 240);
}

.admin-settings__list-description {
  margin: 0;
  color: rgba(226, 232, 240, 0.7);
  font-size: 0.9rem;
}
</style>
