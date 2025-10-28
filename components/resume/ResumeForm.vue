<template>
  <v-card
    class="resume-form"
    elevation="0"
    rounded="xl"
  >
    <v-card-item>
      <v-card-title class="text-h5 font-weight-bold">Générateur de contenu</v-card-title>
      <v-card-subtitle class="text-body-2 text-medium-emphasis">
        Remplissez vos informations, choisissez un template et personnalisez les couleurs. Les données sont sauvegardées
        automatiquement dans votre navigateur.
      </v-card-subtitle>
    </v-card-item>

    <v-divider class="my-4" />

    <v-card-text>
      <v-alert
        v-if="!resumeStore.isHydrated"
        type="info"
        variant="tonal"
        border="start"
        border-color="primary"
        class="mb-4"
      >
        Chargement de vos données locales…
      </v-alert>

      <v-form class="resume-form__content">
        <v-expansion-panels
          multiple
          class="resume-form__panels"
          variant="accordion"
          density="comfortable"
        >
          <v-expansion-panel value="personal">
            <v-expansion-panel-title class="resume-form__panel-title">
              <div>
                <div class="text-subtitle-1 font-weight-medium">Profil</div>
                <div class="text-body-2 text-medium-emphasis">Nom, fonction, résumé et coordonnées principales.</div>
              </div>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <div class="resume-form__grid">
                <v-text-field
                  v-model="resume.personal.firstName"
                  label="Prénom"
                  variant="outlined"
                  density="comfortable"
                />
                <v-text-field
                  v-model="resume.personal.lastName"
                  label="Nom"
                  variant="outlined"
                  density="comfortable"
                />
                <v-text-field
                  v-model="resume.personal.headline"
                  label="Titre professionnel"
                  variant="outlined"
                  density="comfortable"
                  class="resume-form__grid-span"
                />
                <v-textarea
                  v-model="resume.personal.summary"
                  label="Résumé"
                  variant="outlined"
                  rows="4"
                  auto-grow
                  class="resume-form__grid-span"
                />
                <v-text-field
                  v-model="resume.personal.email"
                  label="Email"
                  type="email"
                  variant="outlined"
                  density="comfortable"
                />
                <v-text-field
                  v-model="resume.personal.phone"
                  label="Téléphone"
                  variant="outlined"
                  density="comfortable"
                />
                <v-text-field
                  v-model="resume.personal.location"
                  label="Localisation"
                  variant="outlined"
                  density="comfortable"
                />
                <v-text-field
                  v-model="resume.personal.website"
                  label="Site web"
                  variant="outlined"
                  density="comfortable"
                />
                <v-text-field
                  v-model="resume.personal.linkedin"
                  label="LinkedIn"
                  variant="outlined"
                  density="comfortable"
                />
                <v-text-field
                  v-model="resume.personal.github"
                  label="GitHub"
                  variant="outlined"
                  density="comfortable"
                />
              </div>
            </v-expansion-panel-text>
          </v-expansion-panel>

          <v-expansion-panel value="experiences">
            <v-expansion-panel-title class="resume-form__panel-title">
              <div>
                <div class="text-subtitle-1 font-weight-medium">Expériences</div>
                <div class="text-body-2 text-medium-emphasis">Ajoutez vos rôles clés et vos réalisations.</div>
              </div>
              <v-btn
                color="primary"
                variant="tonal"
                density="comfortable"
                size="small"
                class="ml-auto"
                @click.stop="resumeStore.addExperience"
              >
                Ajouter
              </v-btn>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-alert
                v-if="resume.experiences.length === 0"
                type="info"
                variant="tonal"
                class="mb-4"
              >
                Aucune expérience pour l’instant. Ajoutez vos missions principales pour enrichir le CV.
              </v-alert>

              <v-card
                v-for="experience in resume.experiences"
                :key="experience.id"
                class="resume-form__item"
                rounded="lg"
                variant="outlined"
              >
                <v-card-item>
                  <div class="resume-form__item-header">
                    <div class="resume-form__item-title">{{ experience.position }} – {{ experience.company }}</div>
                    <v-btn
                      icon="mdi-delete"
                      variant="text"
                      size="small"
                      color="error"
                      @click="resumeStore.removeExperience(experience.id)"
                    />
                  </div>

                  <div class="resume-form__item-grid">
                    <v-text-field
                      v-model="experience.position"
                      label="Poste"
                      variant="outlined"
                      density="comfortable"
                    />
                    <v-text-field
                      v-model="experience.company"
                      label="Entreprise"
                      variant="outlined"
                      density="comfortable"
                    />
                    <v-text-field
                      v-model="experience.location"
                      label="Lieu"
                      variant="outlined"
                      density="comfortable"
                    />
                    <v-text-field
                      v-model="experience.startDate"
                      label="Début"
                      variant="outlined"
                      density="comfortable"
                    />
                    <v-text-field
                      v-model="experience.endDate"
                      label="Fin"
                      variant="outlined"
                      density="comfortable"
                    />
                    <v-textarea
                      v-model="experience.description"
                      label="Description"
                      variant="outlined"
                      rows="3"
                      auto-grow
                      class="resume-form__item-span"
                    />
                  </div>

                  <div class="resume-form__subsection">
                    <div class="resume-form__subsection-header">
                      <span class="text-body-2 font-weight-medium">Réalisations</span>
                      <v-btn
                        color="primary"
                        variant="text"
                        size="small"
                        @click="resumeStore.addExperienceHighlight(experience.id)"
                      >
                        Ajouter une ligne
                      </v-btn>
                    </div>
                    <div class="resume-form__subsection-content">
                      <div
                        v-for="highlight in experience.highlights"
                        :key="highlight.id"
                        class="resume-form__highlight"
                      >
                        <v-textarea
                          v-model="highlight.text"
                          label="Détail"
                          variant="outlined"
                          rows="2"
                          auto-grow
                        />
                        <v-btn
                          icon="mdi-close"
                          variant="text"
                          size="small"
                          color="error"
                          @click="resumeStore.removeExperienceHighlight(experience.id, highlight.id)"
                        />
                      </div>
                    </div>
                  </div>
                </v-card-item>
              </v-card>
            </v-expansion-panel-text>
          </v-expansion-panel>

          <v-expansion-panel value="education">
            <v-expansion-panel-title class="resume-form__panel-title">
              <div>
                <div class="text-subtitle-1 font-weight-medium">Formation</div>
                <div class="text-body-2 text-medium-emphasis">Ajoutez vos diplômes et certifications.</div>
              </div>
              <v-btn
                color="primary"
                variant="tonal"
                density="comfortable"
                size="small"
                class="ml-auto"
                @click.stop="resumeStore.addEducation"
              >
                Ajouter
              </v-btn>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-card
                v-for="school in resume.education"
                :key="school.id"
                class="resume-form__item"
                rounded="lg"
                variant="outlined"
              >
                <v-card-item>
                  <div class="resume-form__item-header">
                    <div class="resume-form__item-title">{{ school.degree }} – {{ school.institution }}</div>
                    <v-btn
                      icon="mdi-delete"
                      variant="text"
                      size="small"
                      color="error"
                      @click="resumeStore.removeEducation(school.id)"
                    />
                  </div>

                  <div class="resume-form__item-grid">
                    <v-text-field
                      v-model="school.degree"
                      label="Diplôme"
                      variant="outlined"
                      density="comfortable"
                    />
                    <v-text-field
                      v-model="school.institution"
                      label="Établissement"
                      variant="outlined"
                      density="comfortable"
                    />
                    <v-text-field
                      v-model="school.location"
                      label="Lieu"
                      variant="outlined"
                      density="comfortable"
                    />
                    <v-text-field
                      v-model="school.startDate"
                      label="Début"
                      variant="outlined"
                      density="comfortable"
                    />
                    <v-text-field
                      v-model="school.endDate"
                      label="Fin"
                      variant="outlined"
                      density="comfortable"
                    />
                    <v-textarea
                      v-model="school.details"
                      label="Détails"
                      variant="outlined"
                      rows="3"
                      auto-grow
                      class="resume-form__item-span"
                    />
                  </div>
                </v-card-item>
              </v-card>
            </v-expansion-panel-text>
          </v-expansion-panel>

          <v-expansion-panel value="skills">
            <v-expansion-panel-title class="resume-form__panel-title">
              <div>
                <div class="text-subtitle-1 font-weight-medium">Compétences</div>
                <div class="text-body-2 text-medium-emphasis">Listez vos expertises principales.</div>
              </div>
              <v-btn
                color="primary"
                variant="tonal"
                density="comfortable"
                size="small"
                class="ml-auto"
                @click.stop="resumeStore.addSkill"
              >
                Ajouter
              </v-btn>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-alert
                v-if="resume.skills.length === 0"
                type="info"
                variant="tonal"
                class="mb-4"
              >
                Ajoutez au moins trois compétences pour équilibrer votre CV.
              </v-alert>

              <v-row dense>
                <v-col
                  v-for="skill in resume.skills"
                  :key="skill.id"
                  cols="12"
                  md="6"
                >
                  <v-card
                    rounded="lg"
                    variant="outlined"
                    class="pa-4 d-flex flex-column gap-3"
                  >
                    <v-text-field
                      v-model="skill.name"
                      label="Compétence"
                      variant="outlined"
                      density="comfortable"
                    />
                    <v-text-field
                      v-model="skill.level"
                      label="Niveau"
                      variant="outlined"
                      density="comfortable"
                    />
                    <v-btn
                      color="error"
                      variant="text"
                      size="small"
                      class="align-self-end"
                      @click="resumeStore.removeSkill(skill.id)"
                    >
                      Supprimer
                    </v-btn>
                  </v-card>
                </v-col>
              </v-row>
            </v-expansion-panel-text>
          </v-expansion-panel>

          <v-expansion-panel value="projects">
            <v-expansion-panel-title class="resume-form__panel-title">
              <div>
                <div class="text-subtitle-1 font-weight-medium">Projets</div>
                <div class="text-body-2 text-medium-emphasis">Présentez quelques réalisations marquantes.</div>
              </div>
              <v-btn
                color="primary"
                variant="tonal"
                density="comfortable"
                size="small"
                class="ml-auto"
                @click.stop="resumeStore.addProject"
              >
                Ajouter
              </v-btn>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-row dense>
                <v-col
                  v-for="project in resume.projects"
                  :key="project.id"
                  cols="12"
                  md="6"
                >
                  <v-card
                    rounded="lg"
                    variant="outlined"
                    class="pa-4 d-flex flex-column gap-3"
                  >
                    <v-text-field
                      v-model="project.name"
                      label="Nom du projet"
                      variant="outlined"
                      density="comfortable"
                    />
                    <v-textarea
                      v-model="project.description"
                      label="Description"
                      rows="3"
                      auto-grow
                      variant="outlined"
                    />
                    <v-text-field
                      v-model="project.link"
                      label="Lien"
                      variant="outlined"
                      density="comfortable"
                    />
                    <v-btn
                      color="error"
                      variant="text"
                      size="small"
                      class="align-self-end"
                      @click="resumeStore.removeProject(project.id)"
                    >
                      Supprimer
                    </v-btn>
                  </v-card>
                </v-col>
              </v-row>
            </v-expansion-panel-text>
          </v-expansion-panel>

          <v-expansion-panel value="interests">
            <v-expansion-panel-title class="resume-form__panel-title">
              <div>
                <div class="text-subtitle-1 font-weight-medium">Centres d’intérêt</div>
                <div class="text-body-2 text-medium-emphasis">Quelques passions pour humaniser votre profil.</div>
              </div>
              <v-btn
                color="primary"
                variant="tonal"
                density="comfortable"
                size="small"
                class="ml-auto"
                @click.stop="resumeStore.addInterest"
              >
                Ajouter
              </v-btn>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <div class="resume-form__interests">
                <div
                  v-for="(interest, index) in resume.interests"
                  :key="`${interest}-${index}`"
                  class="resume-form__interest"
                >
                  <v-text-field
                    :model-value="interest"
                    label="Intérêt"
                    variant="outlined"
                    density="comfortable"
                    @update:model-value="resumeStore.updateInterest(index, $event)"
                  />
                  <v-btn
                    icon="mdi-close"
                    variant="text"
                    size="small"
                    color="error"
                    @click="resumeStore.removeInterest(index)"
                  />
                </div>
              </div>
            </v-expansion-panel-text>
          </v-expansion-panel>

          <v-expansion-panel value="socials">
            <v-expansion-panel-title class="resume-form__panel-title">
              <div>
                <div class="text-subtitle-1 font-weight-medium">Réseaux & liens</div>
                <div class="text-body-2 text-medium-emphasis">Ajoutez les plateformes sur lesquelles on peut vous retrouver.</div>
              </div>
              <v-btn
                color="primary"
                variant="tonal"
                density="comfortable"
                size="small"
                class="ml-auto"
                @click.stop="resumeStore.addSocial"
              >
                Ajouter
              </v-btn>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-row dense>
                <v-col
                  v-for="social in resume.socials"
                  :key="social.id"
                  cols="12"
                  md="6"
                >
                  <v-card
                    rounded="lg"
                    variant="outlined"
                    class="pa-4 d-flex flex-column gap-3"
                  >
                    <v-text-field
                      v-model="social.label"
                      label="Libellé"
                      variant="outlined"
                      density="comfortable"
                    />
                    <v-text-field
                      v-model="social.url"
                      label="Lien"
                      variant="outlined"
                      density="comfortable"
                    />
                    <v-btn
                      color="error"
                      variant="text"
                      size="small"
                      class="align-self-end"
                      @click="resumeStore.removeSocial(social.id)"
                    >
                      Supprimer
                    </v-btn>
                  </v-card>
                </v-col>
              </v-row>
            </v-expansion-panel-text>
          </v-expansion-panel>

          <v-expansion-panel value="design">
            <v-expansion-panel-title class="resume-form__panel-title">
              <div>
                <div class="text-subtitle-1 font-weight-medium">Design & couleurs</div>
                <div class="text-body-2 text-medium-emphasis">Sélectionnez un template et adaptez la palette.</div>
              </div>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <div class="resume-form__template-picker">
                <span class="text-body-2 text-medium-emphasis">Template</span>
                <v-btn-toggle
                  v-model="resume.template"
                  mandatory
                  class="resume-form__template-toggle"
                  color="primary"
                >
                  <v-btn
                    v-for="option in resumeStore.templateOptions"
                    :key="option.id"
                    :value="option.id"
                    class="resume-form__template-option"
                    size="small"
                  >
                    <div class="resume-form__template-label">
                      <span class="font-weight-medium">{{ option.name }}</span>
                      <span class="text-caption text-medium-emphasis">{{ option.description }}</span>
                    </div>
                  </v-btn>
                </v-btn-toggle>
              </div>

              <div class="resume-form__colors">
                <div class="resume-form__color-field">
                  <label for="resume-color-primary">Couleur principale</label>
                  <input
                    id="resume-color-primary"
                    v-model="resume.colors.primary"
                    type="color"
                    class="resume-form__color-input"
                  />
                </div>
                <div class="resume-form__color-field">
                  <label for="resume-color-secondary">Couleur secondaire</label>
                  <input
                    id="resume-color-secondary"
                    v-model="resume.colors.secondary"
                    type="color"
                    class="resume-form__color-input"
                  />
                </div>
                <div class="resume-form__color-field">
                  <label for="resume-color-background">Fond</label>
                  <input
                    id="resume-color-background"
                    v-model="resume.colors.background"
                    type="color"
                    class="resume-form__color-input"
                  />
                </div>
                <div class="resume-form__color-field">
                  <label for="resume-color-surface">Surface</label>
                  <input
                    id="resume-color-surface"
                    v-model="resume.colors.surface"
                    type="color"
                    class="resume-form__color-input"
                  />
                </div>
                <div class="resume-form__color-field">
                  <label for="resume-color-text">Texte</label>
                  <input
                    id="resume-color-text"
                    v-model="resume.colors.text"
                    type="color"
                    class="resume-form__color-input"
                  />
                </div>
              </div>

              <v-btn
                color="primary"
                variant="text"
                class="mt-4"
                @click="resumeStore.reset"
              >
                Réinitialiser avec un exemple complet
              </v-btn>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useResumeStore } from "~/stores/resume";

const resumeStore = useResumeStore();

const { resume } = storeToRefs(resumeStore);
</script>

<style scoped>
.resume-form {
  display: flex;
  flex-direction: column;
}

.resume-form__content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.resume-form__panels {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.resume-form__panel-title {
  align-items: flex-start;
  gap: 16px;
}

.resume-form__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.resume-form__grid-span {
  grid-column: 1 / -1;
}

.resume-form__item {
  margin-bottom: 20px;
}

.resume-form__item:last-of-type {
  margin-bottom: 0;
}

.resume-form__item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

.resume-form__item-title {
  font-weight: 600;
  font-size: 15px;
}

.resume-form__item-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.resume-form__item-span {
  grid-column: 1 / -1;
}

.resume-form__subsection {
  margin-top: 20px;
  border-top: 1px solid rgba(148, 163, 184, 0.35);
  padding-top: 16px;
}

.resume-form__subsection-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.resume-form__subsection-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.resume-form__highlight {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.resume-form__interests {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.resume-form__interest {
  display: flex;
  align-items: center;
  gap: 8px;
}

.resume-form__template-picker {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.resume-form__template-toggle {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.resume-form__template-option {
  display: flex;
  align-items: flex-start;
  text-transform: none;
  height: auto;
  padding: 12px 14px;
  min-width: 180px;
}

.resume-form__template-label {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}

.resume-form__colors {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 16px;
  margin-top: 24px;
}

.resume-form__color-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
  color: rgb(71 85 105);
}

.resume-form__color-input {
  width: 100%;
  height: 40px;
  border: 1px solid rgba(148, 163, 184, 0.4);
  border-radius: 12px;
  padding: 4px;
  background: #ffffff;
}

@media (max-width: 960px) {
  .resume-form__panel-title {
    flex-direction: column;
    align-items: flex-start;
  }

  .resume-form__item-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
