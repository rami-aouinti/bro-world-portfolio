<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const router = useRouter()
const sections = [
  {
    slug: 'profile',
    title: 'Profil',
    description: 'Nom, rôle et avatar affichés sur le site.'
  },
  {
    slug: 'hero',
    title: 'Section Hero',
    description: 'Badge, titre et sous-titre de l’entête.'
  },
  {
    slug: 'service',
    title: 'Compétences',
    description: 'Liste des services et compétences clés.'
  },
  {
    slug: 'work',
    title: 'Projets',
    description: 'Projets présentés dans la section “Works”.'
  },
  {
    slug: 'about',
    title: 'À propos',
    description: 'Paragraphe de présentation personnelle.'
  },
  {
    slug: 'cta',
    title: 'Appel à l’action',
    description: 'Bloc contact/CTA du bas de page.'
  },
  {
    slug: 'navlinks',
    title: 'Navigation',
    description: 'Liens affichés dans le menu et le CTA.'
  },
  {
    slug: 'skills',
    title: 'Skills',
    description: 'Catégories de compétences.'
  },
  {
    slug: 'experiences',
    title: 'Expériences',
    description: 'Historique des expériences professionnelles.'
  },
  {
    slug: 'education',
    title: 'Formations',
    description: 'Parcours académique et certifications.'
  }
] as const

const { data: session } = await useAsyncData('admin-session', () => $fetch('/api/auth/session'))

async function handleLogout() {
  await $fetch('/api/auth/logout', { method: 'POST' })
  await router.replace('/admin/login')
}
</script>

<template>
  <v-container class="py-12">
    <v-row justify="center">
      <v-col cols="12" lg="10" class="d-flex flex-column" style="gap: 24px;">
        <v-card elevation="2" class="pa-6">
          <div class="d-flex flex-column flex-md-row" style="gap: 16px; align-items: center;">
            <div class="flex-grow-1">
              <h1 class="text-h4 font-weight-semibold mb-2">Tableau de bord</h1>
              <p class="text-body-2 text-medium-emphasis">
                Gérez l’ensemble des contenus affichés sur le portfolio.
              </p>
            </div>
            <div class="text-body-2 text-medium-emphasis" style="text-align: right;">
              <p v-if="session?.user">
                Connecté en tant que
                <strong>{{ session.user.email }}</strong>
              </p>
              <v-btn color="primary" variant="tonal" class="text-none mt-2" @click="handleLogout">
                Déconnexion
              </v-btn>
            </div>
          </div>
        </v-card>

        <v-row dense>
          <v-col v-for="section in sections" :key="section.slug" cols="12" md="6">
            <v-card elevation="1" class="h-100 d-flex flex-column">
              <v-card-text>
                <h2 class="text-h6 font-weight-semibold mb-2">{{ section.title }}</h2>
                <p class="text-body-2 text-medium-emphasis">{{ section.description }}</p>
              </v-card-text>
              <v-card-actions class="mt-auto">
                <v-btn
                  :to="`/admin/content/${section.slug}`"
                  color="primary"
                  variant="text"
                  class="text-none"
                >
                  Modifier
                  <v-icon icon="mdi-arrow-right" class="ml-2" />
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>
