<script setup lang="ts">
import { computed } from 'vue'

const { data: about } = useContentBlock('about')
const { data: profile } = useContentBlock('profile')

const aboutContent = computed(() => about.value)
const profileContent = computed(() => profile.value)
const fullname = computed(() => {
  if (!profileContent.value) {
    return ''
  }
  return `${profileContent.value.firstname} ${profileContent.value.lastname}`
})
</script>

<template>
  <section id="about">
    <LayoutScrollSmooth>
      <v-container v-if="aboutContent" class="py-16">
        <v-row align="center" justify="center" class="g-8">
          <v-col cols="12" md="6">
            <v-chip color="primary" variant="outlined" class="text-uppercase mb-4">
              {{ aboutContent.label }}
            </v-chip>
            <h2 class="text-h4 font-weight-semibold mb-4">{{ fullname || ' ' }}</h2>
            <div class="text-body-1 text-medium-emphasis d-flex flex-column" style="gap: 12px;">
              <p v-for="intro in aboutContent.introduce" :key="intro">
                {{ intro }}
              </p>
            </div>
            <Button class="mt-8" label="Connect Me" to="/contact" variant="btn-dark" />
          </v-col>
          <v-col cols="12" md="6" v-if="profileContent">
            <v-card elevation="2">
              <v-img
                :src="profileContent.avatar"
                :alt="`${fullname} - ${profileContent.role}`"
                height="360"
                cover
              />
              <v-card-subtitle class="text-medium-emphasis pa-4">
                {{ profileContent.role }}
              </v-card-subtitle>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </LayoutScrollSmooth>
  </section>
</template>
