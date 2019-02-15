<template>
  <transition name="drop">
    <div class="dialog-wrapper" v-show="flag" @click.stop="hide">
      <div class="dialog">
        <h1>关于</h1>
        <ul>
          <li>
            软件名称
            <span>柠檬音乐</span>
          </li>
          <li>
            版本
            <span>1.0.0</span>
          </li>
          <li>
            作者
            <span>林秀梅</span>
          </li>
          <li @click="openUrl">
            GitHub
            <span>
              <i>&#xe600;</i>
            </span>
          </li>
        </ul>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    delay: {
      type: Number,
      default: 1000
    }
  },
  data() {
    return {
      flag: true
    };
  },
  methods: {
    show() {
      this.flag = true;
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.hide();
      }, this.delay);
    },
    hide() {
      this.flag = false;
    },
    openUrl() {
      window.location.href = "https://github.com/Charlotte666/vue-music-webapp";
    }
  }
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
.dialog-wrapper {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  background-color: rgba(255, 255, 255, 0.1);
  opacity: 0.1;
  display: none;
  transition: all 1s;

  &.drop-enter-active, &.drop-leave-active {
    transition: opacity 0.3s;

    .dialog {
      transition: all 0.3s;
    }
  }

  &.drop-enter, &.drop-leave-to {
    opacity: 0;

    .dialog {
      transform: translate3d(-100%, 0, 0);
    }
  }

  .dialog {
    padding: 30px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 3000;
    width: 220px;
    height: 265px;
    background-color: #000;
    box-shadow: 3px 0px 14px 4px rgba(0, 0, 0, 0.6);
    border-radius: 5px;
    font-size: 18px;
    color: $color-theme;

    h1 {
      font-size: 28px;
      padding-bottom: 20px;
      border-bottom: 1px solid $color-theme-d;
      margin-bottom: 20px;
    }

    ul {
      float: left;

      li {
        padding: 0 10px;
        height: 50px;
        line-height: 50px;

        span {
          margin-left: 50px;
          display: inline-block;
          float: right;
          color: #d5d5d5;

          i {
            font-family: 'iconfont' !important;
            font-weight: normal;
            font-style: normal;
            font-size: 36px;
          }
        }

        &:hover {
          background-color: #333937;
        }
      }

      img {
        margin: 10px auto;
      }
    }
  }
}
</style>