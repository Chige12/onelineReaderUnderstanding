import Vue from 'vue'
import firebase from '~/plugins/firebase'

Vue.mixin({
  destroyed() {
    if (this._eventRemovers) {
      this._eventRemovers.forEach(function(eventRemover) {
        eventRemover.remove()
      })
    }
  },
  methods: {
    listen(target, eventType, callback) {
      if (!this._eventRemovers) {
        this._eventRemovers = []
      }
      target.addEventListener(eventType, callback)
      this._eventRemovers.push({
        remove() {
          target.removeEventListener(eventType, callback)
        }
      })
    },
    $delay(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms))
    },
    setAuthUser() {
      const user = this.$store.state.user
      if (user === null) {
        firebase.auth().onAuthStateChanged((authUser) => {
          if (authUser) {
            const currentUser = firebase.auth().currentUser
            const currentUserMap = {
              uid: currentUser.uid,
              displayName: currentUser.displayName,
              photoURL: currentUser.photoURL,
              email: currentUser.email
            }
            this.$store.commit('setUser', currentUserMap)
          } else {
            this.$store.dispatch('login')
          }
        })
      }
    }
  }
})
