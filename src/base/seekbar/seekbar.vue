<template>
  <transition name="list-fade">
    <div class="seekbar" @click="hide" v-show="seekBarVisible">
      <div class="list-wrapper" @click.stop>
        <div class="list-operate">
          <h2 class="num">{{percentNum}}</h2>
          <div class="seek-bar" ref="seekBar" @click="seekBarClick">
            <div class="bar-inner">
              <div class="progress" ref="progress"></div>
              <div
                class="progress-btn-wrapper"
                ref="progressBtn"
                @touchstart.prevent="seekBarTouchStart"
                @touchmove.prevent="seekBarTouchMove"
                @touchend.prevent="seekBarTouchEnd"
              >
                <div class="progress-btn"></div>
              </div>
            </div>
          </div>
        </div>
        <mu-flat-button @click="hide" label="完成" class="demo-flat-button"/>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import { mapActions, mapGetters, mapMutations } from "vuex";
import { prefixStyle } from "common/js/dom";
import { saveBlur, loadBlur } from "common/js/cache";
const progressBtnWidth = 15;
const transform = prefixStyle("transform");
export default {
  data() {
    return {
      percentNum: loadBlur()
    };
  },
  props: {
    seekBarPercent: {
      type: Number,
      default: 50
    }
  },
  mounted() {
    this.$nextTick(() => {
     this._offset( this.percentNum * 4)
    });
  },
  computed: {
    ...mapGetters(["seekBarVisible"])
  },
  created() {
    this.touch = {};
  },
  methods: {
    seekBarTouchStart(e) {
      // initiated表示是否正在拖动或者点击进度条
      this.touch.initiated = true;
      this.touch.startX = e.touches[0].pageX;
      this.touch.left = this.$refs.progress.clientWidth;
    },
    seekBarTouchMove(e) {
      if (!this.touch.initiated) {
        return;
      }
      const deltaX = e.touches[0].pageX - this.touch.startX;
      const offsetWidth = Math.min(
        this.$refs.seekBar.clientWidth - progressBtnWidth,
        Math.max(0, this.touch.left + deltaX)
      );
      this._offset(offsetWidth);
      this.$emit("percentChanging", this._getPercent());
    },
    seekBarTouchEnd() {
      this._triggerPercent();
      this.touch.initiated = false;
    },
    // 点击进度条
    seekBarClick(e) {
      const rect = this.$refs.seekBar.getBoundingClientRect();
      const offsetWidth = Math.min(e.pageX - rect.left, Math.max(0, 200));
      this._offset(offsetWidth);
      this._triggerPercent();
    },
    setProgressOffset(percent) {
      if (percent >= 0 && !this.touch.initiated) {
        const barWidth = this.$refs.seekBar.clientWidth - progressBtnWidth;
        const offsetWidth = percent * barWidth;
        this._offset(offsetWidth);
      }
    },
    _offset(offsetWidth) {
      this.$refs.progress.style.width = `${offsetWidth}px`;
      this.$refs.progressBtn.style[
        transform
      ] = `translate3d(${offsetWidth}px, 0, 0)`;
    },
    _triggerPercent() {
      this.$emit("percentChange", this._getPercent());
    },
    _getPercent() {
      const barWidth = this.$refs.seekBar.clientWidth - progressBtnWidth;
      this.percentNum = parseInt(
        ((this.$refs.progress.clientWidth / barWidth) * 100) / 2
      );
      saveBlur(this.percentNum);
      return this.percentNum;
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
  watch: {
    percent(newPercent) {
      this.setProgressOffset(newPercent);
    }
  }
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
      width: 215px;
      margin: auto;

      .num {
        text-align: center;
        font-size: 18px;
        margin-bottom: 10px;
      }

      .seek-bar {
        height: 30px;

        .bar-inner {
          position: relative;
          top: 13px;
          height: 3px;
          background: #b7b7b7;

          .progress {
            position: absolute;
            height: 100%;
            background: $color-theme;
          }

          .progress-btn-wrapper {
            position: absolute;
            left: -8px;
            top: -13px;
            width: 30px;
            height: 30px;

            .progress-btn {
              position: relative;
              top: 6px;
              left: 7px;
              box-sizing: border-box;
              width: 17px;
              height: 17px;
              border-radius: 50%;
              background: $color-theme;
            }
          }
        }
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