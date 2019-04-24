<template>
  <div class="loading">
    <mu-circular-progress :size="30" :strokeWidth="4" color="#31c27c"/>
    <p class="desc">{{title}}</p>
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

  .desc {
    line-height: 30px;
    font-size: $font-size-small;
    color: $color-text-l;
  }
}
</style>