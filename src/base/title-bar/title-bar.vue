<template>
  <div class="titleBar">
    <mu-appbar :title=titleBarName>
      <mu-icon-button icon="arrow_back" slot="left" @click="back"/>
    </mu-appbar>
  </div>
</template>

<script>
export default {
 props: {
    titleBarName: {
      type: String,
      default: ""
    }
 },
  methods: {
    back() {
      this.$router.back();
    }
  }
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
.titleBar{
  height $top-height;
  background-color:$color-background

}
</style>