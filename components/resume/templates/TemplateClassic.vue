<template>
  <section
    class="resume-template resume-template--classic"
    :style="templateStyle"
  >
    <header class="resume-template__header">
      <div>
        <h1 class="resume-template__name">{{ fullName }}</h1>
        <p class="resume-template__headline">{{ data.personal.headline }}</p>
      </div>
      <div class="resume-template__contact">
        <span>{{ data.personal.email }}</span>
        <span>{{ data.personal.phone }}</span>
        <span>{{ data.personal.location }}</span>
        <span>{{ data.personal.website }}</span>
      </div>
    </header>

    <div class="resume-template__body">
      <aside class="resume-template__sidebar">
        <section class="resume-template__block">
          <h2 class="resume-template__block-title">À propos</h2>
          <p class="resume-template__summary">{{ data.personal.summary }}</p>
        </section>

        <section
          v-if="data.skills.length > 0"
          class="resume-template__block"
        >
          <h2 class="resume-template__block-title">Compétences</h2>
          <ul class="resume-template__tags">
            <li
              v-for="skill in data.skills"
              :key="skill.id"
            >
              <span class="resume-template__tag-name">{{ skill.name }}</span>
              <span class="resume-template__tag-level">{{ skill.level }}</span>
            </li>
          </ul>
        </section>

        <section
          v-if="data.socials.length > 0"
          class="resume-template__block"
        >
          <h2 class="resume-template__block-title">Liens</h2>
          <ul class="resume-template__list">
            <li
              v-for="social in data.socials"
              :key="social.id"
            >
              <span class="resume-template__list-label">{{ social.label }}</span>
              <span class="resume-template__list-value">{{ social.url }}</span>
            </li>
          </ul>
        </section>

        <section
          v-if="data.interests.length > 0"
          class="resume-template__block"
        >
          <h2 class="resume-template__block-title">Intérêts</h2>
          <ul class="resume-template__bullets">
            <li
              v-for="interest in data.interests"
              :key="interest"
            >
              {{ interest }}
            </li>
          </ul>
        </section>
      </aside>

      <main class="resume-template__content">
        <section class="resume-template__block">
          <h2 class="resume-template__block-title">Expériences</h2>
          <div class="resume-template__timeline">
            <article
              v-for="experience in data.experiences"
              :key="experience.id"
              class="resume-template__timeline-item"
            >
              <div class="resume-template__timeline-meta">
                <span>{{ experience.startDate }} – {{ experience.endDate }}</span>
                <span>{{ experience.location }}</span>
              </div>
              <div class="resume-template__timeline-content">
                <h3>{{ experience.position }} – {{ experience.company }}</h3>
                <p>{{ experience.description }}</p>
                <ul>
                  <li
                    v-for="highlight in experience.highlights"
                    :key="highlight.id"
                  >
                    {{ highlight.text }}
                  </li>
                </ul>
              </div>
            </article>
          </div>
        </section>

        <section class="resume-template__block">
          <h2 class="resume-template__block-title">Formation</h2>
          <div class="resume-template__timeline">
            <article
              v-for="school in data.education"
              :key="school.id"
              class="resume-template__timeline-item"
            >
              <div class="resume-template__timeline-meta">
                <span>{{ school.startDate }} – {{ school.endDate }}</span>
                <span>{{ school.location }}</span>
              </div>
              <div class="resume-template__timeline-content">
                <h3>{{ school.degree }} – {{ school.institution }}</h3>
                <p>{{ school.details }}</p>
              </div>
            </article>
          </div>
        </section>

        <section
          v-if="data.projects.length > 0"
          class="resume-template__block"
        >
          <h2 class="resume-template__block-title">Projets</h2>
          <ul class="resume-template__projects">
            <li
              v-for="project in data.projects"
              :key="project.id"
            >
              <div>
                <h3>{{ project.name }}</h3>
                <p>{{ project.description }}</p>
              </div>
              <span class="resume-template__project-link">{{ project.link }}</span>
            </li>
          </ul>
        </section>
      </main>
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
  display: flex;
  flex-direction: column;
  gap: 28px;
  background: var(--resume-background);
  color: var(--resume-text);
  min-height: 100%;
}

.resume-template__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 18px;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--resume-secondary);
}

.resume-template__name {
  font-size: 32px;
  font-weight: 700;
  margin: 0;
  color: var(--resume-primary);
}

.resume-template__headline {
  margin: 4px 0 0;
  font-size: 16px;
  font-weight: 500;
}

.resume-template__contact {
  display: grid;
  gap: 6px;
  font-size: 13px;
  text-align: right;
}

.resume-template__body {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 24px;
}

.resume-template__sidebar {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.resume-template__block-title {
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--resume-primary);
  margin-bottom: 12px;
}

.resume-template__summary {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
}

.resume-template__tags {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 10px;
}

.resume-template__tags li {
  background: var(--resume-surface);
  border-radius: 12px;
  padding: 10px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
}

.resume-template__tag-name {
  font-weight: 600;
}

.resume-template__tag-level {
  color: var(--resume-secondary);
}

.resume-template__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 13px;
}

.resume-template__list-label {
  font-weight: 600;
}

.resume-template__list-value {
  display: block;
  word-break: break-all;
  color: var(--resume-secondary);
}

.resume-template__bullets {
  list-style: disc;
  padding-left: 18px;
  margin: 0;
  display: grid;
  gap: 8px;
  font-size: 13px;
}

.resume-template__content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.resume-template__timeline {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.resume-template__timeline-item {
  display: grid;
  grid-template-columns: 160px 1fr;
  gap: 18px;
}

.resume-template__timeline-meta {
  font-size: 13px;
  color: rgba(15, 23, 42, 0.7);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.resume-template__timeline-content h3 {
  margin: 0 0 6px;
  font-size: 16px;
  font-weight: 600;
}

.resume-template__timeline-content p {
  margin: 0 0 8px;
  font-size: 14px;
}

.resume-template__timeline-content ul {
  margin: 0;
  padding-left: 18px;
  font-size: 13px;
  display: grid;
  gap: 6px;
}

.resume-template__projects {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 12px;
}

.resume-template__projects li {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 14px;
  padding: 12px 16px;
  background: var(--resume-surface);
}

.resume-template__projects h3 {
  margin: 0 0 4px;
  font-size: 15px;
}

.resume-template__projects p {
  margin: 0;
  font-size: 13px;
  line-height: 1.5;
}

.resume-template__project-link {
  font-size: 12px;
  color: var(--resume-secondary);
  align-self: flex-start;
  word-break: break-all;
}

@media (max-width: 900px) {
  .resume-template__body {
    grid-template-columns: 1fr;
  }

  .resume-template__contact {
    text-align: left;
  }

  .resume-template__timeline-item {
    grid-template-columns: 1fr;
  }
}
</style>
