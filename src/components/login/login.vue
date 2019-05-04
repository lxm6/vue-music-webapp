<template>
  <transition name="slide">
    <div class="container">
      <title-Bar :titleBarName="titleBarName"></title-Bar>
      <div class="main">
        <ul class="form-list">
          <li>
            <mu-text-field label="用户名" labelFloat v-model="form.username"/>
          </li>
          <li>
            <mu-text-field label="密码" type="password" labelFloat v-model="form.password"/>
          </li>
          <li>
            <mu-raised-button label="登录" class="demo-raised-button" primary @click="loginForm"/>
            <router-link to="/register" tag="a" class="option">注册账号</router-link>
            <router-link to="/changePwd" tag="a" class="option">忘记密码</router-link>
          </li>
        </ul>
      </div>
      <mu-popup position="top" :overlay="false" popupClass="demo-popup-top" :open="topPopup">登录成功</mu-popup>
    </div>
  </transition>
</template>

<script>
import { ERR_OK } from "@/api/config";
import TitleBar from "base/title-bar/title-bar";
import { popupMixin } from "common/js/mixin";

export default {
  mixins: [popupMixin],

  data() {
    return {
      titleBarName: "登录",
      // 注册表单
      form: {
        username: "",
        password: ""
      }
    };
  },
  methods: {
    open(position) {
      this[position + "Popup"] = true;
    },
    close(position) {
      this[position + "Popup"] = false;
    },

    loginForm() {
      this.open("top");
    }
  },
  watch: {
    topPopup(val) {
      if (val) {
        setTimeout(() => {
          this.topPopup = false;
        }, 1000);
      }
    }
  },
  components: {
    TitleBar,
  }
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.container {
  position: fixed;
  bottom: 0;
  width: 100%;
  top: 0;
  z-index: 100;
}

.main {
  width: 100%;
  height: 100%;
  background: #fff;

  .form-list {
    width: 85%;
    padding-top: 30px;
    margin: 0px auto;
    text-align: center;

    li {
      display: block;

      .option {
        color: $color-theme;
        margin: 0 20px;
        font-size: 14px;
      }
    }
  }
}
</style>