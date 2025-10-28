<template>
  <section
    class="resume-template resume-template--elegant"
    :style="templateStyle"
  >
    <header class="resume-elegant__header">
      <div>
        <p class="resume-elegant__eyebrow">Curriculum Vitae</p>
        <h1>{{ fullName }}</h1>
        <p class="resume-elegant__headline">{{ data.personal.headline }}</p>
      </div>
      <div class="resume-elegant__contact">
        <span>{{ data.personal.email }}</span>
        <span>{{ data.personal.phone }}</span>
        <span>{{ data.personal.website }}</span>
        <span>{{ data.personal.linkedin }}</span>
        <span>{{ data.personal.location }}</span>
      </div>
    </header>

    <section class="resume-elegant__summary">
      <p>{{ data.personal.summary }}</p>
    </section>

    <div class="resume-elegant__columns">
      <section class="resume-elegant__column">
        <div class="resume-elegant__card">
          <h2>Expériences</h2>
          <div class="resume-elegant__timeline">
            <article
              v-for="experience in data.experiences"
              :key="experience.id"
            >
              <header>
                <div class="resume-elegant__timeline-dates">{{ experience.startDate }} – {{ experience.endDate }}</div>
                <div>
                  <h3>{{ experience.position }}</h3>
                  <span>{{ experience.company }} · {{ experience.location }}</span>
                </div>
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
        </div>

        <div class="resume-elegant__card">
          <h2>Formation</h2>
          <ul class="resume-elegant__list">
            <li
              v-for="school in data.education"
              :key="school.id"
            >
              <div class="resume-elegant__list-dates">{{ school.startDate }} – {{ school.endDate }}</div>
              <div>
                <h3>{{ school.degree }}</h3>
                <span>{{ school.institution }} · {{ school.location }}</span>
                <p>{{ school.details }}</p>
              </div>
            </li>
          </ul>
        </div>
      </section>

      <section class="resume-elegant__column">
        <div class="resume-elegant__card">
          <h2>Compétences</h2>
          <ul class="resume-elegant__tags">
            <li
              v-for="skill in data.skills"
              :key="skill.id"
            >
              <span>{{ skill.name }}</span>
              <small>{{ skill.level }}</small>
            </li>
          </ul>
        </div>

        <div
          v-if="data.projects.length"
          class="resume-elegant__card"
        >
          <h2>Projets</h2>
          <ul class="resume-elegant__projects">
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
        </div>

        <div
          v-if="data.socials.length"
          class="resume-elegant__card"
        >
          <h2>Réseaux</h2>
          <ul class="resume-elegant__links">
            <li
              v-for="social in data.socials"
              :key="social.id"
            >
              <span>{{ social.label }}</span>
              <span>{{ social.url }}</span>
            </li>
          </ul>
        </div>

        <div
          v-if="data.interests.length"
          class="resume-elegant__card"
        >
          <h2>Intérêts</h2>
          <p class="resume-elegant__interests">{{ data.interests.join(" · ") }}</p>
        </div>
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
  gap: 28px;
}

.resume-elegant__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
}

.resume-elegant__eyebrow {
  font-size: 12px;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  margin: 0 0 6px;
  color: var(--resume-secondary);
}

.resume-elegant__header h1 {
  margin: 0;
  font-size: 34px;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.resume-elegant__headline {
  margin: 6px 0 0;
  font-size: 16px;
  color: rgba(15, 23, 42, 0.75);
}

.resume-elegant__contact {
  display: grid;
  gap: 6px;
  font-size: 13px;
  text-align: right;
  color: rgba(15, 23, 42, 0.65);
}

.resume-elegant__summary {
  background: var(--resume-surface);
  border-radius: 20px;
  padding: 18px 22px;
  font-size: 14px;
  line-height: 1.6;
}

.resume-elegant__columns {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
  gap: 24px;
}

.resume-elegant__card {
  background: #ffffff;
  border-radius: 18px;
  padding: 20px 22px;
  box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.05);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.resume-elegant__card h2 {
  margin: 0;
  font-size: 15px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--resume-secondary);
}

.resume-elegant__timeline {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.resume-elegant__timeline article {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.resume-elegant__timeline header {
  display: flex;
  gap: 16px;
}

.resume-elegant__timeline-dates {
  min-width: 120px;
  font-size: 12px;
  font-weight: 600;
  color: var(--resume-primary);
}

.resume-elegant__timeline h3 {
  margin: 0;
  font-size: 17px;
  font-weight: 600;
}

.resume-elegant__timeline span {
  font-size: 13px;
  color: rgba(15, 23, 42, 0.65);
}

.resume-elegant__timeline p {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
}

.resume-elegant__timeline ul {
  margin: 0;
  padding-left: 18px;
  display: grid;
  gap: 6px;
  font-size: 13px;
}

.resume-elegant__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 16px;
}

.resume-elegant__list li {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 16px;
}

.resume-elegant__list-dates {
  font-size: 12px;
  font-weight: 600;
  color: var(--resume-primary);
}

.resume-elegant__list h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.resume-elegant__list span {
  font-size: 13px;
  color: rgba(15, 23, 42, 0.65);
}

.resume-elegant__list p {
  margin: 6px 0 0;
  font-size: 13px;
  color: rgba(15, 23, 42, 0.7);
}

.resume-elegant__tags {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.resume-elegant__tags li {
  background: rgba(59, 130, 246, 0.1);
  border-radius: 999px;
  padding: 8px 14px;
  display: flex;
  gap: 8px;
  align-items: baseline;
  font-size: 13px;
  color: var(--resume-primary);
}

.resume-elegant__tags small {
  font-size: 11px;
  color: rgba(15, 23, 42, 0.6);
}

.resume-elegant__projects {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 12px;
}

.resume-elegant__projects li {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.resume-elegant__projects span {
  font-size: 12px;
  color: var(--resume-secondary);
  word-break: break-all;
}

.resume-elegant__links {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 10px;
  font-size: 13px;
}

.resume-elegant__links li {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.resume-elegant__links span:last-child {
  color: var(--resume-secondary);
  word-break: break-all;
}

.resume-elegant__interests {
  margin: 0;
  font-size: 13px;
  color: rgba(15, 23, 42, 0.7);
}

@media (max-width: 1024px) {
  .resume-elegant__header {
    flex-direction: column;
    align-items: flex-start;
  }

  .resume-elegant__contact {
    text-align: left;
  }

  .resume-elegant__columns {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .resume-elegant__timeline header {
    flex-direction: column;
  }

  .resume-elegant__list li {
    grid-template-columns: 1fr;
  }

  .resume-elegant__projects li,
  .resume-elegant__links li {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
