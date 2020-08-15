<template lang="pug">
  .answer_check
    .answer_check_wrapper
      h2 {{user.displayName}}さん テスト終了です。お疲れさまでした。
      v-card.my-8
        v-card-text
          v-list-item(three-line)
            v-list-item-content
              .correct_answer
                v-list-item-subtitle.mb-2 模範解答
                div.text--primary {{questionData[0].A}}
              .your_answer.mt-6
                v-list-item-subtitle.mb-2 あなたの解答
                div.text--primary {{questionAnswer[0]}}
            v-list-item-content.circle-or-times
              v-icon(x-large color="blue" v-if="checkCorrectAnswer").correct mdi-checkbox-blank-circle-outline
              v-icon(x-large color="red" v-else="checkCorrectAnswer").mistake mdi-close
      v-col.text-right
        v-btn(color="primary" @click="backMenu").mr-n3 メニューに戻る
</template>
<script>
export default {
  props: {
    questionData: {
      type: Array,
      default: () => []
    },
    questionAnswer: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      isDisabled: true
    }
  },
  computed: {
    user() {
      return this.$store.state.user
    },
    checkCorrectAnswer() {
      return this.questionData[0].A === this.questionAnswer[0]
    }
  },
  methods: {
    backMenu() {
      this.$router.push('/tests')
    }
  }
}
</script>
<style lang="scss" scoped>
.answer_check {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 20000;
  width: 100vw;
  height: 100vh;
  background: #556677;
}
.answer_check_wrapper {
  position: fixed;
  margin: auto;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 20000;
  width: 980px;
  height: 580px;
  background: #fff;
  overflow-y: auto;
  padding: 60px;
}
.question_text {
  line-height: 2;
  margin: 32px 0 16px;
}
.success_btn {
  color: white;
}
.v-radio {
  width: 100%;
  margin-bottom: 16px;
}
.v-btn {
  margin-right: 8px;
}

.circle-or-times {
  width: 30%;
  flex-shrink: 4;
  flex: auto 0;
}
</style>
