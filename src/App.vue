<template>
  <div @touchmove.prevent>
    <about ref="about"></about>
    <m-header @open="open"></m-header>
    <tab></tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
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
#app {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);

}
</style>