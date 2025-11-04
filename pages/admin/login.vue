<template>
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
            <span class="login-card__badge-text">{{ t("admin.login.badge") }}</span>
          </div>
          <h3 class="login-card__title">{{ t("admin.login.title") }}</h3>
        </div>

        <v-form
            class="login-form"
            @submit.prevent="handleSubmit"
        >
          <div class="login-form__fields">
            <v-text-field
                v-model="identifier"
                :label="t('admin.login.form.email')"
                type="text"
                required
                autocomplete="username"
                variant="outlined"
                density="comfortable"
            />
            <v-text-field
                v-model="password"
                :label="t('admin.login.form.password')"
                type="password"
                required
                autocomplete="current-password"
                variant="outlined"
                density="comfortable"
            />
          </div>

          <v-alert
              v-if="sessionNotice"
              type="info"
              variant="tonal"
              class="login-form__alert"
          >
            {{ sessionNotice }}
          </v-alert>

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
            {{ t("admin.login.form.submit") }}
          </v-btn>
        </v-form>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { useAuthSession } from "~/stores/auth-session";

definePageMeta({
  layout: "admin",
});

const { t } = useI18n();
const auth = useAuthSession();

await auth.initialize();

if (auth.isAuthenticated.value) {
  await navigateTo("/admin", { replace: true });
}

const identifier = ref("");
const password = ref("");
const localError = ref<string | null>(null);
const sessionNotice = ref(auth.consumeSessionMessage());

watch(
  () => auth.sessionMessage.value,
  (value) => {
    if (value) {
      sessionNotice.value = value;
      auth.consumeSessionMessage();
    }
  },
);

watch([identifier, password], () => {
  localError.value = null;
  auth.clearLoginError();
});

const isSubmitting = computed(() => auth.isLoggingIn.value);
const errorMessage = computed(() => localError.value ?? auth.loginError.value ?? "");

async function handleSubmit() {
  localError.value = null;

  const success = await auth.login({
    identifier: identifier.value,
    password: password.value,
  });

  if (success) {
    const redirectTo = auth.consumeRedirect() ?? "/admin";
    await navigateTo(redirectTo, { replace: true });
    return;
  }

  if (!auth.loginError.value) {
    localError.value = t("admin.login.form.error");
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
  font-size: clamp(1.25rem, 3vw, 1.75rem);
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
