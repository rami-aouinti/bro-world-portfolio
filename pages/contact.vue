<template>
  <ScrollSmooth>
    <v-container class="mt-10">
      <v-row
        justify="center"
        align="stretch"
        style="row-gap: 32px"
      >
        <v-col
          cols="12"
          md="7"
        >
          <h1 class="text-h4 text-foreground font-weight-bold">
            {{ t("portfolio.contact.title") }}
          </h1>
          <p class="text-body-1 text-foreground mt-4">
            {{ t("portfolio.contact.description") }}
          </p>
          <v-form
            ref="formRef"
            class="mt-8 text-foreground"
            @submit.prevent="handleSubmit"
          >
            <v-alert
              v-if="status === 'success'"
              type="success"
              variant="tonal"
              class="mb-4"
              :text="t('portfolio.contact.form.success')"
            />
            <v-alert
              v-else-if="status === 'error'"
              type="error"
              variant="tonal"
              class="mb-4"
              :text="submitError ?? t('portfolio.contact.form.error')"
            />
            <v-row
              align="stretch"
              style="row-gap: 16px"
            >
              <v-col
                cols="12"
                md="6"
              >
                <v-text-field
                  v-model="form.name"
                  :label="t('portfolio.contact.form.nameLabel')"
                  autocomplete="name"
                  variant="outlined"
                  density="comfortable"
                  :rules="[rules.name]"
                  :disabled="isSubmitting"
                />
              </v-col>
              <v-col
                cols="12"
                md="6"
              >
                <v-text-field
                  v-model="form.email"
                  :label="t('portfolio.contact.form.emailLabel')"
                  type="email"
                  autocomplete="email"
                  variant="outlined"
                  density="comfortable"
                  :rules="[rules.email]"
                  :disabled="isSubmitting"
                />
              </v-col>
            </v-row>
            <v-textarea
              v-model="form.message"
              :label="t('portfolio.contact.form.projectDetailsLabel')"
              rows="6"
              variant="outlined"
              density="comfortable"
              :placeholder="t('portfolio.contact.form.projectDetailsPlaceholder')"
              :rules="[rules.message]"
              :disabled="isSubmitting"
            />
            <v-btn
              type="submit"
              color="primary"
              class="text-none mt-4"
              :loading="isSubmitting"
              :disabled="isSubmitting"
            >
              {{ t("portfolio.contact.form.submit") }}
            </v-btn>
          </v-form>
        </v-col>
        <v-col
          cols="12"
          md="5"
        >
          <CustomGlowCard
            class="contact__card"
            :title="t('portfolio.contact.card.title')"
            :description="t('portfolio.contact.card.description')"
            :badge="t('portfolio.contact.card.badge')"
            variant="primary"
            :heading-level="2"
          >
            <div class="contact__methods">
              <div
                v-for="method in contactMethods"
                :key="method.label"
                class="contact__method"
              >
                <v-icon
                  :icon="method.icon"
                  class="contact__icon"
                  size="26"
                />
                <div>
                  <p class="contact__method-label">{{ method.label }}</p>
                  <p class="contact__method-value">
                    <a
                      v-if="method.href"
                      :href="method.href"
                      >{{ method.value }}</a
                    >
                    <span v-else>{{ method.value }}</span>
                  </p>
                </div>
              </div>
            </div>
            <template #footer>
              <div class="contact__footer">
                <span class="contact__footer-label">{{
                  t("portfolio.contact.card.footerLabel")
                }}</span>
                <v-btn
                  :href="schedulingLink"
                  :label="t('portfolio.contact.card.footerCta')"
                  target="_blank"
                  variant="flat"
                  rounded="pill"
                  class="app-button text-none"
                >
                  {{ t("portfolio.contact.card.footerCta") }}
                </v-btn>
              </div>
            </template>
          </CustomGlowCard>
        </v-col>
      </v-row>
    </v-container>
  </ScrollSmooth>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import type { VForm } from "vuetify/components";
import { LOCALIZED_PAGE_META } from "~/utils/i18n/routes";
import CustomGlowCard from "~/components/CustomGlowCard.vue";
import ScrollSmooth from "~/components/layout/ScrollSmooth.vue";

definePageMeta({
  ...LOCALIZED_PAGE_META.contact,
});

const { t } = useI18n();

const formRef = ref<InstanceType<typeof VForm> | null>(null);
const isSubmitting = ref(false);
const status = ref<"idle" | "success" | "error">("idle");
const submitError = ref<string | null>(null);
const form = reactive({
  name: "",
  email: "",
  message: "",
});

const rules = {
  name: (value: string) => {
    const normalized = value?.trim() ?? "";
    return normalized.length > 0 || t("portfolio.contact.form.nameRequired");
  },
  email: (value: string) => {
    const normalized = value?.trim() ?? "";
    if (!normalized) {
      return t("portfolio.contact.form.emailRequired");
    }
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(normalized) || t("portfolio.contact.form.emailRequired");
  },
  message: (value: string) => {
    const normalized = value?.trim() ?? "";
    return normalized.length > 0 || t("portfolio.contact.form.messageRequired");
  },
};

function resolveErrorMessage(error: unknown) {
  if (!error || typeof error !== "object") {
    return null;
  }

  if ("data" in error) {
    const data = (error as { data?: unknown }).data;
    if (data && typeof data === "object" && "statusMessage" in data) {
      const message = (data as { statusMessage?: unknown }).statusMessage;
      if (typeof message === "string" && message.trim()) {
        return message;
      }
    }
  }

  if ("statusMessage" in error) {
    const message = (error as { statusMessage?: unknown }).statusMessage;
    if (typeof message === "string" && message.trim()) {
      return message;
    }
  }

  if ("message" in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === "string" && message.trim()) {
      return message;
    }
  }

  return null;
}

function resetForm() {
  form.name = "";
  form.email = "";
  form.message = "";
  formRef.value?.resetValidation();
}

async function handleSubmit() {
  submitError.value = null;
  status.value = "idle";

  const validationResult = await formRef.value?.validate();
  if (validationResult && !validationResult.valid) {
    return;
  }

  isSubmitting.value = true;

  try {
    await $fetch("/api/contact", {
      method: "POST",
      body: {
        name: form.name.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
      },
    });

    status.value = "success";
    resetForm();
  } catch (error) {
    status.value = "error";
    submitError.value = resolveErrorMessage(error);
  } finally {
    isSubmitting.value = false;
  }
}

const contactEmailHref = computed(() =>
  import.meta.dev ? "mailto:hello@example.dev" : "mailto:rami.aouinti@gmail.com",
);

const contactEmailValue = computed(() =>
  import.meta.dev ? t("portfolio.contact.methods.email.value") : "rami.aouinti@gmail.com",
);

const contactLocationValue = computed(() =>
  import.meta.dev ? t("portfolio.contact.methods.location.value") : "Köln, Germany",
);

const contactMethods = computed(() => [
  {
    icon: "mdi-email-outline",
    label: t("portfolio.contact.methods.email.label"),
    value: contactEmailValue.value,
    href: contactEmailHref.value,
  },
  {
    icon: "mdi-map-marker",
    label: t("portfolio.contact.methods.location.label"),
    value: contactLocationValue.value,
  },
  {
    icon: "mdi-clock-outline",
    label: t("portfolio.contact.methods.availability.label"),
    value: t("portfolio.contact.methods.availability.value"),
  },
]);

const schedulingLink = computed(() =>
  import.meta.dev ? "https://cal.com/example-consultation" : "https://cal.com/aouinti-rami",
);
</script>

<style scoped>
.contact__card {
  height: 100%;
}

.contact__methods {
  display: grid;
  gap: 18px;
}

.contact__method {
  display: flex;
  gap: 16px;
  align-items: center;
}

.contact__icon {
  color: var(--card-accent);
  background: color-mix(in srgb, var(--card-accent) 25%, transparent);
  border-radius: 12px;
  padding: 10px;
}

.contact__method-label {
  margin: 0;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.contact__method-value {
  margin: 4px 0 0;
  color: rgba(226, 232, 240, 0.85);
}

.contact__method-value a {
  color: inherit;
  text-decoration: none;
}

.contact__method-value a:hover {
  text-decoration: underline;
}

.contact__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.contact__footer-label {
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.75rem;
  color: color-mix(in srgb, var(--card-text-color) 65%, white 35%);
}
</style>
