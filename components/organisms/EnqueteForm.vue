<template lang="pug">
  .enquete
    transition(name="fade")
      v-card.my-4(outlined v-if="!endEnquete")
        v-list-item(two-line)
          v-list-item-content.pb-0
            v-list-item-title アンケート入力のお願い
            v-list-item-subtitle 被験者のご年齢や実験環境について把握するため、以下「アンケートを始める」ボタンからアンケート調査にご協力お願いいたします。
        v-card-actions.ml-2.mb-2
          v-btn(outlined color="primary" @click="formOpen()") アンケートを始める
      v-card.my-4(outlined v-if="endEnquete")
        v-list-item
          v-list-item-content.py-4
            v-list-item-title アンケートへのご協力ありがとうございました。
          v-list-item-action
            v-btn(outlined color="primary" @click="formOpen()") アンケート内容を変更する
    transition(name="fade")
      .enquete-form(v-if="isformOpened")
        .enquete-form-wrapper
          .container.my-4
            v-form.mt-8(v-model="valid" ref="form")
              ul.form-list
                li: v-text-field.my-4(label="氏名 *" v-model="realNameCom" :rules="rules.req")
                li: v-text-field.my-4(label="所属 *" v-model="belongsCom" :rules="rules.req")
                li: v-radio-group.my-4(v-model="gender" row :rules="rules.req")
                  label.mr-8 性別 *
                  v-radio(v-for="(gen,genId) in sel.gender" :key="`gen-${gen}`" :label="gen" :value="gen")
                li: v-text-field.my-4(label="年齢 *" type="number" v-model.number="age" suffix="歳" :rules="rules.age")
                li: v-textarea.my-4(label="普段どのくらいの頻度で本や新聞などの紙媒体の読み物を読みますか？ *" hint="紙媒体であれば、参考書,論文,雑誌,文庫本等々、ジャンルの指定はありません。「週何時間」や「1カ月何冊」などと回答いただければ結構です。" v-model="bookReadTime" rows="1" :rules="rules.req")
                li: v-textarea.my-4(label="普段どのくらいの頻度でスマホやPCで活字を読みますか？ *" hint="SNS等のアプリも含みます。「週何時間」や「1日何時間」などと回答いただければ結構です。" v-model="digitalReadTime" rows="1" :rules="rules.req")
                li: v-textarea.my-4(label="どんな読み物を読みますか？" hint="参考書、論文、雑誌、文庫本といったカテゴリで回答いただければ結構です。" v-model="kindOfBook" rows="1")
                li: v-row.my-4
                  v-col(cols="12" md="6")
                    .pt-2 視力はどのくらいですか *
                    <small>（実験時に眼鏡をかけていた場合、かけた状態での視力を記入）</small>
                  v-col(cols="12" md="3")
                    v-text-field(label="左目" type="number" v-model.number="leftSight" :rules="rules.age" step="0.5")
                  v-col(cols="12" md="3")
                    v-text-field(label="右目" type="number" v-model.number="rightSight" :rules="rules.age" step="0.5")
                li: .my-4
                  label 飛ばし読みをよく行いますか？ *
                  v-radio-group.mt-2(v-model="skipRead" row :rules="rules.req")
                    v-radio(v-for="(skipRead,skipReadId) in sel.skipRead" :key="`skipRead-${skipRead}`" :label="skipRead" :value="skipRead")
                li: .my-4
                  label 文章の読解力を問うような国語の問題は得意ですか？ *
                  v-radio-group.mt-2(v-model="japanese" row :rules="rules.req")
                    v-radio(v-for="(japanese,japaneseId) in sel.japanese" :key="`japanese-${japanese}`" :label="japanese" :value="japanese")
                v-btn(:disabled="!valid" :color="error ? 'error' : 'primary'" @click="validate" :loading="updating").mr-2 {{endEnquete ? '回答を再送する' : '回答を送信する'}}
                v-btn(color="#888" dark @click="isformOpened = false") キャンセルして戻る
</template>
<script>
import firebase from '~/plugins/firebase'

export default {
  props: {
    realName: {
      type: String,
      default: ''
    },
    belongs: {
      type: String,
      default: ''
    },
    endEnquete: {
      type: Boolean,
      default: false
    },
    enquete: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      valid: false,
      isformOpened: false,
      rules: {
        req: [(v) => !!v || '必須項目です'],
        age: [(v) => v > 0 || '0よりも大きくしてください']
      },
      sel: {
        gender: ['男性', '女性', 'その他'],
        skipRead: ['全くしない', 'あまりしない', 'たまにする', 'よくする'],
        japanese: [
          '不得意',
          'どちらかというと不得意',
          'どちらでもない',
          'どちらかというと得意',
          '得意'
        ]
      },
      gender: '',
      age: null,
      bookReadTime: '',
      kindOfBook: '',
      digitalReadTime: '',
      leftSight: 1.5,
      rightSight: 1.5,
      skipRead: '',
      japanese: '',
      updating: false,
      error: false
    }
  },
  computed: {
    realNameCom: {
      get() {
        return this.realName
      },
      set(val) {
        this.$emit('setRealName', val)
      }
    },
    belongsCom: {
      get() {
        return this.belongs
      },
      set(val) {
        this.$emit('setBelongs', val)
      }
    }
  },
  watch: {
    enquete(obj) {
      this.gender = obj.gender
      this.age = obj.age
      this.bookReadTime = obj.bookReadTime
      this.kindOfBook = obj.kindOfBook
      this.digitalReadTime = obj.digitalReadTime
      this.leftSight = obj.leftSight
      this.rightSight = obj.rightSight
      this.skipRead = obj.skipRead
      this.japanese = obj.japanese
    }
  },
  methods: {
    formOpen() {
      const realName = this.$store.state.realName
      if (realName === '') {
        this.$emit('setRealName', realName)
      }
      const belongs = this.$store.state.belongs
      if (belongs === '') {
        this.$emit('setBelongs', belongs)
      }
      this.isformOpened = true
    },
    validate() {
      this.$refs.form.validate()
      this.updating = true
      const uid = this.$store.state.user.uid
      const enquete = {
        gender: this.gender,
        age: this.age,
        bookReadTime: this.bookReadTime,
        kindOfBook: this.kindOfBook,
        digitalReadTime: this.digitalReadTime,
        leftSight: this.leftSight,
        rightSight: this.rightSight,
        skipRead: this.skipRead,
        japanese: this.japanese
      }
      firebase
        .firestore()
        .collection('users')
        .doc(uid)
        .update({
          realName: this.realName,
          belongs: this.belongs,
          enquete
        })
        .then(() => {
          console.log('Succsess update enquete data')
          this.updating = false
          this.isformOpened = false
          this.$emit('endEnqueteTrue')
        })
        .catch((error) => {
          console.log('Error! : update enquete data', error)
          this.updating = false
          this.errer = true
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.enquete-form {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 20000;
  width: 100vw;
  height: 100vh;
  background: rgba(#556677, 0.6);
}
.enquete-form-wrapper {
  position: fixed;
  margin: auto;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 20000;
  width: 1024px;
  height: calc(100% - 80px);
  background: #fff;
  overflow-y: auto;
}
.form-list {
  li {
    padding-left: 8px;
  }
}
</style>
