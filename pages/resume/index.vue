<template>
  <v-container class="resume-builder py-12">
    <v-row>
      <v-col cols="12">
        <div class="resume-builder__hero">
          <div class="resume-builder__headline">
            <span class="resume-builder__badge">Nouvelle fonctionnalité</span>
            <h1>Générez un CV élégant en quelques minutes</h1>
            <p>
              Saisissez vos informations, choisissez un template parmi cinq styles professionnels, ajustez les couleurs et
              exportez instantanément un PDF prêt à être partagé.
            </p>
          </div>
        </div>
      </v-col>
    </v-row>

    <v-row class="resume-builder__layout" align="stretch">
      <v-col
        cols="12"
        lg="5"
      >
        <ResumeForm />
      </v-col>
      <v-col
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
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
  margin-bottom: 32px;
  padding: 32px;
  border-radius: 28px;
  background:
    radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.2), transparent 55%),
    radial-gradient(circle at 80% 15%, rgba(236, 72, 153, 0.2), transparent 60%),
    linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 0.75));
  color: #f8fafc;
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

.resume-builder__layout {
  gap: 24px 0;
}

@media (max-width: 1024px) {
  .resume-builder__hero {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
