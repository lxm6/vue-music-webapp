<template>

  <mu-bottom-nav :value="bottomNav" @change="handleChange">
    <mu-bottom-nav-item value="recommend" title="音乐" to="/recommend"/>
    <mu-bottom-nav-item value="user" title="我的" to="/user"/>
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


</style>
