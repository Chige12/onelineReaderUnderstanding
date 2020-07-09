<template lang="pug">
  v-layout(column justify-center align-center)
    v-flex(xs12 sm8 md6).mt-8
      v-card
        v-card-title.headline オンライン 一行表示UI被験者実験
        v-card-text
          p Vuetify is a progressive Material Design component framework for
          | Vue.js. It was designed to empower developers to create amazing
          | applications.
          p
          | For more information on Vuetify, check out the
          | <a href="https://vuetifyjs.com" target="_blank"> documentation </a>.
          p
          | If you have questions, please join the official
          | <a href="https://chat.vuetifyjs.com/" target="_blank" title="chat"> discord </a>.
          p
          | Find a bug? Report it on the github
          p
          | Thank you for developing with Vuetify and I look forward to bringing
          | more exciting features in the future.
          .text-xs-right <em><small>&mdash; John Leider</small></em>
          hr.mt-4
        v-card-actions
          v-checkbox(v-model="isCheked" label="上記に同意する").ml-4.mt-0
          v-spacer
          v-btn(:disabled="!isCheked" dense color="primary" nuxt to="/tests").mr-2.mb-4 Googleでログイン
</template>

<script>
export default {
  data() {
    return {
      isCheked: false
    }
  },
  mounted() {
    console.log(process.env.HOGE)
  }
}
</script>
