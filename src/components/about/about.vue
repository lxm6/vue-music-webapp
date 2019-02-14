<template>
  <!-- <transition name="slide"> -->
  <div class="wrapper" v-show="showFlag" @click="hide">
    <div @click.stop class="leftNav">
      <div @click="clearStorage">刷新刷新刷新</div>
      <div @click="refreshPage">刷刷新刷新新</div>
      <div @click="openDialog">关刷新刷新于</div>
    </div>

    <top-tip ref="topTip">
      <div class="tip-title">
        <i class="icon-ok"></i>
        <span class="text">清除缓存成功</span>
      </div>
    </top-tip>
    <!-- <div class="dialog"></div> -->
  </div>
  <!-- </transition> -->
</template>

<script>
import TopTip from "base/top-tip/top-tip";

export default {
  props: {
    delay: {
      type: Number,
      default: 1000
    }
  },
  data() {
    return {
      showFlag: true
    };
  },
  methods: {
    show() {
      this.showFlag = true;
    },
    hide() {
      this.showFlag = false;
    },

    clearStorage() {
      localStorage.clear();
      this.$refs.topTip.show();
    },
    // 强制刷新页面
    refreshPage() {
      window.location.reload();
    },
    openDialog() {
      console.log("弹出");
    }
  },
  components: {
    TopTip
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

.wrapper {
  position: fixed;
  top: 0px;
  bottom: 0;
  z-index: 220;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);

  &.slide-enter-active, &.slide-leave-active {
    transition: opacity 0.3s;

    .leftNav {
      transition: all 0.3s;
    }
  }

  &.slide-enter, &.slide-leave-to {
    opacity: 0;

    .leftNav {
      transform: translate3d(-100%, 0, 0);
    }
  }
}

.leftNav {
  background-color: #000;
  width: 60%;
  height: 100%;
  opacity: 0.95;
  box-shadow: 3px 0px 14px 4px rgba(0, 0, 0, 0.2);
  color: #fff;
  z-index: 100000;

  div {
    position: absolute;
    top: 100px;
    left: 100px;
    color: #fff;
    height: 50px;
    width: 100px;
    border-top: 0.5px solid #fff;
  }
}

.tip-title {
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

.leftNav-enter, .leftNav-leave-to {
  transform: translateX(-100%);
}

.leftNav-enter-active, .leftNav-leave-active {
  transition: all 0.5s ease-out;
}

.dialog {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 270px;
  height: 340px;
  background-color: #000;
  box-shadow: 3px 0px 14px 4px rgba(0, 0, 0, 0.12);
}
</style>