<template>
  <div id="app" @touchmove.prevent>
    <i class="menu" @click="show">&#xe605;</i>
    <about ref="about"></about>
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
import about from "components/about/about";

export default {
  methods: {
    show() {
      this.$refs.about.showFlag = true;
    }
  },

  components: {
    MHeader,
    Tab,
    Player,
    about
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.menu {
  position: absolute;
  top: 6px;
  left: 20px;
  padding: 12px;
  font-size: 20px;
  z-index 200
  color: $color-text;
  font-family: 'iconfont' !important;
  font-weight: normal;
  font-style: normal;
}

</style>