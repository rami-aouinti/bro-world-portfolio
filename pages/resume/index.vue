<template>
  <v-container class="resume-builder py-12">
    <v-row
      class="resume-builder__hero"
      align="center"
      justify="space-between"
    >
      <v-col
        cols="12"
        lg="6"
      >
        <div class="resume-builder__headline">
          <span class="resume-builder__badge">Nouvelle fonctionnalité</span>
          <h1>Générez un CV élégant en quelques minutes</h1>
          <p>
            Saisissez vos informations, choisissez un template parmi cinq styles professionnels, ajustez les couleurs et exportez
            instantanément un PDF prêt à être partagé.
          </p>

          <div class="resume-builder__actions">
            <v-btn
              color="primary"
              class="text-none"
              prepend-icon="mdi-auto-fix"
              @click="scrollToSection('resume-form')"
            >
              Commencer la création
            </v-btn>
            <v-btn
              variant="text"
              class="text-none resume-builder__cta-secondary"
              append-icon="mdi-eye-outline"
              @click="scrollToSection('resume-preview')"
            >
              Voir un exemple
            </v-btn>
          </div>

          <ul class="resume-builder__benefits">
            <li
              v-for="benefit in heroBenefits"
              :key="benefit.title"
            >
              <div class="resume-builder__benefit-icon">
                <v-icon
                  :icon="benefit.icon"
                  size="22"
                />
              </div>
              <div class="resume-builder__benefit-text">
                <strong>{{ benefit.title }}</strong>
                <span>{{ benefit.description }}</span>
              </div>
            </li>
          </ul>
        </div>
      </v-col>
      <v-col
        cols="12"
        lg="6"
        class="d-flex justify-center"
      >
        <div
          class="resume-builder__visual"
          aria-hidden="true"
        >
          <div class="resume-builder__visual-card">
            <div class="resume-builder__visual-header">
              <span class="resume-builder__visual-avatar" />
              <div class="resume-builder__visual-lines">
                <span />
                <span />
              </div>
            </div>
            <div class="resume-builder__visual-body">
              <div class="resume-builder__visual-column">
                <span class="resume-builder__visual-chip" />
                <span class="resume-builder__visual-line" />
                <span class="resume-builder__visual-line" />
                <span class="resume-builder__visual-line" />
              </div>
              <div class="resume-builder__visual-column resume-builder__visual-column--right">
                <span class="resume-builder__visual-block" />
                <span class="resume-builder__visual-block" />
              </div>
            </div>
            <div class="resume-builder__visual-footer">
              <span />
              <span />
              <span />
            </div>
          </div>
          <div class="resume-builder__visual-orb resume-builder__visual-orb--primary" />
          <div class="resume-builder__visual-orb resume-builder__visual-orb--secondary" />
        </div>
      </v-col>
    </v-row>

    <v-row class="resume-builder__layout" align="stretch">
      <v-col
        id="resume-form"
        cols="12"
        lg="5"
      >
        <ResumeForm />
      </v-col>
      <v-col
        id="resume-preview"
        cols="12"
        lg="7"
      >
        <ResumePreview />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import ResumeForm from "~/components/resume/ResumeForm.vue";
import ResumePreview from "~/components/resume/ResumePreview.vue";

const heroBenefits = [
  {
    title: "Modèles professionnels",
    description: "5 styles prêts à l'emploi, inspirés des meilleurs portfolios.",
    icon: "mdi-briefcase-check-outline",
  },
  {
    title: "Ajustements instantanés",
    description: "Vos modifications sont reflétées en direct dans l'aperçu.",
    icon: "mdi-update",
  },
  {
    title: "Export PDF haute qualité",
    description: "Récupérez un document optimisé pour l'impression en un clic.",
    icon: "mdi-file-download-outline",
  },
];

function scrollToSection(id: string) {
  if (!import.meta.client) {
    return;
  }

  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

definePageMeta({
  layout: "default",
});

useSeoMeta({
  title: "Générateur de CV",
  ogTitle: "Générateur de CV | Bro World",
  description:
    "Créez un CV moderne depuis vos données enregistrées, personnalisez le design et exportez un PDF en un clic.",
});
</script>

<style scoped>
.resume-builder {
  max-width: 1320px;
}

.resume-builder__hero {
  position: relative;
  margin-bottom: 48px;
  padding: clamp(24px, 4vw, 40px);
  border-radius: 36px;
  background:
    radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.25), transparent 60%),
    radial-gradient(circle at 85% 10%, rgba(236, 72, 153, 0.22), transparent 55%),
    linear-gradient(135deg, rgba(15, 23, 42, 0.96), rgba(15, 23, 42, 0.76));
  color: #f8fafc;
  overflow: hidden;
}

.resume-builder__hero::after {
  content: "";
  position: absolute;
  inset: 12px;
  border-radius: 28px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  pointer-events: none;
}

.resume-builder__headline {
  max-width: 560px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.resume-builder__headline h1 {
  margin: 0;
  font-size: 34px;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.resume-builder__headline p {
  margin: 0;
  font-size: 16px;
  line-height: 1.7;
  color: rgba(226, 232, 240, 0.92);
}

.resume-builder__badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  width: fit-content;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  background: rgba(59, 130, 246, 0.18);
  color: #bfdbfe;
}

.resume-builder__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.resume-builder__cta-secondary {
  color: #bfdbfe !important;
}

.resume-builder__benefits {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin: 16px 0 0;
  padding: 0;
  list-style: none;
}

.resume-builder__benefits li {
  display: flex;
  gap: 12px;
  padding: 16px;
  border-radius: 18px;
  background: rgba(15, 23, 42, 0.45);
  border: 1px solid rgba(148, 163, 184, 0.2);
}

.resume-builder__benefit-icon {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(59, 130, 246, 0.18);
  color: #bfdbfe;
}

.resume-builder__benefit-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 13px;
  color: rgba(226, 232, 240, 0.88);
}

.resume-builder__benefit-text strong {
  font-size: 14px;
  color: #f8fafc;
}

.resume-builder__visual {
  position: relative;
  width: min(420px, 100%);
  aspect-ratio: 4 / 5;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 36px;
  padding: 28px;
  background:
    radial-gradient(circle at 25% 20%, rgba(59, 130, 246, 0.28), transparent 65%),
    radial-gradient(circle at 80% 80%, rgba(236, 72, 153, 0.25), transparent 60%),
    linear-gradient(145deg, rgba(15, 23, 42, 0.85), rgba(15, 23, 42, 0.55));
  overflow: hidden;
}

.resume-builder__visual-card {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 24px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  background: rgba(15, 23, 42, 0.72);
  border: 1px solid rgba(148, 163, 184, 0.24);
  box-shadow: 0 30px 60px -40px rgba(15, 23, 42, 0.7);
}

.resume-builder__visual-header {
  display: flex;
  align-items: center;
  gap: 14px;
}

.resume-builder__visual-avatar {
  width: 52px;
  height: 52px;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(96, 165, 250, 0.9), rgba(129, 140, 248, 0.9));
}

.resume-builder__visual-lines {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
}

.resume-builder__visual-lines span {
  display: block;
  height: 6px;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.35);
}

.resume-builder__visual-lines span:first-child {
  width: 60%;
}

.resume-builder__visual-body {
  display: grid;
  grid-template-columns: 1fr 0.8fr;
  gap: 18px;
  flex-grow: 1;
}

.resume-builder__visual-column {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.resume-builder__visual-chip {
  display: block;
  width: 80px;
  height: 22px;
  border-radius: 999px;
  background: rgba(59, 130, 246, 0.4);
}

.resume-builder__visual-line {
  display: block;
  height: 10px;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.25);
}

.resume-builder__visual-column--right {
  justify-content: flex-start;
}

.resume-builder__visual-block {
  display: block;
  height: 82px;
  border-radius: 18px;
  background: rgba(79, 70, 229, 0.35);
}

.resume-builder__visual-footer {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.resume-builder__visual-footer span {
  display: block;
  height: 12px;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.25);
}

.resume-builder__visual-orb {
  position: absolute;
  border-radius: 999px;
  filter: blur(0.5px);
  opacity: 0.8;
}

.resume-builder__visual-orb--primary {
  width: 180px;
  height: 180px;
  bottom: -40px;
  right: -30px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.4), transparent 65%);
  animation: resume-orb 12s ease-in-out infinite;
}

.resume-builder__visual-orb--secondary {
  width: 140px;
  height: 140px;
  top: -30px;
  left: -40px;
  background: radial-gradient(circle, rgba(236, 72, 153, 0.35), transparent 60%);
  animation: resume-orb 10s ease-in-out infinite reverse;
}

@keyframes resume-orb {
  0%,
  100% {
    transform: translate3d(0, 0, 0);
  }

  50% {
    transform: translate3d(12px, -12px, 0);
  }
}

.resume-builder__layout {
  gap: 24px 0;
}

@media (max-width: 1024px) {
  .resume-builder__hero {
    flex-direction: column;
    align-items: flex-start;
  }

  .resume-builder__visual {
    margin-top: 16px;
  }
}
</style>
