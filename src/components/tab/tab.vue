<template>
  <!-- <div class="tab">
    <router-link tag="div" class="tab-item" to="/recommend">
      <span class="tab-link">推荐</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/singer">
      <span class="tab-link">歌手</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/rank">
      <span class="tab-link">排行</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/search">
      <span class="tab-link">搜索</span>
    </router-link>
  </div>-->
  <mu-bottom-nav :value="bottomNav" @change="handleChange">
    <mu-bottom-nav-item value="recommend" title="推荐" to="/recommend"/>
    <mu-bottom-nav-item value="singer" title="歌手" to="/singer"/>
    <mu-bottom-nav-item value="rank" title="排行" to="/rank"/>
    <mu-bottom-nav-item value="search" title="搜索" to="/search"/>
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