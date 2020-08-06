<template lang="pug">
  .login-info-card
    v-card(outlined).my-4
      v-list-item
        v-list-item-avatar(color="grey")
          img(:src="user.photoURL" :alt="user.displayName")
        v-list-item-content
          v-list-item-title {{user.displayName}}
          v-list-item-subtitle {{user.email}}
        v-list-item-action
          v-menu(offset-y)
            template(v-slot:activator="{ on }") 
              v-btn(v-on="on" color="primary") ログイン中
            v-list
              v-list-item(@click="logout")
                v-list-item-title ログアウト
</template>
<script>
export default {
  props: {
    user: {
      type: Object,
      default: null
    }
  },
  methods: {
    logout() {
      this.$emit('logout')
    }
  }
}
</script>
