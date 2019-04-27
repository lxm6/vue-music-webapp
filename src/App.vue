<template>
  <div id="app" @touchmove.prevent>
    <div class="header">
      <about ref="about"></about>
      <m-header @open="open"></m-header>
      <tab></tab>
    </div>
    <!-- 可将dom缓存在内存中,不会每次切换都加载 -->
    <!-- <transition name="slide">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
    </transition>
    <transition name="slide">
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </transition>-->
    <transition name="slide" mode="out-in">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </transition>
    <player></player>
  </div>
</template>

<script>
import Player from "components/player/player";
import MHeader from "components/m-header/m-header";
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
    Tab,
    About
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
  transition: all 3s;
}

.slide-enter, .slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>