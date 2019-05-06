<template>
  <transition name="list-fade">
    <div class="playlist" @click="hide" v-show="playListVisible">
      <div class="list-wrapper" @click.stop>
        <div class="list-header">
          <h1 class="title">
            <i class="icon" :class="iconMode" @click="changeMode"></i>
            <span class="text">
              {{modeText}}
              <span class="text" v-show="mode!=1">({{playlist.length}}首)</span>
            </span>

            <span class="clear" @click="showConfirm">
              <i class="icon-clear"></i>
            </span>
          </h1>
        </div>
        <scroll
          ref="listContent"
          :data="sequenceList"
          class="list-content"
          :refreshDelay="refreshDelay"
        >
          <transition-group name="list" tag="ul">
            <li
              :key="item.id"
              ref="listItem"
              class="item"
              v-for="(item,index) in sequenceList"
              @click="selectItem(item,index)"
            >
              <mu-list-item>
                <mu-flexbox class="flexbox">
                  <mu-flexbox-item class="flexitem1">
                    <i class="current" :class="getCurrentIcon(item)"></i>
                  </mu-flexbox-item>
                  <mu-flexbox-item>
                    <div class="text" :class="getCurrent(item)">
                      <span>{{item.name}} -</span>
                      <span class="subtext">{{item.singerName}}</span>
                    </div>
                  </mu-flexbox-item>
                  <mu-flexbox-item class="flexitem2">
                    <span @click.stop="toggleFavorite(item)" class="like">
                      <i :class="getFavoriteIcon(item)"></i>
                    </span>
                    <span @click.stop="deleteOne(item)" class="delete">
                      <i class="icon-delete"></i>
                    </span>
                  </mu-flexbox-item>
                </mu-flexbox>
              </mu-list-item>
            </li>
          </transition-group>
        </scroll>
        <div class="list-operate">
          <div @click="addSong" class="add">
            <i class="icon-add"></i>
            <span class="text">添加歌曲到队列</span>
          </div>
        </div>
        <mu-flat-button @click="hide" label="关闭" class="demo-flat-button"/>
      </div>
      <confirm ref="confirm" @confirm="confirmClear" text="是否清空播放列表？" confirmBtnText="清空"></confirm>
      <add-song ref="addSong"></add-song>
      <toast :title="title" ref="toast1">
        <div class="content">
          <i class="icon-ok"></i>
          <p class="desc">{{title}}</p>
        </div>
      </toast>
      <toast :title="title" ref="toast2">
        <div class="content">
          <p class="desc">{{title}}</p>
        </div>
      </toast>
    </div>
  </transition>
</template>
<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import { playMode } from "common/js/config";
import Scroll from "base/scroll/scroll";
import Confirm from "base/confirm/confirm";
import AddSong from "components/add-song/add-song";
import Toast from "base/toast/toast";
import { playerMixin } from "common/js/mixin";
export default {
  mixins: [playerMixin],
  data() {
    return {
      refreshDelay: 120,
      title: ""
    };
  },
  computed: {
    modeText() {
      return this.mode === playMode.sequence
        ? "顺序播放"
        : this.mode === playMode.random
        ? "随机播放"
        : "单曲循环";
    },
    ...mapGetters(["playListVisible"])
  },
  methods: {
    show() {
      this.setPlayListVisible(true);
      setTimeout(() => {
        this.$refs.listContent.refresh();
        this.scrollToCurrent(this.currentSong);
      }, 20);
    },
    hide() {
      this.setPlayListVisible(false);
    },
    showConfirm() {
      this.$refs.confirm.show();
    },
    confirmClear() {
      this.deleteSongList();
      this.hide();
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
    getName(item) {
      return `${item.name} - ${item.singerName}`;
    },
    selectItem(item, index) {
      if (this.mode === playMode.random) {
        index = this.playlist.findIndex(song => {
          return song.id === item.id;
        });
      }
      this.setCurrentIndex(index);
      this.setPlayingState(true);
    },
    scrollToCurrent(current) {
      const index = this.sequenceList.findIndex(song => {
        return current.id === song.id;
      });
      this.$refs.listContent.scrollToElement(this.$refs.listItem[index], 300);
    },

    addSong() {
      this.$refs.addSong.show();
    },
    ...mapActions(["deleteSong", "deleteSongList"]),
    ...mapMutations({
      setPlayListVisible: "SET_PLAY_LIST_VISIBLE"
    })
  },
  watch: {
    currentSong(newSong, oldSong) {
      if (!this.playListVisible || newSong.id === oldSong.id) {
        return;
      }
      setTimeout(() => {
        this.scrollToCurrent(newSong);
      }, 20);
    }
  },
  components: {
    Scroll,
    Confirm,
    AddSong,
    Toast
  }
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.playlist {
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
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    background-color: $color-playlist-bg;

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
          font-size: $font-size-medium-x;
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

    .flexitem1 {
      flex: 0 0 0 !important;
    }

    .flexitem2 {
      flex: 0 0 50px !important;
    }

    .list-content {
      height: 260px;
      overflow: hidden;
      padding: 0 12px;

      .item {
        line-height 45px;
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
          width: 16px;
          font-size: $font-size-medium;
          color: $color-theme;
        }

        .text {
          no-wrap();
          font-size: $font-size-medium-x;
          width: 96%;
          color: $color-text-ll;

          .subtext {
            font-size: 14px;
          }
        }

        .current-play {
          color: $color-theme;
        }

        .like {
          extend-click();
          margin-right: 10px;
          font-size: $font-size-medium-x;
          color: $color-theme;

          .icon-favorite {
            color: $color-sub-theme;
          }
        }

        .delete {
          display: inline-block;
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

        &:active {
          background-color: rgba(0, 0, 0, 0.1);
        }

        .icon-add {
          margin-right: 5px;
          font-size: $font-size-small-s;
        }

        .text {
          font-size: $font-size-small;
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
  }

  .content {
    width: 140px;
    padding: 10px 0;
    margin: 0 auto;
    text-align: center;
    background-color: #000;
    border-radius: 5px;

    i {
      display: inline-block;
      margin-bottom: 10px;
    }

    .desc {
      font-size: $font-size-medium;
      color: $color-text-h;
    }
  }
}
</style>