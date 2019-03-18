<template>
  <transition name="list-fade">
    <div class="lyricset" @click="hide" v-show="lyricsetVisible">
      <div class="list-wrapper" @click.stop>

        <div class="list-operate">
          <div class="add">
            <i class="icon-add"></i>
            <span class="text">添加歌曲到队列</span>
          </div>
        </div>
        <div @click="hide" class="list-close">
          <span>完成</span>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["lyricsetVisible"])
  },
  methods: {
    show() {
      this.setlyricsetVisible(true);
    },
    hide() {
      this.setlyricsetVisible(false);
    },

    getCurrentIcon(item) {
      if (this.currentSong.id === item.id) {
        return "icon-play";
      }
      return "";
    },
    getCurrent(item) {
      if (this.currentSong.id === item.id) {
        return "current-play";
      }
      return "";
    },
    ...mapMutations({
      setlyricsetVisible: "SET_LYRICSET_VISIBLE"
    })
  },
  watch: {},
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

    .list-header {
      position: relative;
      padding: 10px 30px 10px 20px;

      .title {
        display: flex;
        align-items: center;

        .icon {
          margin-right: 10px;
          font-size: 30px;
          color: $color-theme;
        }

        .text {
          flex: 1;
          font-size: $font-size-medium;
          color: $color-theme;
        }

        .clear {
          extend-click();

          .icon-clear {
            font-size: $font-size-medium-x;
            color: $color-text-d;
          }
        }
      }
    }

    .list-content {
      max-height: 270px;
      overflow: hidden;
      padding: 0 15px;

      .item {
        display: flex;
        align-items: center;
        height: 45px;
        overflow: hidden;
        border-top: 1px solid $color-border;

        &.list-enter-active, &.list-leave-active {
          transition: all 0.1s;
        }

        &.list-enter, &.list-leave-to {
          height: 0;
        }

        .current {
          flex: 0 0 20px;
          width: 20px;
          font-size: $font-size-medium;
          color: $color-theme;
        }

        .text {
          flex: 1;
          no-wrap();
          font-size: $font-size-medium;
          color: $color-text-ll;
        }

        .current-play {
          color: $color-theme;
        }

        .like {
          extend-click();
          margin-right: 15px;
          font-size: $font-size-medium-x;
          color: $color-theme;

          .icon-favorite {
            color: $color-sub-theme;
          }
        }

        .delete {
          extend-click();
          font-size: $font-size-medium;
          color: rgba(0, 0, 0, 0.3);
        }
      }
    }

    .list-operate {
      width: 140px;
      margin: 10px auto 15px auto;

      .add {
        display: flex;
        align-items: center;
        padding: 10px 16px;
        border: 1px solid $color-theme;
        border-radius: 100px;
        color: $color-theme;

        .icon-add {
          margin-right: 5px;
          font-size: $font-size-small-s;
        }

        .text {
          font-size: $font-size-small;
        }
      }
    }

    .list-close {
      text-align: center;
      line-height: 50px;
      background: $color-theme;
      font-size: $font-size-medium-x;
      color: #fff;
    }
  }
}
</style>