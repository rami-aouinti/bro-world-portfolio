<template>
  <section
    class="resume-template resume-template--modern"
    :style="templateStyle"
  >
    <header class="resume-modern__hero">
      <div class="resume-modern__name-block">
        <h1>{{ fullName }}</h1>
        <p>{{ data.personal.headline }}</p>
      </div>
      <ul class="resume-modern__hero-contact">
        <li>{{ data.personal.email }}</li>
        <li>{{ data.personal.phone }}</li>
        <li>{{ data.personal.location }}</li>
        <li>{{ data.personal.website }}</li>
      </ul>
    </header>

    <div class="resume-modern__grid">
      <section class="resume-modern__panel">
        <h2>Profil</h2>
        <p>{{ data.personal.summary }}</p>
      </section>

      <section
        v-if="data.skills.length"
        class="resume-modern__panel"
      >
        <h2>Compétences clés</h2>
        <div class="resume-modern__skill-grid">
          <div
            v-for="skill in data.skills"
            :key="skill.id"
            class="resume-modern__skill"
          >
            <span class="resume-modern__skill-name">{{ skill.name }}</span>
            <span class="resume-modern__skill-level">{{ skill.level }}</span>
          </div>
        </div>
      </section>

      <section class="resume-modern__panel resume-modern__panel--full">
        <h2>Expériences professionnelles</h2>
        <div class="resume-modern__experience-list">
          <article
            v-for="experience in data.experiences"
            :key="experience.id"
          >
            <header>
              <div>
                <h3>{{ experience.position }}</h3>
                <span class="resume-modern__company">{{ experience.company }} · {{ experience.location }}</span>
              </div>
              <span class="resume-modern__dates">{{ experience.startDate }} – {{ experience.endDate }}</span>
            </header>
            <p>{{ experience.description }}</p>
            <ul>
              <li
                v-for="highlight in experience.highlights"
                :key="highlight.id"
              >
                {{ highlight.text }}
              </li>
            </ul>
          </article>
        </div>
      </section>

      <section class="resume-modern__panel">
        <h2>Formation</h2>
        <ul class="resume-modern__education">
          <li
            v-for="school in data.education"
            :key="school.id"
          >
            <div class="resume-modern__education-heading">
              <span class="resume-modern__education-dates">{{ school.startDate }} – {{ school.endDate }}</span>
              <span>{{ school.location }}</span>
            </div>
            <div>
              <h3>{{ school.degree }}</h3>
              <p>{{ school.institution }}</p>
              <p class="resume-modern__education-details">{{ school.details }}</p>
            </div>
          </li>
        </ul>
      </section>

      <section
        v-if="data.projects.length"
        class="resume-modern__panel"
      >
        <h2>Projets sélectionnés</h2>
        <ul class="resume-modern__projects">
          <li
            v-for="project in data.projects"
            :key="project.id"
          >
            <div>
              <h3>{{ project.name }}</h3>
              <p>{{ project.description }}</p>
            </div>
            <span>{{ project.link }}</span>
          </li>
        </ul>
      </section>

      <section
        v-if="data.interests.length"
        class="resume-modern__panel"
      >
        <h2>Intérêts</h2>
        <ul class="resume-modern__chips">
          <li
            v-for="interest in data.interests"
            :key="interest"
          >
            {{ interest }}
          </li>
        </ul>
      </section>

      <section
        v-if="data.socials.length"
        class="resume-modern__panel"
      >
        <h2>Réseaux</h2>
        <ul class="resume-modern__links">
          <li
            v-for="social in data.socials"
            :key="social.id"
          >
            <span>{{ social.label }}</span>
            <span>{{ social.url }}</span>
          </li>
        </ul>
      </section>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { ResumeColorPalette, ResumeData } from "~/types/resume";

const props = defineProps<{
  data: ResumeData;
  colors: ResumeColorPalette;
}>();

const fullName = computed(() => `${props.data.personal.firstName} ${props.data.personal.lastName}`.trim());

const templateStyle = computed(() => ({
  "--resume-primary": props.colors.primary,
  "--resume-secondary": props.colors.secondary,
  "--resume-background": props.colors.background,
  "--resume-surface": props.colors.surface,
  "--resume-text": props.colors.text,
}));
</script>

<style scoped>
.resume-template {
  background: var(--resume-background);
  color: var(--resume-text);
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.resume-modern__hero {
  background: var(--resume-primary);
  color: #ffffff;
  border-radius: 22px;
  padding: 28px 32px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
}

.resume-modern__name-block h1 {
  margin: 0;
  font-size: 34px;
  font-weight: 700;
}

.resume-modern__name-block p {
  margin: 6px 0 0;
  font-size: 16px;
}

.resume-modern__hero-contact {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 6px;
  font-size: 13px;
  text-align: right;
}

.resume-modern__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
}

.resume-modern__panel {
  background: var(--resume-surface);
  border-radius: 18px;
  padding: 20px 22px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.04);
}

.resume-modern__panel--full {
  grid-column: 1 / -1;
}

.resume-modern__panel h2 {
  margin: 0;
  font-size: 15px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--resume-primary);
}

.resume-modern__panel p {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
}

.resume-modern__skill-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
}

.resume-modern__skill {
  background: #ffffff;
  border-radius: 14px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  box-shadow: 0 4px 10px rgba(15, 23, 42, 0.08);
}

.resume-modern__skill-name {
  font-weight: 600;
}

.resume-modern__skill-level {
  font-size: 12px;
  color: var(--resume-secondary);
}

.resume-modern__experience-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.resume-modern__experience-list article {
  background: #ffffff;
  border-radius: 16px;
  padding: 18px;
  box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.08);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.resume-modern__experience-list header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

.resume-modern__experience-list h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.resume-modern__company {
  font-size: 13px;
  color: rgba(15, 23, 42, 0.7);
}

.resume-modern__dates {
  font-size: 13px;
  font-weight: 600;
  color: var(--resume-secondary);
}

.resume-modern__experience-list ul {
  margin: 0;
  padding-left: 18px;
  display: grid;
  gap: 6px;
  font-size: 13px;
}

.resume-modern__education {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 14px;
}

.resume-modern__education-heading {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  font-size: 12px;
  color: rgba(15, 23, 42, 0.6);
}

.resume-modern__education h3 {
  margin: 4px 0;
  font-size: 16px;
  font-weight: 600;
}

.resume-modern__education p {
  margin: 0;
  font-size: 13px;
}

.resume-modern__education-details {
  color: rgba(15, 23, 42, 0.7);
}

.resume-modern__projects {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 12px;
}

.resume-modern__projects li {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  background: #ffffff;
  border-radius: 14px;
  padding: 12px 14px;
}

.resume-modern__projects span {
  font-size: 12px;
  color: var(--resume-secondary);
  word-break: break-all;
}

.resume-modern__chips {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.resume-modern__chips li {
  background: rgba(59, 130, 246, 0.12);
  color: var(--resume-secondary);
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 12px;
}

.resume-modern__links {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 10px;
  font-size: 13px;
}

.resume-modern__links li {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.resume-modern__links span:last-child {
  color: var(--resume-secondary);
  word-break: break-all;
}

@media (max-width: 900px) {
  .resume-modern__hero {
    flex-direction: column;
  }

  .resume-modern__hero-contact {
    text-align: left;
  }

  .resume-modern__experience-list header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
