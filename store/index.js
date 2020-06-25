import firebase from '~/plugins/firebase'

export const getters = {}

export const state = () => ({
  user: null,
  randomTestJsonArr: [],
  whiteout: true,
  menuDisplay: false,
  timerDisplay: false,
  crack_px: 16,
  totalWordCount: 0,
  fontSize: 16,
  white_blur: 0,
  lessdata: null,
  questionData: null,
  examination: null,
  storylist: null,
  alertTextArr: [],
  alertCounter: 0,
  testsOrderArr: []
})

export const mutations = {
  setUser(state, payload) {
    state.user = payload
  },
  logout(state) {
    state.user = null
  },
  setRandomTestJsonArr(state, arr) {
    state.randomTestJsonArr = arr
  },
  setAlertText(state, text) {
    const obj = {}
    obj.text = text
    obj.key = state.alertCounter
    state.alertTextArr.push(obj)
    state.alertCounter++
  },
  toggleWhiteOut(state) {
    state.whiteout = !state.whiteout
  },
  ChangeWhiteOut(state, whiteout) {
    state.whiteout = whiteout
  },
  toggleMenuDisplay(state) {
    state.menuDisplay = !state.menuDisplay
  },
  CloseMenuDisplay(state) {
    state.menuDisplay = false
  },
  toggleTimerDisplay(state) {
    state.timerDisplay = !state.timerDisplay
  },
  changeCrack(state, px) {
    state.crack_px = px
  },
  totalWordCount(state, count) {
    state.totalWordCount = count
  },
  SetFontSize(state, size) {
    state.fontSize = size
  },
  ChangeBlur(state, blur) {
    state.white_blur = blur
  },
  updateData(state, lessdata) {
    state.lessdata = lessdata
  },
  questionData(state, data) {
    state.questionData = data
  },
  updateTestsOrderArr(state, arr) {
    state.testsOrderArr = arr
  },
  examination(state, data) {
    state.examination = data
  },
  storyList(state, list) {
    state.storylist = list
  }
}

export const actions = {
  login({ commit }) {
    const provider = new firebase.auth.GoogleAuthProvider()
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(function(result) {
        const resultUser = result.user
        const user = Object.keys(resultUser).reduce(
          (acc, key) =>
            ({}.hasOwnProperty.call(acc, key)
              ? { ...acc, [key]: resultUser[key] }
              : acc),
          { uid: null, displayName: null, photoURL: null, email: null }
        )
        if (user.uid) {
          commit('setAlertText', 'ログイン成功!')
          commit('setUser', user)
        }
      })
      .catch(function(error) {
        const errorCode = error.code
        commit('setAlertText', `ログインエラー: ${errorCode}`)
      })
  },
  logout({ commit }) {
    firebase
      .auth()
      .signOut()
      .then(() => {
        commit('logout')
      })
      .catch(function(error) {
        console.log(error)
      })
  },
  updateTestsOrderArr({ commit, state }) {
    commit('updateTestsOrderArr')
  },
  KeyDown({ commit, state }, event) {
    if (event.key === 'm') {
      commit('toggleMenuDisplay')
    }
    if (event.key === 'w') {
      commit('toggleWhiteOut')
    }
    if (event.key === 't') {
      commit('toggleTimerDisplay')
    }
    if (event.key === '[') {
      commit('changeCrack', state.crack_px + 2)
    }
    if (event.key === ']') {
      if (state.crack_px > 0) {
        commit('changeCrack', state.crack_px - 2)
      }
    }
  }
}
