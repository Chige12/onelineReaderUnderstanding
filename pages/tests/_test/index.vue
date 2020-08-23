<template>
  <div :class="{ 'reader-wrapper': isStartPageShowed }">
    <div id="top" class="reader">
      <div id="container" class="container">
        <h2 ref="storyTitle">{{ title }}</h2>
        <p ref="storyWriter">ソース：{{ source }}</p>
        <div
          ref="documentBody"
          class="documentBody"
          :style="`font-size: ${fontSize}px;`"
          v-html="bodyHtml"
        ></div>
      </div>
    </div>
    <Whiteout ref="whiteoutRef" />
    <StopWatch :is-start-page-showed="isStartPageShowed" />
    <StartPage
      v-if="isStartPageShowed"
      :title="title"
      :source="source"
      :whiteout="uiWhiteout"
      @startPageHide="startPageHide()"
    />
  </div>
</template>

<script>
import StopWatch from '~/components/atoms/stopWatch.vue'
import Whiteout from '~/components/atoms/whiteout.vue'
import StartPage from '~/components/atoms/startPage.vue'
import summaryJson from '~/contents/summary.json'
// import { SlowBuffer } from "buffer";
export default {
  layout: 'testDefault',
  components: {
    Whiteout,
    StopWatch,
    StartPage
  },
  asyncData({ params }) {
    return Object.assign({}, require(`~/contents/json/${params.test}.json`), {
      params
    })
  },
  data() {
    return {
      nowrow: null,
      rowlist: [],
      whiteupperH: 16,
      isStartPageShowed: true,
      duration: 0
    }
  },
  computed: {
    uiWhiteout() {
      return this.$store.state.whiteout
    },
    fontSize() {
      return this.$store.state.fontSize
    },
    randomTestJsonArr() {
      return this.$store.state.randomTestJsonArr
    }
  },
  validate({ params }) {
    return summaryJson.sourceFileArray.includes(
      `contents/posts/${params.test}.md`
    )
  },
  watch: {
    sourceExt: () => {
      this.firstLoad()
    }
  },
  mounted() {
    // 戻るボタン禁止
    history.pushState(null, null, null)
    window.onpopstate = function(event) {
      history.pushState(null, null, null)
      alert('ブラウザの戻るボタンは禁止されています。')
    }
    this.mountedRun()
  },
  created() {
    if (process.browser) {
      window.addEventListener('keydown', this.KeydownEvent)
    }
  },
  beforeDestroy() {
    if (process.browser) {
      window.removeEventListener('keydown', this.KeydownEvent)
    }
  },
  methods: {
    mountedRun() {
      this.setAuthUser()
      this.$nextTick(() => {
        setTimeout(() => this.firstLoad(), 500)
        // changeCrack
        const titleHeight = this.$refs.storyTitle.clientHeight
        const writerHeight = this.$refs.storyWriter.clientHeight
        this.$store.commit('changeCrack', titleHeight + writerHeight * 2)
        // wordCount
        const wordCount = this.$refs.documentBody.textContent
          .replace(/\r?\n/g, '')
          .replace(/\s+/g, '').length
        this.$store.commit('totalWordCount', wordCount)
      })
    },
    firstLoad() {
      this.rowlist = this.$refs.documentBody.getElementsByTagName('p')
      const whiteoutUpper = document.getElementById('whiteout_upper')
      if (whiteoutUpper) {
        this.whiteupperH = whiteoutUpper.clientHeight
      } else {
        console.log('whiteout_upper is ' + whiteoutUpper)
      }
      for (let i = 0; i < this.rowlist.length; i++) {
        this.rowlist[i].setAttribute('id', `pg_${i}`)
      }
      setTimeout(() => this.setQuestionData(), 500)
      this.setExamination()
    },
    setQuestionData() {
      const questionArray = []
      for (let i = 0; i < this.questions_number; i++) {
        const question = {}
        switch (i + 1) {
          case 1:
            if (this.question_1 && this.selector_1 && this.answer_1) {
              question.type = this.question_type_1
              question.Q = this.question_1
              question.S = this.selectorTextToArray(this.selector_1)
              question.A = this.answer_1
            } else {
              console.log('Error! Missing data question_1')
            }
            break
          case 2:
            if (this.question_2 && this.selector_2 && this.answer_2) {
              question.type = this.question_type_2
              question.Q = this.question_2
              const trueSelect = this.arrayLengthLimit(
                this.randomizeArr(this.selector_2.split(',')),
                15
              )
              const wrongSelect = this.arrayLengthLimit(
                this.randomizeArr(this.selector_2_wrong.split(',')),
                15
              )
              question.S = this.randomizeArr([...trueSelect, ...wrongSelect])
              question.A = this.answer_2
            } else {
              console.log('Error! Missing data question_2')
            }
            break
          case 3:
            if (this.question_3 && this.selector_3 && this.answer_3) {
              question.type = this.question_type_3
              question.Q = this.question_3
              question.S = this.selectorTextToArray(this.selector_3)
              question.A = this.answer_3
            } else {
              console.log('Error! Missing data question_3')
            }
            break
          case 4:
            if (this.question_4 && this.selector_4 && this.answer_4) {
              question.type = this.question_type_4
              question.Q = this.question_4
              question.S = this.selectorTextToArray(this.selector_4)
              question.A = this.answer_4
            } else {
              console.log('Error! Missing data question_4')
            }
            break
          default:
            console.log('Error! Missing data')
        }
        questionArray.push(question)
      }
      this.$store.commit('questionData', questionArray)
    },
    selectorTextToArray(text) {
      const splitTextArr = text.split(',')
      const randomSplitTextArr = this.randomizeArr(splitTextArr)
      randomSplitTextArr.push('わからない')
      return randomSplitTextArr
    },
    randomizeArr(arr) {
      return arr
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
    arrayLengthLimit(arr, limit) {
      return arr.slice(0, limit)
    },
    setExamination() {
      const examination = {
        id: this.$route.params.test,
        title: this.title,
        word_count_space: this.word_count_space,
        word_count: this.word_count,
        paragraphs: this.paragraphs
      }
      this.$store.commit('examination', examination)
    },
    reset() {
      this.nowrow = null
    },
    startPageHide() {
      this.isStartPageShowed = false
      if (!this.uiWhiteout) {
        this.PressEnter()
      }
    },
    KeydownEvent(e) {
      // this.$store.dispatch('KeyDown', e)

      if (e.key === 'ArrowUp' && this.uiWhiteout && !this.isStartPageShowed) {
        this.arrowScrollUp(e)
      }
      if (e.key === 'ArrowDown' && this.uiWhiteout && !this.isStartPageShowed) {
        e.preventDefault()
        this.arrowScrollDown(e)
      }
      if (e.key === 'Enter' && !this.uiWhiteout && !this.isStartPageShowed) {
        this.isStartPageShowed = false
        this.PressEnter()
      }
    },
    arrowScrollUp(e) {
      let height = 0
      if (this.nowrow === 0) {
        e.preventDefault()
        const titleHeight = this.$refs.storyTitle.clientHeight
        const writerHeight = this.$refs.storyWriter.clientHeight
        this.$store.commit('changeCrack', titleHeight + writerHeight * 2)
        this.$scrollTo(`#top`, { duration: this.duration, offset: 0 })
        this.nowrow = null
      }
      if (this.nowrow > 0) {
        e.preventDefault()
        height = this.rowlist[this.nowrow - 1].clientHeight / 2
        this.$store.commit('changeCrack', height * 2)
        this.$scrollTo(`#pg_${this.nowrow - 1}`, {
          duration: this.duration,
          offset: -this.whiteupperH + height
        })
        this.nowrow--
      }
      this.$store.commit('updateData', {
        key: 'ScrollUp',
        row: this.nowrow,
        height
      })
    },
    arrowScrollDown(e) {
      let height = 0
      if (this.nowrow === null) {
        height = this.rowlist[0].clientHeight / 2
        this.$store.commit('changeCrack', height * 2)
        this.$scrollTo(`#pg_0`, {
          duration: this.duration,
          offset: -this.whiteupperH + height
        })
        this.nowrow = 0
      } else if (this.nowrow >= 0 && this.nowrow < this.rowlist.length - 1) {
        height = this.rowlist[this.nowrow + 1].clientHeight / 2
        this.$store.commit('changeCrack', height * 2)
        this.$scrollTo(`#pg_${this.nowrow + 1}`, {
          duration: this.duration,
          offset: -this.whiteupperH + height
        })
        this.nowrow++
      }
      this.$store.commit('updateData', {
        key: 'ScrollDown',
        row: this.nowrow,
        height
      })
    },
    PressEnter() {
      this.$store.commit('updateData', {
        key: 'Enter',
        row: null,
        height: null
      })
    }
  }
}
</script>

<style>
.reader-wrapper {
  width: 100%;
  height: 100vh;
  margin: 0;
  overflow: hidden;
}
.reader {
  padding: calc(50vh - 2rem) 0 calc(50vh - 2rem);
}
.container {
  max-width: 980px;
  padding-top: 0;
  margin: auto;
}
.documentBody p {
  line-height: 1.5;
  margin: 20px 0;
}
</style>
