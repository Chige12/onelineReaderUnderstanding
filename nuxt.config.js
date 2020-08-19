import colors from 'vuetify/es5/util/colors'
require('dotenv').config()
const {
  FB_API_KEY,
  FB_AUTH_DOMAIN,
  FB_DATABASE_URL,
  FB_PROJECTID,
  FB_STORAGE_BUCKET,
  FB_MESSAGING_SENDER_ID,
  FB_APPID,
  FB_MEASUREMENTID
} = process.env

export default {
  mode: 'spa',
  /*
   ** Headers of the page
   */
  head: {
    title: 'Oneline Reader Test',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: '一行表示UIの効果検証のためのWebオンライン被験者実験環境'
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: ['ress'],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '@/plugins/mixin-common-methods',
    '@/plugins/firebase',
    '@/plugins/localStrage',
    '@/plugins/vue-scrollto'
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    '@nuxtjs/vuetify'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: ['@nuxtjs/style-resources', 'nuxt-webfontloader', '@nuxtjs/dotenv'],
  styleResources: {
    scss: ['~/assets/style/variables.scss', '~/assets/style/mixins.scss']
  },
  webfontloader: {
    // add Google Fonts as "custom" | workaround required
    custom: {
      families: ['Noto Sans JP:n4,n7'],
      urls: [
        'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap'
      ]
    }
  },
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    customVariables: ['~/assets/vuetify/variables.scss'],
    theme: {
      white: true,
      themes: {
        white: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config) {
      if (process.server && process.browser) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/,
          options: {
            fix: true
          }
        })
      }
    }
  },
  env: {
    FB_API_KEY,
    FB_AUTH_DOMAIN,
    FB_DATABASE_URL,
    FB_PROJECTID,
    FB_STORAGE_BUCKET,
    FB_MESSAGING_SENDER_ID,
    FB_APPID,
    FB_MEASUREMENTID
  }
}
