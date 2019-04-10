<template>
  <transition name="fade">
    <div class="toast" v-show="showFlag">
       <slot></slot>
    </div>
  </transition>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: "已收藏到我喜欢"
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
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.hide();
      }, 800);
    },
    hide() {
      this.showFlag = false;
    }
  }
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

.toast {
  width: 200px;
  position: fixed;
  top: 40%;
  left: 50%;
  margin-left: -100px;
  z-index: 1000;

  .content {
    width: 100px;
    padding 10px 10px;
    margin 0 auto;
    text-align: center;
    background-color: rgba(0, 0, 0, 0.7);
    border-radius: 5px;

    .desc {
      margin-top: 10px;
      line-height: 20px;
      font-size: $font-size-medium;
      color: $color-text-h;
    }
  }

  &.fade-enter, &.fade-leave-to {
    opacity: 0;
  }

  &.fade-enter-to, &.fade-leave {
    opacity: 1;
  }

  &.fade-enter-active, &.fade-leave-active {
    transition: all 0.3s;
  }
}
</style>