<template lang="pug">
  .whiteout(v-if="whiteout")
    .whiteout_upper#whiteout_upper(
      :style="{marginTop:`${-(crackPx/2)}px`,marginBottom:`${crackPx}px`,background: `linear-gradient( to bottom, rgba(255,255,255,1) ${100 - whiteBlur}%, rgba(255,255,255,0) )`}"
    )
    .whiteout_under#whiteout_under(
      :style="{background: `linear-gradient( to top, rgba(255,255,255,1) ${100 - whiteBlur}%, rgba(255,255,255,0) )`}"
    )
</template>
<script>
export default {
  data() {
    return {}
  },
  computed: {
    whiteout() {
      return this.$store.state.whiteout
    },
    whiteBlur() {
      return this.$store.state.white_blur
    },
    crackPx() {
      return this.$store.state.crack_px
    }
  }
}
</script>
<style lang="scss" scoped>
.whiteout {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 2;
}
.whiteout_upper {
  width: 100%;
  height: 50vh;
}
.whiteout_under {
  width: 100%;
  height: 50vh;
}
</style>
