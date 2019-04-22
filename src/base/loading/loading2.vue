<template>
  <div class="loading">
    <mu-circular-progress :size="25" :strokeWidth="4" color="#31c27c" class="progress"/>
    <span class="desc">{{title}}</span>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "正在加载..."
    }
  }
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

.loading {
  width: 100%;
  text-align: center;
  height 60px;
  line-height: 40px;
  padding 10px 0;

  .desc {
    font-size: $font-size-small;
    color: $color-text-l;
    display: inline-block;
    margin-left: 10px;
    line-height: 40px;

  }
}
</style>