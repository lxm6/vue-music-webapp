<template>
  <div class="m-header">
    <div class="menu" @click="open">
      <mu-icon-button icon="menu"/>
    </div>
    <div class="icon"></div>
    <h1 class="text">柠檬音乐</h1>
    <router-link tag="div" class="mine" to="/search">
      <mu-icon-button icon="search"/>
    </router-link>
  </div>
</template>

<script>

export default {
  methods: {
    open() {
      this.$emit("open");
    }
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.m-header {
  position: relative;
  height: 48px;
  text-align: center;
  color: $color-text-h;
  background-color: $color-theme;
  font-size 0;

  .menu {
    position: absolute;
    left: 8px;
  }

  .icon {
    display: inline-block;
    margin-top: 8px;
    width: 30px;
    height: 32px;
    margin-right: 9px;
    bg-image('logo');
    background-size: 30px 32px;
  }

  .text {
    display: inline-block;
    vertical-align: top;
    line-height: 50px;
    font-style: bold;
    font-size: $font-size-large;
  }

  .mine {
    position: absolute;
    top: 0;
    right: 5px;

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