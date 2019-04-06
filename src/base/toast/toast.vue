<template>
 <transition name="fade">
  <div class="toast" v-show="showFlag">
    <i class="icon-ok"></i>
    <p class="desc">{{title}}</p>
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
      }, 1500);
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
  width: 150px;
  padding: 15px 0;
  text-align: center;
  position: fixed;
  top: 40%;
  left: 50%;
  margin-left: -75px;
  z-index: 1000;
  background-color: rgba(0, 0, 0, 0.8);
  border-radius: 5px;


  .desc {
    margin-top: 10px;
    line-height: 20px;
    font-size: $font-size-medium;
    color: $color-text-h;
  }

  &.fade-enter, &.fade-leave-to {
    opacity: 0;
  }

  &.fade-enter-to, &.fade-leave {
    opacity: 1;
  }

  &.fade-enter-active, &.fade-leave-active {
    transition: all 0.5s;
  }
}
</style>