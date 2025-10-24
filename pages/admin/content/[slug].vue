<script setup lang="ts">
import { ZodError } from 'zod'
import { showError } from '#app'
import { contentSchemas, isContentSlug, type ContentSlug } from '~/types/content'
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type LocaleCode } from '~/utils/i18n/locales'

definePageMeta({ middleware: 'auth' })

const route = useRoute()
const runtimeConfig = useRuntimeConfig()
const slugParam = computed(() => route.params.slug?.toString() ?? '')

if (!isContentSlug(slugParam.value)) {
  showError({ statusCode: 404, statusMessage: 'Section introuvable.' })
}

const slug = computed(() => slugParam.value as ContentSlug)

const localeLabels: Record<LocaleCode, string> = {
  en: 'English',
  fr: 'Français',
  de: 'Deutsch',
  es: 'Español',
  it: 'Italiano',
  ru: 'Русский',
  ar: 'العربية'
}

const localeItems = SUPPORTED_LOCALES.map((code) => ({
  value: code,
  title: localeLabels[code] ?? code.toUpperCase()
}))

const selectedLocale = ref<LocaleCode>(DEFAULT_LOCALE)

const titles: Record<ContentSlug, string> = {
  contact: "Contact",
  profile: 'Profil',
  hero: 'Section personnelle',
  service: 'Compétences',
  work: 'Projets',
  about: 'À propos',
  cta: 'Appel à l’action',
  navlinks: 'Navigation',
  skills: 'Compétences',
  experiences: 'Expériences',
  education: 'Formations'
}

const { data, pending, refresh, error } = await useAsyncData(
  () => `admin-content-${slug.value}-${selectedLocale.value}`,
  () => $fetch(`/api/content/${slug.value}`, { query: { locale: selectedLocale.value } }),
  { watch: [slug, selectedLocale] }
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
  let clone: Record<string, any>
  try {
    clone = typeof structuredClone === 'function'
      ? structuredClone(value)
      : JSON.parse(JSON.stringify(value))
  }
  catch {
    clone = JSON.parse(JSON.stringify(value))
  }
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
    slug: '',
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
  form.positions.push({ slug: '', role: '', company: '', timeframe: '', achievements: [''] })
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
  form.schools.push({ slug: '', degree: '', institution: '', timeframe: '', details: '' })
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
      query: { locale: selectedLocale.value },
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
  <v-container class="mt-10">
    <v-row justify="center">
      <v-col cols="12" lg="10" style="display: flex; flex-direction: column; gap: 24px;">
        <v-card elevation="2" class="pa-6">
          <div class="d-flex flex-column flex-md-row" style="gap: 16px; align-items: center;">
            <div class="flex-grow-1">
              <v-btn :to="'/admin'" variant="text" color="primary" class="text-none px-0">
                Retour au tableau de bord
              </v-btn>
              <h1 class="text-h4 font-weight-semibold mt-3">{{ titles[slug] }}</h1>
            </div>
            <div class="d-flex flex-column align-end" style="gap: 12px;">
              <p class="text-body-2 text-medium-emphasis text-end">
                Les modifications sont appliquées immédiatement après sauvegarde.
              </p>
              <v-select
                v-model="selectedLocale"
                :items="localeItems"
                item-title="title"
                item-value="value"
                label="Langue du contenu"
                density="comfortable"
                variant="outlined"
                hide-details
                style="min-width: 220px;"
              />
            </div>
          </div>
        </v-card>

        <v-card elevation="2" class="pa-6">
          <div v-if="pending" class="py-10 text-center text-medium-emphasis">Chargement…</div>
          <div v-else-if="error" class="py-10 text-center" style="color: var(--v-theme-error);">
            Une erreur est survenue lors du chargement du contenu.
          </div>
          <v-form v-else @submit.prevent="handleSubmit" style="display: flex; flex-direction: column; gap: 24px;">
            <v-alert
              v-if="saveState.errors.length"
              type="error"
              variant="tonal"
            >
              <p class="font-weight-medium mb-2">Merci de corriger les points suivants :</p>
              <ul style="padding-left: 20px; margin: 0;">
                <li v-for="errorMessage in saveState.errors" :key="errorMessage">{{ errorMessage }}</li>
              </ul>
            </v-alert>
            <v-alert v-if="saveState.success" type="success" variant="tonal">
              {{ saveState.success }}
            </v-alert>

            <template v-if="slug === 'profile'">
              <v-row dense>
                <v-col cols="12" md="6">
                  <v-text-field v-model="form.firstname" label="Prénom" required variant="outlined" density="comfortable" />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field v-model="form.lastname" label="Nom" required variant="outlined" density="comfortable" />
                </v-col>
                <v-col cols="12">
                  <v-text-field v-model="form.role" label="Rôle" required variant="outlined" density="comfortable" />
                </v-col>
                <v-col cols="12">
                  <v-text-field v-model="form.avatar" label="URL de l’avatar" required variant="outlined" density="comfortable" />
                </v-col>
              </v-row>
            </template>

            <template v-else-if="slug === 'hero'">
              <v-text-field v-model="form.badge" label="Badge" required variant="outlined" density="comfortable" />
              <v-text-field v-model="form.headline" label="Titre principal" required variant="outlined" density="comfortable" />
              <v-textarea v-model="form.subline" label="Description" rows="4" required variant="outlined" density="comfortable" />
            </template>

            <template v-else-if="slug === 'service'">
              <v-text-field v-model="form.label" label="Libellé" required variant="outlined" density="comfortable" />
              <v-text-field v-model="form.headline" label="Titre" required variant="outlined" density="comfortable" />
              <v-textarea v-model="form.subline" label="Description" rows="4" required variant="outlined" density="comfortable" />
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <h2 class="text-h6 font-weight-semibold mb-0">Services</h2>
                <v-btn color="primary" variant="tonal" class="text-none" @click="addService">
                  Ajouter un service
                </v-btn>
              </div>
              <div v-if="form.services?.length" style="display: flex; flex-direction: column; gap: 16px;">
                <v-card
                  v-for="(service, index) in form.services"
                  :key="index"
                  variant="tonal"
                  color="primary"
                  class="pa-4"
                >
                  <div class="d-flex justify-space-between align-center mb-3">
                    <span class="text-caption">Service #{{ index + 1 }}</span>
                    <v-btn icon="mdi-delete" variant="text" color="error" @click="removeService(index)" />
                  </div>
                  <v-text-field v-model="service.name" label="Nom" required variant="outlined" density="comfortable" />
                  <v-text-field v-model="service.icon" label="Icône" required variant="outlined" density="comfortable" />
                  <v-textarea v-model="service.description" label="Description" rows="3" required variant="outlined" density="comfortable" />
                  <v-text-field v-model="service.thumbnails" label="Image (optionnelle)" variant="outlined" density="comfortable" />
                </v-card>
              </div>
              <p v-else class="text-body-2 text-medium-emphasis">Aucun service. Ajoutez-en un pour commencer.</p>
            </template>

            <template v-else-if="slug === 'work'">
              <v-text-field v-model="form.label" label="Libellé" required variant="outlined" density="comfortable" />
              <v-text-field v-model="form.headline" label="Titre" required variant="outlined" density="comfortable" />
              <v-textarea v-model="form.subline" label="Description" rows="4" required variant="outlined" density="comfortable" />
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <h2 class="text-h6 font-weight-semibold mb-0">Projets</h2>
                <v-btn color="primary" variant="tonal" class="text-none" @click="addWork">
                  Ajouter un projet
                </v-btn>
              </div>
              <div v-if="form.works?.length" style="display: flex; flex-direction: column; gap: 16px;">
                <v-card
                  v-for="(project, index) in form.works"
                  :key="project.slug || index"
                  variant="tonal"
                  color="primary"
                  class="pa-4"
                >
                  <div class="d-flex justify-space-between align-center mb-3">
                    <span class="text-caption">Projet #{{ index + 1 }}</span>
                    <v-btn icon="mdi-delete" variant="text" color="error" @click="removeWork(index)" />
                  </div>
                  <v-text-field v-model="project.name" label="Nom" required variant="outlined" density="comfortable" />
                  <v-text-field
                    v-model="project.slug"
                    label="Identifiant (slug)"
                    required
                    variant="outlined"
                    density="comfortable"
                  />
                  <v-text-field v-model="project.live_demo" label="Lien de démonstration" required variant="outlined" density="comfortable" />
                  <v-textarea v-model="project.description" label="Description" rows="3" required variant="outlined" density="comfortable" />
                  <v-text-field v-model="project.thumbnails" label="Image" required variant="outlined" density="comfortable" />
                  <v-text-field v-model="project.type" label="Type" required variant="outlined" density="comfortable" />
                </v-card>
              </div>
              <p v-else class="text-body-2 text-medium-emphasis">Aucun projet enregistré.</p>
            </template>

            <template v-else-if="slug === 'about'">
              <v-text-field v-model="form.label" label="Libellé" required variant="outlined" density="comfortable" />
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <h2 class="text-h6 font-weight-semibold mb-0">Paragraphes</h2>
                <v-btn color="primary" variant="tonal" class="text-none" @click="addIntroduce">
                  Ajouter un paragraphe
                </v-btn>
              </div>
              <div v-if="form.introduce?.length" style="display: flex; flex-direction: column; gap: 16px;">
                <v-card
                  v-for="(paragraph, index) in form.introduce"
                  :key="index"
                  variant="tonal"
                  color="primary"
                  class="pa-4"
                >
                  <div class="d-flex justify-space-between align-center mb-3">
                    <span class="text-caption">Paragraphe #{{ index + 1 }}</span>
                    <v-btn icon="mdi-delete" variant="text" color="error" @click="removeIntroduce(index)" />
                  </div>
                  <v-textarea v-model="form.introduce[index]" label="Contenu" rows="3" required variant="outlined" density="comfortable" />
                </v-card>
              </div>
              <p v-else class="text-body-2 text-medium-emphasis">Ajoutez un paragraphe pour commencer.</p>
            </template>

            <template v-else-if="slug === 'cta'">
              <v-text-field v-model="form.label" label="Libellé" required variant="outlined" density="comfortable" />
              <v-textarea v-model="form.description" label="Description" rows="4" required variant="outlined" density="comfortable" />
            </template>

            <template v-else-if="slug === 'navlinks'">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <h2 class="text-h6 font-weight-semibold mb-0">Liens de navigation</h2>
                <v-btn color="primary" variant="tonal" class="text-none" @click="addNavlink">
                  Ajouter un lien
                </v-btn>
              </div>
              <div v-if="form.navlinks?.length" style="display: flex; flex-direction: column; gap: 16px;">
                <v-card
                  v-for="(link, index) in form.navlinks"
                  :key="index"
                  variant="tonal"
                  color="primary"
                  class="pa-4"
                >
                  <div class="d-flex justify-space-between align-center mb-3">
                    <span class="text-caption">Lien #{{ index + 1 }}</span>
                    <v-btn icon="mdi-delete" variant="text" color="error" @click="removeNavlink(index)" />
                  </div>
                  <v-text-field v-model="link.label" label="Libellé" required variant="outlined" density="comfortable" />
                  <v-text-field v-model="link.url" label="URL" required variant="outlined" density="comfortable" />
                </v-card>
              </div>
              <p v-else class="text-body-2 text-medium-emphasis">Aucun lien n’est encore configuré.</p>
            </template>

            <template v-else-if="slug === 'skills'">
              <v-text-field v-model="form.label" label="Libellé" required variant="outlined" density="comfortable" />
              <v-text-field v-model="form.headline" label="Titre" required variant="outlined" density="comfortable" />
              <v-textarea v-model="form.subline" label="Description" rows="4" required variant="outlined" density="comfortable" />
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <h2 class="text-h6 font-weight-semibold mb-0">Catégories</h2>
                <v-btn color="primary" variant="tonal" class="text-none" @click="addSkillCategory">
                  Ajouter une catégorie
                </v-btn>
              </div>
              <div v-if="form.categories?.length" style="display: flex; flex-direction: column; gap: 16px;">
                <v-card
                  v-for="(category, categoryIndex) in form.categories"
                  :key="categoryIndex"
                  variant="tonal"
                  color="primary"
                  class="pa-4"
                >
                  <div class="d-flex justify-space-between align-center mb-3">
                    <span class="text-caption">Catégorie #{{ categoryIndex + 1 }}</span>
                    <v-btn icon="mdi-delete" variant="text" color="error" @click="removeSkillCategory(categoryIndex)" />
                  </div>
                  <v-text-field v-model="category.name" label="Nom de la catégorie" required variant="outlined" density="comfortable" />
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span class="text-body-2">Compétences</span>
                    <v-btn icon="mdi-plus" variant="text" color="primary" @click="addSkill(categoryIndex)" />
                  </div>
                  <div v-if="category.skills?.length" style="display: flex; flex-direction: column; gap: 12px;">
                    <div v-for="(skill, skillIndex) in category.skills" :key="skillIndex" class="d-flex" style="gap: 12px;">
                      <v-text-field
                        v-model="category.skills[skillIndex]"
                        label="Nom de la compétence"
                        required
                        variant="outlined"
                        density="comfortable"
                        class="flex-grow-1"
                      />
                      <v-btn icon="mdi-delete" variant="text" color="error" @click="removeSkill(categoryIndex, skillIndex)" />
                    </div>
                  </div>
                  <p v-else class="text-body-2 text-medium-emphasis">Aucune compétence.</p>
                </v-card>
              </div>
              <p v-else class="text-body-2 text-medium-emphasis">Aucune catégorie définie.</p>
            </template>

            <template v-else-if="slug === 'experiences'">
              <v-text-field v-model="form.label" label="Libellé" required variant="outlined" density="comfortable" />
              <v-text-field v-model="form.headline" label="Titre" required variant="outlined" density="comfortable" />
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <h2 class="text-h6 font-weight-semibold mb-0">Expériences</h2>
                <v-btn color="primary" variant="tonal" class="text-none" @click="addExperience">
                  Ajouter une expérience
                </v-btn>
              </div>
              <div v-if="form.positions?.length" style="display: flex; flex-direction: column; gap: 16px;">
                <v-card
                  v-for="(position, index) in form.positions"
                  :key="position.slug || index"
                  variant="tonal"
                  color="primary"
                  class="pa-4"
                >
                  <div class="d-flex justify-space-between align-center mb-3">
                    <span class="text-caption">Expérience #{{ index + 1 }}</span>
                    <v-btn icon="mdi-delete" variant="text" color="error" @click="removeExperience(index)" />
                  </div>
                  <v-text-field v-model="position.role" label="Rôle" required variant="outlined" density="comfortable" />
                  <v-text-field
                    v-model="position.slug"
                    label="Identifiant (slug)"
                    required
                    variant="outlined"
                    density="comfortable"
                  />
                  <v-text-field v-model="position.company" label="Entreprise" required variant="outlined" density="comfortable" />
                  <v-text-field v-model="position.timeframe" label="Période" required variant="outlined" density="comfortable" />
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span class="text-body-2">Réalisations</span>
                    <v-btn icon="mdi-plus" variant="text" color="primary" @click="addAchievement(index)" />
                  </div>
                  <div v-if="position.achievements?.length" style="display: flex; flex-direction: column; gap: 12px;">
                    <div
                      v-for="(achievement, achievementIndex) in position.achievements"
                      :key="achievementIndex"
                      class="d-flex"
                      style="gap: 12px;"
                    >
                      <v-textarea
                        v-model="position.achievements[achievementIndex]"
                        label="Détail"
                        rows="2"
                        required
                        variant="outlined"
                        density="comfortable"
                        class="flex-grow-1"
                      />
                      <v-btn icon="mdi-delete" variant="text" color="error" @click="removeAchievement(index, achievementIndex)" />
                    </div>
                  </div>
                  <p v-else class="text-body-2 text-medium-emphasis">Aucune réalisation.</p>
                </v-card>
              </div>
              <p v-else class="text-body-2 text-medium-emphasis">Aucune expérience.</p>
            </template>

            <template v-else-if="slug === 'education'">
              <v-text-field v-model="form.label" label="Libellé" required variant="outlined" density="comfortable" />
              <v-text-field v-model="form.headline" label="Titre" required variant="outlined" density="comfortable" />
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <h2 class="text-h6 font-weight-semibold mb-0">Formations</h2>
                <v-btn color="primary" variant="tonal" class="text-none" @click="addEducation">
                  Ajouter une formation
                </v-btn>
              </div>
              <div v-if="form.schools?.length" style="display: flex; flex-direction: column; gap: 16px;">
                <v-card
                  v-for="(school, index) in form.schools"
                  :key="school.slug || index"
                  variant="tonal"
                  color="primary"
                  class="pa-4"
                >
                  <div class="d-flex justify-space-between align-center mb-3">
                    <span class="text-caption">Formation #{{ index + 1 }}</span>
                    <v-btn icon="mdi-delete" variant="text" color="error" @click="removeEducation(index)" />
                  </div>
                  <v-text-field v-model="school.degree" label="Diplôme" required variant="outlined" density="comfortable" />
                  <v-text-field
                    v-model="school.slug"
                    label="Identifiant (slug)"
                    required
                    variant="outlined"
                    density="comfortable"
                  />
                  <v-text-field v-model="school.institution" label="Établissement" required variant="outlined" density="comfortable" />
                  <v-text-field v-model="school.timeframe" label="Période" required variant="outlined" density="comfortable" />
                  <v-textarea v-model="school.details" label="Détails" rows="3" required variant="outlined" density="comfortable" />
                </v-card>
              </div>
              <p v-else class="text-body-2 text-medium-emphasis">Aucune formation.</p>
            </template>

            <div class="d-flex justify-end" style="gap: 12px;">
              <v-btn :to="'/admin'" variant="tonal" color="primary" class="text-none">
                Annuler
              </v-btn>
              <v-btn type="submit" color="primary" class="text-none" :loading="saveState.isSaving">
                Enregistrer
              </v-btn>
            </div>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
