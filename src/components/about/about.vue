<template>
  <transition name="slideLeft">
    <div class="wrapper" v-show="showFlag" @click="hide">
      <div @click.stop class="leftNav">
        <div class="cover" @click.stop="changeImg">
          <img :src="imgsrc">
        </div>
        <mu-list class="mu-list-class">
          <mu-list-item title="App下载" @click="download" class="mu-list-item"/>
          <mu-list-item title="清除缓存" @click="open" class="mu-list-item"/>
          <mu-list-item title="刷新" @click="refreshPage" class="mu-list-item"/>
          <mu-list-item title="关于" @click="openAboutDialog" class="mu-list-item"/>
        </mu-list>
      </div>
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
      <mu-dialog :open="dialog" @close="close">
        是否清除缓存？
        <mu-flat-button slot="actions" primary @click="close" label="取消"/>
        <mu-flat-button slot="actions" primary @click="clear" label="确定"/>
      </mu-dialog>
    </div>
  </transition>
</template>

<script>
import { openUrl } from "common/js/openUrl";

export default {
  props: {},
  data() {
    return {
      showFlag: false,
      showAboutDialog: false,
      dialog: false,
      clickNum: 0
    };
  },
  computed: {
    imgsrc() {
      return `static/cover/cover${this.clickNum%8}.jpg`;
    }
  },
  methods: {
    changeImg() {
      this.clickNum += 1;
    },
    show() {
      this.showFlag = true;
    },
    hide() {
      this.showFlag = false;
    },
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
    open() {
      this.dialog = true;
    },
    close() {
      this.dialog = false;
    },
    clear() {
      this.close();
      localStorage.clear();
      this.refreshPage();
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

.mu-list-class {
  text-indent: 20px;
}

.mu-list-item {
  padding: 5px 0;
}

.wrapper {
  position: fixed;
  top: 0px;
  bottom: 0;
  z-index: 1000;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);

  &.slideLeft-enter-active, &.slideLeft-leave-active {
    transition: opacity 0.3s;

    .leftNav {
      transition: all 0.3s;
    }
  }

  &.slideLeft-enter, &.slideLeft-leave-to {
    opacity: 0;

    .leftNav {
      transform: translate3d(-100%, 0, 0);
    }
  }
}

.leftNav {
  background-color: #fff;
  width: 240px;
  height: 100%;
  box-shadow: 3px 0px 14px 4px rgba(0, 0, 0, 0.2);
}

.cover {
  width: 100%;
  height: 240px;

}
</style>