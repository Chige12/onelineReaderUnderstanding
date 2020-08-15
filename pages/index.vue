<template lang="pug">
  v-layout(column justify-center align-center)
    v-flex(xs12 sm8 md6).mt-8
      v-card.px-6.py-2.mb-8
        v-card-actions
          v-card-text 既に以下同意済みで、過去にサインインしたことがあればこちらからでもログインできます。
          v-spacer
          v-btn(nuxt to="/tests" color="primary" dense) ログイン
      v-card.pa-6
        v-card-title.headline オンライン 1行表示UI被験者実験 サインイン画面
        v-card-text
          h2.mt-8.mb-2 実験の説明
          p 本研究の趣旨などは以下のボタンを押してご覧ください。本実験にご参加頂ける場合は、下記研究の目的や実施内容などをご理解の上、本ページ最下部の「同意」にチェックし、ログインしてください。
            | 参加を決めた後に途中で辞退することも可能です。実験にご協力いただければ幸いです。
          .my-4
            DescriptionDialog
          h2.mt-8.mb-2 被験者の同意
          p 私は、「スクリーン上での読書における1行表示UIの提案と評価に関する研究」のための実験について、
            | 目的・方法・予測される問題などについて、上記ボタンで表示できる文書（タイトル：「スクリーン上での読書における1行表示UIの提案と評価」実験の説明）を読み、
            | 実験協力者（被験者）として十分理解しました。また、以下の項目についても理解しました。
          ul.my-4
            li: p 実験の目的・方法・あらゆる危険性とそれに対すること。
            li: p 私は自らの自由意志で、いつでも実験を中止できること。
            li: p 生じる私の不利益に対する配慮は、学問的・社会的利益より優先されること。
            li: p 私は万一実験に参加したことに起因する不利益を被った場合、奈良工業高等専門学校における人を対象とする研究倫理委員会に対して申し立てを行うことができること。
          p そこで、自らの自由意志によりこの研究に協力するために、この実験の実験協力者となることを同意します。
        v-card-actions
          v-col
            v-form(v-model="valid" ref="form")
              v-row
                v-col
                  v-text-field(
                    v-model="belongs"
                    :rules="[v => !!v || '所属をご記入ください']"
                    label="所属"
                    required
                    )
                v-col
                  v-text-field(
                    v-model="realName"
                    :rules="[v => !!v || '氏名をご記入ください']"
                    label="氏名"
                    required
                    )
              v-row
                v-checkbox(
                  v-model="isCheked"
                  :rules="[v => !!v || '同意しないとサインインはできません']"
                  label="同意する"
                  ).mt-0.ml-2
                v-spacer
                v-btn(:disabled="!valid" @click="validate" dense color="primary").mr-2.mb-4 Google でサインイン

</template>

<script>
import DescriptionDialog from '~/components/atoms/descriptionDialog.vue'
export default {
  components: {
    DescriptionDialog
  },
  data() {
    return {
      valid: true,
      haveAgreed: false,
      isCheked: false,
      realName: '',
      belongs: ''
    }
  },
  methods: {
    validate() {
      this.$refs.form.validate()
      this.$store.commit('setRealName', this.realName)
      this.$store.commit('setBelongs', this.belongs)
      const date = new Date()
      this.$store.commit('setAcceptDate', date)
      this.$router.push('/tests')
    }
  }
}
</script>
