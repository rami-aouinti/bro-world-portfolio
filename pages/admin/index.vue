<script setup lang="ts">
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'

definePageMeta({ middleware: 'auth' })

const router = useRouter()
const { t } = useI18n()

const ThemeCustomizer = defineAsyncComponent(() => import('~/components/ThemeCustomizer.vue'))
const shouldRenderThemeCustomizer = ref(false)

function activateThemeCustomizer() {
  if (shouldRenderThemeCustomizer.value) {
    return
  }

  shouldRenderThemeCustomizer.value = true
}

onMounted(() => {
  if (typeof window === 'undefined') {
    return
  }

  const { requestIdleCallback } = window as Window & {
    requestIdleCallback?: (callback: () => void) => number
  }

  if (typeof requestIdleCallback === 'function') {
    requestIdleCallback(activateThemeCustomizer)
    return
  }

  window.setTimeout(activateThemeCustomizer, 300)
})

const sections = [
  {
    slug: 'profile',
    title: 'Profil',
    description: 'Nom, rôle et avatar affichés sur le site.',
    icon: 'mdi-account-circle-outline'
  },
  {
    slug: 'hero',
    title: 'Section personnelle',
    description: 'Badge, titre et sous-titre de l’en-tête.',
    icon: 'mdi-star'
  },
  {
    slug: 'service',
    title: 'Compétences',
    description: 'Liste des services et compétences clés.',
    icon: 'mdi-clipboard-check-outline'
  },
  {
    slug: 'work',
    title: 'Projets',
    description: 'Projets présentés dans la section « Projets ».',
    icon: 'mdi-rocket-launch-outline'
  },
  {
    slug: 'about',
    title: 'À propos',
    description: 'Paragraphe de présentation personnelle.',
    icon: 'mdi-text-box-outline'
  },
  {
    slug: 'cta',
    title: 'Appel à l’action',
    description: 'Bloc contact/CTA du bas de page.',
    icon: 'mdi-email-outline'
  },
  {
    slug: 'navlinks',
    title: 'Navigation',
    description: 'Liens affichés dans le menu et le CTA.',
    icon: 'mdi-compass-outline'
  },
  {
    slug: 'skills',
    title: 'Compétences',
    description: 'Catégories de compétences.',
    icon: 'mdi-lightbulb-on-outline'
  },
  {
    slug: 'experiences',
    title: 'Expériences',
    description: 'Historique des expériences professionnelles.',
    icon: 'mdi-briefcase-search-outline'
  },
  {
    slug: 'education',
    title: 'Formations',
    description: 'Parcours académique et certifications.',
    icon: 'mdi-school-outline'
  }
] as const

const { data: session } = await useAsyncData('admin-session', () => $fetch('/api/auth/session'))

const userDisplayName = computed(
  () => session.value?.user?.name || session.value?.user?.email || 'Utilisateur connecté'
)

async function handleLogout() {
  await $fetch('/api/auth/logout', { method: 'POST' })
  await router.replace('/admin/login')
}
</script>

<template>
  <v-container class="admin-dashboard mt-10">
    <div class="admin-dashboard__decor" />
    <v-row justify="center">
      <v-col cols="12" lg="10" class="d-flex flex-column" style="gap: 32px;">
        <v-card class="dashboard-hero" elevation="0" rounded="xl">
          <div class="dashboard-hero__glow" />
          <v-card-text class="dashboard-hero__content">
            <div class="dashboard-hero__intro">
              <div class="dashboard-hero__eyebrow">
                <span class="dashboard-hero__dot" />
                <span>Administration</span>
              </div>
              <h1 class="dashboard-hero__title">Tableau de bord</h1>
              <p class="dashboard-hero__subtitle">
                Pilotez toutes les sections du portfolio, mettez-les à jour en quelques clics et suivez l’impact de vos modifications.
              </p>
            </div>
            <div class="dashboard-session text-foreground text-end">
              <div class="dashboard-session__avatar">
                <v-avatar size="64" color="white" class="mb-3">
                  <v-icon icon="mdi-shield-account" color="primary" size="36" />
                </v-avatar>
                <span class="dashboard-session__status">
                  <span class="dashboard-session__status-dot" />
                  En ligne
                </span>
              </div>
              <p class="text-subtitle-2 mb-1 text-high-emphasis">{{ userDisplayName }}</p>
              <p class="text-body-2 text-foreground text-medium-emphasis">Administrateur</p>
              <div class="dashboard-session-actions">
                <v-btn
                  color="white"
                  variant="outlined"
                  class="text-none"
                  prepend-icon="mdi-logout"
                  @click="handleLogout"
                >
                  Déconnexion
                </v-btn>
              </div>
            </div>
          </v-card-text>
        </v-card>

        <v-row class="dashboard-grid" dense>
          <v-col cols="12">
            <v-card class="site-settings-card" elevation="0" rounded="xl">
              <div class="site-settings-card__glow" />
              <v-card-text class="site-settings-card__content">
                <div class="site-settings-card__header">
                  <div>
                    <p class="site-settings-card__eyebrow text-caption">
                      {{ t('admin.settings.siteSettings') }}
                    </p>
                    <h2 class="site-settings-card__title">{{ t('admin.settings.themeCustomizer.title') }}</h2>
                    <p class="site-settings-card__subtitle">
                      Personnalisez les couleurs, le rayon et le thème global du site en temps réel.
                    </p>
                  </div>
                  <div class="site-settings-card__icon">
                    <v-icon icon="mdi-tune" size="28" color="primary" />
                  </div>
                </div>
                <div class="site-settings-card__customizer">
                  <ClientOnly>
                    <template #fallback>
                      <div class="site-settings-card__loading">
                        Préparation des outils de thème…
                      </div>
                    </template>
                    <Suspense>
                      <template #default>
                        <ThemeCustomizer v-if="shouldRenderThemeCustomizer" />
                        <div v-else class="site-settings-card__loading">
                          Préparation des outils de thème…
                        </div>
                      </template>
                      <template #fallback>
                        <div class="site-settings-card__loading">
                          Chargement des outils de thème…
                        </div>
                      </template>
                    </Suspense>
                  </ClientOnly>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col v-for="section in sections" :key="section.slug" cols="12" md="6" xl="4">
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
                      <v-icon :icon="section.icon" color="primary" size="28" />
                    </div>
                    <v-chip color="primary" variant="tonal" size="small" class="text-none dashboard-card__chip">
                      Section
                    </v-chip>
                  </div>
                  <h2 class="dashboard-card__title">{{ section.title }}</h2>
                  <p class="dashboard-card__description">{{ section.description }}</p>
                </v-card-text>
                <v-card-actions class="dashboard-card__actions">
                  <div class="dashboard-card__meta">
                    <span class="dashboard-card__meta-dot" />
                    Dernière mise à jour en attente
                  </div>
                  <v-btn
                    :to="`/admin/content/${section.slug}`"
                    color="primary"
                    variant="tonal"
                    class="text-none"
                    append-icon="mdi-arrow-right"
                  >
                    Modifier
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

<style scoped>
.admin-dashboard {
  position: relative;
  min-height: 100vh;
  background: radial-gradient(circle at top, rgba(52, 120, 246, 0.2), transparent 60%),
    linear-gradient(180deg, rgba(10, 18, 41, 0.95), rgba(10, 18, 41, 0.7) 50%, rgba(15, 23, 42, 0.4));
}
.admin-dashboard__decor,
.admin-dashboard::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 18% 25%, rgba(255, 255, 255, 0.12), transparent 55%),
    repeating-linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.09) 0,
      rgba(255, 255, 255, 0.09) 2px,
      transparent 2px,
      transparent 12px
    );
  mask-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.65), rgba(255, 255, 255, 0));
  pointer-events: none;
}

.admin-dashboard__decor {
  inset: 10% 5% 5% 8%;
  background:
    radial-gradient(circle at 30% 20%, rgba(96, 165, 250, 0.3), transparent 50%),
    radial-gradient(circle at 70% 80%, rgba(59, 130, 246, 0.22), transparent 55%);
  filter: blur(40px);
}

.admin-dashboard > * {
  position: relative;
}

.dashboard-hero {
  background: linear-gradient(135deg, #1d4ed8, #2563eb 55%, #4f46e5);
  color: white;
  overflow: hidden;
  box-shadow: 0 40px 80px -50px rgba(37, 99, 235, 0.75);
}

.dashboard-hero__glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.25), transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.3), transparent 55%);
  mix-blend-mode: screen;
  pointer-events: none;
}

.dashboard-hero__content {
  display: flex;
  flex-direction: column;
  gap: 32px;
  position: relative;
  z-index: 1;
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
  border: 1px solid rgba(37, 99, 235, 0.18);
  background: linear-gradient(140deg, rgba(15, 23, 42, 0.92), rgba(30, 41, 59, 0.9));
  box-shadow: 0 34px 70px -45px rgba(37, 99, 235, 0.75);
}

.site-settings-card__glow {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 15% 25%, rgba(59, 130, 246, 0.35), transparent 55%),
    radial-gradient(circle at 85% 15%, rgba(129, 140, 248, 0.25), transparent 60%),
    radial-gradient(circle at 60% 85%, rgba(59, 130, 246, 0.2), transparent 65%);
  pointer-events: none;
  opacity: 0.9;
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
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
  border: 1px solid rgba(37, 99, 235, 0.12);
  background: linear-gradient(160deg, rgba(15, 23, 42, 0.85), rgba(30, 41, 59, 0.88));
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
  opacity: 0.75;
}

.dashboard-card:hover .dashboard-card__beam {
  opacity: 1;
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
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06), 0 18px 35px -28px rgba(37, 99, 235, 0.9);
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
