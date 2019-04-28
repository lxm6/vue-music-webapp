<template>
  <div id="app" @touchmove.prevent>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
#app {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
</style>