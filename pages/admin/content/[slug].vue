<script setup lang="ts">
import { ZodError } from 'zod'
import { showError } from '#app'
import { contentSchemas, isContentSlug, type ContentSlug } from '~/types/content'
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type LocaleCode } from '~/utils/i18n/locales'

definePageMeta({
  middleware: 'auth' ,
  layout: 'admin'
})

const route = useRoute()
const runtimeConfig = useRuntimeConfig()
const slugParam = computed(() => route.params.slug?.toString() ?? '')

if (!isContentSlug(slugParam.value)) {
  showError({ statusCode: 404, statusMessage: 'Section introuvable.' })
}

const slug = computed(() => slugParam.value as ContentSlug)

type ContentFormState = {
  navlinks?: Array<{ label: string; url: string }>
  services?: Array<{ name: string; icon: string; description: string; thumbnails: string }>
  works?: Array<{
    name: string
    slug: string
    live_demo: string
    description: string
    thumbnails: string
    type: string
  }>
  introduce?: string[]
  hobbies?: string[]
  categories?: Array<{ name: string; skills: string[] }>
  languages?: string[]
  languageProficiencies?: Array<{ name: string; proficiency: number }>
  positions?: Array<{
    slug: string
    role: string
    company: string
    timeframe: string
    achievements: string[]
  }>
  schools?: Array<{
    slug: string
    degree: string
    institution: string
    timeframe: string
    details: string
  }>
} & Record<string, unknown>

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

const form = reactive<ContentFormState>({})
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
  let clone: Partial<ContentFormState>
  try {
    clone = typeof structuredClone === 'function'
      ? structuredClone(value) as Partial<ContentFormState>
      : JSON.parse(JSON.stringify(value)) as Partial<ContentFormState>
  }
  catch {
    clone = JSON.parse(JSON.stringify(value)) as Partial<ContentFormState>
  }
  Object.keys(form).forEach((key) => {
    delete form[key]
  })
  Object.assign(form, clone)
}, { immediate: true })

const csrfCookie = useCookie<string | null>(runtimeConfig.public.auth.csrfCookieName)

function extractStatusMessage(error: unknown): string | null {
  if (typeof error !== 'object' || error === null) {
    return null
  }

  const candidate = error as Record<string, unknown>
  if (typeof candidate.data !== 'object' || candidate.data === null) {
    return null
  }

  const data = candidate.data as Record<string, unknown>
  const statusMessage = data.statusMessage

  return typeof statusMessage === 'string' ? statusMessage : null
}

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

function addHobby() {
  form.hobbies ??= []
  form.hobbies.push('')
}

function removeHobby(index: number) {
  form.hobbies.splice(index, 1)
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

function addLanguage() {
  form.languages ??= []
  form.languages.push('')
}

function removeLanguage(index: number) {
  form.languages.splice(index, 1)
}

function addLanguageProficiency() {
  form.languageProficiencies ??= []
  form.languageProficiencies.push({ name: '', proficiency: 0 })
}

function removeLanguageProficiency(index: number) {
  form.languageProficiencies.splice(index, 1)
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
  catch (err: unknown) {
    if (err instanceof ZodError) {
      saveState.errors = err.errors.map((issue) => issue.message)
    }
    else {
      const statusMessage = extractStatusMessage(err)
      if (statusMessage) {
        saveState.errors = [statusMessage]
      }
      else {
        saveState.errors = ['Impossible d’enregistrer les modifications.']
      }
    }
  }
  finally {
    saveState.isSaving = false
  }
}
</script>

<template>
  <v-container class="admin-editor mt-6">
    <v-row justify="center">
      <v-col
        cols="12"
        lg="10"
        style="display: flex; flex-direction: column; gap: 24px"
      >
        <v-card
          elevation="0"
          class="editor-card editor-card--header"
        >
          <div
            class="editor-card__content d-flex flex-column flex-md-row"
            style="gap: 16px; align-items: center"
          >
            <div class="flex-grow-1">
              <v-btn
                :to="'/admin'"
                variant="text"
                color="primary"
                class="text-none px-0 editor-card__back"
              >
                Retour au tableau de bord
              </v-btn>
              <h1 class="editor-card__title">{{ titles[slug] }}</h1>
            </div>
            <div
              class="editor-card__aside d-flex flex-column align-end"
              style="gap: 12px"
            >
              <p class="text-body-2 text-medium-emphasis text-end editor-card__hint">
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
                class="editor-card__locale"
              />
            </div>
          </div>
        </v-card>

        <v-card
          elevation="0"
          class="editor-card editor-card--panel"
        >
          <div
            v-if="pending"
            class="py-10 text-center text-medium-emphasis"
          >
            Chargement…
          </div>
          <div
            v-else-if="error"
            class="py-10 text-center editor-card__error"
          >
            Une erreur est survenue lors du chargement du contenu.
          </div>
          <v-form
            v-else
            class="editor-form"
            @submit.prevent="handleSubmit"
          >
            <v-alert
              v-if="saveState.errors.length"
              type="error"
              variant="tonal"
              class="editor-form__alert"
            >
              <p class="font-weight-medium mb-2">Merci de corriger les points suivants :</p>
              <ul style="padding-left: 20px; margin: 0">
                <li
                  v-for="errorMessage in saveState.errors"
                  :key="errorMessage"
                >
                  {{ errorMessage }}
                </li>
              </ul>
            </v-alert>
            <v-alert
              v-if="saveState.success"
              type="success"
              variant="tonal"
              class="editor-form__alert"
            >
              {{ saveState.success }}
            </v-alert>

            <template v-if="slug === 'profile'">
              <v-row dense>
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    v-model="form.firstname"
                    label="Prénom"
                    required
                    variant="outlined"
                    density="comfortable"
                  />
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    v-model="form.lastname"
                    label="Nom"
                    required
                    variant="outlined"
                    density="comfortable"
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="form.role"
                    label="Rôle"
                    required
                    variant="outlined"
                    density="comfortable"
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="form.avatar"
                    label="URL de l’avatar"
                    required
                    variant="outlined"
                    density="comfortable"
                  />
                </v-col>
              </v-row>
            </template>

            <template v-else-if="slug === 'hero'">
              <v-text-field
                v-model="form.badge"
                label="Badge"
                required
                variant="outlined"
                density="comfortable"
              />
              <v-text-field
                v-model="form.headline"
                label="Titre principal"
                required
                variant="outlined"
                density="comfortable"
              />
              <v-textarea
                v-model="form.subline"
                label="Description"
                rows="4"
                required
                variant="outlined"
                density="comfortable"
              />
            </template>

            <template v-else-if="slug === 'service'">
              <v-text-field
                v-model="form.label"
                label="Libellé"
                required
                variant="outlined"
                density="comfortable"
              />
              <v-text-field
                v-model="form.headline"
                label="Titre"
                required
                variant="outlined"
                density="comfortable"
              />
              <v-textarea
                v-model="form.subline"
                label="Description"
                rows="4"
                required
                variant="outlined"
                density="comfortable"
              />
              <div class="editor-section__heading">
                <h2 class="editor-section__title">Services</h2>
                <v-btn
                  color="primary"
                  variant="tonal"
                  class="text-none"
                  @click="addService"
                >
                  Ajouter un service
                </v-btn>
              </div>
              <div
                v-if="form.services?.length"
                class="editor-collection"
              >
                <v-card
                  v-for="(service, index) in form.services"
                  :key="index"
                  variant="tonal"
                  color="primary"
                  class="editor-subcard"
                >
                  <div class="d-flex justify-space-between align-center mb-3">
                    <span class="text-caption">Service #{{ index + 1 }}</span>
                    <v-btn
                      icon="mdi-delete"
                      variant="text"
                      color="error"
                      @click="removeService(index)"
                    />
                  </div>
                  <v-text-field
                    v-model="service.name"
                    label="Nom"
                    required
                    variant="outlined"
                    density="comfortable"
                  />
                  <v-text-field
                    v-model="service.icon"
                    label="Icône"
                    required
                    variant="outlined"
                    density="comfortable"
                  />
                  <v-textarea
                    v-model="service.description"
                    label="Description"
                    rows="3"
                    required
                    variant="outlined"
                    density="comfortable"
                  />
                  <v-text-field
                    v-model="service.thumbnails"
                    label="Image (optionnelle)"
                    variant="outlined"
                    density="comfortable"
                  />
                </v-card>
              </div>
              <p
                v-else
                class="text-body-2 text-medium-emphasis"
              >
                Aucun service. Ajoutez-en un pour commencer.
              </p>
            </template>

            <template v-else-if="slug === 'work'">
              <v-text-field
                v-model="form.label"
                label="Libellé"
                required
                variant="outlined"
                density="comfortable"
              />
              <v-text-field
                v-model="form.headline"
                label="Titre"
                required
                variant="outlined"
                density="comfortable"
              />
              <v-textarea
                v-model="form.subline"
                label="Description"
                rows="4"
                required
                variant="outlined"
                density="comfortable"
              />
              <div class="editor-section__heading">
                <h2 class="editor-section__title">Projets</h2>
                <v-btn
                  color="primary"
                  variant="tonal"
                  class="text-none"
                  @click="addWork"
                >
                  Ajouter un projet
                </v-btn>
              </div>
              <div
                v-if="form.works?.length"
                class="editor-collection"
              >
                <v-card
                  v-for="(project, index) in form.works"
                  :key="project.slug || index"
                  variant="tonal"
                  color="primary"
                  class="editor-subcard"
                >
                  <div class="d-flex justify-space-between align-center mb-3">
                    <span class="text-caption">Projet #{{ index + 1 }}</span>
                    <v-btn
                      icon="mdi-delete"
                      variant="text"
                      color="error"
                      @click="removeWork(index)"
                    />
                  </div>
                  <v-text-field
                    v-model="project.name"
                    label="Nom"
                    required
                    variant="outlined"
                    density="comfortable"
                  />
                  <v-text-field
                    v-model="project.slug"
                    label="Identifiant (slug)"
                    required
                    variant="outlined"
                    density="comfortable"
                  />
                  <v-text-field
                    v-model="project.live_demo"
                    label="Lien de démonstration"
                    required
                    variant="outlined"
                    density="comfortable"
                  />
                  <v-textarea
                    v-model="project.description"
                    label="Description"
                    rows="3"
                    required
                    variant="outlined"
                    density="comfortable"
                  />
                  <v-text-field
                    v-model="project.thumbnails"
                    label="Image"
                    required
                    variant="outlined"
                    density="comfortable"
                  />
                  <v-text-field
                    v-model="project.type"
                    label="Type"
                    required
                    variant="outlined"
                    density="comfortable"
                  />
                </v-card>
              </div>
              <p
                v-else
                class="text-body-2 text-medium-emphasis"
              >
                Aucun projet enregistré.
              </p>
            </template>

            <template v-else-if="slug === 'about'">
              <v-text-field
                v-model="form.label"
                label="Libellé"
                required
                variant="outlined"
                density="comfortable"
              />
              <div class="editor-section__heading">
                <h2 class="editor-section__title">Paragraphes</h2>
                <v-btn
                  color="primary"
                  variant="tonal"
                  class="text-none"
                  @click="addIntroduce"
                >
                  Ajouter un paragraphe
                </v-btn>
              </div>
              <div
                v-if="form.introduce?.length"
                class="editor-collection"
              >
                <v-card
                  v-for="(paragraph, index) in form.introduce"
                  :key="index"
                  variant="tonal"
                  color="primary"
                  class="editor-subcard"
                >
                  <div class="d-flex justify-space-between align-center mb-3">
                    <span class="text-caption">Paragraphe #{{ index + 1 }}</span>
                    <v-btn
                      icon="mdi-delete"
                      variant="text"
                      color="error"
                      @click="removeIntroduce(index)"
                    />
                  </div>
                  <v-textarea
                    v-model="form.introduce[index]"
                    label="Contenu"
                    rows="3"
                    required
                    variant="outlined"
                    density="comfortable"
                  />
                </v-card>
              </div>
              <p
                v-else
                class="text-body-2 text-medium-emphasis"
              >
                Ajoutez un paragraphe pour commencer.
              </p>
              <div class="editor-section__heading mt-6">
                <h2 class="editor-section__title">Hobbies</h2>
                <v-btn
                  color="primary"
                  variant="tonal"
                  class="text-none"
                  @click="addHobby"
                >
                  Ajouter un hobby
                </v-btn>
              </div>
              <div
                v-if="form.hobbies?.length"
                class="editor-collection"
              >
                <v-card
                  v-for="(hobby, index) in form.hobbies"
                  :key="index"
                  variant="tonal"
                  color="primary"
                  class="editor-subcard"
                >
                  <div class="d-flex justify-space-between align-center mb-3">
                    <span class="text-caption">Hobby #{{ index + 1 }}</span>
                    <v-btn
                      icon="mdi-delete"
                      variant="text"
                      color="error"
                      @click="removeHobby(index)"
                    />
                  </div>
                  <v-text-field
                    v-model="form.hobbies[index]"
                    label="Nom du hobby"
                    required
                    variant="outlined"
                    density="comfortable"
                  />
                </v-card>
              </div>
              <p
                v-else
                class="text-body-2 text-medium-emphasis"
              >
                Ajoutez un hobby pour commencer.
              </p>
            </template>

            <template v-else-if="slug === 'cta'">
              <v-text-field
                v-model="form.label"
                label="Libellé"
                required
                variant="outlined"
                density="comfortable"
              />
              <v-textarea
                v-model="form.description"
                label="Description"
                rows="4"
                required
                variant="outlined"
                density="comfortable"
              />
            </template>

            <template v-else-if="slug === 'navlinks'">
              <div style="display: flex; justify-content: space-between; align-items: center">
                <h2 class="text-h6 font-weight-semibold mb-0">Liens de navigation</h2>
                <v-btn
                  color="primary"
                  variant="tonal"
                  class="text-none"
                  @click="addNavlink"
                >
                  Ajouter un lien
                </v-btn>
              </div>
              <div
                v-if="form.navlinks?.length"
                style="display: flex; flex-direction: column; gap: 16px"
              >
                <v-card
                  v-for="(link, index) in form.navlinks"
                  :key="index"
                  variant="tonal"
                  color="primary"
                  class="pa-4"
                >
                  <div class="d-flex justify-space-between align-center mb-3">
                    <span class="text-caption">Lien #{{ index + 1 }}</span>
                    <v-btn
                      icon="mdi-delete"
                      variant="text"
                      color="error"
                      @click="removeNavlink(index)"
                    />
                  </div>
                  <v-text-field
                    v-model="link.label"
                    label="Libellé"
                    required
                    variant="outlined"
                    density="comfortable"
                  />
                  <v-text-field
                    v-model="link.url"
                    label="URL"
                    required
                    variant="outlined"
                    density="comfortable"
                  />
                </v-card>
              </div>
              <p
                v-else
                class="text-body-2 text-medium-emphasis"
              >
                Aucun lien n’est encore configuré.
              </p>
            </template>

            <template v-else-if="slug === 'skills'">
              <v-text-field
                v-model="form.label"
                label="Libellé"
                required
                variant="outlined"
                density="comfortable"
              />
              <v-text-field
                v-model="form.headline"
                label="Titre"
                required
                variant="outlined"
                density="comfortable"
              />
              <v-textarea
                v-model="form.subline"
                label="Description"
                rows="4"
                required
                variant="outlined"
                density="comfortable"
              />
              <div class="editor-section__heading">
                <h2 class="editor-section__title">Catégories</h2>
                <v-btn
                  color="primary"
                  variant="tonal"
                  class="text-none"
                  @click="addSkillCategory"
                >
                  Ajouter une catégorie
                </v-btn>
              </div>
              <div
                v-if="form.categories?.length"
                class="editor-collection"
              >
                <v-card
                  v-for="(category, categoryIndex) in form.categories"
                  :key="categoryIndex"
                  variant="tonal"
                  color="primary"
                  class="editor-subcard"
                >
                  <div class="d-flex justify-space-between align-center mb-3">
                    <span class="text-caption">Catégorie #{{ categoryIndex + 1 }}</span>
                    <v-btn
                      icon="mdi-delete"
                      variant="text"
                      color="error"
                      @click="removeSkillCategory(categoryIndex)"
                    />
                  </div>
                  <v-text-field
                    v-model="category.name"
                    label="Nom de la catégorie"
                    required
                    variant="outlined"
                    density="comfortable"
                  />
                  <div class="editor-section__heading">
                    <span class="text-body-2">Compétences</span>
                    <v-btn
                      icon="mdi-plus"
                      variant="text"
                      color="primary"
                      @click="addSkill(categoryIndex)"
                    />
                  </div>
                  <div
                    v-if="category.skills?.length"
                    class="editor-collection editor-collection--compact"
                  >
                    <div
                      v-for="(skill, skillIndex) in category.skills"
                      :key="skillIndex"
                      class="editor-collection__item"
                    >
                      <v-text-field
                        v-model="category.skills[skillIndex]"
                        label="Nom de la compétence"
                        required
                        variant="outlined"
                        density="comfortable"
                        class="flex-grow-1"
                      />
                      <v-btn
                        icon="mdi-delete"
                        variant="text"
                        color="error"
                        @click="removeSkill(categoryIndex, skillIndex)"
                      />
                    </div>
                  </div>
                  <p
                    v-else
                    class="text-body-2 text-medium-emphasis"
                  >
                    Aucune compétence.
                  </p>
                </v-card>
              </div>
              <p
                v-else
                class="text-body-2 text-medium-emphasis"
              >
                Aucune catégorie définie.
              </p>
              <div class="editor-section__heading mt-6">
                <h2 class="editor-section__title">Langues</h2>
                <v-btn
                  color="primary"
                  variant="tonal"
                  class="text-none"
                  @click="addLanguage"
                >
                  Ajouter une langue
                </v-btn>
              </div>
              <div
                v-if="form.languages?.length"
                class="editor-collection"
              >
                <v-card
                  v-for="(language, index) in form.languages"
                  :key="index"
                  variant="tonal"
                  color="primary"
                  class="editor-subcard"
                >
                  <div class="d-flex justify-space-between align-center mb-3">
                    <span class="text-caption">Langue #{{ index + 1 }}</span>
                    <v-btn
                      icon="mdi-delete"
                      variant="text"
                      color="error"
                      @click="removeLanguage(index)"
                    />
                  </div>
                  <v-text-field
                    v-model="form.languages[index]"
                    label="Nom de la langue"
                    required
                    variant="outlined"
                    density="comfortable"
                  />
                </v-card>
              </div>
              <p
                v-else
                class="text-body-2 text-medium-emphasis"
              >
                Aucune langue définie.
              </p>
              <div class="editor-section__heading mt-6">
                <h2 class="editor-section__title">Niveaux de langues</h2>
                <v-btn
                  color="primary"
                  variant="tonal"
                  class="text-none"
                  @click="addLanguageProficiency"
                >
                  Ajouter un niveau
                </v-btn>
              </div>
              <div
                v-if="form.languageProficiencies?.length"
                class="editor-collection"
              >
                <v-card
                  v-for="(entry, index) in form.languageProficiencies"
                  :key="index"
                  variant="tonal"
                  color="primary"
                  class="editor-subcard"
                >
                  <div class="d-flex justify-space-between align-center mb-3">
                    <span class="text-caption">Langue #{{ index + 1 }}</span>
                    <v-btn
                      icon="mdi-delete"
                      variant="text"
                      color="error"
                      @click="removeLanguageProficiency(index)"
                    />
                  </div>
                  <v-text-field
                    v-model="form.languageProficiencies[index].name"
                    label="Nom de la langue"
                    required
                    variant="outlined"
                    density="comfortable"
                  />
                  <v-text-field
                    v-model.number="form.languageProficiencies[index].proficiency"
                    type="number"
                    label="Maîtrise (%)"
                    min="0"
                    max="100"
                    step="5"
                    required
                    variant="outlined"
                    density="comfortable"
                  />
                </v-card>
              </div>
              <p
                v-else
                class="text-body-2 text-medium-emphasis"
              >
                Aucun niveau de langue défini.
              </p>
            </template>

            <template v-else-if="slug === 'experiences'">
              <v-text-field
                v-model="form.label"
                label="Libellé"
                required
                variant="outlined"
                density="comfortable"
              />
              <v-text-field
                v-model="form.headline"
                label="Titre"
                required
                variant="outlined"
                density="comfortable"
              />
              <div class="editor-section__heading">
                <h2 class="editor-section__title">Expériences</h2>
                <v-btn
                  color="primary"
                  variant="tonal"
                  class="text-none"
                  @click="addExperience"
                >
                  Ajouter une expérience
                </v-btn>
              </div>
              <div
                v-if="form.positions?.length"
                class="editor-collection"
              >
                <v-card
                  v-for="(position, index) in form.positions"
                  :key="position.slug || index"
                  variant="tonal"
                  color="primary"
                  class="editor-subcard"
                >
                  <div class="d-flex justify-space-between align-center mb-3">
                    <span class="text-caption">Expérience #{{ index + 1 }}</span>
                    <v-btn
                      icon="mdi-delete"
                      variant="text"
                      color="error"
                      @click="removeExperience(index)"
                    />
                  </div>
                  <v-text-field
                    v-model="position.role"
                    label="Rôle"
                    required
                    variant="outlined"
                    density="comfortable"
                  />
                  <v-text-field
                    v-model="position.slug"
                    label="Identifiant (slug)"
                    required
                    variant="outlined"
                    density="comfortable"
                  />
                  <v-text-field
                    v-model="position.company"
                    label="Entreprise"
                    required
                    variant="outlined"
                    density="comfortable"
                  />
                  <v-text-field
                    v-model="position.timeframe"
                    label="Période"
                    required
                    variant="outlined"
                    density="comfortable"
                  />
                  <div class="editor-section__heading">
                    <span class="text-body-2">Réalisations</span>
                    <v-btn
                      icon="mdi-plus"
                      variant="text"
                      color="primary"
                      @click="addAchievement(index)"
                    />
                  </div>
                  <div
                    v-if="position.achievements?.length"
                    class="editor-collection editor-collection--compact"
                  >
                    <div
                      v-for="(achievement, achievementIndex) in position.achievements"
                      :key="achievementIndex"
                      class="editor-collection__item"
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
                      <v-btn
                        icon="mdi-delete"
                        variant="text"
                        color="error"
                        @click="removeAchievement(index, achievementIndex)"
                      />
                    </div>
                  </div>
                  <p
                    v-else
                    class="text-body-2 text-medium-emphasis"
                  >
                    Aucune réalisation.
                  </p>
                </v-card>
              </div>
              <p
                v-else
                class="text-body-2 text-medium-emphasis"
              >
                Aucune expérience.
              </p>
            </template>

            <template v-else-if="slug === 'education'">
              <v-text-field
                v-model="form.label"
                label="Libellé"
                required
                variant="outlined"
                density="comfortable"
              />
              <v-text-field
                v-model="form.headline"
                label="Titre"
                required
                variant="outlined"
                density="comfortable"
              />
              <div class="editor-section__heading">
                <h2 class="editor-section__title">Formations</h2>
                <v-btn
                  color="primary"
                  variant="tonal"
                  class="text-none"
                  @click="addEducation"
                >
                  Ajouter une formation
                </v-btn>
              </div>
              <div
                v-if="form.schools?.length"
                class="editor-collection"
              >
                <v-card
                  v-for="(school, index) in form.schools"
                  :key="school.slug || index"
                  variant="tonal"
                  color="primary"
                  class="editor-subcard"
                >
                  <div class="d-flex justify-space-between align-center mb-3">
                    <span class="text-caption">Formation #{{ index + 1 }}</span>
                    <v-btn
                      icon="mdi-delete"
                      variant="text"
                      color="error"
                      @click="removeEducation(index)"
                    />
                  </div>
                  <v-text-field
                    v-model="school.degree"
                    label="Diplôme"
                    required
                    variant="outlined"
                    density="comfortable"
                  />
                  <v-text-field
                    v-model="school.slug"
                    label="Identifiant (slug)"
                    required
                    variant="outlined"
                    density="comfortable"
                  />
                  <v-text-field
                    v-model="school.institution"
                    label="Établissement"
                    required
                    variant="outlined"
                    density="comfortable"
                  />
                  <v-text-field
                    v-model="school.timeframe"
                    label="Période"
                    required
                    variant="outlined"
                    density="comfortable"
                  />
                  <v-textarea
                    v-model="school.details"
                    label="Détails"
                    rows="3"
                    required
                    variant="outlined"
                    density="comfortable"
                  />
                </v-card>
              </div>
              <p
                v-else
                class="text-body-2 text-medium-emphasis"
              >
                Aucune formation.
              </p>
            </template>

            <div class="editor-form__footer">
              <v-btn
                :to="'/admin'"
                variant="tonal"
                color="primary"
                class="text-none"
              >
                Annuler
              </v-btn>
              <v-btn
                type="submit"
                color="primary"
                class="text-none"
                :loading="saveState.isSaving"
              >
                Enregistrer
              </v-btn>
            </div>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ZodError } from "zod";
import { showError } from "#app";
import { contentSchemas, isContentSlug, type ContentSlug } from "~/types/content";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type LocaleCode } from "~/utils/i18n/locales";

definePageMeta({
  middleware: "auth",
  layout: "admin",
});

const route = useRoute();
const runtimeConfig = useRuntimeConfig();
const slugParam = computed(() => route.params.slug?.toString() ?? "");

if (!isContentSlug(slugParam.value)) {
  showError({ statusCode: 404, statusMessage: "Section introuvable." });
}

const slug = computed(() => slugParam.value as ContentSlug);

const localeLabels: Record<LocaleCode, string> = {
  en: "English",
  fr: "Français",
  de: "Deutsch",
  es: "Español",
  it: "Italiano",
  ru: "Русский",
  ar: "العربية",
};

const localeItems = SUPPORTED_LOCALES.map((code) => ({
  value: code,
  title: localeLabels[code] ?? code.toUpperCase(),
}));

const selectedLocale = ref<LocaleCode>(DEFAULT_LOCALE);

const titles: Record<ContentSlug, string> = {
  contact: "Contact",
  profile: "Profil",
  hero: "Section personnelle",
  service: "Compétences",
  work: "Projets",
  about: "À propos",
  cta: "Appel à l’action",
  navlinks: "Navigation",
  skills: "Compétences",
  experiences: "Expériences",
  education: "Formations",
};

const { data, pending, refresh, error } = await useAsyncData(
  () => `admin-content-${slug.value}-${selectedLocale.value}`,
  () => $fetch(`/api/content/${slug.value}`, { query: { locale: selectedLocale.value } }),
  { watch: [slug, selectedLocale] },
);

const form = reactive<Record<string, any>>({});
const saveState = reactive({
  isSaving: false,
  success: "",
  errors: [] as string[],
});

watch(
  data,
  (value) => {
    if (!value) {
      return;
    }
    saveState.success = "";
    saveState.errors = [];
    let clone: Record<string, any>;
    try {
      clone =
        typeof structuredClone === "function"
          ? structuredClone(value)
          : JSON.parse(JSON.stringify(value));
    } catch {
      clone = JSON.parse(JSON.stringify(value));
    }
    Object.keys(form).forEach((key) => {
      delete form[key];
    });
    Object.assign(form, clone);
  },
  { immediate: true },
);

const csrfCookie = useCookie<string | null>(runtimeConfig.public.auth.csrfCookieName);

function addNavlink() {
  form.navlinks ??= [];
  form.navlinks.push({ label: "", url: "" });
}

function removeNavlink(index: number) {
  form.navlinks.splice(index, 1);
}

function addService() {
  form.services ??= [];
  form.services.push({ name: "", icon: "", description: "", thumbnails: "" });
}

function removeService(index: number) {
  form.services.splice(index, 1);
}

function addWork() {
  form.works ??= [];
  form.works.push({
    name: "",
    slug: "",
    live_demo: "",
    description: "",
    thumbnails: "",
    type: "",
  });
}

function removeWork(index: number) {
  form.works.splice(index, 1);
}

function addIntroduce() {
  form.introduce ??= [];
  form.introduce.push("");
}

function removeIntroduce(index: number) {
  form.introduce.splice(index, 1);
}

function addHobby() {
  form.hobbies ??= [];
  form.hobbies.push("");
}

function removeHobby(index: number) {
  form.hobbies.splice(index, 1);
}

function addSkillCategory() {
  form.categories ??= [];
  form.categories.push({ name: "", skills: [""] });
}

function removeSkillCategory(index: number) {
  form.categories.splice(index, 1);
}

function addSkill(categoryIndex: number) {
  form.categories[categoryIndex].skills.push("");
}

function removeSkill(categoryIndex: number, skillIndex: number) {
  form.categories[categoryIndex].skills.splice(skillIndex, 1);
}

function addLanguage() {
  form.languages ??= [];
  form.languages.push("");
}

function removeLanguage(index: number) {
  form.languages.splice(index, 1);
}

function addLanguageProficiency() {
  form.languageProficiencies ??= [];
  form.languageProficiencies.push({ name: "", proficiency: 0 });
}

function removeLanguageProficiency(index: number) {
  form.languageProficiencies.splice(index, 1);
}

function addExperience() {
  form.positions ??= [];
  form.positions.push({ slug: "", role: "", company: "", timeframe: "", achievements: [""] });
}

function removeExperience(index: number) {
  form.positions.splice(index, 1);
}

function addAchievement(positionIndex: number) {
  form.positions[positionIndex].achievements.push("");
}

function removeAchievement(positionIndex: number, achievementIndex: number) {
  form.positions[positionIndex].achievements.splice(achievementIndex, 1);
}

function addEducation() {
  form.schools ??= [];
  form.schools.push({ slug: "", degree: "", institution: "", timeframe: "", details: "" });
}

function removeEducation(index: number) {
  form.schools.splice(index, 1);
}

async function handleSubmit() {
  saveState.isSaving = true;
  saveState.success = "";
  saveState.errors = [];

  try {
    const schema = contentSchemas[slug.value];
    const payload = schema.parse(form);
    await $fetch(`/api/content/${slug.value}`, {
      method: "PUT",
      body: payload,
      query: { locale: selectedLocale.value },
      headers: {
        "x-csrf-token": csrfCookie.value ?? "",
      },
    });
    saveState.success = "Contenu mis à jour avec succès.";
    await refresh();
  } catch (err: any) {
    if (err instanceof ZodError) {
      saveState.errors = err.errors.map((issue) => issue.message);
    } else if (err?.data?.statusMessage) {
      saveState.errors = [err.data.statusMessage];
    } else {
      saveState.errors = ["Impossible d’enregistrer les modifications."];
    }
  } finally {
    saveState.isSaving = false;
  }
}
</script>

<style scoped>
.admin-editor {
  position: relative;
  padding-bottom: 16px;
  border-radius: 32px 32px 0 0;
  overflow: hidden;
}

.admin-editor > * {
  position: relative;
}

.editor-card {
  position: relative;
  overflow: hidden;
  border-radius: 28px;
  padding: clamp(24px, 5vw, 36px);
  background: rgba(15, 23, 42, 0.72);
  border: 1px solid rgba(96, 165, 250, 0.15);
  box-shadow: 0 30px 60px -45px rgba(15, 23, 42, 0.9);
  backdrop-filter: blur(18px);
}

.editor-card::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(140deg, rgba(59, 130, 246, 0.18), rgba(129, 140, 248, 0.08));
  opacity: 0.6;
  pointer-events: none;
}

.editor-card > * {
  position: relative;
  z-index: 1;
}

.editor-card--header {
  display: flex;
}

.editor-card__content {
  width: 100%;
}

.editor-card__title {
  margin: 16px 0 0;
  font-size: clamp(1.875rem, 3vw, 2.35rem);
  font-weight: 700;
  color: #e2e8f0;
}

.editor-card__back {
  align-self: flex-start;
  letter-spacing: 0.08em;
}

.editor-card__hint {
  max-width: 240px;
}

.editor-card__locale {
  min-width: 220px;
}

.editor-card__aside {
  align-items: flex-end !important;
}

.editor-card__error {
  color: var(--v-theme-error);
}

.editor-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.editor-form__alert {
  border-radius: 20px;
}

.editor-form__footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.editor-section__heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.editor-section__title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: rgba(226, 232, 240, 0.92);
}

.editor-collection {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.editor-collection--compact {
  gap: 12px;
}

.editor-collection__item {
  display: flex;
  gap: 12px;
  align-items: stretch;
}

.editor-subcard {
  padding: 20px;
  border-radius: 20px;
  border: 1px solid rgba(59, 130, 246, 0.2);
  background: rgba(37, 99, 235, 0.12);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
}

.editor-subcard :deep(.v-btn--variant-text) {
  border-radius: 14px;
}

:deep(.editor-card .v-input .v-field) {
  border-radius: 18px;
}

:deep(.editor-card .v-alert) {
  background: rgba(37, 99, 235, 0.12);
}

.editor-form__footer .v-btn {
  border-radius: 999px;
  padding-inline: 24px;
}

@media (max-width: 959px) {
  .editor-card__aside {
    align-items: flex-start !important;
  }

  .editor-card__hint {
    max-width: none;
    text-align: left !important;
  }

  .editor-card__locale {
    width: 100%;
  }

  .editor-form__footer {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
