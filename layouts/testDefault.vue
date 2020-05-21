<template>
  <div>
    <Menu />
    <nuxt />
  </div>
</template>

<script>
import Menu from '~/components/organisms/Menu.vue'

export default {
  components: {
    Menu
  }
}
</script>

<style>
html {
  margin: 0;
}
body {
  margin: 0;
  position: relative;
}
</style>
