<template>
  <transition name="list-fade">
    <div class="lyricset" @click="hide" v-show="lyricsetVisible">
      <div class="list-wrapper" @click.stop>
        <div class="list-operate">
          <ul class="fontsize">
            <span>大小</span>
            <li
              :class="{'current':defaultFontSize === item.fontSize}"
              v-for="(item,index) in theme.fontSizeList"
              :style="{fontSize:item.fontSize + 'px'}"
              :key="index"
              @click="setFontSize(item.fontSize)"
            >A</li>
          </ul>
          <ul class="color">
            <span>颜色</span>
            <li v-for="(item,index) in theme.colorList" :key="index">
              <i
                @click="setColor(item.name)"
                :style="{background:item.color}"
                :class="{'current':defaultColor === item.name}"
              ></i>
            </li>
          </ul>
        </div>
        <mu-flat-button @click="hide" label="完成" class="demo-flat-button"/>
      </div>
    </div>
  </transition>
</template>
<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
export default {
  props: {
    defaultFontSize: Number,
    defaultColor: String,
    theme: Object
  },
  computed: {
    ...mapGetters(["lyricsetVisible"])
  },
  methods: {
    setFontSize(fontSize) {
      this.$emit("setFontSize", fontSize);
    },
    setColor(name) {
      this.$emit("setColor", name);
    },
    show() {
      this.setlyricsetVisible(true);
    },
    hide() {
      this.setlyricsetVisible(false);
    },

    ...mapMutations({
      setlyricsetVisible: "SET_LYRICSET_VISIBLE"
    })
  },
  watch: {}
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.lyricset {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 200;
  background-color: rgba(0, 0, 0, 0.4);

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
      ul {
        height: 60px;
        border-bottom: 1px solid $color-border;
        line-height: 32px;
        display: flex;

        span {
          padding: 15px;
          display: inline-block;
          color: $color-text-l;
          font-size: $font-size-medium;
        }

        li {
          padding: 15px;
          align-items: center;
          flex: 1;
        }
      }

      .fontsize li {
        color: #3c3c3c;

        &.current {
          color: $color-theme;
        }
      }

      .color li {
        i {
          display: block;
          height: 22px;
          width: 22px;
          background-color: $color-theme;
          border-radius: 50%;
          border: 3px solid #fff;

          &.current {
            border: 3px solid #ccc;
          }
        }
      }
    }

        .demo-flat-button {
      width: 100%;
      background: $color-theme;
      font-size: $font-size-medium-x;
      color: #fff;
      height 50px;
    }
  }
}
</style>