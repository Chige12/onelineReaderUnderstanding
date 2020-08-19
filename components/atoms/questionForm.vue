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
            .question_item(v-if="question.type === 'radio'")
              p.question_text 1. {{ question.Q }}
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
            .question_item(v-if="question.type === 'checkbox'")
              p.question_text 2. {{ question.Q }}
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
          v-expansion-panels(v-model="panel").mt-8
            v-expansion-panel
              v-expansion-panel-header 体調不良等でやむなくテストを中断したり、システムの誤作動等があった場合はこちらから報告をお願いします。
              v-expansion-panel-content
                p.text--secondary.body-2 この報告フォームは、体調不良やシステム誤作動など、実験に影響を及ぼすような諸問題がテスト中に起こった際に、取得した実験データを信頼できるデータとして取り扱わないようにするためのものです。
                v-switch.mt-8(v-model="isReportedCom" label="1. このテスト中に起こった問題を報告する")
                p.text--secondary.mt-4 2. 報告理由について *
                v-radio-group(v-model="causeCom" row :disabled="!isReported")
                  v-radio.v-radio(
                    v-for="(selCau, selCauKey) in sel.cause"
                    :key="`sel_${selCauKey}`"
                    :label="selCau" :value="selCau"
                  )
                v-textarea(
                  outlined
                  :disabled="!isReported"
                  label="3. どんな状況で中断されましたか？ またはどんな誤作動がありましたか？ *"
                  hint="できる限り具体的に報告していただけると光栄です。今後の研究活動の参考になります。1.でその他と回答した方は、その内容も記述してください。"
                  v-model="concreteReportCom" rows="3"
                )
      v-btn.mt-8(:disabled="isDisabled" color="primary" @click="fileParse") {{isReported ? '報告を送信' : '解答を送信'}}
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
    },
    isReported: {
      type: Boolean,
      default: false
    },
    cause: {
      type: String,
      default: ''
    },
    concreteReport: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isDisabled: true,
      panel: undefined,
      sel: {
        cause: [
          '体調不良にて中断した。',
          '電話など急な用事で中断せざるを得なかった。',
          'システムの不調・誤作動があった。',
          'その他'
        ]
      }
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
    },
    isReportedCom: {
      get() {
        return this.isReported
      },
      set(newVal) {
        if (this.isReported !== newVal) {
          this.$emit('setIsReported', newVal)
          this.checkFillReport(newVal, 'isReported')
        }
      }
    },
    causeCom: {
      get() {
        return this.cause
      },
      set(newVal) {
        if (this.cause !== newVal) {
          this.$emit('setCause', newVal)
          this.checkFillReport(newVal, 'cause')
        }
      }
    },
    concreteReportCom: {
      get() {
        return this.concreteReport
      },
      set(newVal) {
        if (this.concreteReport !== newVal) {
          this.$emit('setConcreteReport', newVal)
          this.checkFillReport(newVal, 'concreteReport')
        }
      }
    }
  },
  watch: {
    panel(arr) {
      if (arr === undefined) {
        // 閉じるとき
        this.$emit('setIsReported', false)
        this.$emit('setCause', '')
        this.$emit('setConcreteReport', '')
      }
      const isOpened = arr === undefined ? 'close' : 'open'
      this.$emit('clickReportPanel', 'Report expansion panel', isOpened, null)
    },
    radioAnswer(value) {
      if (value) {
        this.isDisabled = false
        this.$emit('updateRadioAnswer', value[0], 'set', 1)
      }
    }
  },
  methods: {
    fileParse() {
      this.$emit('fileParse')
    },
    checkFillReport(newVal, type) {
      const isReported = type === 'isReported' ? newVal : this.isReported
      if (isReported) {
        const cause = type === 'cause' ? newVal : this.cause
        const concreteReport =
          type === 'concreteReport' ? newVal : this.concreteReport
        if (cause !== '' && concreteReport !== '') {
          this.isDisabled = false
        } else {
          this.isDisabled = true
        }
      } else {
        this.isDisabled = this.radioAnswer.length === 0
      }
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
