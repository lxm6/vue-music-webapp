<template>

  <mu-bottom-nav :value="bottomNav" @change="handleChange">
    <mu-bottom-nav-item value="recommend" title="推荐" to="/recommend"/>
    <mu-bottom-nav-item value="singer" title="歌手" to="/singer"/>
    <mu-bottom-nav-item value="rank" title="排行" to="/rank"/>
    <mu-bottom-nav-item value="search" title="搜索" to="/search"/>
    <mu-bottom-nav-item value="search" title="歌单" to="/sort"/>
  </mu-bottom-nav>
</template>

<script>
export default {
  data() {
    return {
      bottomNav: "recommend"
    };
  },
  methods: {
    handleChange(val) {
      this.bottomNav = val;
    }
  }
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

.router-link-active {
  border-bottom: 3px solid #d5ef42;
  
}
</style>