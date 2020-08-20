<template lang="pug">
  v-layout
    main(v-if="user").mt-6
      LoginInfoCard(:user="user" @logout="logout")
      EnqueteForm(
        :realName="realName", :belongs="belongs" :endEnquete="endEnquete" :enquete="enquete"
        @setRealName="realName=$event" @setBelongs="belongs=$event" @endEnqueteTrue="endEnquete = true")
      TestList(:randomTestJsonArr="randomTestJsonArr")
    main(v-else="user")
      v-progress-circular(indeterminate size="64").progress
</template>
<script>
import { uniqBy } from 'lodash'
import firebase from '~/plugins/firebase'
import summaryJson from '~/contents/summary.json'
import LoginInfoCard from '~/components/organisms/loginInfoCard.vue'
import EnqueteForm from '~/components/organisms/EnqueteForm.vue'
import TestList from '~/components/organisms/testList.vue'

export default {
  components: {
    LoginInfoCard,
    EnqueteForm,
    TestList
  },
  data() {
    return {
      realName: '',
      belongs: '',
      acceptDate: null,
      oldAcceptDate: null,
      endEnquete: false,
      enquete: {}
    }
  },
  computed: {
    user() {
      return this.$store.state.user
    },
    randomTestJsonArr() {
      return this.$store.state.randomTestJsonArr
    }
  },
  watch: {
    user() {
      if (this.user) {
        this.getData()
      }
    }
  },
  mounted() {
    setTimeout(() => {
      this.setAuthUser()
    }, 0)
  },
  methods: {
    async getData() {
      let user = {}
      const uid = this.user.uid
      await firebase
        .firestore()
        .collection('users')
        .doc(uid)
        .get()
        .then((res) => {
          if (res.exists) {
            const data = res.data()
            user = data
            if (user.enquete !== undefined) {
              this.endEnquete = true
              this.enquete = user.enquete
            } else {
              this.endEnquete = false
            }
            if (user.realName !== null) {
              this.realName = user.realName
              this.$store.commit('setRealName', this.realName)
            }
            if (user.belongs !== null) {
              this.belongs = user.belongs
              this.$store.commit('setBelongs', this.belongs)
            }
            this.oldAcceptDate = user.acceptDate
            if (user.acceptDate !== null) {
              this.acceptDate = user.acceptDate
              this.$store.commit('setAcceptDate', this.acceptDate)
            }
            if (this.acceptDate === null) {
              firebase
                .auth()
                .signOut()
                .then(() => {
                  this.$store.commit('logout')
                  this.$store.commit('setRealName', '')
                  this.$store.commit('setBelongs', '')
                  this.$store.commit('setAcceptDate', null)
                  this.$router.push('/')
                })
                .catch(function(error) {
                  console.log(error)
                })
            }
            // ドキュメントがあるとき
            this.updateRandomTestsOrder(user.testsOrder)
          } else {
            // ドキュメントがないとき
            this.setNewRandomTestsOrder()
          }
        })
        .catch((error) => {
          console.log('Error! : get Test order', error)
        })
    },
    updateRandomTestsOrder(oldOrder) {
      if (oldOrder) {
        // 過去の順序に最新順序マージ
        const latestOrderArr = this.latestOrderArr(oldOrder)
        // Jsonから必要な情報補完
        const randomTestJsonArr = this.latestRandomTestJsonArr(latestOrderArr)
        this.$store.commit('setRandomTestJsonArr', randomTestJsonArr)
        // Firebaseへマージ後の最新順序を送信
        if (
          latestOrderArr.length !== oldOrder.length ||
          this.oldAcceptDate === null
        ) {
          this.updateFirestoreTestOrder(latestOrderArr)
        }
      }
    },
    latestOrderArr(oldRandomTestsOrderArr) {
      // 最新のテスト情報のランダムソートしたやつと過去のテスト順序とをマージ
      return uniqBy(
        [...oldRandomTestsOrderArr, ...this.randomizeTestsOrderArr()],
        'key'
      )
    },
    updateFirestoreTestOrder(orderArr) {
      const realName = this.$store.state.realName
      const belongs = this.$store.state.belongs
      const acceptDate = this.$store.state.acceptDate
      firebase
        .firestore()
        .collection('users')
        .doc(this.user.uid)
        .update({
          user: this.user,
          realName,
          belongs,
          acceptDate,
          testsOrder: orderArr
        })
        .then(() => {
          console.log('Succsess update Test order')
        })
        .catch((error) => {
          console.log('Error! : update Test order', error)
        })
    },
    latestRandomTestJsonArr(latestOrderArr) {
      // Jsonから必要な情報補完
      return latestOrderArr.map((value) => ({
        key: value.key,
        ui: value.ui,
        done: value.done,
        date: value.date,
        ...summaryJson.fileMap[value.key]
      }))
    },
    setNewRandomTestsOrder() {
      // 最新のテスト情報をランダムソートして必要な情報補完
      const newOrderArr = this.randomizeTestsOrderArr()
      // Jsonから必要な情報補完
      const randomTestJsonArr = this.newRandomTestJsonArr(newOrderArr)
      this.$store.commit('setRandomTestJsonArr', randomTestJsonArr)
      // Firebaseへマージ後の最新順序を送信
      this.setFirestoreTestOrder(newOrderArr)
    },
    setFirestoreTestOrder(orderArr) {
      const realName = this.$store.state.realName
      const belongs = this.$store.state.belongs
      const acceptDate = this.$store.state.acceptDate
      firebase
        .firestore()
        .collection('users')
        .doc(this.user.uid)
        .set({
          user: this.user,
          realName,
          belongs,
          acceptDate,
          testsOrder: orderArr
        })
        .then(() => {
          console.log('Succsess set Test order')
        })
        .catch((error) => {
          console.log('Error! : set Test order', error)
        })
    },
    newRandomTestJsonArr(newOrderKeyArr) {
      // Jsonから必要な情報補完
      return newOrderKeyArr.map((value) => ({
        key: value.key,
        ui: value.ui,
        done: value.done,
        date: value.date,
        ...summaryJson.fileMap[value.key]
      }))
    },
    randomizeTestsOrderArr() {
      // uiのランダマイズ
      const randomizeTestsOrderUIArr = this.randomizeTestsOrderUIArr()
      // テスト順のランダマイズ
      return this.randomizeTestsOrderKeyArr().map((value, index) => ({
        key: value,
        ui: randomizeTestsOrderUIArr[index],
        done: false,
        date: null
      }))
    },
    randomizeTestsOrderUIArr() {
      // ['oneline','scroll']
      const summaryJsonkeyMap = Object.entries(summaryJson.fileMap).map(
        ([key, value]) => ({
          key
        })
      )
      const SummaryJsonMapExamples = Object.entries(summaryJson.fileMap)
        .map(([key, value]) => ({
          key,
          value
        }))
        .filter((x) => {
          return x.value.example === true
        })
      // 半々ずつテストする
      const uiArr = []
      for (let i = 0; i < summaryJsonkeyMap.length; i++) {
        if (i % 2 !== 0) {
          // 奇数の時
          uiArr.push('oneline')
        } else if (i === summaryJsonkeyMap.length - 1) {
          // 偶数で最後の時はランダム
          uiArr.push(this.getRandomInt(2) === 0 ? 'oneline' : 'scroll')
        } else {
          // 偶数の時
          uiArr.push('scroll')
        }
      }
      // ランダムソート
      const sortedUiArr = uiArr
        .map(function(a) {
          return { weight: Math.random(), value: a }
        })
        .sort(function(a, b) {
          return a.weight - b.weight
        })
        .map(function(a) {
          return a.value
        })
      for (let i = 0; i < SummaryJsonMapExamples.length; i++) {
        sortedUiArr.shift()
      }
      for (let i = 0; i < SummaryJsonMapExamples.length; i++) {
        sortedUiArr.unshift(
          SummaryJsonMapExamples[SummaryJsonMapExamples.length - i - 1].value
            .example_test_type
        )
      }
      return sortedUiArr
    },
    randomizeTestsOrderKeyArr() {
      // ['~~~/test_2.json', '~~~/test_1.json']
      const SummaryJsonMap = Object.entries(summaryJson.fileMap).map(
        ([key, value]) => ({
          key,
          value
        })
      )

      const SummaryJsonMapExamples = SummaryJsonMap.filter((x) => {
        return x.value.example === true
      })
      const SummaryJsonMapTests = SummaryJsonMap.filter((x) => {
        return x.value.example !== true
      })
      const SummaryJsonMapTestsSort = SummaryJsonMapTests.map(function(x) {
        return { key: x.key, weight: Math.random() }
      }).sort(function(a, b) {
        if (a.weight < b.weight) return -1
        if (a.weight > b.weight) return 1
        return 0
      })
      return SummaryJsonMapExamples.concat(SummaryJsonMapTestsSort).map(
        function(a) {
          return a.key
        }
      )
    },
    getRandomInt(max) {
      // 0〜(max-1)の間の整数でランダム
      return Math.floor(Math.random() * Math.floor(max))
    },
    logout() {
      this.$store.dispatch('logout')
    }
  }
}
</script>
<style lang="scss" scoped>
main {
  width: 100%;
}
.test-cards {
  width: calc(33.3% - 16px);
}
.progress {
  display: block;
  margin: 120px auto;
}
</style>
