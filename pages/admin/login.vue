<script setup lang="ts">
const email = ref('')
const password = ref('')
const errorMessage = ref('')
const isSubmitting = ref(false)

const sessionCheck = await useAsyncData('admin-session-check', () => $fetch('/api/auth/session'))
if (sessionCheck.data.value?.user) {
  await navigateTo('/admin', { replace: true })
}

async function handleSubmit() {
  errorMessage.value = ''
  isSubmitting.value = true

  try {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: { email: email.value, password: password.value }
    })
    await navigateTo('/admin', { replace: true })
  }
  catch (error: any) {
    if (error?.data?.statusMessage) {
      errorMessage.value = error.data.statusMessage
    }
    else {
      errorMessage.value = 'Une erreur est survenue lors de la connexion.'
    }
  }
  finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <v-container class="py-16">
    <v-row justify="center">
      <v-col cols="12" sm="8" md="5">
        <v-card elevation="2" class="pa-6" style="display: flex; flex-direction: column; gap: 16px;">
          <div class="text-center">
            <h1 class="text-h5 font-weight-semibold mb-2">Espace administrateur</h1>
            <p class="text-body-2 text-medium-emphasis">
              Connectez-vous pour gérer le contenu du portfolio.
            </p>
          </div>

          <v-form @submit.prevent="handleSubmit" style="display: flex; flex-direction: column; gap: 16px;">
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

            <v-alert v-if="errorMessage" type="error" variant="tonal">
              {{ errorMessage }}
            </v-alert>

            <v-btn type="submit" color="primary" class="text-none" :loading="isSubmitting">
              Se connecter
            </v-btn>
          </v-form>

          <v-alert type="info" variant="tonal">
            <p class="font-weight-medium mb-1">Identifiants par défaut</p>
            <p>Utilisateur : <code>admin@example.com</code></p>
            <p>Mot de passe : <code>ChangeMe123!</code></p>
          </v-alert>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
