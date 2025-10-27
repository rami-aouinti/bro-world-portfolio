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
                {{ t("admin.editor.backToDashboard") }}
              </v-btn>
              <h1 class="editor-card__title">{{ sectionTitle }}</h1>
            </div>
            <div
              class="editor-card__aside d-flex flex-column align-end"
              style="gap: 12px"
            >
              <p class="text-body-2 text-medium-emphasis text-end editor-card__hint">
                {{ t("admin.editor.autosaveHint") }}
              </p>
              <v-select
                v-model="selectedLocale"
                :items="localeItems"
                item-title="title"
                item-value="value"
                :label="t('admin.editor.localeSelectorLabel')"
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
            {{ t("admin.editor.loading") }}
          </div>
          <div
            v-else-if="error"
            class="py-10 text-center editor-card__error"
          >
            {{ t("admin.editor.loadError") }}
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
              <p class="font-weight-medium mb-2">{{ t("admin.editor.validation.title") }}</p>
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
                    :label="t('admin.editor.fields.profile.firstname')"
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
                    :label="t('admin.editor.fields.profile.lastname')"
                    required
                    variant="outlined"
                    density="comfortable"
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="form.role"
                    :label="t('admin.editor.fields.profile.role')"
                    required
                    variant="outlined"
                    density="comfortable"
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="form.avatar"
                    :label="t('admin.editor.fields.profile.avatar')"
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
                :label="t('admin.editor.fields.hero.badge')"
                required
                variant="outlined"
                density="comfortable"
              />
              <v-text-field
                v-model="form.headline"
                :label="t('admin.editor.fields.hero.headline')"
                required
                variant="outlined"
                density="comfortable"
              />
              <v-textarea
                v-model="form.subline"
                :label="t('admin.editor.fields.hero.subline')"
                rows="4"
                required
                variant="outlined"
                density="comfortable"
              />
            </template>

            <template v-else-if="slug === 'service'">
              <v-text-field
                v-model="form.label"
                :label="t('admin.editor.fields.common.label')"
                required
                variant="outlined"
                density="comfortable"
              />
              <v-text-field
                v-model="form.headline"
                :label="t('admin.editor.fields.common.title')"
                required
                variant="outlined"
                density="comfortable"
              />
              <v-textarea
                v-model="form.subline"
                :label="t('admin.editor.fields.common.description')"
                rows="4"
                required
                variant="outlined"
                density="comfortable"
              />
              <div class="editor-section__heading">
                <h2 class="editor-section__title">{{ t('admin.editor.sections.service.listTitle') }}</h2>
                <v-btn
                  color="primary"
                  variant="tonal"
                  class="text-none"
                  @click="addService"
                >
                  {{ t('admin.editor.buttons.addService') }}
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
                    <span class="text-caption">{{ t('admin.editor.entries.service', { index: index + 1 }) }}</span>
                    <v-btn
                      icon="mdi-delete"
                      variant="text"
                      color="error"
                      @click="removeService(index)"
                    />
                  </div>
                  <v-text-field
                    v-model="service.name"
                    :label="t('admin.editor.fields.common.name')"
                    required
                    variant="outlined"
                    density="comfortable"
                  />
                  <v-text-field
                    v-model="service.icon"
                    :label="t('admin.editor.fields.service.icon')"
                    required
                    variant="outlined"
                    density="comfortable"
                  />
                  <v-textarea
                    v-model="service.description"
                    :label="t('admin.editor.fields.common.description')"
                    rows="3"
                    required
                    variant="outlined"
                    density="comfortable"
                  />
                  <v-text-field
                    v-model="service.thumbnails"
                    :label="t('admin.editor.fields.service.thumbnailOptional')"
                    variant="outlined"
                    density="comfortable"
                  />
                </v-card>
              </div>
              <p
                v-else
                class="text-body-2 text-medium-emphasis"
              >
                {{ t('admin.editor.empty.services') }}
              </p>
            </template>

            <template v-else-if="slug === 'work'">
              <v-text-field
                v-model="form.label"
                :label="t('admin.editor.fields.common.label')"
                required
                variant="outlined"
                density="comfortable"
              />
              <v-text-field
                v-model="form.headline"
                :label="t('admin.editor.fields.common.title')"
                required
                variant="outlined"
                density="comfortable"
              />
              <v-textarea
                v-model="form.subline"
                :label="t('admin.editor.fields.common.description')"
                rows="4"
                required
                variant="outlined"
                density="comfortable"
              />
              <div class="editor-section__heading">
                <h2 class="editor-section__title">{{ t('admin.editor.sections.work.listTitle') }}</h2>
                <v-btn
                  color="primary"
                  variant="tonal"
                  class="text-none"
                  @click="addWork"
                >
                  {{ t('admin.editor.buttons.addProject') }}
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
                    <span class="text-caption">{{ t('admin.editor.entries.project', { index: index + 1 }) }}</span>
                    <v-btn
                      icon="mdi-delete"
                      variant="text"
                      color="error"
                      @click="removeWork(index)"
                    />
                  </div>
                  <v-text-field
                    v-model="project.name"
                    :label="t('admin.editor.fields.common.name')"
                    required
                    variant="outlined"
                    density="comfortable"
                  />
                  <v-text-field
                    v-model="project.slug"
                    :label="t('admin.editor.fields.common.slug')"
                    required
                    variant="outlined"
                    density="comfortable"
                  />
                  <v-text-field
                    v-model="project.live_demo"
                    :label="t('admin.editor.fields.work.demo')"
                    required
                    variant="outlined"
                    density="comfortable"
                  />
                  <v-textarea
                    v-model="project.description"
                    :label="t('admin.editor.fields.common.description')"
                    rows="3"
                    required
                    variant="outlined"
                    density="comfortable"
                  />
                  <v-text-field
                    v-model="project.thumbnails"
                    :label="t('admin.editor.fields.work.thumbnail')"
                    required
                    variant="outlined"
                    density="comfortable"
                  />
                  <v-text-field
                    v-model="project.type"
                    :label="t('admin.editor.fields.work.type')"
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
                {{ t('admin.editor.empty.projects') }}
              </p>
            </template>

            <template v-else-if="slug === 'about'">
              <v-text-field
                v-model="form.label"
                :label="t('admin.editor.fields.common.label')"
                required
                variant="outlined"
                density="comfortable"
              />
              <div class="editor-section__heading">
                <h2 class="editor-section__title">{{ t('admin.editor.sections.about.paragraphsTitle') }}</h2>
                <v-btn
                  color="primary"
                  variant="tonal"
                  class="text-none"
                  @click="addIntroduce"
                >
                  {{ t('admin.editor.buttons.addParagraph') }}
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
                    <span class="text-caption">{{ t('admin.editor.entries.paragraph', { index: index + 1 }) }}</span>
                    <v-btn
                      icon="mdi-delete"
                      variant="text"
                      color="error"
                      @click="removeIntroduce(index)"
                    />
                  </div>
                  <v-textarea
                    v-model="form.introduce[index]"
                    :label="t('admin.editor.fields.common.content')"
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
                {{ t('admin.editor.empty.paragraphs') }}
              </p>
              <div class="editor-section__heading mt-6">
                <h2 class="editor-section__title">{{ t('admin.editor.sections.about.hobbiesTitle') }}</h2>
                <v-btn
                  color="primary"
                  variant="tonal"
                  class="text-none"
                  @click="addHobby"
                >
                  {{ t('admin.editor.buttons.addHobby') }}
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
                    <span class="text-caption">{{ t('admin.editor.entries.hobby', { index: index + 1 }) }}</span>
                    <v-btn
                      icon="mdi-delete"
                      variant="text"
                      color="error"
                      @click="removeHobby(index)"
                    />
                  </div>
                  <v-text-field
                    v-model="form.hobbies[index]"
                    :label="t('admin.editor.fields.about.hobbyName')"
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
                {{ t('admin.editor.empty.hobbies') }}
              </p>
            </template>

            <template v-else-if="slug === 'cta'">
              <v-text-field
                v-model="form.label"
                :label="t('admin.editor.fields.common.label')"
                required
                variant="outlined"
                density="comfortable"
              />
              <v-textarea
                v-model="form.description"
                :label="t('admin.editor.fields.common.description')"
                rows="4"
                required
                variant="outlined"
                density="comfortable"
              />
            </template>

            <template v-else-if="slug === 'contact'">
              <v-text-field
                v-model="form.label"
                :label="t('admin.editor.fields.common.label')"
                required
                variant="outlined"
                density="comfortable"
              />
              <v-text-field
                v-model="form.headline"
                :label="t('admin.editor.fields.common.title')"
                required
                variant="outlined"
                density="comfortable"
              />
              <div class="editor-section__heading">
                <h2 class="editor-section__title">{{ t('admin.editor.sections.contact.listTitle') }}</h2>
                <v-btn
                  color="primary"
                  variant="tonal"
                  class="text-none"
                  @click="addContact"
                >
                  {{ t('admin.editor.buttons.addContact') }}
                </v-btn>
              </div>
              <div
                v-if="form.contact?.length"
                class="editor-collection"
              >
                <v-card
                  v-for="(contactEntry, index) in form.contact"
                  :key="index"
                  variant="tonal"
                  color="primary"
                  class="editor-subcard"
                >
                  <div class="d-flex justify-space-between align-center mb-3">
                    <span class="text-caption">{{ t('admin.editor.entries.contact', { index: index + 1 }) }}</span>
                    <v-btn
                      icon="mdi-delete"
                      variant="text"
                      color="error"
                      @click="removeContact(index)"
                    />
                  </div>
                  <v-text-field
                    :model-value="contactEntry.degree"
                    :label="t('admin.editor.fields.contact.degree')"
                    required
                    variant="outlined"
                    density="comfortable"
                    @update:model-value="updateContactField(index, 'degree', $event)"
                  />
                  <v-text-field
                    :model-value="contactEntry.institution"
                    :label="t('admin.editor.fields.contact.institution')"
                    required
                    variant="outlined"
                    density="comfortable"
                    @update:model-value="updateContactField(index, 'institution', $event)"
                  />
                  <v-text-field
                    :model-value="contactEntry.timeframe"
                    :label="t('admin.editor.fields.contact.timeframe')"
                    required
                    variant="outlined"
                    density="comfortable"
                    @update:model-value="updateContactField(index, 'timeframe', $event)"
                  />
                  <v-textarea
                    :model-value="contactEntry.details"
                    :label="t('admin.editor.fields.contact.details')"
                    rows="3"
                    required
                    variant="outlined"
                    density="comfortable"
                    @update:model-value="updateContactField(index, 'details', $event)"
                  />
                </v-card>
              </div>
              <p
                v-else
                class="text-body-2 text-medium-emphasis"
              >
                {{ t('admin.editor.empty.contact') }}
              </p>
            </template>

            <template v-else-if="slug === 'navlinks'">
              <div style="display: flex; justify-content: space-between; align-items: center">
                <h2 class="text-h6 font-weight-semibold mb-0">
                  {{ t('admin.editor.sections.navlinks.listTitle') }}
                </h2>
                <v-btn
                  color="primary"
                  variant="tonal"
                  class="text-none"
                  @click="addNavlink"
                >
                  {{ t('admin.editor.buttons.addNavlink') }}
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
                    <span class="text-caption">{{ t('admin.editor.entries.navlink', { index: index + 1 }) }}</span>
                    <v-btn
                      icon="mdi-delete"
                      variant="text"
                      color="error"
                      @click="removeNavlink(index)"
                    />
                  </div>
                  <v-text-field
                    v-model="link.label"
                    :label="t('admin.editor.fields.common.label')"
                    required
                    variant="outlined"
                    density="comfortable"
                  />
                  <v-text-field
                    v-model="link.url"
                    :label="t('admin.editor.fields.common.url')"
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
                {{ t('admin.editor.empty.navlinks') }}
              </p>
            </template>

            <template v-else-if="slug === 'skills'">
              <v-text-field
                v-model="form.label"
                :label="t('admin.editor.fields.common.label')"
                required
                variant="outlined"
                density="comfortable"
              />
              <v-text-field
                v-model="form.headline"
                :label="t('admin.editor.fields.common.title')"
                required
                variant="outlined"
                density="comfortable"
              />
              <v-textarea
                v-model="form.subline"
                :label="t('admin.editor.fields.common.description')"
                rows="4"
                required
                variant="outlined"
                density="comfortable"
              />
              <div class="editor-section__heading">
                <h2 class="editor-section__title">{{ t('admin.editor.sections.skills.categoriesTitle') }}</h2>
                <v-btn
                  color="primary"
                  variant="tonal"
                  class="text-none"
                  @click="addSkillCategory"
                >
                  {{ t('admin.editor.buttons.addCategory') }}
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
                    <span class="text-caption">{{ t('admin.editor.entries.category', { index: categoryIndex + 1 }) }}</span>
                    <v-btn
                      icon="mdi-delete"
                      variant="text"
                      color="error"
                      @click="removeSkillCategory(categoryIndex)"
                    />
                  </div>
                  <v-text-field
                    v-model="category.name"
                    :label="t('admin.editor.fields.skills.categoryName')"
                    required
                    variant="outlined"
                    density="comfortable"
                  />
                  <div class="editor-section__heading">
                    <span class="text-body-2">{{ t('admin.editor.sections.skills.skillsLabel') }}</span>
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
                        :label="t('admin.editor.fields.skills.skillName')"
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
                    {{ t('admin.editor.empty.skills') }}
                  </p>
                </v-card>
              </div>
              <p
                v-else
                class="text-body-2 text-medium-emphasis"
              >
                {{ t('admin.editor.empty.categories') }}
              </p>
              <div class="editor-section__heading mt-6">
                <h2 class="editor-section__title">{{ t('admin.editor.sections.skills.languagesTitle') }}</h2>
                <v-btn
                  color="primary"
                  variant="tonal"
                  class="text-none"
                  @click="addLanguage"
                >
                  {{ t('admin.editor.buttons.addLanguage') }}
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
                    <span class="text-caption">{{ t('admin.editor.entries.language', { index: index + 1 }) }}</span>
                    <v-btn
                      icon="mdi-delete"
                      variant="text"
                      color="error"
                      @click="removeLanguage(index)"
                    />
                  </div>
                  <v-text-field
                    v-model="form.languages[index]"
                    :label="t('admin.editor.fields.skills.languageName')"
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
                {{ t('admin.editor.empty.languages') }}
              </p>
              <div class="editor-section__heading mt-6">
                <h2 class="editor-section__title">{{ t('admin.editor.sections.skills.proficienciesTitle') }}</h2>
                <v-btn
                  color="primary"
                  variant="tonal"
                  class="text-none"
                  @click="addLanguageProficiency"
                >
                  {{ t('admin.editor.buttons.addLanguageLevel') }}
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
                    <span class="text-caption">{{ t('admin.editor.entries.language', { index: index + 1 }) }}</span>
                    <v-btn
                      icon="mdi-delete"
                      variant="text"
                      color="error"
                      @click="removeLanguageProficiency(index)"
                    />
                  </div>
                  <v-text-field
                    v-model="form.languageProficiencies[index].name"
                    :label="t('admin.editor.fields.skills.languageName')"
                    required
                    variant="outlined"
                    density="comfortable"
                  />
                  <v-text-field
                    v-model.number="form.languageProficiencies[index].proficiency"
                    type="number"
                    :label="t('admin.editor.fields.skills.languageProficiency')"
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
                {{ t('admin.editor.empty.languageProficiencies') }}
              </p>
            </template>

            <template v-else-if="slug === 'experiences'">
              <v-text-field
                v-model="form.label"
                :label="t('admin.editor.fields.common.label')"
                required
                variant="outlined"
                density="comfortable"
              />
              <v-text-field
                v-model="form.headline"
                :label="t('admin.editor.fields.common.title')"
                required
                variant="outlined"
                density="comfortable"
              />
              <div class="editor-section__heading">
                <h2 class="editor-section__title">{{ t('admin.editor.sections.experiences.listTitle') }}</h2>
                <v-btn
                  color="primary"
                  variant="tonal"
                  class="text-none"
                  @click="addExperience"
                >
                  {{ t('admin.editor.buttons.addExperience') }}
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
                    <span class="text-caption">{{ t('admin.editor.entries.experience', { index: index + 1 }) }}</span>
                    <v-btn
                      icon="mdi-delete"
                      variant="text"
                      color="error"
                      @click="removeExperience(index)"
                    />
                  </div>
                  <v-text-field
                    v-model="position.role"
                    :label="t('admin.editor.fields.experiences.role')"
                    required
                    variant="outlined"
                    density="comfortable"
                  />
                  <v-text-field
                    v-model="position.slug"
                    :label="t('admin.editor.fields.common.slug')"
                    required
                    variant="outlined"
                    density="comfortable"
                  />
                  <v-text-field
                    v-model="position.company"
                    :label="t('admin.editor.fields.experiences.company')"
                    required
                    variant="outlined"
                    density="comfortable"
                  />
                  <v-text-field
                    v-model="position.timeframe"
                    :label="t('admin.editor.fields.common.period')"
                    required
                    variant="outlined"
                    density="comfortable"
                  />
                  <div class="editor-section__heading">
                    <span class="text-body-2">{{ t('admin.editor.sections.experiences.achievementsTitle') }}</span>
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
                        :label="t('admin.editor.fields.experiences.achievementDetail')"
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
                    {{ t('admin.editor.empty.achievements') }}
                  </p>
                </v-card>
              </div>
              <p
                v-else
                class="text-body-2 text-medium-emphasis"
              >
                {{ t('admin.editor.empty.experiences') }}
              </p>
            </template>

            <template v-else-if="slug === 'education'">
              <v-text-field
                v-model="form.label"
                :label="t('admin.editor.fields.common.label')"
                required
                variant="outlined"
                density="comfortable"
              />
              <v-text-field
                v-model="form.headline"
                :label="t('admin.editor.fields.common.title')"
                required
                variant="outlined"
                density="comfortable"
              />
              <div class="editor-section__heading">
                <h2 class="editor-section__title">{{ t('admin.editor.sections.education.listTitle') }}</h2>
                <v-btn
                  color="primary"
                  variant="tonal"
                  class="text-none"
                  @click="addEducation"
                >
                  {{ t('admin.editor.buttons.addEducation') }}
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
                    <span class="text-caption">{{ t('admin.editor.entries.education', { index: index + 1 }) }}</span>
                    <v-btn
                      icon="mdi-delete"
                      variant="text"
                      color="error"
                      @click="removeEducation(index)"
                    />
                  </div>
                  <v-text-field
                    v-model="school.degree"
                    :label="t('admin.editor.fields.education.degree')"
                    required
                    variant="outlined"
                    density="comfortable"
                  />
                  <v-text-field
                    v-model="school.slug"
                    :label="t('admin.editor.fields.common.slug')"
                    required
                    variant="outlined"
                    density="comfortable"
                  />
                  <v-text-field
                    v-model="school.institution"
                    :label="t('admin.editor.fields.education.institution')"
                    required
                    variant="outlined"
                    density="comfortable"
                  />
                  <v-text-field
                    v-model="school.timeframe"
                    :label="t('admin.editor.fields.common.period')"
                    required
                    variant="outlined"
                    density="comfortable"
                  />
                  <v-textarea
                    v-model="school.details"
                    :label="t('admin.editor.fields.education.details')"
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
                {{ t('admin.editor.empty.education') }}
              </p>
            </template>

            <div class="editor-form__footer">
              <v-btn
                :to="'/admin'"
                variant="tonal"
                color="primary"
                class="text-none"
              >
                {{ t('admin.editor.actions.cancel') }}
              </v-btn>
              <v-btn
                type="submit"
                color="primary"
                class="text-none"
                :loading="saveState.isSaving"
              >
                {{ t('admin.editor.actions.save') }}
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

const { t } = useI18n();

if (!isContentSlug(slugParam.value)) {
  showError({ statusCode: 404, statusMessage: t("admin.editor.notFound") });
}

const slug = computed(() => slugParam.value as ContentSlug);

const localeItems = computed(() =>
  SUPPORTED_LOCALES.map((code) => ({
    value: code,
    title: t(`admin.editor.localeNames.${code}`),
  })),
);

const selectedLocale = ref<LocaleCode>(DEFAULT_LOCALE);

const sectionTitle = computed(() => t(`admin.editor.sections.${slug.value}.title`));

const { data, pending, refresh, error } = await useAsyncData(
  () => `admin-content-${slug.value}-${selectedLocale.value}`,
  () => $fetch(`/api/content/${slug.value}`, { query: { locale: selectedLocale.value } }),
  { watch: [slug, selectedLocale] },
);

type NavLinkEntry = { label: string; url: string };
type ServiceEntry = { name: string; icon: string; description: string; thumbnails: string };
type WorkEntry = {
  name: string;
  slug: string;
  live_demo: string;
  description: string;
  thumbnails: string;
  type: string;
};
type ContactEntry = { degree: string; institution: string; timeframe: string; details: string };
type CategoryEntry = { name: string; skills: string[] };
type LanguageProficiencyEntry = { name: string; proficiency: number };
type PositionEntry = {
  slug: string;
  role: string;
  company: string;
  timeframe: string;
  achievements: string[];
};
type SchoolEntry = {
  slug: string;
  degree: string;
  institution: string;
  timeframe: string;
  details: string;
};

interface ContentFormState extends Record<string, unknown> {
  firstname?: string;
  lastname?: string;
  role?: string;
  avatar?: string;
  badge?: string;
  headline?: string;
  subline?: string;
  label?: string;
  navlinks?: NavLinkEntry[];
  services?: ServiceEntry[];
  works?: WorkEntry[];
  introduce?: string[];
  hobbies?: string[];
  categories?: CategoryEntry[];
  languages?: string[];
  languageProficiencies?: LanguageProficiencyEntry[];
  positions?: PositionEntry[];
  schools?: SchoolEntry[];
  contact?: ContactEntry[];
}

function cloneContentForm(value: unknown): ContentFormState {
  const rawClone =
    typeof structuredClone === "function"
      ? structuredClone(value)
      : JSON.parse(JSON.stringify(value));

  return (rawClone ?? {}) as ContentFormState;
}

function isFetchError(value: unknown): value is { data?: { statusMessage?: string } } {
  return (
    typeof value === "object" &&
    value !== null &&
    "data" in value &&
    typeof (value as { data?: unknown }).data === "object"
  );
}

const form = reactive<ContentFormState>({});
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
    let clone: ContentFormState;
    try {
      clone = cloneContentForm(value);
    } catch {
      clone = JSON.parse(JSON.stringify(value)) as ContentFormState;
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
  form.navlinks?.splice(index, 1);
}

function addService() {
  form.services ??= [];
  form.services.push({ name: "", icon: "", description: "", thumbnails: "" });
}

function removeService(index: number) {
  form.services?.splice(index, 1);
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
  form.works?.splice(index, 1);
}

function addIntroduce() {
  form.introduce ??= [];
  form.introduce.push("");
}

function removeIntroduce(index: number) {
  form.introduce?.splice(index, 1);
}

function addHobby() {
  form.hobbies ??= [];
  form.hobbies.push("");
}

function removeHobby(index: number) {
  form.hobbies?.splice(index, 1);
}

function addSkillCategory() {
  form.categories ??= [];
  form.categories.push({ name: "", skills: [""] });
}

function removeSkillCategory(index: number) {
  form.categories?.splice(index, 1);
}

function addSkill(categoryIndex: number) {
  if (!form.categories?.[categoryIndex]) {
    return;
  }
  form.categories[categoryIndex]?.skills.push("");
}

function removeSkill(categoryIndex: number, skillIndex: number) {
  const category = form.categories?.[categoryIndex];
  category?.skills.splice(skillIndex, 1);
}

function addLanguage() {
  form.languages ??= [];
  form.languages.push("");
}

function removeLanguage(index: number) {
  form.languages?.splice(index, 1);
}

function addLanguageProficiency() {
  form.languageProficiencies ??= [];
  form.languageProficiencies.push({ name: "", proficiency: 0 });
}

function removeLanguageProficiency(index: number) {
  form.languageProficiencies?.splice(index, 1);
}

function addExperience() {
  form.positions ??= [];
  form.positions.push({ slug: "", role: "", company: "", timeframe: "", achievements: [""] });
}

function removeExperience(index: number) {
  form.positions?.splice(index, 1);
}

function addAchievement(positionIndex: number) {
  const position = form.positions?.[positionIndex];
  position?.achievements.push("");
}

function removeAchievement(positionIndex: number, achievementIndex: number) {
  const position = form.positions?.[positionIndex];
  position?.achievements.splice(achievementIndex, 1);
}

function addEducation() {
  form.schools ??= [];
  form.schools.push({ slug: "", degree: "", institution: "", timeframe: "", details: "" });
}

function removeEducation(index: number) {
  form.schools?.splice(index, 1);
}

function addContact() {
  form.contact ??= [];
  form.contact.push({ degree: "", institution: "", timeframe: "", details: "" });
}

function removeContact(index: number) {
  form.contact?.splice(index, 1);
}

function updateContactField(index: number, field: keyof ContactEntry, value: string) {
  const entry = form.contact?.[index];
  if (!entry) {
    return;
  }
  entry[field] = value;
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
    saveState.success = t("admin.editor.save.success");
    await refresh();
  } catch (err: unknown) {
    if (err instanceof ZodError) {
      saveState.errors = err.errors.map((issue) => issue.message);
    } else if (isFetchError(err) && typeof err.data?.statusMessage === "string") {
      saveState.errors = [err.data.statusMessage];
    } else {
      saveState.errors = [t("admin.editor.save.failure")];
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
