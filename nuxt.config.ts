// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  modules: [
    '@pinia/nuxt',
    '@vueuse/nuxt',
    'nuxt-icon',
  ],

  ssr: false,
  compatibilityDate: '2024-09-12',
});