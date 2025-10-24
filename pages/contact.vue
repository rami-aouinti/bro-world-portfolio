<script setup lang="ts">
import { LOCALIZED_PAGE_META } from '~/utils/i18n/routes'
import CustomGlowCard from '~/components/CustomGlowCard.vue'

definePageMeta(LOCALIZED_PAGE_META.contact)

const contactMethods = [
  {
    icon: 'mdi-email-outline',
    label: 'Email',
    value: 'hello@broworld.dev',
    href: 'mailto:hello@broworld.dev'
  },
  {
    icon: 'mdi-map-marker',
    label: 'Location',
    value: 'Jakarta, Indonesia'
  },
  {
    icon: 'mdi-clock-outline',
    label: 'Availability',
    value: 'Weekdays, 9am – 6pm (GMT+7)'
  }
]
</script>

<template>
  <LayoutLine />
  <LayoutScrollSmooth>
    <v-container class="py-16">
      <v-row justify="center" align="stretch" style="row-gap: 32px;">
        <v-col cols="12" md="7">
          <v-chip color="primary" variant="outlined" class="text-uppercase mb-4">Contact</v-chip>
          <h1 class="text-h4 font-weight-semibold">
            Let’s create something remarkable together.
          </h1>
          <p class="text-body-1 text-medium-emphasis mt-4">
            Whether you have a question, a project idea, or just want to say hello, feel free to reach out. I’m always excited to collaborate on new challenges and craft intuitive experiences.
          </p>
          <v-form class="mt-8" @submit.prevent>
            <v-row align="stretch" style="row-gap: 16px;">
              <v-col cols="12" md="6">
                <v-text-field label="Name" autocomplete="name" variant="outlined" density="comfortable" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field label="Email" type="email" autocomplete="email" variant="outlined" density="comfortable" />
              </v-col>
            </v-row>
            <v-textarea
              label="Project Details"
              rows="6"
              variant="outlined"
              density="comfortable"
              placeholder="Tell me more about your project, timeline, and goals."
            />
            <v-btn type="submit" color="primary" class="text-none mt-4">
              Send Message
            </v-btn>
          </v-form>
        </v-col>
        <v-col cols="12" md="5">
          <CustomGlowCard
            class="contact__card"
            title="Direct Contact"
            description="Prefer a quick chat? Drop me a message and I’ll get back to you within one business day."
            badge="Let's talk"
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
                <span class="contact__footer-label">Schedule a call</span>
                <Button to="https://cal.com/" label="Let's connect" variant="btn-dark" />
              </div>
            </template>
          </CustomGlowCard>
        </v-col>
      </v-row>
    </v-container>
  </LayoutScrollSmooth>
  <LayoutLine />
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
