<template>
  <section
    class="resume-template resume-template--bold"
    :style="templateStyle"
  >
    <div class="resume-bold__layout">
      <aside class="resume-bold__sidebar">
        <div class="resume-bold__identity">
          <h1>{{ fullName }}</h1>
          <p>{{ data.personal.headline }}</p>
        </div>

        <section class="resume-bold__section">
          <h2>Coordonnées</h2>
          <ul>
            <li>{{ data.personal.email }}</li>
            <li>{{ data.personal.phone }}</li>
            <li>{{ data.personal.location }}</li>
            <li>{{ data.personal.website }}</li>
          </ul>
        </section>

        <section class="resume-bold__section">
          <h2>Profil</h2>
          <p>{{ data.personal.summary }}</p>
        </section>

        <section
          v-if="data.skills.length"
          class="resume-bold__section"
        >
          <h2>Compétences</h2>
          <ul class="resume-bold__chips">
            <li
              v-for="skill in data.skills"
              :key="skill.id"
            >
              <span>{{ skill.name }}</span>
              <small>{{ skill.level }}</small>
            </li>
          </ul>
        </section>

        <section
          v-if="data.socials.length"
          class="resume-bold__section"
        >
          <h2>Réseaux</h2>
          <ul class="resume-bold__links">
            <li
              v-for="social in data.socials"
              :key="social.id"
            >
              <span>{{ social.label }}</span>
              <span>{{ social.url }}</span>
            </li>
          </ul>
        </section>

        <section
          v-if="data.interests.length"
          class="resume-bold__section"
        >
          <h2>Intérêts</h2>
          <ul class="resume-bold__interests">
            <li
              v-for="interest in data.interests"
              :key="interest"
            >
              {{ interest }}
            </li>
          </ul>
        </section>
      </aside>

      <main class="resume-bold__content">
        <section class="resume-bold__card">
          <h2>Expériences</h2>
          <div class="resume-bold__card-content">
            <article
              v-for="experience in data.experiences"
              :key="experience.id"
            >
              <header>
                <div>
                  <h3>{{ experience.position }}</h3>
                  <span>{{ experience.company }} · {{ experience.location }}</span>
                </div>
                <span class="resume-bold__dates">{{ experience.startDate }} – {{ experience.endDate }}</span>
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

        <section class="resume-bold__card">
          <h2>Formation</h2>
          <div class="resume-bold__card-content">
            <article
              v-for="school in data.education"
              :key="school.id"
            >
              <header>
                <div>
                  <h3>{{ school.degree }}</h3>
                  <span>{{ school.institution }} · {{ school.location }}</span>
                </div>
                <span class="resume-bold__dates">{{ school.startDate }} – {{ school.endDate }}</span>
              </header>
              <p>{{ school.details }}</p>
            </article>
          </div>
        </section>

        <section
          v-if="data.projects.length"
          class="resume-bold__card"
        >
          <h2>Projets</h2>
          <div class="resume-bold__card-content resume-bold__card-content--grid">
            <article
              v-for="project in data.projects"
              :key="project.id"
            >
              <h3>{{ project.name }}</h3>
              <p>{{ project.description }}</p>
              <span>{{ project.link }}</span>
            </article>
          </div>
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
  background: var(--resume-background);
  color: var(--resume-text);
  min-height: 100%;
}

.resume-bold__layout {
  display: grid;
  grid-template-columns: 260px 1fr;
  min-height: 100%;
  border-radius: 18px;
  overflow: hidden;
}

.resume-bold__sidebar {
  background: var(--resume-primary);
  color: #ffffff;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 28px 24px;
}

.resume-bold__identity h1 {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
}

.resume-bold__identity p {
  margin: 6px 0 0;
  font-size: 14px;
  opacity: 0.85;
}

.resume-bold__section h2 {
  margin: 0 0 10px;
  font-size: 13px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  opacity: 0.7;
}

.resume-bold__section p {
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
}

.resume-bold__section ul {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 8px;
  font-size: 13px;
}

.resume-bold__chips {
  display: grid;
  gap: 8px;
}

.resume-bold__chips li {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  padding: 8px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.resume-bold__chips small {
  font-size: 11px;
  opacity: 0.7;
}

.resume-bold__links li {
  display: flex;
  flex-direction: column;
  gap: 4px;
  opacity: 0.85;
}

.resume-bold__links span:last-child {
  font-size: 12px;
  opacity: 0.65;
  word-break: break-all;
}

.resume-bold__interests {
  display: grid;
  gap: 6px;
}

.resume-bold__content {
  background: #f8fafc;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.resume-bold__card {
  background: #ffffff;
  border-radius: 18px;
  padding: 22px 24px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.12);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.resume-bold__card h2 {
  margin: 0;
  font-size: 16px;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: var(--resume-secondary);
}

.resume-bold__card-content {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.resume-bold__card-content article {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(15, 23, 42, 0.08);
}

.resume-bold__card-content article:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.resume-bold__card-content header {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.resume-bold__card-content h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.resume-bold__card-content span {
  font-size: 13px;
  color: rgba(15, 23, 42, 0.6);
}

.resume-bold__card-content p {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
}

.resume-bold__card-content ul {
  margin: 0;
  padding-left: 18px;
  font-size: 13px;
  display: grid;
  gap: 6px;
}

.resume-bold__dates {
  font-weight: 600;
  color: var(--resume-primary);
}

.resume-bold__card-content--grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.resume-bold__card-content--grid article {
  border-bottom: none;
  padding: 0;
  background: rgba(59, 130, 246, 0.08);
  border-radius: 16px;
  padding: 14px 16px;
}

.resume-bold__card-content--grid span {
  color: var(--resume-secondary);
  font-size: 12px;
  word-break: break-all;
}

@media (max-width: 1024px) {
  .resume-bold__layout {
    grid-template-columns: 1fr;
  }

  .resume-bold__content {
    padding: 24px;
  }
}

@media (max-width: 768px) {
  .resume-bold__card-content header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
