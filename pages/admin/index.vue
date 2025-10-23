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
  <div class="min-h-screen bg-[#02010c] px-4 py-10">
    <div class="mx-auto flex w-full max-w-5xl flex-col gap-8">
      <header class="flex flex-col gap-3 rounded-3xl border border-white/10 bg-[#0b061a]/70 p-8 backdrop-blur-md md:flex-row md:items-center md:justify-between">
        <div>
          <h1 class="text-3xl font-semibold text-white">Tableau de bord</h1>
          <p class="text-white/60 text-sm">
            Gérez l’ensemble des contenus affichés sur le portfolio.
          </p>
        </div>
        <div class="flex flex-col items-start gap-2 text-sm text-white/60 md:items-end">
          <p v-if="session?.user">Connecté en tant que <span class="text-white">{{ session.user.email }}</span></p>
          <button
            class="rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-white transition hover:border-primary hover:text-primary"
            @click="handleLogout"
          >
            Déconnexion
          </button>
        </div>
      </header>

      <div class="grid gap-6 md:grid-cols-2">
        <article
          v-for="section in sections"
          :key="section.slug"
          class="flex h-full flex-col justify-between rounded-2xl border border-white/10 bg-[#0f0a1f]/80 p-6 text-white shadow-lg shadow-primary/5"
        >
          <div class="space-y-2">
            <h2 class="text-xl font-semibold">{{ section.title }}</h2>
            <p class="text-sm text-white/60">{{ section.description }}</p>
          </div>
          <NuxtLink
            :to="`/admin/content/${section.slug}`"
            class="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-primary/80 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary"
          >
            Modifier
            <VsxIcon iconName="ArrowRight" type="linear" :size="18" />
          </NuxtLink>
        </article>
      </div>
    </div>
  </div>
</template>
