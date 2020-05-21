<template>
  <div>
    <div id="top" class="reader">
      <div id="container" class="container">
        <h2 ref="storyTitle">
          <a :href="link">{{ title }}</a>
        </h2>
        <p ref="storyWriter">著者：{{ writer }}</p>
        <div
          ref="documentBody"
          class="documentBody"
          :style="`font-size: ${fontSize}px;`"
          v-html="bodyHtml"
        ></div>
      </div>
    </div>
    <Whiteout />
    <StopWatch />
  </div>
</template>

<script>
import StopWatch from '~/components/atoms/stopWatch.vue'
import Whiteout from '~/components/atoms/whiteout.vue'
import summaryJson from '~/contents/summary.json'
// import { SlowBuffer } from "buffer";
export default {
  layout: 'testDefault',
  components: {
    Whiteout,
    StopWatch
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
      whiteupperH: 16
    }
  },
  computed: {
    fontSize() {
      return this.$store.state.fontSize
    }
  },
  validate({ params }) {
    return summaryJson.sourceFileArray.includes(
      `contents/posts/${params.test}.md`
    )
  },
  mounted() {
    this.$nextTick(() => {
      // this.firstLoad()
      // setTimeout(() => this.firstLoad(), 500)
      const titleHeight = this.$refs.storyTitle.clientHeight
      const writerHeight = this.$refs.storyWriter.clientHeight
      this.$store.commit('ChangeCrack', titleHeight + writerHeight * 2)
    })
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
  }
}
</script>

<style>
.reader {
  padding: calc(50vh - 2rem) 0 calc(50vh - 2rem);
}
.container {
  max-width: 980px;
  margin: auto;
}
.documentBody p {
  line-height: 1.5;
  margin: 20px 0;
}
</style>
