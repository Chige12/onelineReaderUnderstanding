<template lang="pug">
  .dev
    v-textarea(
      v-model="text"
    )
    div {{countWord}}
    div {{checkDuplicate}}
    div {{randomize}}
</template>
<script>
export default {
  data() {
    return {
      text: ''
    }
  },
  computed: {
    countWord() {
      return this.text.split(',').length
    },
    checkDuplicate() {
      const arr = this.text.split(',')
      const findDuplicates = arr.filter(
        (item, index) => arr.indexOf(item) !== index
      )
      return findDuplicates
    },
    randomize() {
      const arr = this.text.split(',')
      const randomArr = arr
        .map(function(a) {
          return { weight: Math.random(), value: a }
        })
        .sort(function(a, b) {
          return a.weight - b.weight
        })
        .map(function(a) {
          return a.value
        })
      return randomArr.join(',')
    }
  }
}
</script>
