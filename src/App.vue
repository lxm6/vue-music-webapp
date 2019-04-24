<template>
  <div id="app" @touchmove.prevent>
    <about ref="about"></about>
    <m-header @show="show"></m-header>
    <tab></tab>
    <!-- 可将dom缓存在内存中,不会每次切换都加载 -->
    <transition name="slide">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
    </transition>
    <transition name="slide">
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </transition>

    <player></player>
  </div>
</template>

<script>
import MHeader from "components/m-header/m-header";
import Player from "components/player/player";
import Tab from "components/tab/tab";
import about from "components/about/about";

export default {
  data() {
    return {
      fullscreen: false
    };
  },
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

#app {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}

.slide-enter-active, .slide-leave-active {
  transition: all 0.3s;
}

.slide-enter, .slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>