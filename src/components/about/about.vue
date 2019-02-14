<template>
  <transition name="slide">
    <div class="wrapper" v-show="showFlag" @click="hide">
      <div @click.stop class="leftNav">
        <ul>
          <li @click="clearStorage">清除缓存</li>
          <li @click="refreshPage">刷新页面</li>
          <li @click="openDialog">关于</li>
          <li></li>
        </ul>
      </div>
      <top-tip ref="topTip">
        <div class="tip-title">
          <i class="icon-ok"></i>
          <span class="text">清除缓存成功</span>
        </div>
      </top-tip>
      <div class="dialog">
        <h1>关于</h1>
        <ul>
          <li>软件名称</li>
          <li>版本</li>
          <li>作者</li>
          <li>GitHub</li>
        </ul>
      </div>
    </div>
  </transition>
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
      showFlag: false
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
  z-index: 1000;
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
  background-color: #111;
  width: 50%;
  height: 100%;
  opacity: 0.95;
  box-shadow: 3px 0px 14px 4px rgba(0, 0, 0, 0.2);
  color: #fff;

  ul {
    padding-top 100px

    li {
      padding-left 30px;
      color: #fff;
      height: 60px;
      line-height: 60px;

      &:hover{
        background-color #333937
        }
    }
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
  padding 35px
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 230px;
  height: 300px;
  background-color: #000;
  box-shadow: 3px 0px 14px 4px rgba(0, 0, 0, 0.6);
  border-radius 5px
  font-size 20px

  h1{
    font-size 30px
    padding-bottom 20px
    border-bottom :1px solid $color-theme-d
    color:$color-theme;
    margin-bottom 20px
  }

  li{
    padding 10px 0
  }

  
}

</style>