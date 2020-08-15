<template lang="pug">
  .enquete
    v-card.my-4(outlined)
      v-list-item(two-line)
        v-list-item-content.pb-0
          v-list-item-title アンケート入力のお願い
          v-list-item-subtitle 被験者のご年齢や実験環境について把握するため、以下「アンケートを始める」ボタンからアンケート調査にご協力お願いいたします。
      v-card-actions.ml-2.mb-2
        v-btn(outlined color="primary" @click="formOpen = true") アンケートを始める
    .enquete-form(v-if="formOpen")
      .enquete-form-wrapper
        .container.my-4
          form
            v-btn(color="primary" @click="formOpen = false") 閉じる
</template>
<script>
export default {
  props: {
    realName: {
      type: String,
      default: ''
    },
    belongs: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      formOpen: false
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
</style>
