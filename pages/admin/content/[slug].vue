<script setup lang="ts">
import { ZodError } from 'zod'
import { showError } from '#app'
import { contentSchemas, isContentSlug, type ContentSlug } from '~/types/content'

definePageMeta({ middleware: 'auth' })

const route = useRoute()
const runtimeConfig = useRuntimeConfig()
const slugParam = computed(() => route.params.slug?.toString() ?? '')

if (!isContentSlug(slugParam.value)) {
  showError({ statusCode: 404, statusMessage: 'Section introuvable.' })
}

const slug = computed(() => slugParam.value as ContentSlug)

const titles: Record<ContentSlug, string> = {
  profile: 'Profil',
  hero: 'Section Hero',
  service: 'Compétences',
  work: 'Projets',
  about: 'À propos',
  cta: 'Appel à l’action',
  navlinks: 'Navigation',
  skills: 'Skills',
  experiences: 'Expériences',
  education: 'Formations'
}

const { data, pending, refresh, error } = await useAsyncData(
  () => `admin-content-${slug.value}`,
  () => $fetch(`/api/content/${slug.value}`),
  { watch: [slug] }
)

const form = reactive<Record<string, any>>({})
const saveState = reactive({
  isSaving: false,
  success: '',
  errors: [] as string[]
})

watch(data, (value) => {
  if (!value) {
    return
  }
  saveState.success = ''
  saveState.errors = []
  const clone = typeof structuredClone === 'function'
    ? structuredClone(value)
    : JSON.parse(JSON.stringify(value))
  Object.keys(form).forEach((key) => {
    delete form[key]
  })
  Object.assign(form, clone)
}, { immediate: true })

const csrfCookie = useCookie<string | null>(runtimeConfig.public.auth.csrfCookieName)

function addNavlink() {
  form.navlinks ??= []
  form.navlinks.push({ label: '', url: '' })
}

function removeNavlink(index: number) {
  form.navlinks.splice(index, 1)
}

function addService() {
  form.services ??= []
  form.services.push({ name: '', icon: '', description: '', thumbnails: '' })
}

function removeService(index: number) {
  form.services.splice(index, 1)
}

function addWork() {
  form.works ??= []
  form.works.push({
    name: '',
    live_demo: '',
    description: '',
    thumbnails: '',
    type: ''
  })
}

function removeWork(index: number) {
  form.works.splice(index, 1)
}

function addIntroduce() {
  form.introduce ??= []
  form.introduce.push('')
}

function removeIntroduce(index: number) {
  form.introduce.splice(index, 1)
}

function addSkillCategory() {
  form.categories ??= []
  form.categories.push({ name: '', skills: [''] })
}

function removeSkillCategory(index: number) {
  form.categories.splice(index, 1)
}

function addSkill(categoryIndex: number) {
  form.categories[categoryIndex].skills.push('')
}

function removeSkill(categoryIndex: number, skillIndex: number) {
  form.categories[categoryIndex].skills.splice(skillIndex, 1)
}

function addExperience() {
  form.positions ??= []
  form.positions.push({ role: '', company: '', timeframe: '', achievements: [''] })
}

function removeExperience(index: number) {
  form.positions.splice(index, 1)
}

function addAchievement(positionIndex: number) {
  form.positions[positionIndex].achievements.push('')
}

function removeAchievement(positionIndex: number, achievementIndex: number) {
  form.positions[positionIndex].achievements.splice(achievementIndex, 1)
}

function addEducation() {
  form.schools ??= []
  form.schools.push({ degree: '', institution: '', timeframe: '', details: '' })
}

function removeEducation(index: number) {
  form.schools.splice(index, 1)
}

async function handleSubmit() {
  saveState.isSaving = true
  saveState.success = ''
  saveState.errors = []

  try {
    const schema = contentSchemas[slug.value]
    const payload = schema.parse(form)
    await $fetch(`/api/content/${slug.value}`, {
      method: 'PUT',
      body: payload,
      headers: {
        'x-csrf-token': csrfCookie.value ?? ''
      }
    })
    saveState.success = 'Contenu mis à jour avec succès.'
    await refresh()
  }
  catch (err: any) {
    if (err instanceof ZodError) {
      saveState.errors = err.errors.map((issue) => issue.message)
    }
    else if (err?.data?.statusMessage) {
      saveState.errors = [err.data.statusMessage]
    }
    else {
      saveState.errors = ['Impossible d’enregistrer les modifications.']
    }
  }
  finally {
    saveState.isSaving = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-[#02010c] px-4 py-10 text-white">
    <div class="mx-auto flex w-full max-w-5xl flex-col gap-8">
      <header class="flex flex-col gap-3 rounded-3xl border border-white/10 bg-[#0b061a]/70 p-6 backdrop-blur-md md:flex-row md:items-center md:justify-between">
        <div>
          <p class="text-sm text-white/40">
            <NuxtLink class="underline hover:text-primary" to="/admin">Retour au tableau de bord</NuxtLink>
          </p>
          <h1 class="text-3xl font-semibold">{{ titles[slug] }}</h1>
        </div>
        <p class="text-sm text-white/50">Les modifications sont appliquées immédiatement après sauvegarde.</p>
      </header>

      <section class="rounded-3xl border border-white/10 bg-[#0f0a1f]/80 p-6 backdrop-blur-md">
        <div v-if="pending" class="py-10 text-center text-white/60">Chargement…</div>
        <div v-else-if="error" class="py-10 text-center text-red-400">
          Une erreur est survenue lors du chargement du contenu.
        </div>
        <form v-else class="space-y-8" @submit.prevent="handleSubmit">
          <div v-if="saveState.errors.length" class="rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200">
            <p class="font-semibold">Merci de corriger les points suivants :</p>
            <ul class="mt-2 list-disc space-y-1 pl-6">
              <li v-for="errorMessage in saveState.errors" :key="errorMessage">{{ errorMessage }}</li>
            </ul>
          </div>
          <p v-if="saveState.success" class="rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-4 text-sm text-emerald-200">{{ saveState.success }}</p>

          <!-- Profile -->
          <div v-if="slug === 'profile'" class="grid gap-4 md:grid-cols-2">
            <label class="flex flex-col gap-2 text-sm">
              Prénom
              <input v-model="form.firstname" type="text" class="input" required />
            </label>
            <label class="flex flex-col gap-2 text-sm">
              Nom
              <input v-model="form.lastname" type="text" class="input" required />
            </label>
            <label class="md:col-span-2 flex flex-col gap-2 text-sm">
              Rôle
              <input v-model="form.role" type="text" class="input" required />
            </label>
            <label class="md:col-span-2 flex flex-col gap-2 text-sm">
              URL de l’avatar
              <input v-model="form.avatar" type="text" class="input" required />
            </label>
          </div>

          <!-- Hero -->
          <div v-else-if="slug === 'hero'" class="grid gap-4">
            <label class="flex flex-col gap-2 text-sm">
              Badge
              <input v-model="form.badge" type="text" class="input" required />
            </label>
            <label class="flex flex-col gap-2 text-sm">
              Titre principal
              <input v-model="form.headline" type="text" class="input" required />
            </label>
            <label class="flex flex-col gap-2 text-sm">
              Description
              <textarea v-model="form.subline" rows="3" class="input" required />
            </label>
          </div>

          <!-- Service -->
          <div v-else-if="slug === 'service'" class="space-y-6">
            <div class="grid gap-4">
              <label class="flex flex-col gap-2 text-sm">
                Libellé
                <input v-model="form.label" type="text" class="input" required />
              </label>
              <label class="flex flex-col gap-2 text-sm">
                Titre
                <input v-model="form.headline" type="text" class="input" required />
              </label>
              <label class="flex flex-col gap-2 text-sm">
                Description
                <textarea v-model="form.subline" rows="3" class="input" required />
              </label>
            </div>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-semibold">Services</h2>
                <button type="button" class="btn-secondary" @click="addService">Ajouter un service</button>
              </div>
              <div v-if="form.services?.length" class="space-y-4">
                <div v-for="(service, index) in form.services" :key="index" class="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
                  <div class="flex items-center justify-between text-sm text-white/60">
                    <span>Service #{{ index + 1 }}</span>
                    <button type="button" class="text-red-300 hover:text-red-200" @click="removeService(index)">Supprimer</button>
                  </div>
                  <label class="flex flex-col gap-2 text-sm">
                    Nom
                    <input v-model="service.name" type="text" class="input" required />
                  </label>
                  <label class="flex flex-col gap-2 text-sm">
                    Icône (Iconsax)
                    <input v-model="service.icon" type="text" class="input" required />
                  </label>
                  <label class="flex flex-col gap-2 text-sm">
                    Description
                    <textarea v-model="service.description" rows="3" class="input" required />
                  </label>
                  <label class="flex flex-col gap-2 text-sm">
                    Image (optionnelle)
                    <input v-model="service.thumbnails" type="text" class="input" />
                  </label>
                </div>
              </div>
              <p v-else class="text-sm text-white/50">Aucun service. Ajoutez-en un pour commencer.</p>
            </div>
          </div>

          <!-- Work -->
          <div v-else-if="slug === 'work'" class="space-y-6">
            <div class="grid gap-4">
              <label class="flex flex-col gap-2 text-sm">
                Libellé
                <input v-model="form.label" type="text" class="input" required />
              </label>
              <label class="flex flex-col gap-2 text-sm">
                Titre
                <input v-model="form.headline" type="text" class="input" required />
              </label>
              <label class="flex flex-col gap-2 text-sm">
                Description
                <textarea v-model="form.subline" rows="3" class="input" required />
              </label>
            </div>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-semibold">Projets</h2>
                <button type="button" class="btn-secondary" @click="addWork">Ajouter un projet</button>
              </div>
              <div v-if="form.works?.length" class="space-y-4">
                <div v-for="(project, index) in form.works" :key="index" class="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
                  <div class="flex items-center justify-between text-sm text-white/60">
                    <span>Projet #{{ index + 1 }}</span>
                    <button type="button" class="text-red-300 hover:text-red-200" @click="removeWork(index)">Supprimer</button>
                  </div>
                  <label class="flex flex-col gap-2 text-sm">
                    Nom
                    <input v-model="project.name" type="text" class="input" required />
                  </label>
                  <label class="flex flex-col gap-2 text-sm">
                    Lien de démonstration
                    <input v-model="project.live_demo" type="text" class="input" required />
                  </label>
                  <label class="flex flex-col gap-2 text-sm">
                    Description
                    <textarea v-model="project.description" rows="3" class="input" required />
                  </label>
                  <label class="flex flex-col gap-2 text-sm">
                    Image
                    <input v-model="project.thumbnails" type="text" class="input" required />
                  </label>
                  <label class="flex flex-col gap-2 text-sm">
                    Type
                    <input v-model="project.type" type="text" class="input" required />
                  </label>
                </div>
              </div>
              <p v-else class="text-sm text-white/50">Aucun projet enregistré.</p>
            </div>
          </div>

          <!-- About -->
          <div v-else-if="slug === 'about'" class="space-y-6">
            <label class="flex flex-col gap-2 text-sm">
              Libellé
              <input v-model="form.label" type="text" class="input" required />
            </label>
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-semibold">Paragraphes</h2>
                <button type="button" class="btn-secondary" @click="addIntroduce">Ajouter un paragraphe</button>
              </div>
              <div v-if="form.introduce?.length" class="space-y-4">
                <div v-for="(paragraph, index) in form.introduce" :key="index" class="space-y-2">
                  <label class="flex flex-col gap-2 text-sm">
                    Paragraphe #{{ index + 1 }}
                    <textarea v-model="form.introduce[index]" rows="3" class="input" required />
                  </label>
                  <button type="button" class="text-sm text-red-300 hover:text-red-200" @click="removeIntroduce(index)">Supprimer</button>
                </div>
              </div>
              <p v-else class="text-sm text-white/50">Ajoutez un paragraphe pour commencer.</p>
            </div>
          </div>

          <!-- CTA -->
          <div v-else-if="slug === 'cta'" class="space-y-4">
            <label class="flex flex-col gap-2 text-sm">
              Libellé
              <input v-model="form.label" type="text" class="input" required />
            </label>
            <label class="flex flex-col gap-2 text-sm">
              Description
              <textarea v-model="form.description" rows="3" class="input" required />
            </label>
          </div>

          <!-- Navigation -->
          <div v-else-if="slug === 'navlinks'" class="space-y-4">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-semibold">Liens de navigation</h2>
              <button type="button" class="btn-secondary" @click="addNavlink">Ajouter un lien</button>
            </div>
            <div v-if="form.navlinks?.length" class="space-y-4">
              <div v-for="(link, index) in form.navlinks" :key="index" class="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
                <div class="flex items-center justify-between text-sm text-white/60">
                  <span>Lien #{{ index + 1 }}</span>
                  <button type="button" class="text-red-300 hover:text-red-200" @click="removeNavlink(index)">Supprimer</button>
                </div>
                <label class="flex flex-col gap-2 text-sm">
                  Libellé
                  <input v-model="link.label" type="text" class="input" required />
                </label>
                <label class="flex flex-col gap-2 text-sm">
                  URL
                  <input v-model="link.url" type="text" class="input" required />
                </label>
              </div>
            </div>
            <p v-else class="text-sm text-white/50">Aucun lien n’est encore configuré.</p>
          </div>

          <!-- Skills -->
          <div v-else-if="slug === 'skills'" class="space-y-6">
            <div class="grid gap-4">
              <label class="flex flex-col gap-2 text-sm">
                Libellé
                <input v-model="form.label" type="text" class="input" required />
              </label>
              <label class="flex flex-col gap-2 text-sm">
                Titre
                <input v-model="form.headline" type="text" class="input" required />
              </label>
              <label class="flex flex-col gap-2 text-sm">
                Description
                <textarea v-model="form.subline" rows="3" class="input" required />
              </label>
            </div>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-semibold">Catégories</h2>
                <button type="button" class="btn-secondary" @click="addSkillCategory">Ajouter une catégorie</button>
              </div>
              <div v-if="form.categories?.length" class="space-y-4">
                <div v-for="(category, categoryIndex) in form.categories" :key="categoryIndex" class="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
                  <div class="flex items-center justify-between text-sm text-white/60">
                    <span>Catégorie #{{ categoryIndex + 1 }}</span>
                    <button type="button" class="text-red-300 hover:text-red-200" @click="removeSkillCategory(categoryIndex)">Supprimer</button>
                  </div>
                  <label class="flex flex-col gap-2 text-sm">
                    Nom de la catégorie
                    <input v-model="category.name" type="text" class="input" required />
                  </label>
                  <div class="space-y-2">
                    <div class="flex items-center justify-between text-sm">
                      <span>Compétences</span>
                      <button type="button" class="text-primary hover:text-primary/80" @click="addSkill(categoryIndex)">Ajouter</button>
                    </div>
                    <div v-if="category.skills?.length" class="space-y-2">
                      <div v-for="(skill, skillIndex) in category.skills" :key="skillIndex" class="flex items-center gap-2">
                        <input v-model="category.skills[skillIndex]" type="text" class="input flex-1" required />
                        <button type="button" class="text-red-300 hover:text-red-200" @click="removeSkill(categoryIndex, skillIndex)">Retirer</button>
                      </div>
                    </div>
                    <p v-else class="text-sm text-white/50">Aucune compétence.</p>
                  </div>
                </div>
              </div>
              <p v-else class="text-sm text-white/50">Aucune catégorie définie.</p>
            </div>
          </div>

          <!-- Experiences -->
          <div v-else-if="slug === 'experiences'" class="space-y-6">
            <div class="grid gap-4">
              <label class="flex flex-col gap-2 text-sm">
                Libellé
                <input v-model="form.label" type="text" class="input" required />
              </label>
              <label class="flex flex-col gap-2 text-sm">
                Titre
                <input v-model="form.headline" type="text" class="input" required />
              </label>
            </div>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-semibold">Expériences</h2>
                <button type="button" class="btn-secondary" @click="addExperience">Ajouter une expérience</button>
              </div>
              <div v-if="form.positions?.length" class="space-y-4">
                <div v-for="(position, index) in form.positions" :key="index" class="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
                  <div class="flex items-center justify-between text-sm text-white/60">
                    <span>Expérience #{{ index + 1 }}</span>
                    <button type="button" class="text-red-300 hover:text-red-200" @click="removeExperience(index)">Supprimer</button>
                  </div>
                  <label class="flex flex-col gap-2 text-sm">
                    Rôle
                    <input v-model="position.role" type="text" class="input" required />
                  </label>
                  <label class="flex flex-col gap-2 text-sm">
                    Entreprise
                    <input v-model="position.company" type="text" class="input" required />
                  </label>
                  <label class="flex flex-col gap-2 text-sm">
                    Période
                    <input v-model="position.timeframe" type="text" class="input" required />
                  </label>
                  <div class="space-y-2">
                    <div class="flex items-center justify-between text-sm">
                      <span>Réalisations</span>
                      <button type="button" class="text-primary hover:text-primary/80" @click="addAchievement(index)">Ajouter</button>
                    </div>
                    <div v-if="position.achievements?.length" class="space-y-2">
                      <div v-for="(achievement, achievementIndex) in position.achievements" :key="achievementIndex" class="flex items-center gap-2">
                        <textarea v-model="position.achievements[achievementIndex]" rows="2" class="input flex-1" required />
                        <button type="button" class="text-red-300 hover:text-red-200" @click="removeAchievement(index, achievementIndex)">Retirer</button>
                      </div>
                    </div>
                    <p v-else class="text-sm text-white/50">Aucune réalisation.</p>
                  </div>
                </div>
              </div>
              <p v-else class="text-sm text-white/50">Aucune expérience.</p>
            </div>
          </div>

          <!-- Education -->
          <div v-else-if="slug === 'education'" class="space-y-6">
            <div class="grid gap-4">
              <label class="flex flex-col gap-2 text-sm">
                Libellé
                <input v-model="form.label" type="text" class="input" required />
              </label>
              <label class="flex flex-col gap-2 text-sm">
                Titre
                <input v-model="form.headline" type="text" class="input" required />
              </label>
            </div>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-semibold">Formations</h2>
                <button type="button" class="btn-secondary" @click="addEducation">Ajouter une formation</button>
              </div>
              <div v-if="form.schools?.length" class="space-y-4">
                <div v-for="(school, index) in form.schools" :key="index" class="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
                  <div class="flex items-center justify-between text-sm text-white/60">
                    <span>Formation #{{ index + 1 }}</span>
                    <button type="button" class="text-red-300 hover:text-red-200" @click="removeEducation(index)">Supprimer</button>
                  </div>
                  <label class="flex flex-col gap-2 text-sm">
                    Diplôme
                    <input v-model="school.degree" type="text" class="input" required />
                  </label>
                  <label class="flex flex-col gap-2 text-sm">
                    Établissement
                    <input v-model="school.institution" type="text" class="input" required />
                  </label>
                  <label class="flex flex-col gap-2 text-sm">
                    Période
                    <input v-model="school.timeframe" type="text" class="input" required />
                  </label>
                  <label class="flex flex-col gap-2 text-sm">
                    Détails
                    <textarea v-model="school.details" rows="3" class="input" required />
                  </label>
                </div>
              </div>
              <p v-else class="text-sm text-white/50">Aucune formation.</p>
            </div>
          </div>

          <div class="flex items-center justify-end gap-3 border-t border-white/10 pt-6">
            <NuxtLink to="/admin" class="btn-secondary">Annuler</NuxtLink>
            <button type="submit" :disabled="saveState.isSaving" class="btn-primary">
              <span v-if="!saveState.isSaving">Enregistrer</span>
              <span v-else>Sauvegarde…</span>
            </button>
          </div>
        </form>
      </section>
    </div>
  </div>
</template>

<style scoped>
.input {
  @apply w-full rounded-lg border border-white/10 bg-black/40 px-4 py-2 text-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40;
}
.btn-primary {
  @apply inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-primary/60;
}
.btn-secondary {
  @apply inline-flex items-center justify-center rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-white transition hover:border-primary hover:text-primary;
}
</style>
