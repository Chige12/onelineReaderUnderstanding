<template lang="pug">
  .test-list
    .mt-10
      h3.mb-n2 テスト一覧
      .my-4.body-1.text--secondary
        p.mb-1 テストの順序は自動でランダマイズされています。「TEST 1」から順番に始めてください。6×3日間の全部で18テストです。
        p.mb-1 目や身体の疲労による計測データへの影響を加味し、3日間等に分けて実施ください。3日以上かかっても問題ありません。
    v-tabs(
      v-model="tab"
      background-color="#f0f0f0"
    )
      v-tabs-slider
      v-tab(
        v-for="(slicedArr, slicedId) in randomTestJsonSixSliceArr"
        :key="`tab-sliced-${slicedId}`"
      ) {{slicedId + 1}}日目
      v-tab-item(
        v-for="(slicedArr, slicedId) in randomTestJsonSixSliceArr"
        :key="`sliced-${slicedId}`"
      ) 
        .d-flex.flex-wrap.mx-n2.pt-4
          .test-cards(
            v-for="(test, testId) in slicedArr"
            :key="`test-${slicedId * 6 + testId}`"
            )
            v-card(outlined).mx-2.mb-6
              v-list-item(three-line)
                v-list-item-content
                  .overline.mb-4 Test {{slicedId * 6 + testId + 1}}
                  v-list-item-title.headline.mb-1 {{test.title}}
                  v-list-item-subtitle(style="line-height: 1.8;")
                    span ソース : {{test.source}} 
                  v-list-item-subtitle(style="line-height: 1.8;")
                    span UI : {{test.ui==='oneline' ? '一行表示UI' : '通常'}}
              v-card-actions.ml-2.mb-2
                v-btn(
                  v-if="test.done === false"
                  nuxt :to="`../tests/${randomTestJsonArr[slicedId * 6 + testId].base.slice( 0, -5 )}`"
                  @click.native="ChangeWhiteOut(test.ui, slicedId * 6 + testId)"
                  outlined color="primary"
                  :disabled="!isTestStartEnable(slicedId * 6 + testId)"
                ) {{startBtnText(slicedId * 6 + testId)}}
                v-alert(
                  v-if="test.done === true"
                  type="success" dense text
                ).mb-0 実施済
</template>
<script>
export default {
  props: {
    randomTestJsonArr: {
      type: Array,
      default: null
    }
  },
  computed: {
    tab() {
      if (this.randomTestJsonArr[11].done) {
        return 2
      } else if (this.randomTestJsonArr[5].done) {
        return 1
      } else {
        return 0
      }
    },
    randomTestJsonSixSliceArr() {
      const sliceInterval = 6
      const sliceTime = this.randomTestJsonArr.length / sliceInterval
      const arr = []
      for (let i = 0; i < sliceTime; i++) {
        arr.push(
          this.randomTestJsonArr.slice(
            i * sliceInterval,
            i * sliceInterval + sliceInterval
          )
        )
      }
      return arr
    }
  },
  mounted() {
    console.log(this.randomTestJsonArr)
  },
  methods: {
    startBtnText(id) {
      if (this.isTestStartEnable(id)) {
        return 'テストを始める'
      } else if (!this.lastTestDateComparison(id)) {
        return '明日までロック中'
      } else {
        return '未オープン'
      }
    },
    isTestStartEnable(id) {
      if (id === 0) {
        // 最初のテストは許可
        return true
      } else if (
        this.randomTestJsonArr[id - 1].done === true &&
        this.randomTestJsonArr[id].done === false
      ) {
        return this.lastTestDateComparison(id)
      } else {
        return false
      }
    },
    lastTestDateComparison(id) {
      if (id % 6 === 0 && this.randomTestJsonArr[id - 1].date) {
        // n日目のタブの先頭のテストは、次の日になってたら許可
        const today = new Date()
        const todayEraseTime = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          0,
          0,
          0
        )
        console.log(this.randomTestJsonArr[id - 1].date)
        const lastTestDate = new Date(
          this.randomTestJsonArr[id - 1].date.seconds * 1000
        )
        const lastTestDateEraseTime = new Date(
          lastTestDate.getFullYear(),
          lastTestDate.getMonth(),
          lastTestDate.getDate(),
          0,
          0,
          0
        )
        return todayEraseTime.getTime() > lastTestDateEraseTime.getTime()
      } else {
        // やってないけど、一つ前がdoneなら許可
        return true
      }
    },
    ChangeWhiteOut(ui, testId) {
      if (!this.isTestStartEnable(testId)) {
        this.$router.push('/tests')
      }
      const changeUi = ui === 'oneline'
      this.$store.commit('ChangeWhiteOut', changeUi)
    }
  }
}
</script>
<style lang="scss" scoped>
.test-cards {
  display: block;
  width: 50%;
}
</style>
