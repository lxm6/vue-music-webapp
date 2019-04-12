<template>
  <transition name="slide">
    <div class="delete-song" v-if="deleteSongVisible">
      <div class="header">
        <div class="close" @click="hide">
          <i class="icon-close"></i>
        </div>
        <h1 class="title" v-html="checkText"></h1>
        <input class="check-btn" type="checkbox" @click="checkedAll" :checked="check">
        <div class="delete-btn" @click="showConfirm" :class="disableCls">
          <i class="icon-clear"></i>
        </div>
      </div>
      <div class="list-wrapper" ref="listWrapper">
        <scroll ref="songList" class="list-scroll">
          <div class="song-list">
            <ul>
              <li v-for="(item,index) in songs" :key="index" class="item">
                <input
                  ref="checkbox"
                  class="checkbox"
                  type="checkbox"
                  :value="item"
                  v-model="checkboxList"
                >
                <div class="content">
                  <h2 class="name">{{item.name}}</h2>
                  <p class="desc">
                    <span class="vip" v-if="item.isPay">VIP</span>
                    <span class="hq">HQ</span>
                    <span>{{getDesc(item)}}</span>
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </scroll>
      </div>
      <toast ref="toast">
        <div class="wrapper">
          <i class="icon-ok"></i>
          <p class="desc">删除成功</p>
        </div>
      </toast>
      <confirm ref="confirm" @confirm="deleteSong" text="是否清除所选歌曲？" confirmBtnText="清除"></confirm>
    </div>
  </transition>
</template>

<script>
import SongList from "base/song-list/song-list";
import Scroll from "base/scroll/scroll";
import Toast from "base/toast/toast";
import Confirm from "base/confirm/confirm";
import { mapGetters, mapActions, mapMutations } from "vuex";
import Song from "common/js/song";

export default {
  props: {
    songs: {
      type: Array,
      default: []
    },
    currentIndex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      isCheckedAll: false,
      ischeck: true,
      checkboxList: []
    };
  },
  computed: {
    disableCls() {
      return this.checkboxList.length == 0 ? "disable" : "";
    },
    check() {
      if (this.checkboxList.length == this.songs.length) {
        this.isCheckedAll = true;
        return true;
      } else {
        this.isCheckedAll = false;
        return false;
      }
    },
    checkText() {
      if (this.checkboxList.length == 0) {
        return "批量操作";
      } else {
        return `已选定${this.checkboxList.length}首`;
      }
    },

    ...mapGetters(["favoriteList", "playHistory", "deleteSongVisible"])
  },
  methods: {

    show() {
      this.setDeleteSongVisible(true);
    },
    hide() {
      this.setDeleteSongVisible(false);
    },
    getDesc(song) {
      return `${song.singer} · ${song.album}`;
    },
    showConfirm() {
      if (this.checkboxList.length == 0) {
        return;
      }
      this.$refs.confirm.show();
    },
    checkedAll() {
      if (this.isCheckedAll) {
        this.checkboxList = [];
      } else {
        // 全选
        this.songs.forEach(item => {
          // 数组里没有这一个value才push，防止重复push
          if (this.checkboxList.indexOf(item) == "-1") {
            this.checkboxList.push(item);
          }
        });
      }
    },

    deleteSong() {
      this.deleteSong2([this.currentIndex, this.checkboxList]);
      this.$refs.toast.show();
      if (this.isCheckedAll) {
        this.hide();
      }
    },
    ...mapMutations({
      setDeleteSongVisible: "SET_DELETE_SONG_VISIBLE"
    }),
    ...mapActions(["deleteSong2"])
  },
  watch: {
    deleteSongVisible(){
      console.log(this.checkboxList.length)
      this.checkboxList = [];
    }
  },

  components: {
    SongList,
    Scroll,
    Toast,
    Confirm
  }
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.delete-song {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  z-index: 200;
  background: $color-background;

  &.slide-enter-active, &.slide-leave-active {
    transition: all 0.3s;
  }

  &.slide-enter, &.slide-leave-to {
    transform: translate3d(0, 100%, 0);
  }

  .header {
    position: relative;
    height: 44px;
    text-align: center;
    color: $color-theme;

    .title {
      line-height: 44px;
      font-size: $font-size-large;
    }

    .close {
      position: absolute;
      top: 14px;
      right: 16px;
    }

    .check-btn {
      position: absolute;
      top: 14px;
      left: 14px;
    }

    .delete-btn {
      position: absolute;
      top: 14px;
      left: 45px;

      &.disable {
        color: $color-text-l;
      }
    }
  }

  .list-wrapper {
    border-top: 3px solid $color-theme;
    position: absolute;
    top: 50px;
    bottom: 0;
    width: 100%;
    background-color: #fff;
    padding-top: 7px;

    .list-scroll {
      height: 100%;
      overflow: hidden;

      .song-list {
        .item {
          display: flex;
          align-items: center;
          box-sizing: border-box;
          padding: 0px 0px 0px 25px;
          border-left: 5px solid #fff;

          .content {
            flex: 1;
            line-height: 20px;
            overflow: hidden;
            border-bottom: 1px solid $color-border;
            padding: 8px 0px 0px 0;

            .name {
              no-wrap();
              font-size: $font-size-medium-x;
              color: $color-text;
              display: inline-block;
              width: 90%;
            }

            .desc {
              display: inline-block;
              font-size: $font-size-small;
              no-wrap();
              margin-top: 3px;
              color: $color-text-l;
              width: 90%;
            }

            .vip, .hq {
              font-size: 7px;
              padding: 1px 2px;
              color: $color-theme;
              border: 1px solid $color-theme;
              border-radius: 3px;
            }

            .hq {
              padding: 1px 3px;
              color: orange;
              border: 1px solid orange;
              margin-right: 4px;
            }
          }

          .checkbox {
            padding: 5px;
            right: 15px;
            extend-click();
          }
        }
      }
    }
  }
}

.wrapper {
  width: 140px;
  padding: 10px 0;
  margin: 0 auto;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.7);
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
</style>