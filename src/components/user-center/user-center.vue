<template>
  <transition name="slide">
    <div class="user-center">
      <div class="back" @click="back">
        <i class="icon-back"></i>
      </div>
      <div class="switches-wrapper">
        <switches @switch="switchItem" :switches="switches" :currentIndex="currentIndex"></switches>
      </div>
      <div ref="playBtn" class="play-btn" @click="random" v-if="currentIndex===1||currentIndex===0">
        <i class="icon-play"></i>
        <span class="text">全部播放</span>
      </div>
      <div class="play-btn" @click="showConfirm" v-if="currentIndex===1||currentIndex===0">
        <i class="icon-clear"></i>
        <span class="text">清空</span>
      </div>
      <div class="list-wrapper" ref="listWrapper">
        <scroll ref="favoriteList" class="list-scroll" v-if="currentIndex===0" :data="favoriteList">
          <div class="list-inner">
            <song-list
              :songs="favoriteList"
              @select="selectSong"
              @deleteFavorite="deleteFavorite"
              :isFavorite="true"
            ></song-list>
          </div>
        </scroll>

        <scroll ref="playList" class="list-scroll" v-if="currentIndex===1" :data="playHistory">
          <div class="list-inner">
            <song-list
              :songs="playHistory"
              @select="selectSong"
              @deletePlay="deletePlay"
              :isPlayHistory="true"
            ></song-list>
          </div>
        </scroll>
        <scroll
          ref="favoriteListList"
          class="list-scroll"
          v-if="currentIndex===2"
          :data="favoriteListList"
        >
          <div class="list-inner">
            <ul>
              <li
                @click="selectItem(item)"
                v-for="(item,index) in favoriteListList"
                :key="index"
                class="item"
              >
                <div class="icon">
                  <img v-lazy="item.imgurl" width="60" height="60">
                </div>
                <div class="text">
                  <h2 class="name" v-html="item.creator.name"></h2>
                  <p class="desc" v-html="item.dissname"></p>
                </div>
              </li>
            </ul>
          </div>
        </scroll>
      </div>
      <div class="no-result-wrapper" v-show="noResult">
        <no-result :title="noResultDesc"></no-result>
      </div>
      <confirm ref="confirm" @confirm="clear(currentIndex)" text="是否清空全部？" confirmBtnText="清空"></confirm>
    </div>
  </transition>
</template>

<script>
import Switches from "base/switches/switches";
import Scroll from "base/scroll/scroll";
import SongList from "base/song-list/song-list";
import NoResult from "base/no-result/no-result";
import Confirm from "base/confirm/confirm";
import Song from "common/js/song";
import { mapGetters, mapActions, mapMutations } from "vuex";
import { playlistMixin } from "common/js/mixin";

export default {
  mixins: [playlistMixin],
  data() {
    return {
      currentIndex: 0,
      switches: [
        {
          name: "我喜欢的"
        },
        {
          name: "最近收听"
        },
        {
          name: "收藏歌单"
        }
      ]
    };
  },
  computed: {
    noResult() {
      if (this.currentIndex === 0) {
        return !this.favoriteList.length;
      } else if (this.currentIndex === 1) {
        return !this.playHistory.length;
      } else {
        return !this.favoriteListList.length;
      }
    },
    noResultDesc() {
      if (this.currentIndex === 0) {
        return "暂无收藏歌曲";
      } else if (this.currentIndex === 1) {
        return "你还没有听过歌曲";
      } else {
        return "暂无收藏歌单";
      }
    },
    ...mapGetters(["favoriteList", "playHistory", "favoriteListList"])
  },
  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? "60px" : "";
      this.$refs.listWrapper.style.bottom = bottom;
      this.$refs.favoriteList && this.$refs.favoriteList.refresh();
      this.$refs.playList && this.$refs.playList.refresh();
      this.$refs.favoriteListList && this.$refs.favoriteListList.refresh();
    },
    showConfirm() {
      if (this.currentIndex === 0) {
        if (this.favoriteList.length) this.$refs.confirm.show();
      } else {
        if (this.playHistory.length) this.$refs.confirm.show();
      }
    },
    switchItem(index) {
      this.currentIndex = index;
    },
    selectSong(song) {
      this.insertSong([new Song(song), false]);
    },
    back() {
      this.$router.back();
    },
    random() {
      let list = this.currentIndex === 0 ? this.favoriteList : this.playHistory;

      if (list.length === 0) {
        return;
      }
      list = list.map(song => {
        return new Song(song);
      });
      // this.randomPlay({
      //   list
      // });
      this.selectPlay({
        list,
        index: 0
      });
    },

    selectItem(item) {
      this.$router.push({
        path: `/recommend/${item.id}`
      });
      this.setDisc(item);
    },
    deletePlay(item) {
      this.$emit("deletePlay", item);
    },
    deleteFavorite(item) {
      this.$emit("deleteFavorite", item);
    },

    ...mapMutations({
      setDisc: "SET_DISC"
    }),
    ...mapActions(["insertSong", "randomPlay", "selectPlay", "clear"])
  },

  components: {
    Switches,
    Scroll,
    SongList,
    NoResult,
    Confirm
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

.user-center {
  position: fixed;
  top: 0;
  bottom: 0;
  z-index: 100;
  width: 100%;
  background: $color-background;

  &.slide-enter-active, &.slide-leave-active {
    transition: all 0.3s;
  }

  &.slide-enter, &.slide-leave-to {
    transform: translate3d(100%, 0, 0);
  }

  .switches-wrapper {
    margin: 10px 0 15px 0;
  }

  .play-btn {
    margin-right: 20px;
    box-sizing: border-box;
    width: 50%;
    padding: 2px 0;
    margin: 0 auto;
    color: $color-theme;
    border-radius: 100px;
    text-align: center;
    float: left;

    .icon-play, .icon-clear {
      display: inline-block;
      vertical-align: middle;
      margin-right: 6px;
      font-size: $font-size-large;
    }

    .text {
      color: #000;
      display: inline-block;
      vertical-align: middle;
      font-size: $font-size-medium-x;
    }
  }

  .list-wrapper {
    border-top: 3px solid $color-theme;
    position: absolute;
    top: 90px;
    bottom: 0;
    width: 100%;
    background-color: #fff;
    padding-top 7px;

    .list-scroll {
      height: 100%;
      overflow: hidden;

      .list-inner {
        .item {
          display: flex;
          box-sizing: border-box;
          align-items: center;
          margin: 10px 20px;
          padding: 10px;
          background: $color-highlight-background;

          .icon {
            flex: 0 0 60px;
            width: 60px;
            padding-right: 20px;
          }

          .text {
            display: flex;
            flex-direction: column;
            justify-content: center;
            flex: 1;
            line-height: 20px;
            overflow: hidden;
            font-size: $font-size-medium;

            .name {
              margin-bottom: 10px;
              color: $color-text;
            }

            .desc {
              color: $color-text-d;
            }
          }
        }
      }
    }
  }

  .no-result-wrapper {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>