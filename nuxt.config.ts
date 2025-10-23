// https://nuxt.com/docs/api/configuration/nuxt-config
const sessionCookieName = process.env.SESSION_COOKIE_NAME || 'bro_world_session'
const csrfCookieName = process.env.CSRF_COOKIE_NAME || 'bro_world_csrf'

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
      Poppins: [300, 400, 500, 600, 700]
    },
    display: 'swap'
  },
  nitro: {
    storage: {
      content: {
        driver: 'fs',
        base: './server/storage/content'
      },
      auth: {
        driver: 'fs',
        base: './server/storage/auth'
      }
    }
  },
  runtimeConfig: {
    auth: {
      sessionCookieName,
      csrfCookieName,
      sessionMaxAge: Number.parseInt(process.env.SESSION_MAX_AGE ?? '', 10) || 60 * 60 * 24
    },
    admin: {
      defaultEmail: process.env.ADMIN_EMAIL || 'admin@example.com',
      defaultPassword: process.env.ADMIN_PASSWORD || 'ChangeMe123!'
    },
    public: {
      auth: {
        csrfCookieName
      }
    }
  }
})
