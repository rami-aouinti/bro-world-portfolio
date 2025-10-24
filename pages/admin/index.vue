<script setup lang="ts">
import { computed } from 'vue'

definePageMeta({ middleware: 'auth' })

const router = useRouter()

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
    <v-row justify="center">
      <v-col cols="12" lg="10" class="d-flex flex-column" style="gap: 32px;">
        <v-card class="dashboard-hero" elevation="0" rounded="xl">
          <v-card-text
            class="d-flex flex-column flex-md-row"
            style="gap: 32px; align-items: center;"
          >
            <div class="flex-grow-1">
              <h1 class="text-h4 text-foreground mb-2">Tableau de bord</h1>
              <p class="text-body-1 text-foreground text-high-emphasis">
                Pilotez toutes les sections du portfolio, mettez-les à jour en quelques clics et suivez l’impact de vos modifications.
              </p>
            </div>
            <div class="dashboard-session text-foreground text-end">
              <v-avatar size="64" color="white" class="mb-3">
                <v-icon icon="mdi-shield-account" color="primary" size="36" />
              </v-avatar>
              <p class="text-subtitle-2 mb-1 text-high-emphasis">{{ userDisplayName }}</p>
              <p class="text-body-2 text-foreground text-medium-emphasis">Administrateur</p>
              <v-btn color="white" variant="outlined" class="text-none mt-4" prepend-icon="mdi-logout" @click="handleLogout">
                Déconnexion
              </v-btn>
            </div>
          </v-card-text>
        </v-card>

        <v-row class="dashboard-grid" dense>
          <v-col v-for="section in sections" :key="section.slug" cols="12" md="6" xl="4">
            <v-hover v-slot="{ isHovering, props }">
              <v-card
                v-bind="props"
                class="dashboard-card h-100 d-flex flex-column"
                :elevation="isHovering ? 10 : 2"
                rounded="xl"
              >
                <v-card-text class="flex-grow-1">
                  <div class="d-flex align-center justify-space-between mb-6">
                    <v-avatar size="48" color="primary" variant="tonal">
                      <v-icon :icon="section.icon" color="primary" />
                    </v-avatar>
                    <v-chip color="primary" variant="text" size="small" class="text-none">
                      Section
                    </v-chip>
                  </div>
                  <h2 class="text-h6 font-weight-semibold mb-2">{{ section.title }}</h2>
                  <p class="text-body-2 text-medium-emphasis">{{ section.description }}</p>
                </v-card-text>
                <v-card-actions class="mt-auto justify-space-between">
                  <div class="text-caption text-medium-emphasis">Dernière mise à jour en attente</div>
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

.admin-dashboard::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.12), transparent 55%),
    repeating-linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.08) 0,
      rgba(255, 255, 255, 0.08) 2px,
      transparent 2px,
      transparent 10px
    );
  mask-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0));
  pointer-events: none;
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

.dashboard-hero::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.25), transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.3), transparent 55%);
  mix-blend-mode: screen;
  pointer-events: none;
}

.dashboard-session {
  min-width: 220px;
}

.dashboard-grid {
  row-gap: 24px !important;
}

.dashboard-card {
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  border: 1px solid rgba(37, 99, 235, 0.12);
}

.dashboard-card:hover {
  transform: translateY(-6px);
}

.text-high-emphasis {
  color: rgba(255, 255, 255, 0.92) !important;
}

@media (max-width: 959px) {
  .dashboard-session {
    text-align: left !important;
  }
}
</style>
