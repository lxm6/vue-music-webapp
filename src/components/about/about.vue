<template>
  <transition name="slide">
    <div class="user-center-wrapper" @click="hide" v-show="userCenterVisible">
      <div @click.stop>
        <mu-drawer class="user-center" :open="true"  @close="hide">
          <mu-card class="user-center-inner">
            <mu-list>
              <mu-list-item title="清除缓存" @click="clearStorage"/>
              <mu-list-item title="刷新" @click="refreshPage"/>
              <mu-list-item title="关于" @click="openAboutDialog"/>
              <mu-dialog :open="showAboutDialog" title="关于" @close="closeAboutDialog">
                <mu-list>
                  <mu-list-item title="软件名称">
                    <p slot="after">柠檬音乐</p>
                  </mu-list-item>
                  <mu-list-item title="版本">
                    <p slot="after">1.0.1</p>
                  </mu-list-item>
                  <mu-list-item title="作者" href="https://github.com/Charlotte666">
                    <p slot="after">lxm</p>
                  </mu-list-item>
                  <mu-list-item
                    title="项目地址"
                    href="https://github.com/Charlotte666/vue-music-webapp"
                  >
                    <p slot="after">
                      <img src="~@/common/image/github.svg" alt="github" width="40">
                    </p>
                  </mu-list-item>
                </mu-list>
              </mu-dialog>
            </mu-list>
          </mu-card>
        </mu-drawer>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  computed: {
    ...mapGetters(["userCenterVisible"])
  },

  methods: {
    // 隐藏用户中心
    hide() {
      this.setUserCenterVisible(false);
    },

    clearStorage() {
      localStorage.clear();
      //this.setPopup("清除缓存成功");
    },
    // 强制刷新页面
    refreshPage() {
      window.location.reload();
    },
    // 打开关于对话框
    openAboutDialog() {
      this.showAboutDialog = true;
    },
    // 关闭关于对话框
    closeAboutDialog() {
      this.showAboutDialog = false;
    },
    ...mapMutations({
      setUserCenterVisible: "SET_USER_CENTER_VISIBLE"
    })
  },
  watch: {
    userCenterVisible(newVisible) {
      if (!newVisible) {
        this.closeAboutDialog();
      }
    }
  }
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.user-center-wrapper {
  &.slide-enter-active, &.slide-leave-active {
    transition: opacity 0.3s;

    .user-center {
      transition: all 0.3s;
    }
  }

  &.slide-enter, &.slide-leave-to {
    opacity: 0;

    .user-center {
      transform: translate3d(-100%, 0, 0);
    }
  }

  position: fixed;
  top: 0;
  bottom: 0;
  z-index: 1220;
  width: 100%;
  background-color: white;
  box-shadow: 3px 0px 14px 4px rgba(0, 0, 0, 0.12);
}

.user-center {
  width: 75%;
  height: 100%;
}

.user-center-inner {
  box-shadow: none;
}
</style>