<template lang="pug">
  v-app.stopWatch#stopWatch
    div
      .timer(v-if="timerDisplay")
        div {{ timer }}
        button(@click="start()") start
        button(@click="stop()") stop
        button(@click="reset()") reset
      questionForm(
        v-if="endform"
        :questionData="questionData"
        :questionAnswer="questionAnswer"
        @fileParse="fileParse"
      )
</template>
<script>
import firebase from '~/plugins/firebase'
import questionForm from '~/components/atoms/questionForm.vue'

export default {
  components: {
    questionForm
  },
  data() {
    return {
      timer: '00:00:000',
      startTime: null,
      endTime: null,
      elapsedTime: 0,
      timerId: null,
      timeToadd: 0,
      data: [],
      once: 0,
      row: '',
      endform: false,
      timerRun: false,
      questionAnswer: []
    }
  },
  computed: {
    nameList() {
      return this.$store.getters['listup/unique_users']
    },
    timerDisplay() {
      return this.$store.state.timerDisplay
    },
    questionData() {
      return this.$store.state.questionData
    },
    lessdata() {
      return this.$store.state.lessdata
    }
  },
  watch: {
    lessdata(lessdata) {
      const nowtime = this.timer
      const nowrow = document.getElementById(`pg_${lessdata.row}`)
      let word
      if (nowrow) {
        word = nowrow.textContent.length
      } else {
        word = null
      }
      this.data.push({ ...lessdata, time: nowtime, word })
      if (lessdata.key === 'Enter') {
        if (this.timerRun) {
          this.stop()
          this.endTest()
        } else {
          this.start()
        }
      } else {
        if (this.once === 0) {
          this.start()
        } else if (this.row !== null && this.row === lessdata.row) {
          this.stop()
          this.endTest()
        }
        this.once++
        this.row = lessdata.row
        console.log(
          'Key : ' +
            lessdata.key +
            '\nRow : ' +
            lessdata.row +
            '\nHeight : ' +
            lessdata.height +
            '\nTime : ' +
            nowtime +
            '\nWord : ' +
            word
        )
      }
    }
  },
  methods: {
    endTest() {
      this.endform = true
      this.endTime = new Date()
    },
    judgment() {
      const judgment = []
      for (let i = 0; i < this.questionData.length; i++) {
        judgment[i] = {
          Answer: this.questionAnswer[i],
          Model: this.questionData[i].A
        }
      }
      return judgment
    },
    yyyymmddhhmi(custom) {
      if (custom) {
        const customDate = new Date(custom)
        const date = customDate
        const yyyy = date.getFullYear()
        const mm = ('0' + date.getMonth()).slice(-2)
        const dd = ('0' + date.getDate()).slice(-2)
        const hh = ('0' + date.getHours()).slice(-2)
        const mi = ('0' + date.getMinutes()).slice(-2)
        return `${yyyy}-${mm}-${dd}_${hh}-${mi}`
      } else {
        console.log('Error: custom date is' + custom)
        return null
      }
    },
    async fileParse() {
      const user = this.$store.state.user
      const uid = user.uid
      const whiteout = this.$store.state.whiteout
      const judgment = this.judgment()
      const examination = this.$store.state.examination

      await firebase
        .firestore()
        .collection('users')
        .doc(uid)
        .get()
        .then((res) => {
          if (res.exists) {
            const data = res.data()
            const hitIndex = data.testsOrder.findIndex((x) => {
              return x.key === `contents/json/${examination.id}.json`
            })
            if (data.testsOrder[hitIndex].done) {
              // すでにテストを行なっていたら'/tests'に戻る
              this.reset()
              this.$router.push('/tests')
            } else {
              const totalWordCount = this.$store.state.totalWordCount
              const testFileData = {
                user,
                data: this.data,
                endTime: {
                  yyyymmddhhmi: this.yyyymmddhhmi(this.endTime),
                  date: this.endTime
                },
                startTime: {
                  yyyymmddhhmi: this.yyyymmddhhmi(this.startTime),
                  date: this.startTime
                },
                whiteout,
                judgment,
                examination,
                totalWordCount
              }
              this.fileUpload(testFileData)
            }
          }
        })
        .catch((error) => {
          console.log('Error! : get Test order', error)
        })
    },
    fileUpload(testFileData) {
      // Firebaseへ投げる
      firebase
        .firestore()
        .collection('tests')
        .doc()
        .set(testFileData)
        .then(() => {
          this.testFinished()
          console.log('success')
        })
        .catch(function(error) {
          console.log('error' + error)
        })
    },
    testFinished() {
      const uid = this.$store.state.user.uid
      const examinId = this.$store.state.examination.id
      const RandomTestJsonArr = [...this.$store.state.randomTestJsonArr]
      const testIndex = RandomTestJsonArr.findIndex((x) => {
        return x.base === examinId + x.ext
      })
      const RandomTestJsonArrMap = RandomTestJsonArr.map((value) => ({
        key: value.key,
        ui: value.ui,
        done: value.done
      }))
      if (testIndex !== -1) {
        RandomTestJsonArrMap[testIndex].done = true
        RandomTestJsonArr[testIndex].done = true
        firebase
          .firestore()
          .collection('users')
          .doc(uid)
          .update({
            testsOrder: RandomTestJsonArrMap
          })
          .then(() => {
            this.$store.commit('setRandomTestJsonArr', RandomTestJsonArr)
            this.reset()
            this.$router.push('/tests')
          })
          .catch(function(error) {
            console.log('error' + error)
          })
      } else {
        console.log('testIndex is ' + testIndex)
      }
    },
    updateTimerText() {
      // m(分) = 135200 / 60000ミリ秒で割った数の商 -> 2分
      let m = Math.floor(this.elapsedTime / 60000)
      // s(秒) = 135200 % 60000ミリ秒で / 1000 (ミリ秒なので1000で割ってやる) -> 15秒
      let s = Math.floor((this.elapsedTime % 60000) / 1000)
      // ms(ミリ秒) = 135200ミリ秒を % 1000ミリ秒で割った数の余り
      let ms = this.elapsedTime % 1000
      // HTML 上で表示の際の桁数を固定する 例）3 => 03 、 12 -> 012
      // javascriptでは文字列数列を連結すると文字列になる
      // 文字列の末尾2桁を表示したいのでsliceで負の値(-2)引数で渡してやる。
      m = ('0' + m).slice(-2)
      s = ('0' + s).slice(-2)
      ms = ('0' + ms).slice(-3)
      // HTMLのid timer部分に表示させる
      this.timer = m + ':' + s + ':' + ms
    },
    countUp() {
      // timerId変数はsetTimeoutの返り値になるので代入する
      this.timerId = setTimeout(() => {
        // 経過時刻は現在時刻をミリ秒で示すDate.now()からstartを押した時の時刻(startTime)を引く
        this.elapsedTime = Date.now() - this.startTime + this.timeToadd
        this.updateTimerText()
        // countUp関数自身を呼ぶことで10ミリ秒毎に以下の計算を始める
        this.countUp()
        // 1秒以下の時間を表示するために10ミリ秒後に始めるよう宣言
      }, 10)
    },
    start() {
      // 在時刻を示すDate.nowを代入
      this.startTime = Date.now()
      // 再帰的に使えるように関数を作る
      this.countUp()
      this.timerRun = true
    },
    stop() {
      // タイマーを止めるにはclearTimeoutを使う必要があり、そのためにはclearTimeoutの引数に渡すためのタイマーのidが必要
      clearTimeout(this.timerId)
      // タイマーに表示される時間elapsedTimeが現在時刻かたスタートボタンを押した時刻を引いたものなので、
      // タイマーを再開させたら0になってしまう。elapsedTime = Date.now - startTime
      // それを回避するためには過去のスタート時間からストップ時間までの経過時間を足してあげなければならない。elapsedTime = Date.now - startTime + timeToadd (timeToadd = ストップを押した時刻(Date.now)から直近のスタート時刻(startTime)を引く)
      this.timeToadd += Date.now() - this.startTime
      this.timerRun = false
    },
    reset() {
      // 経過時刻を更新するための変数elapsedTimeを0にしてあげつつ、updateTimetTextで0になったタイムを表示。
      this.elapsedTime = 0

      // リセット時に0に初期化したいのでリセットを押した際に0を代入してあげる
      this.timeToadd = 0

      // updateTimerTextで0になったタイムを表示
      this.updateTimerText()
      this.once = 0
      this.row = ''
      this.endform = false
      this.$emit('reset')
    }
  }
}
</script>

<style lang="scss">
.stopWatch {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 10000;
}
.timer {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 10000;
}
</style>
