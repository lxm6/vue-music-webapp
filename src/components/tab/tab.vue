<template>
  <div class="tab">
    <router-link tag="div" class="tab-item" to="/recommend">
      <mu-flat-button class="demo-flat-button">
        <span class="tab-link">音乐</span>
      </mu-flat-button>
    </router-link>
    <router-link tag="div" class="tab-item" to="/user">
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

.tab {
  display: flex;
  height: 50px;
  line-height: 44px;
  font-size: 18px;
  background-color: $color-theme;

  .tab-item {
    flex: 1;
    text-align: center;

    .tab-link {
      color: #fff;
      display inline-block;
    }

    &.router-link-active {
      .tab-link {
        border-bottom: 3px solid #fff;
      }
    }
  }
}
</style>