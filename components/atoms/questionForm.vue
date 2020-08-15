<template lang="pug">
  .endform
    .endform_wrapper
      form
        div(v-if="questionData")
          h3 以下の問題にお答えください。
          div(
            v-for="(question, question_id) in questionData"
            :key="`question-${question_id}`"
          )
            .question_radio(v-if="question.type === 'radio'")
              p.question_text {{ question.Q }}
              v-radio-group(
                v-if="question.S !== null"
                v-model="radioAnswer[question_id]"
                row
              )
                v-radio.v-radio(
                  v-for="(sel_item, sel_key) in question.S"
                  :key="`sel_${sel_key}`"
                  :label="sel_item" :value="sel_item"
                )
            .question_radio(v-if="question.type === 'checkbox'")
              p.question_text {{ question.Q }}
              v-row
                v-col.d-flex.py-0(
                  cols="12" sm="3"
                  v-for="(sel_item, sel_key) in question.S"
                  :key="`sel_${sel_key}`"
                )
                  v-checkbox.my-0(
                    v-model="checkedArr"
                    :label="sel_item"
                    v-bind:value="sel_item"
                    dense
                  )
      v-btn.mt-8(:disabled="isDisabled" color="primary" @click="fileParse") 解答を送信
</template>
<script>
export default {
  props: {
    questionData: {
      type: Array,
      default: null
    },
    radioAnswer: {
      type: Array,
      default: null
    },
    checkedAnswer: {
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
    },
    checkedArr: {
      get() {
        return this.checkedAnswer
      },
      set(value) {
        this.$emit('updateCheckedAnswer', value)
      }
    }
  },
  watch: {
    radioAnswer(value) {
      this.isDisabled = false
      this.$emit('updateRadioAnswer', value[0], 'set', 1)
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
  width: 1024px;
  height: calc(100% - 120px);
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
