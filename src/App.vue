<template>
  <div id="app" @touchmove.prevent>
    <about ref="about"></about>
    <m-header @show="show"></m-header>
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
  data() {
    return {
      fullscreen: false
    };
  },
  methods: {
    // handleFullScreen() {
    //   let element = document.documentElement;
    //   if (this.fullscreen) {
    //     if (document.exitFullscreen) {
    //       document.exitFullscreen();
    //     } else if (document.webkitCancelFullScreen) {
    //       document.webkitCancelFullScreen();
    //     } else if (document.mozCancelFullScreen) {
    //       document.mozCancelFullScreen();
    //     } else if (document.msExitFullscreen) {
    //       document.msExitFullscreen();
    //     }
    //   } else {
    //     if (element.requestFullscreen) {
    //       element.requestFullscreen();
    //     } else if (element.webkitRequestFullScreen) {
    //       element.webkitRequestFullScreen();
    //     } else if (element.mozRequestFullScreen) {
    //       element.mozRequestFullScreen();
    //     } else if (element.msRequestFullscreen) {
    //       // IE11
    //       element.msRequestFullscreen();
    //     }
    //   }
    //   this.fullscreen = !this.fullscreen;
    // },

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
</style>