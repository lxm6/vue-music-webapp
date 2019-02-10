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

export default {
  components: {
    MHeader,
    Tab,
    Player
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
</style>