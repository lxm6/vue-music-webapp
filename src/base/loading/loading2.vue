<template>
  <div class="loading">
   <img src="./loading.gif" width="24" height="24">
    <span class="desc">{{title}}</span>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "正在载入更多..."
    }
  }
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

.loading {
  margin 0 auto;
  padding 6px 0;
  width 200px
  text-align: center;
  display flex
  align-items center

  .desc {
    font-size: $font-size-small;
    color: $color-text-l;
    margin-left 4px
  }
}
</style>