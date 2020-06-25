<template lang="pug">
  .endform
    .endform_wrapper
      h2 {{user.displayName}}さん お疲れさまでした。
      form
        div(v-if="questionData")
          h3 以下の問題にお答えください。
          div(
            v-for="(question, question_id) in questionData"
            :key="`question-${question_id}`"
          )
            p.question_text {{ question.Q }}
            v-radio-group(
              v-if="question.S !== null"
              v-model="questionAnswer[question_id]"
              row
            )
              v-radio.v-radio(
                v-for="(sel_item, sel_key) in question.S"
                :key="`sel_${sel_key}`"
                :label="sel_item" :value="sel_item"
              )
      v-btn(:disabled="isDisabled" color="primary" @click="fileParse") 回答を送信
</template>
<script>
export default {
  props: {
    questionData: {
      type: Array,
      default: null
    },
    questionAnswer: {
      type: Array,
      default: null
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
    }
  },
  watch: {
    questionAnswer() {
      this.isDisabled = false
    }
  },
  methods: {
    fileParse() {
      this.$emit('fileParse')
    }
  }
}
</script>
<style lang="scss" scoped>
.endform {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 20000;
  width: 100vw;
  height: 100vh;
  background: #556677;
}
.endform_wrapper {
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
</style>
