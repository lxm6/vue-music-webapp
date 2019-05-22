<template>
  <transition name="list-fade">
    <div class="seekbar" @click="hide" v-show="seekBarVisible">
      <div class="list-wrapper" @click.stop>
        <div class="list-operate">
          <h2 v-text="'背景模糊度：'+value"></h2>
            <mu-slider v-model="value" :step="5" :max="50" class="demo-slider" @change="changeValue" @input="changeValue"/>
        </div>
        <mu-flat-button @click="hide" label="完成" class="demo-flat-button"/>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import { mapGetters, mapMutations } from "vuex";
import { saveBlur, loadBlur } from "common/js/cache";
export default {
  data() {
    return {
      value: loadBlur(),
    };
  },

  computed: {
    ...mapGetters(["seekBarVisible"]),

  },

  methods: {
    changeValue(){
      this.$emit("changeBlur",this.value)
      saveBlur(this.value);
    },
    show() {
      this.setseekBarVisible(true);
    },
    hide() {
      this.setseekBarVisible(false);
    },
    ...mapMutations({
      setseekBarVisible: "SET_SEEKBAR_VISIBLE"
    })
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

.seekbar {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 200;
  background-color: rgba(0,0,0,0.4);

  &.list-fade-enter-active, &.list-fade-leave-active {
    transition: opacity 0.3s;

    .list-wrapper {
      transition: all 0.3s;
    }
  }

  &.list-fade-enter, &.list-fade-leave-to {
    opacity: 0;

    .list-wrapper {
      transform: translate3d(0, 100%, 0);
    }
  }

  &.list-fade-enter, .list-wrapper {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    background-color: #fff;

    .list-operate {
      padding: 25px 0;
      width: 70%;
      margin: 0 auto;

      h2 {
        text-align: center;
        font-size: 18px;
        margin-bottom: 20px;
      }

    }
  }
}

.demo-flat-button {
  width: 100%;
  background: $color-theme;
  font-size: $font-size-medium-x;
  color: #fff;
  height: 50px;
}
</style>