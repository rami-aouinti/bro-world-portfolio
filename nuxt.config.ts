// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-10-01',
  devtools: { enabled: true },
  app: {
    head: {
      title: 'Mohamed Rami Aouinti | Backend Developer (PHP & Symfony)'
    }
  },
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/google-fonts', '@nuxt/image'],
  googleFonts: {
    families: {
      Poppins: [300, 400, 500, 600, 700], 
    },
    display: 'swap', 
  },
})