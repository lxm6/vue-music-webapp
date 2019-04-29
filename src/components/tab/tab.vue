<template>
  <div class="tab">
    <router-link tag="div" class="tab-item" to="/main">
      <mu-flat-button class="demo-flat-button">
        <span class="tab-link">音乐</span>
      </mu-flat-button>
    </router-link>
    <router-link tag="div" class="tab-item" to="/main/user">
      <mu-flat-button class="demo-flat-button">
        <span class="tab-link">我的</span>
      </mu-flat-button>
    </router-link>
  </div>
</template>

<script type="text/ecmascript-6">
export default {};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

.demo-flat-button {
  font-size: $font-size-medium-x;
  color: #fff;
}

.tab {
  background: $color-theme;
  display: flex;
  height: 46px;
  line-height: 36px;
  color: #fff;
  border-bottom: 3px solid #d8f057;

  .tab-item {
    flex: 1;
    text-align: center;

    &.router-link-exact-active {
      .tab-link {
        border-bottom:3px solid #fff;
      }
    }
  }
}
</style>