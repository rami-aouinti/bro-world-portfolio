<script setup lang="ts">
import { LOCALIZED_PAGE_META } from '~/utils/i18n/routes'

definePageMeta(LOCALIZED_PAGE_META.contact)
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
          <v-card elevation="2" class="h-100 d-flex flex-column" style="gap: 24px; padding: 24px;">
            <div class="text-start">
              <h2 class="text-h5 font-weight-semibold">Direct Contact</h2>
              <p class="text-body-2 text-medium-emphasis mt-2">
                Prefer a quick chat? Drop me a message and I’ll get back to you within one business day.
              </p>
            </div>
            <v-list lines="two" density="comfortable">
              <v-list-item>
                <template #prepend>
                  <v-avatar color="primary" size="40">
                    <v-icon icon="mdi-email-outline" />
                  </v-avatar>
                </template>
                <v-list-item-title>Email</v-list-item-title>
                <v-list-item-subtitle>
                  <a href="mailto:hello@broworld.dev">hello@broworld.dev</a>
                </v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <template #prepend>
                  <v-avatar color="primary" size="40">
                    <v-icon icon="mdi-map-marker" />
                  </v-avatar>
                </template>
                <v-list-item-title>Location</v-list-item-title>
                <v-list-item-subtitle>Jakarta, Indonesia</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <template #prepend>
                  <v-avatar color="primary" size="40">
                    <v-icon icon="mdi-clock-outline" />
                  </v-avatar>
                </template>
                <v-list-item-title>Availability</v-list-item-title>
                <v-list-item-subtitle>Weekdays, 9am – 6pm (GMT+7)</v-list-item-subtitle>
              </v-list-item>
            </v-list>
            <div class="mt-auto">
              <Button to="https://cal.com/" label="Schedule a Call" variant="btn-dark" />
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </LayoutScrollSmooth>
  <LayoutLine />
</template>
