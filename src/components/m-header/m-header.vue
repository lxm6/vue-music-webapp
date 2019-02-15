<template>
  <div class="m-header">
    <i class="menu" @click="show">&#xe790;</i>
    <div class="icon"></div>
    <h1 class="text">Lemon Music</h1>
    <router-link tag="div" class="mine" to="/user">
      <i class="icon-mine"></i>
    </router-link>
  </div>
</template>

<script>
import about from "components/about/about";

export default {
  methods: {
    show() {
      this.$emit("show");
    }
  },
  components: {
    about
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.m-header {
  position: relative;
  height: 44px;
  text-align: center;
  color: $color-text;
  background-color: $color-theme;

  .menu {
    display: inline-block;
    position: absolute;
    top: 0;
    left: 20px;
    width: 30px;
    height: 32px;
    font-size: 26px;
    margin-top: 6px;
    color: $color-text;
    font-family: 'iconfont' !important;
    font-weight: normal;
    font-style: normal;
  }

  .icon {
    display: inline-block;
    vertical-align: top;
    margin-top: 6px;
    width: 30px;
    height: 32px;
    margin-right: 9px;
    bg-image('logo');
    background-size: 30px 32px;
  }

  .text {
    display: inline-block;
    vertical-align: top;
    line-height: 44px;
    font-size: $font-size-large;
  }

  .mine {
    position: absolute;
    top: 0;
    right: 0;

    .icon-mine {
      display: block;
      padding: 12px;
      font-size: 20px;
      color: $color-text;
    }
  }
}

.tip-title {
  position: absolute;
  top: 100px;
  left: 100px;
  text-align: center;
  padding: 18px 0;
  font-size: 0;

  .icon-ok {
    font-size: $font-size-medium-x;
    color: $color-text;
    margin-right: 6px;
  }

  .text {
    font-size: $font-size-medium-x;
    color: $color-text;
  }
}
</style>