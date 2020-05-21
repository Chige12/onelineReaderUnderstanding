<template lang="pug">
  v-layout
    main
      ul
        li(
          v-for="(test, test_id) in randomTestJsonArr"
          :key="`test-${test_id}`"
          :style="`font-size: ${fontSize}px;`"
        )
          nuxt-link(
            :to="`../tests/test_${test_id + 1}`"
          ) {{ test.sourceBase.slice(0, -3) }} | {{ test.title }}
</template>
<script>
import { uniqBy } from 'lodash'
import firebase from '~/plugins/firebase'
import summaryJson from '~/contents/summary.json'

export default {
  data() {
    return {
      randomTestJsonArr: []
    }
  },
  computed: {
    fontSize() {
      return this.$store.state.fontSize
    }
  },
  mounted() {
    // Firebaseから並び替え順序を受け取る
    firebase
      .firestore()
      .collection('users')
      .where('name', '==', 'chige')
      .get()
      .then((res) => {
        let user = {}
        res.forEach((doc) => {
          const data = doc.data()
          user = data
        })

        if (user.testsOrder) {
          // userからOrderKeyArrを取り出す
          const oldRandomTestOrderKeyArr = user.testsOrder
          // Jsonから必要な情報補完 最新情報マージ
          this.randomTestJsonArr = this.latestRandomTestJsonArr(
            oldRandomTestOrderKeyArr
          )
        } else {
          // Jsonから必要な情報補完
          this.randomTestJsonArr = this.newRandomTestJsonArr() // 新規ランダムソート
        }
      })
      .catch((error) => {
        console.log('error fetch works data : ' + error)
      })
  },
  methods: {
    newRandomTestJsonArr() {
      // 最新のテスト情報をランダムソートして必要な情報補完
      const newOrderKeyArr = this.randomizeTestsOrderArr()
      // Jsonから必要な情報補完
      return newOrderKeyArr.map((value) => ({
        key: value.testKey,
        ui: value.ui,
        ...summaryJson.fileMap[value.testKey]
      }))
    },
    latestRandomTestJsonArr(oldRandomTestOrderKeyArr) {
      // 最新のテスト情報をランダムソートして過去のテスト順序にマージする
      const latestOrderKeyArr = uniqBy(
        [...oldRandomTestOrderKeyArr, ...this.randomizeTestsOrderArr()],
        'testKey'
      )
      if (latestOrderKeyArr.length !== oldRandomTestOrderKeyArr.length) {
        // ユーザー情報と一緒にFirebaseへ送信
      }
      // Jsonから必要な情報補完
      return latestOrderKeyArr.map((value) => ({
        key: value.testKey,
        ui: value.ui,
        ...summaryJson.fileMap[value.testKey]
      }))
    },
    randomizeTestsOrderArr() {
      const randomizeTestsOrderUIArr = this.randomizeTestsOrderUIArr()
      return this.randomizeTestsOrderKeyArr().map((value, index) => ({
        testKey: value,
        ui: randomizeTestsOrderUIArr[index]
      }))
    },
    randomizeTestsOrderUIArr() {
      // ['oneline','scroll']
      const summaryJsonLength = Object.entries(summaryJson.fileMap).map(
        ([key, value]) => ({
          key
        })
      ).length
      // 半々ずつテストする
      const uiArr = []
      for (let i = 0; i < summaryJsonLength.length; i++) {
        if (i % 2 === 0) {
          // 偶数の時
          uiArr.push('online')
        } else if (i === summaryJsonLength.length - 1) {
          // 奇数で最後の時はランダム
          uiArr.push(this.getRandomInt(2) === 0 ? 'online' : 'scroll')
        } else {
          // 奇数の時
          uiArr.push('scroll')
        }
      }
      // ランダムソート
      return uiArr
        .map(function(a) {
          return { weight: Math.random(), value: a }
        })
        .sort(function(a, b) {
          return a.weight - b.weight
        })
        .map(function(a) {
          return a.value
        })
    },
    randomizeTestsOrderKeyArr() {
      // ['~~~/test_2.json', '~~~/test_1.json']
      return Object.entries(summaryJson.fileMap)
        .map(([key, value]) => ({
          key,
          weight: Math.random()
        }))
        .sort(function(a, b) {
          if (a.weight < b.weight) return -1
          if (a.weight > b.weight) return 1
          return 0
        })
        .map(function(a) {
          return a.key
        })
    },
    getRandomInt(max) {
      // 0〜(max-1)の間の整数でランダム
      return Math.floor(Math.random() * Math.floor(max))
    }
  }
}
</script>
