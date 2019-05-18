<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div
        class="progress-btn-wrapper"
        ref="progressBtn"
        @touchstart.prevent="progressTouchStart"
        @touchmove.prevent="progressTouchMove"
        @touchend.prevent="progressTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { prefixStyle } from "common/js/dom";
const progressBtnWidth = 16;
const timeWidth = 30;
const transform = prefixStyle("transform");
export default {
  props: {
    // 播放进度比例
    percent: {
      type: Number,
      default: 0
    }
  },
  created() {
    this.touch = {};
  },
  methods: {
    progressTouchStart(e) {
      // initiated表示是否正在拖动或者点击进度条
      this.touch.initiated = true;
      this.touch.startX = e.touches[0].pageX;
      this.touch.left = this.$refs.progress.clientWidth;
    },
    progressTouchMove(e) {
      if (!this.touch.initiated) {
        return;
      }
      const deltaX = e.touches[0].pageX - this.touch.startX;
      const offsetWidth = Math.min(
        this.$refs.progressBar.clientWidth - progressBtnWidth,
        Math.max(0, this.touch.left + deltaX)
      );
      this._offset(offsetWidth);
      this.$emit("percentChanging", this._getPercent());
    },
    progressTouchEnd() {
      this._triggerPercent();
      this.touch.initiated = false;
    },
    // 点击进度条
    progressClick(e) {
      const rect = this.$refs.progressBar.getBoundingClientRect();
      const offsetWidth = e.pageX - rect.left;
      this._offset(offsetWidth);
      this._triggerPercent();
    },
    
    _offset(offsetWidth) {
      // 播放进度条偏移
      this.$refs.progress.style.width = `${offsetWidth}px`;
      // 播放点小球偏移
      this.$refs.progressBtn.style[
        transform
      ] = `translate3d(${offsetWidth}px, 0, 0)`;
    },
    _triggerPercent() {
      this.$emit("percentChange", this._getPercent());
    },
    _getPercent() {
      const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth;
      return this.$refs.progress.clientWidth / barWidth;
    }
  },
  watch: {
    percent(newPercent) {
     if (newPercent >= 0 && !this.touch.initiated) {
        const barWidth = (window.innerWidth*0.8-2*timeWidth) - progressBtnWidth;
        const offsetWidth = newPercent * barWidth;
        this._offset(offsetWidth);
      }
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

.progress-bar {
  height: 30px;

  .bar-inner {
    position: relative;
    top: 13px;
    height: 3px;
    background: rgba(255, 255, 255, 0.3);

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
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 15px;
        height: 15px;
        border: 3px solid #fff;
        border-radius: 50%;
        background: $color-theme;
      }
    }
  }
}
</style>