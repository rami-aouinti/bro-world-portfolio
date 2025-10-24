<script setup lang="ts">

import { LOCALIZED_PAGE_META } from '~/utils/i18n/routes'
import CustomGlowCard from '~/components/CustomGlowCard.vue'
import Line from "~/components/Layout/Line.vue";
import ScrollSmooth from "~/components/Layout/ScrollSmooth.vue";

definePageMeta(LOCALIZED_PAGE_META.contact)

const { t } = useI18n()

const contactMethods = computed(() => [
  {
    icon: 'mdi-email-outline',
    label: t('portfolio.contact.methods.email.label'),
    value: t('portfolio.contact.methods.email.value'),
    href: 'mailto:hello@broworld.dev'
  },
  {
    icon: 'mdi-map-marker',
    label: t('portfolio.contact.methods.location.label'),
    value: t('portfolio.contact.methods.location.value')
  },
  {
    icon: 'mdi-clock-outline',
    label: t('portfolio.contact.methods.availability.label'),
    value: t('portfolio.contact.methods.availability.value')
  }
])
</script>

<template>
  <ScrollSmooth>
    <v-container class="py-6">
      <v-row justify="center" align="stretch" style="row-gap: 32px;">
        <v-col cols="12" md="7">
          <h1 class="text-h4 text-foreground font-weight-bold">
            {{ t('portfolio.contact.title') }}
          </h1>
          <p class="text-body-1 text-foreground mt-4">
            {{ t('portfolio.contact.description') }}
          </p>
          <v-form class="mt-8 text-foreground" @submit.prevent>
            <v-row align="stretch" style="row-gap: 16px;">
              <v-col cols="12" md="6">
                <v-text-field
                  :label="t('portfolio.contact.form.nameLabel')"
                  autocomplete="name"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  :label="t('portfolio.contact.form.emailLabel')"
                  type="email"
                  autocomplete="email"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>
            </v-row>
            <v-textarea
              :label="t('portfolio.contact.form.projectDetailsLabel')"
              rows="6"
              variant="outlined"
              density="comfortable"
              :placeholder="t('portfolio.contact.form.projectDetailsPlaceholder')"
            />
            <v-btn type="submit" color="primary" class="text-none mt-4">
              {{ t('portfolio.contact.form.submit') }}
            </v-btn>
          </v-form>
        </v-col>
        <v-col cols="12" md="5">
          <CustomGlowCard
            class="contact__card"
            :title="t('portfolio.contact.card.title')"
            :description="t('portfolio.contact.card.description')"
            :badge="t('portfolio.contact.card.badge')"
            variant="rose"
          >
            <div class="contact__methods">
              <div v-for="method in contactMethods" :key="method.label" class="contact__method">
                <v-icon :icon="method.icon" class="contact__icon" size="26" />
                <div>
                  <p class="contact__method-label">{{ method.label }}</p>
                  <p class="contact__method-value">
                    <a v-if="method.href" :href="method.href">{{ method.value }}</a>
                    <span v-else>{{ method.value }}</span>
                  </p>
                </div>
              </div>
            </div>
            <template #footer>
              <div class="contact__footer">
                <span class="contact__footer-label">{{ t('portfolio.contact.card.footerLabel') }}</span>
                <Button
                  to="https://cal.com/"
                  :label="t('portfolio.contact.card.footerCta')"
                  variant="btn-dark"
                />
              </div>
            </template>
          </CustomGlowCard>
        </v-col>
      </v-row>
    </v-container>
  </ScrollSmooth>
</template>

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
