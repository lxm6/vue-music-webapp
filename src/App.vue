<template>
  <div id="app" @touchmove.prevent>
    <m-header></m-header>
    <tab></tab>
    <!-- 可将dom缓存在内存中,不会每次切换都加载 -->
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
    <player></player>

  </div>
</template>

<script>
import MHeader from "components/m-header/m-header";
import Player from "components/player/player";
import Tab from "components/tab/tab";
import TopTip from "base/top-tip/top-tip";

export default {

  components: {
    MHeader,
    Tab,
    Player,
    TopTip
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.tip-title {
  text-align: center;
  padding: 18px 0;
  font-size: 0;

  .text {
    font-size: $font-size-medium;
    color: $color-text;
  }
}
</style>