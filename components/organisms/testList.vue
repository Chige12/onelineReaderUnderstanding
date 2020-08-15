<template lang="pug">
  .test-list
    .mt-8
      h3.mb-n2 テスト一覧
      v-subheader.ml-n4 テストの順序は自動でランダマイズされています。「TEST 1」から順番に始めてください。
    .d-flex.flex-wrap.mx-n2
      .test-cards(
        v-for="(test, testId) in randomTestJsonArr"
        :key="`test-${testId}`"
        )
        v-card(outlined).mx-2.mb-6
          v-list-item(three-line)
            v-list-item-content
              .overline.mb-4 Test {{testId + 1}}
              v-list-item-title.headline.mb-1 {{test.title}}
              v-list-item-subtitle(style="line-height: 1.8;")
                span ソース : {{test.source}} 
              v-list-item-subtitle(style="line-height: 1.8;")
                span UI : {{test.ui==='oneline' ? '一行表示UI' : '通常'}}
          v-card-actions.ml-2.mb-2
            v-btn(
              v-if="test.done === false"
              nuxt :to="`../tests/${randomTestJsonArr[testId].base.slice( 0, -5 )}`"
              @click.native="ChangeWhiteOut(test.ui, testId)"
              outlined color="primary"
              :disabled="isTestStartEnable(testId)"
            ) {{isTestStartEnable(testId) ? '未オープン':'テストを始める'}}
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
  methods: {
    isTestStartEnable(id) {
      if (id === 0) {
        return false
      } else if (this.randomTestJsonArr[id - 1].done === true) {
        return false
      } else {
        return true
      }
    },
    ChangeWhiteOut(ui, testId) {
      if (this.isTestStartEnable(testId)) {
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
