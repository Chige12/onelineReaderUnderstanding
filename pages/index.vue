<template lang="pug">
  v-layout(column justify-center align-center)
    v-flex(xs12 sm8 md6)
      v-card
        v-card-title.headline Welcome to the Vuetify + Nuxt.js template
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
          hr.my-3
        v-card-actions
          v-spacer
          v-btn(color="primary" nuxt to="/login") Googleでログイン
          v-btn(@click="addTest") addTest
</template>

<script>
import firebase from '~/plugins/firebase'

export default {
  methods: {
    addTest() {
      firebase
        .firestore()
        .collection('tests')
        .doc()
        .set({
          name: 'chige12',
          start: '',
          end: '',
          data: [
            {
              key: 'Enter',
              row: null,
              height: null,
              time: '00:00:000',
              word: null
            },
            {
              key: 'Enter',
              row: null,
              height: null,
              time: '00:48:149',
              word: null
            }
          ],
          whiteout: false,
          crack_px: 16,
          judgment: [
            {
              Answer: '宇宙船に穴が開いて空気が薄くなったから',
              Model: '船内の空気の密度が薄くなっていた'
            },
            { Model: '金的蹴り' },
            { Model: 'チョキ' }
          ],
          story: {
            id: 'story_6',
            title: '宇宙の空気漏れ',
            word_count_space: 753,
            word_count: 753,
            paragraphs: 25
          }
        })
        .then(function() {
          console.log('succsess')
        })
        .catch(function(error) {
          console.log('error' + error)
        })
    }
  }
}
</script>
