<template>
  <v-container class="admin-design mt-6">
    <v-row justify="center">
      <v-col
        cols="12"
        lg="8"
      >
        <v-card
          class="admin-design__card"
          elevation="0"
          rounded="xl"
        >
          <div class="admin-design__glow" />
          <v-card-text class="admin-design__content">
            <div class="admin-design__header">
              <div>
                <p class="admin-design__eyebrow text-caption">
                  {{ t('admin.settings.siteSettings') }}
                </p>
                <h1 class="admin-design__title">
                  {{ t('admin.navigation.design') }}
                </h1>
                <p class="admin-design__subtitle">
                  {{ t('admin.dashboard.settings.subtitle') }}
                </p>
              </div>
            </div>
            <div class="admin-design__customizer">
              <ClientOnly>
                <template #fallback>
                  <div class="admin-design__loading">
                    {{ t('admin.dashboard.settings.customizer.loading') }}
                  </div>
                </template>
                <Suspense>
                  <template #default>
                    <ThemeCustomizer v-if="shouldRenderThemeCustomizer" />
                    <div
                      v-else
                      class="admin-design__loading"
                    >
                      {{ t('admin.dashboard.settings.customizer.prepare') }}
                    </div>
                  </template>
                  <template #fallback>
                    <div class="admin-design__loading">
                      {{ t('admin.dashboard.settings.customizer.loading') }}
                    </div>
                  </template>
                </Suspense>
              </ClientOnly>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { defineAsyncComponent, onMounted, ref } from "vue";

definePageMeta({
  middleware: "auth",
  layout: "admin",
});

const { t } = useI18n();

const ThemeCustomizer = defineAsyncComponent(() => import("~/components/ThemeCustomizer.vue"));
const shouldRenderThemeCustomizer = ref(false);

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
</script>

<style scoped>
.admin-design__card {
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(37, 99, 235, 0.18);
  background: linear-gradient(140deg, rgba(15, 23, 42, 0.92), rgba(30, 41, 59, 0.9));
  box-shadow: 0 34px 70px -45px rgba(37, 99, 235, 0.75);
}

.admin-design__glow {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 15% 25%, rgba(59, 130, 246, 0.35), transparent 55%),
    radial-gradient(circle at 85% 75%, rgba(79, 70, 229, 0.3), transparent 65%);
  pointer-events: none;
}

.admin-design__content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.admin-design__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.admin-design__eyebrow {
  color: rgba(191, 219, 254, 0.9);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 12px;
}

.admin-design__title {
  margin: 0 0 8px;
  font-size: clamp(1.75rem, 3vw, 2.25rem);
  color: rgb(226, 232, 240);
}

.admin-design__subtitle {
  margin: 0;
  color: rgba(226, 232, 240, 0.75);
  max-width: 520px;
}

.admin-design__customizer {
  position: relative;
  min-height: 260px;
}

.admin-design__loading {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  color: rgba(226, 232, 240, 0.75);
}
</style>
