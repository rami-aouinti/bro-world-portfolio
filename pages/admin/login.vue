<template>
  <div class="admin-login">
    <div class="admin-login__overlay" />
    <v-container class="py-16">
      <v-row justify="center">
        <v-col
          cols="12"
          md="6"
          lg="5"
        >
          <v-card
            class="login-card"
            elevation="0"
            rounded="xl"
          >
            <div class="login-card__header">
              <div class="login-card__badge">
                <span class="login-card__badge-dot" />
                <span class="login-card__badge-text">Admin</span>
              </div>
              <h1 class="login-card__title">Espace administrateur</h1>
              <p class="login-card__subtitle">
                Gérez votre portfolio avec une interface claire et élégante.
              </p>
            </div>

            <v-form
              class="login-form"
              @submit.prevent="handleSubmit"
            >
              <div class="login-form__fields">
                <v-text-field
                  v-model="email"
                  label="Adresse e-mail"
                  type="email"
                  required
                  autocomplete="email"
                  variant="outlined"
                  density="comfortable"
                />
                <v-text-field
                  v-model="password"
                  label="Mot de passe"
                  type="password"
                  required
                  autocomplete="current-password"
                  variant="outlined"
                  density="comfortable"
                />
              </div>

              <v-alert
                v-if="errorMessage"
                type="error"
                variant="tonal"
                class="login-form__alert"
              >
                {{ errorMessage }}
              </v-alert>

              <v-btn
                type="submit"
                color="primary"
                class="text-none login-form__submit"
                :loading="isSubmitting"
              >
                Se connecter
              </v-btn>
            </v-form>

            <div class="login-card__footer">
              <v-alert
                type="info"
                variant="tonal"
                density="compact"
                border="start"
                border-color="primary"
              >
                <p class="font-weight-medium mb-1">Identifiants par défaut</p>
                <p>Utilisateur : <code>admin@example.com</code></p>
                <p>Mot de passe : <code>ChangeMe123!</code></p>
              </v-alert>
              <p class="login-card__help text-medium-emphasis">
                En cas d’oubli, contactez le propriétaire du site pour réinitialiser vos accès.
              </p>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "admin",
});

const email = ref("");
const password = ref("");
const errorMessage = ref("");
const isSubmitting = ref(false);

const sessionCheck = await useAsyncData("admin-session-check", () => $fetch("/api/auth/session"));
if (sessionCheck.data.value?.user) {
  await navigateTo("/admin", { replace: true });
}

async function handleSubmit() {
  errorMessage.value = "";
  isSubmitting.value = true;

  try {
    await $fetch("/api/auth/login", {
      method: "POST",
      body: { email: email.value, password: password.value },
    });
    await navigateTo("/admin", { replace: true });
  } catch (error: any) {
    if (error?.data?.statusMessage) {
      errorMessage.value = error.data.statusMessage;
    } else {
      errorMessage.value = "Une erreur est survenue lors de la connexion.";
    }
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<style scoped>
.admin-login {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 32px 16px;
  background:
    radial-gradient(circle at top left, rgba(59, 130, 246, 0.45), transparent 45%),
    radial-gradient(circle at bottom right, rgba(79, 70, 229, 0.4), transparent 40%),
    linear-gradient(160deg, #0b1120, #111827 55%, #1f2937);
}

.admin-login__overlay {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 25% 30%, rgba(255, 255, 255, 0.15), transparent 55%),
    radial-gradient(circle at 80% 70%, rgba(99, 102, 241, 0.18), transparent 45%),
    linear-gradient(120deg, rgba(255, 255, 255, 0.08), transparent 60%);
  opacity: 0.65;
  filter: blur(40px);
  pointer-events: none;
}

.login-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 40px clamp(24px, 5vw, 48px);
  background: rgba(15, 23, 42, 0.78);
  border: 1px solid rgba(148, 163, 184, 0.25);
  box-shadow: 0 30px 60px -35px rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(20px);
}

.login-card::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(140deg, rgba(37, 99, 235, 0.35), rgba(129, 140, 248, 0.15));
  opacity: 0.6;
  pointer-events: none;
}

.login-card > * {
  position: relative;
  z-index: 1;
}

.login-card__badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(37, 99, 235, 0.12);
  border: 1px solid rgba(96, 165, 250, 0.35);
  color: #93c5fd;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.login-card__badge-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #60a5fa;
  box-shadow: 0 0 0 6px rgba(96, 165, 250, 0.15);
}

.login-card__badge-text {
  font-weight: 600;
}

.login-card__title {
  margin: 20px 0 12px;
  font-size: clamp(1.75rem, 3vw, 2.125rem);
  font-weight: 700;
  color: #e2e8f0;
}

.login-card__subtitle {
  margin: 0;
  color: rgba(226, 232, 240, 0.72);
  font-size: 0.95rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.login-form__fields {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

:deep(.login-form .v-input--density-comfortable .v-field) {
  border-radius: 16px;
}

.login-form__alert {
  border-radius: 16px;
}

.login-form__submit {
  align-self: flex-start;
  padding-inline: 28px;
  border-radius: 999px;
  box-shadow: 0 18px 40px -25px rgba(37, 99, 235, 0.9);
}

.login-card__footer {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.login-card__help {
  margin: 0;
  font-size: 0.875rem;
  color: rgba(226, 232, 240, 0.6);
}

@media (max-width: 959px) {
  .admin-login {
    padding: 24px 12px;
  }

  .login-card {
    padding: 32px 24px;
  }

  .login-form__submit {
    width: 100%;
  }
}
</style>
