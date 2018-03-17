<template>
  <div>
    <img src="/images/color_analyzer.svg" alt="" width="30" height="30"><br>
    <button class="hoge_button" @click="onClick()">{{text}}</button>
  </div>
</template>

<script>

export default {
  data () {
    return {
      text: 'hoge'
    }
  },
  methods: {
    onClick(){
      this.text += 'hoge';
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '../stylus/_pccs'

.hoge_button
  background-color: $lt6
  border-radius: 3px
  padding: 3px

</style>
