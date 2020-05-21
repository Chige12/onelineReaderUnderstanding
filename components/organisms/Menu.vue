<template>
  <div>
    <div v-if="menuDisplay" class="menu">
      <!-- <SettingMenu /> -->
      <p>隙間：{{ crackPx }}px</p>
      <ul>
        <li v-for="(story, story_id) in storylist" :key="`storis-${story_id}`">
          <nuxt-link :to="`../stories/story_${story_id + 1}`"
            >{{ story.sourceBase.slice(0, -3) }} | {{ story.title }}</nuxt-link
          >
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
// import SettingMenu from '~/components/molecules/SettingMenu.vue'
import summaryJson from '~/contents/summary.json'
export default {
  // components: {
  //   SettingMenu
  // },
  data() {
    return {
      storylist: []
    }
  },
  computed: {
    menuDisplay() {
      return this.$store.state.menuDisplay
    },
    crackPx() {
      return this.$store.state.crack_px
    }
  },
  mounted() {
    this.updateStorylist()
  },
  methods: {
    updateStorylist() {
      const summaryJsonMap = Object.entries(
        summaryJson.fileMap
      ).map(([key, value]) => ({ key, ...value }))
      this.storylist = summaryJsonMap.sort(function(a, b) {
        if (a.key < b.key) return -1
        if (a.key > b.key) return 1
        return 0
      })
      console.log(this.storylist)
      this.$store.commit('storylist', this.storylist)
    }
  }
}
</script>

<style lang="scss" scoped>
.menu {
  position: fixed;
  z-index: 3;
}
</style>
