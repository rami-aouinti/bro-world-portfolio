<template>
  <section
    class="resume-template resume-template--minimal"
    :style="templateStyle"
  >
    <header class="resume-minimal__header">
      <h1>{{ fullName }}</h1>
      <div class="resume-minimal__headline">
        <span>{{ data.personal.headline }}</span>
        <span>{{ data.personal.location }}</span>
      </div>
    </header>

    <div class="resume-minimal__contact">
      <span>{{ data.personal.email }}</span>
      <span>{{ data.personal.phone }}</span>
      <span>{{ data.personal.website }}</span>
      <span>{{ data.personal.linkedin }}</span>
    </div>

    <section class="resume-minimal__section">
      <h2>Résumé</h2>
      <p>{{ data.personal.summary }}</p>
    </section>

    <section class="resume-minimal__section">
      <h2>Expériences</h2>
      <div class="resume-minimal__entries">
        <article
          v-for="experience in data.experiences"
          :key="experience.id"
        >
          <div class="resume-minimal__entry-header">
            <div>
              <h3>{{ experience.position }}</h3>
              <span>{{ experience.company }} · {{ experience.location }}</span>
            </div>
            <span class="resume-minimal__entry-dates">{{ experience.startDate }} – {{ experience.endDate }}</span>
          </div>
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

    <section class="resume-minimal__section">
      <h2>Formation</h2>
      <div class="resume-minimal__entries">
        <article
          v-for="school in data.education"
          :key="school.id"
        >
          <div class="resume-minimal__entry-header">
            <div>
              <h3>{{ school.degree }}</h3>
              <span>{{ school.institution }} · {{ school.location }}</span>
            </div>
            <span class="resume-minimal__entry-dates">{{ school.startDate }} – {{ school.endDate }}</span>
          </div>
          <p>{{ school.details }}</p>
        </article>
      </div>
    </section>

    <section class="resume-minimal__section">
      <h2>Compétences</h2>
      <ul class="resume-minimal__skills">
        <li
          v-for="skill in data.skills"
          :key="skill.id"
        >
          <span>{{ skill.name }}</span>
          <span class="resume-minimal__skill-level">{{ skill.level }}</span>
        </li>
      </ul>
    </section>

    <section
      v-if="data.projects.length"
      class="resume-minimal__section"
    >
      <h2>Projets</h2>
      <ul class="resume-minimal__projects">
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
      class="resume-minimal__section"
    >
      <h2>Intérêts</h2>
      <p class="resume-minimal__interests">{{ data.interests.join(" · ") }}</p>
    </section>

    <section
      v-if="data.socials.length"
      class="resume-minimal__section"
    >
      <h2>Réseaux</h2>
      <ul class="resume-minimal__links">
        <li
          v-for="social in data.socials"
          :key="social.id"
        >
          <span>{{ social.label }}</span>
          <span>{{ social.url }}</span>
        </li>
      </ul>
    </section>
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
  gap: 24px;
}

.resume-minimal__header h1 {
  margin: 0;
  font-size: 36px;
  letter-spacing: -0.02em;
  font-weight: 700;
  color: var(--resume-primary);
}

.resume-minimal__headline {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;
  font-size: 14px;
  color: rgba(15, 23, 42, 0.7);
}

.resume-minimal__contact {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 18px;
  font-size: 13px;
  color: rgba(15, 23, 42, 0.7);
}

.resume-minimal__section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  border-top: 1px solid rgba(15, 23, 42, 0.08);
  padding-top: 18px;
}

.resume-minimal__section h2 {
  margin: 0;
  font-size: 15px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--resume-secondary);
}

.resume-minimal__section p {
  margin: 0;
  font-size: 14px;
  line-height: 1.7;
}

.resume-minimal__entries {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.resume-minimal__entry-header {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.resume-minimal__entry-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.resume-minimal__entry-header span {
  display: block;
  font-size: 13px;
  color: rgba(15, 23, 42, 0.65);
}

.resume-minimal__entry-dates {
  font-weight: 600;
  color: var(--resume-secondary);
}

.resume-minimal__entries ul {
  margin: 10px 0 0;
  padding-left: 20px;
  font-size: 13px;
  display: grid;
  gap: 6px;
}

.resume-minimal__skills {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
}

.resume-minimal__skills li {
  background: var(--resume-surface);
  border-radius: 16px;
  padding: 12px 14px;
  display: flex;
  justify-content: space-between;
  font-size: 13px;
}

.resume-minimal__skill-level {
  color: var(--resume-secondary);
}

.resume-minimal__projects {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 16px;
}

.resume-minimal__projects li {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-start;
}

.resume-minimal__projects span {
  font-size: 12px;
  color: var(--resume-secondary);
  word-break: break-all;
}

.resume-minimal__interests {
  font-size: 13px;
  color: rgba(15, 23, 42, 0.7);
}

.resume-minimal__links {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 10px;
  font-size: 13px;
}

.resume-minimal__links li {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.resume-minimal__links span:last-child {
  color: var(--resume-secondary);
  word-break: break-all;
}

@media (max-width: 900px) {
  .resume-minimal__entry-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .resume-minimal__projects li {
    flex-direction: column;
  }

  .resume-minimal__links li {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
