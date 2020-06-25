<template lang="pug">
  v-app.start-page
    .start-page-wrapper
      .start-page-top
        h2 {{title}}
        p ソース : {{source}}
        p UI : {{source===true ? '一行のみ表示' : '通常スクロール'}}
      .ui-change.mt-4(v-if="whiteout")
        h3 【重要】一行のみ表示UIでの、テストの行い方
        ul.mt-4
          li このUIでは、文章が一行ずつ表示されます。次の行は下キー⬇️、前の行へは上キー⬆️で移動できます。
          li 以下の「テストスタート！」ボタンでテストが開始されます。
          li 画面中央にタイトルが表示されたら下矢印キー⬇️を押してください。（下矢印キーを押したタイミングで計測開始）
          li 下矢印キー⬇️を押すと、最初の一行が表示されます。
          li 下矢印キー⬇️を押すたびに、次の行の文章が表示されます。上下キーを使って、文章を一行ずつ読んでください。
          li 最後の行に達した時に、さらに下矢印キー⬇️が押された場合に計測終了となります。
          li 計測終了後、国語の文章問題が出題されますので回答してください。選択肢から選ぶ回答形式です。
      .ui-change.mt-4(v-else="whiteout")
        h3 【重要】通常スクロールUIでの、テストの行い方
        ul.mt-4
          li 以下の「テストスタート！」ボタンでテストと計測が開始されます。
          li 文章が表示されるので、読んでください。
          li 最後まで読み終えたら、すぐEnterキーを押してください。Enterキーを押したタイミングで計測は終了です。
          li Enterキーを押すと、国語の文章問題が出題され、回答してください。選択肢から選ぶ回答形式です。
      .start-btn.mt-4
        v-btn(color="primary" @click="$emit('startPageHide')") テストスタート！
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    source: {
      type: String,
      default: ''
    },
    whiteout: {
      type: Boolean,
      default: true
    }
  }
}
</script>
<style lang="scss" scoped>
.start-page {
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  height: 100vh;
  z-index: 1000;
  background: #556677;
}

.start-page-wrapper {
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
.start-page-top {
  h2 {
    margin-bottom: 8px;
  }
  p {
    margin-bottom: 4px;
  }
}
.ui-change {
  background: #e5ebed;
  padding: 24px 32px;
}
</style>
