<script setup lang="ts">
import { LOCALIZED_PAGE_META } from '~/utils/i18n/routes'
import CustomGlowCard from '~/components/CustomGlowCard.vue'
import Line from "~/components/Layout/Line.vue";
import ScrollSmooth from "~/components/Layout/ScrollSmooth.vue";

definePageMeta(LOCALIZED_PAGE_META.contact)

const contactMethods = [
  {
    icon: 'mdi-email-outline',
    label: 'E-mail',
    value: 'hello@broworld.dev',
    href: 'mailto:hello@broworld.dev'
  },
  {
    icon: 'mdi-map-marker',
    label: 'Localisation',
    value: 'Jakarta, Indonésie'
  },
  {
    icon: 'mdi-clock-outline',
    label: 'Disponibilité',
    value: 'Du lundi au vendredi, 9h – 18h (GMT+7)'
  }
]
</script>

<template>
  <Line />
  <ScrollSmooth>
    <v-container class="py-6">
      <v-row justify="center" align="stretch" style="row-gap: 32px;">
        <v-col cols="12" md="7">
          <v-chip color="primary" variant="outlined" class="text-uppercase mb-4">Contact</v-chip>
          <h1 class="text-h4 text-white font-weight-bold">
            Créons quelque chose de remarquable ensemble.
          </h1>
          <p class="text-body-1 text-white mt-4">
            Une question, une idée de projet ou simplement l’envie d’échanger ? Écrivez-moi. J’adore relever de nouveaux défis et concevoir des expériences intuitives.
          </p>
          <v-form class="mt-8 text-white" @submit.prevent>
            <v-row align="stretch" style="row-gap: 16px;">
              <v-col cols="12" md="6">
                <v-text-field label="Nom" autocomplete="name" variant="outlined" density="comfortable" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field label="E-mail" type="email" autocomplete="email" variant="outlined" density="comfortable" />
              </v-col>
            </v-row>
            <v-textarea
              label="Détails du projet"
              rows="6"
              variant="outlined"
              density="comfortable"
              placeholder="Parlez-moi de votre projet, du calendrier et des objectifs."
            />
            <v-btn type="submit" color="primary" class="text-none mt-4">
              Envoyer le message
            </v-btn>
          </v-form>
        </v-col>
        <v-col cols="12" md="5">
          <CustomGlowCard
            class="contact__card"
            title="Contact direct"
            description="Besoin d’un échange rapide ? Laissez-moi un message et je vous répondrai sous un jour ouvré."
            badge="Discutons"
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
                <span class="contact__footer-label">Planifier un appel</span>
                <Button to="https://cal.com/" label="Restons en contact" variant="btn-dark" />
              </div>
            </template>
          </CustomGlowCard>
        </v-col>
      </v-row>
    </v-container>
  </ScrollSmooth>
  <Line />
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
