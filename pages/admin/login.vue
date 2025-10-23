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
  <div class="min-h-screen flex items-center justify-center px-4 py-16 bg-[#02010c]">
    <div class="w-full max-w-md rounded-3xl border border-white/10 bg-[#0b061a]/80 backdrop-blur-md p-10 space-y-6">
      <div class="space-y-2 text-center">
        <h1 class="text-2xl font-semibold text-white">Espace administrateur</h1>
        <p class="text-white/60 text-sm">
          Connectez-vous pour gérer le contenu du portfolio.
        </p>
      </div>

      <form class="space-y-4" @submit.prevent="handleSubmit">
        <div class="space-y-2">
          <label class="block text-sm font-medium text-white/70" for="email">Adresse e-mail</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            class="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-2 text-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
            placeholder="admin@example.com"
            autocomplete="email"
          />
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-white/70" for="password">Mot de passe</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            class="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-2 text-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
            placeholder="••••••••"
            autocomplete="current-password"
          />
        </div>

        <p v-if="errorMessage" class="text-sm text-red-400">{{ errorMessage }}</p>

        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full rounded-lg bg-primary px-4 py-2 font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-primary/60"
        >
          <span v-if="!isSubmitting">Se connecter</span>
          <span v-else>Connexion…</span>
        </button>
      </form>

      <div class="rounded-lg bg-white/5 p-4 text-xs text-white/60">
        <p class="font-medium text-white">Identifiants par défaut</p>
        <p>Utilisateur : <code>admin@example.com</code></p>
        <p>Mot de passe : <code>ChangeMe123!</code></p>
      </div>
    </div>
  </div>
</template>
