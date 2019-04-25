<template>
  <div id="app" @touchmove.prevent>
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
import Player from "components/player/player";

export default {
  data() {
    return {
      fullscreen: false
    };
  },

  components: {
    Player
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