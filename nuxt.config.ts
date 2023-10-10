// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      titleTemplate(title) {
        return `${title} | NITT Mentoring`;
      },
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          hid: "description",
          name: "description",
          content: "NITT Mentoring Portal",
        },
        {
          hid: "site-name",
          name: "og:site-name",
          content: "NITT Mentoring"
        },
        { name: "format-detection", content: "telephone=no" },
      ],
      link: [
        { rel: "shortcut icon", type: "image/x-icon", href: "/favicon.ico" },
      ],
    },
/*    pageTransition: {
      name: "rotate",
      mode: "out-in",
    },*/
    layoutTransition: { name: "layout", mode: "out-in" },
  },
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/tailwindcss",
    "@pinia/nuxt",
  ],
});
