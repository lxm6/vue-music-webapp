<template>
  <div class="user-center" ref="userCenter">
    <div class="login">
      <div>
        <mu-flat-button class="loginBtn">登 录</mu-flat-button>
      </div>
    </div>
    <mu-list class="menu">
      <mu-list-item class="menu-item" @click="enterList(0)">
        <mu-icon slot="left" value="favorite_border"/>
        <h1>我喜欢的</h1>
      </mu-list-item>
      <mu-list-item class="menu-item" @click="enterList(1)">
        <mu-icon slot="left" value="history"/>
        <h1>最近播放</h1>
      </mu-list-item>
      <mu-list-item class="menu-item" @click="enterList(2)">
        <mu-icon slot="left" value="queue_music"/>
        <h1>收藏歌单</h1>
      </mu-list-item>
    </mu-list>

    <router-view></router-view>
  </div>
</template>

<script>
import Scroll from "base/scroll/scroll";
export default {
  methods: {
    enterList(index) {
      this.$router.push({
        path: `/saveList/${index}`
      });
    },
    // enterDiscList(){
    //    this.$router.push({
    //     path: `/saveList/`
    //   });
    // }
  },
  components: {
    Scroll
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

.user-center {
  position: fixed;
  top: 94px;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: #fff;
  padding: 20px;

  .login {
    margin: 20px auto;
    width: 92%;
    height: 15%;
    border-radius: 7px;
    box-shadow: 0 6px 6px rgba(0, 0, 0, 0.05);

    .loginBtn {
      display: block;
      margin: 0px auto;
      line-height: 40px;
      width: 50%;
      height: 40px;
      background-color: #fff;
      padding: 10px 20px;
      color: #fff;
      font-size: 18px;
      font-weight: bold;
      color: $color-theme;
      border: 1px solid $color-theme;
      border-radius: 5px;
    }
  }

  .menu {
    .menu-item {
      border-bottom: 1px solid $color-border;

      h1 {
        line-height: 54px;
        height: 54px;
        color: $color-text-ll;
      }
    }
  }

  .material-icons {
    font-size: 24px !important;
    color: $color-theme;
  }
}
</style>