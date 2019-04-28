<template>
  <div>
    <about ref="about"></about>
    <m-header @open="open"></m-header>
    <tab></tab>
    <recommend></recommend>
    <!-- 可将dom缓存在内存中,不会每次切换都加载 -->
    <keep-alive>
      <router-view></router-view>
    </keep-alive>

    <player></player>
  </div>
</template>

<script>
import Player from "components/player/player";
import MHeader from "components/m-header/m-header";
import Recommend from "components/recommend/recommend";
import About from "components/about/about";
import Tab from "components/tab/tab";
export default {
  data() {
    return {
      fullscreen: false
    };
  },
  methods: {
    open() {
      this.$refs.about.show();
    }
  },

  components: {
    Player,
    MHeader,
    Recommend,
    Tab,
    About
  }
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';
</style>