// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  modules: [
    '@pinia/nuxt',
    '@unocss/nuxt',
    '@vueuse/nuxt',
  ],
  unocss: {
    uno: true,
    icons: true,
    attributify: true,
  },
  ssr: false,
});
