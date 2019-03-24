<template>
  <transition name="slide">
    <div class="wrapper" v-show="showFlag" @click="hide">
      <div @click.stop class="leftNav">
        <ul>
          <li @click="download" id="goto_baidu">App下载</li>
          <li @click="showConfirm">清除缓存</li>
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
      <div class="dialog-wrapper" ref="dialog" @click.stop="hideDialog">
        <div class="dialog" @click.stop>
          <h1>关于</h1>
          <ul>
            <li>
              网站
              <span>柠檬音乐</span>
            </li>
             <li>
              网址
              <span>lxm6.top</span>
            </li>
            <li>
              作者
              <span>LXM</span>
            </li>
           
            <li @click="openUrl" class="url">
              GitHub
              <span>
                <img src="~@/common/image/github.svg" alt="github" width="35">
              </span>
            </li>
          </ul>
        </div>
      </div>
      <confirm ref="confirm" @confirm="confirmClear" text="是否清除缓存？" confirmBtnText="清除"></confirm>
    </div>
  </transition>
</template>

<script>
import TopTip from "base/top-tip/top-tip";
import Confirm from "base/confirm/confirm";

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
    // 强制刷新页面
    refreshPage() {
      window.location.reload();
    },
    download() {
      
      // this.hide();
      // this.$router.push({
      //   name: "target",
      //   params: {
      //     data: "https://www.lxm6.top/download/download.html"
      //   }
      // });

    },
    openDialog() {
      this.$refs.dialog.style.display = "block";
    },
    hideDialog() {
      this.$refs.dialog.style.display = "none";
    },
    openUrl() {
      this.hide();
      this.hideDialog();
      this.$router.push({
        name: "target",
        params: {
          data: "https://github.com/lxm6/vue-music-webapp"
        }
      });
    },
    showConfirm() {
      this.$refs.confirm.show();
    },
    confirmClear() {
      localStorage.clear();
      this.$refs.topTip.show();
      this.refreshPage();
    }
  },

  components: {
    TopTip,
    Confirm
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
  background-color: $color-highlight-background;
  width: 60%;
  height: 100%;
  opacity: 0.95;
  box-shadow: 3px 0px 14px 4px rgba(0, 0, 0, 0.2);

  ul {
    padding-top: 100px;

    li {
      padding-left: 30px;
      color: $color-text;
      height: 60px;
      line-height: 60px;

    }
  }
}

.tip-title {
  text-align: center;
  padding: 18px 0;
  font-size: 0;

  .icon-ok {
    font-size: $font-size-medium-x;
    color: #fff;
    margin-right: 6px;
  }

  .text {
    font-size: $font-size-medium-x;
    color: #fff;
  }
}

.dialog-wrapper {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.1);
  display: none;
  animation: fadein 0.3s;

  .dialog {
    padding: 30px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 3000;
    width: 200px;
    height: 245px;
    background-color: #fff;
    box-shadow: 3px 0px 14px 4px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    font-size: 16px;
    color: $color-theme;
    animation: slide-in 0.3s;

    h1 {
      font-size: 22px;
      padding-bottom: 20px;
      border-bottom: 1px solid $color-theme-d;
      margin-bottom: 15px;
    }

    .url:hover {
      background-color: rgba(255,255,255,0.5);
    }

    ul {
      float: left;

      li {
        padding: 0 10px;
        height: 50px;
        line-height: 50px;

        span {
          margin-left: 80px;
          display: inline-block;
          float: right;
          color:rgba(0,0,0,0.7);
        }
      }

      img {
        margin: 10px auto;
      }
    }
  }
}

@keyframes fadein {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@keyframes slide-in {
  0% {
    transform: translate(-50%, -70%);
  }
}
</style>