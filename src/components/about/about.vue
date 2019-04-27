<template>
  <transition name="slide">
    <div class="wrapper" v-show="showFlag" @click="hide">
      <confirm ref="confirm" @confirm="confirmClear" text="是否清除缓存？" confirmBtnText="清除"></confirm>

      <div @click.stop class="leftNav">
        <mu-list  class="mu-list-class">
          <mu-list-item title="App下载" @click="download" class="mu-list-item"/>
          <mu-list-item title="清除缓存" @click="showConfirm" class="mu-list-item"/>
          <mu-list-item title="刷新页面" @click="refreshPage" class="mu-list-item"/>
          <mu-list-item title="关于" @click="openAboutDialog" class="mu-list-item"/>
        </mu-list>
      </div>
      <top-tip ref="topTip">
        <div class="tip-title">
          <i class="icon-ok"></i>
          <span class="text">清除缓存成功</span>
        </div>
      </top-tip>

        <mu-dialog :open="showAboutDialog" @close="closeAboutDialog" title="关于">
          <mu-list>
            <mu-list-item title="网站" disabled>
              <p slot="after">柠檬音乐</p>
            </mu-list-item>
            <mu-list-item title="网址" disabled>
              <p slot="after">lxm6.top</p>
            </mu-list-item>
            <mu-list-item title="作者" disabled>
              <p slot="after">LXM</p>
            </mu-list-item>
            <mu-list-item title="GitHub" @click="openGitHub">
              <p slot="after">
                <img src="~@/common/image/github.svg" alt="github" width="35">
              </p>
            </mu-list-item>
          </mu-list>
          
        </mu-dialog>
      </div>
    
  </transition>
</template>

<script>
import TopTip from "base/top-tip/top-tip";
import Confirm from "base/confirm/confirm";
import { openUrl } from "common/js/openUrl";

export default {
  props: {
    delay: {
      type: Number,
      default: 1000
    }
  },
  data() {
    return {
      showFlag: false,
      showAboutDialog: false
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
      this.hide();
      openUrl("https://www.lxm6.top/download/download.html");
    },
    openAboutDialog() {
      this.showAboutDialog = true;
    },
    closeAboutDialog() {
      this.showAboutDialog = false;
    },
    openGitHub() {
      openUrl("https://github.com/lxm6/vue-music-webapp");
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
.mu-list-class{
  text-indent 20px;
  }
.mu-list-item{
  padding 5px 0;
}
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
  width: 220px;
  height: 100%;
  padding-top: 100px;
  opacity: 0.95;
  box-shadow: 3px 0px 14px 4px rgba(0, 0, 0, 0.2);
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


</style>