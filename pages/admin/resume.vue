<template>
  <v-container class="admin-resume py-10">
    <v-row>
      <v-col cols="12">
        <v-card
          class="admin-resume__hero"
          elevation="0"
          rounded="xl"
        >
          <div class="admin-resume__hero-glow" />
          <v-card-text class="admin-resume__hero-content">
            <div class="admin-resume__hero-text">
              <span class="admin-resume__badge">{{ t('admin.resume.badge') }}</span>
              <h1 class="admin-resume__title">{{ t('admin.resume.title') }}</h1>
              <p class="admin-resume__subtitle">
                {{ t('admin.resume.subtitle') }}
              </p>
            </div>
            <div class="admin-resume__hero-actions">
              <v-chip
                color="primary"
                variant="outlined"
                size="large"
                class="text-uppercase"
              >
                {{ t('admin.resume.privateLabel') }}
              </v-chip>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

  <v-row
      class="admin-resume__layout"
      align="stretch"
    >
      <v-col
        cols="12"
        lg="5"
      >
        <v-card
          class="admin-resume__panel"
          elevation="0"
          rounded="xl"
        >
          <v-card-text class="admin-resume__panel-content">
            <ResumeForm />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col
        cols="12"
        lg="7"
      >
        <v-card
          class="admin-resume__panel"
          elevation="0"
          rounded="xl"
        >
          <v-card-text class="admin-resume__panel-content">
            <ResumePreview />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <PlatformResumeManager />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import ResumeForm from "~/components/resume/ResumeForm.vue";
import ResumePreview from "~/components/resume/ResumePreview.vue";
import PlatformResumeManager from "~/components/admin/resume/PlatformResumeManager.vue";

definePageMeta({
  middleware: "auth",
  layout: "admin",
});

useSeoMeta({
  title: "Générateur de CV",
  ogTitle: "Générateur de CV | Bro World",
  description:
    "Créez un CV moderne depuis vos données enregistrées, personnalisez le design et exportez un PDF en un clic.",
});

const { t } = useI18n();
</script>

<style scoped>
.admin-resume {
  max-width: 1320px;
}

.admin-resume__hero {
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(59, 130, 246, 0.18);
  background:
    radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.18), transparent 55%),
    radial-gradient(circle at 80% 15%, rgba(236, 72, 153, 0.18), transparent 60%),
    linear-gradient(135deg, rgba(15, 23, 42, 0.96), rgba(15, 23, 42, 0.82));
}

.admin-resume__hero-glow {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(circle at 15% 20%, rgba(59, 130, 246, 0.35), transparent 60%),
    radial-gradient(circle at 80% 80%, rgba(236, 72, 153, 0.28), transparent 65%);
  opacity: 0.75;
}

.admin-resume__hero-content {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 32px;
  padding: clamp(32px, 6vw, 44px);
  color: #f8fafc;
}

.admin-resume__hero-text {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 560px;
}

.admin-resume__badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  width: fit-content;
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  background: rgba(59, 130, 246, 0.22);
  color: #bfdbfe;
}

.admin-resume__title {
  margin: 0;
  font-size: clamp(28px, 3vw + 12px, 40px);
  font-weight: 700;
  letter-spacing: -0.01em;
}

.admin-resume__subtitle {
  margin: 0;
  font-size: 16px;
  line-height: 1.7;
  color: rgba(226, 232, 240, 0.92);
}

.admin-resume__hero-actions {
  display: flex;
  align-items: flex-start;
}

.admin-resume__layout {
  gap: 24px 0;
  margin-top: 32px;
}

.admin-resume__panel {
  border: 1px solid rgba(59, 130, 246, 0.12);
  background: rgba(15, 23, 42, 0.92);
  box-shadow: 0 30px 60px -35px rgba(15, 23, 42, 0.65);
}

.admin-resume__panel-content {
  padding: clamp(22px, 3vw, 30px);
}

.admin-resume :deep(.resume-form) {
  background: transparent;
}

.admin-resume :deep(.resume-preview) {
  background: transparent;
}

@media (max-width: 1024px) {
  .admin-resume__hero-content {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
