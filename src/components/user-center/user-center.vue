<template>
  <transition name="slide">
    <div class="user-center" ref="userCenter">
      <div class="back" @click="back">
        <i class="icon-back"></i>
      </div>
      <div class="switches-wrapper">
        <switches @switch="switchItem" :switches="switches" :currentIndex="currentIndex"></switches>
      </div>
      <div class="btn-wrapper" v-show="showBtn()">
        <div ref="playBtn" class="play-btn" @click="random">
          <i class="icon-play"></i>
          <span class="text">全部播放</span>
        </div>
        <div class="del-btn" @click="showDelete">
          <i class="icon-clear"></i>
          <span class="text">删除</span>
        </div>
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
      <toast ref="toast">
        <div class="wrapper">
          <i class="icon-ok"></i>
          <p class="desc">删除成功</p>
        </div>
      </toast>
      <delete-song ref="deleteSong" :songs="result" :currentIndex="currentIndex"></delete-song>
      <div class="no-result-wrapper" v-show="noResult">
        <no-result :title="noResultDesc"></no-result>
      </div>
    </div>
  </transition>
</template>

<script>
import Switches from "base/switches/switches";
import Scroll from "base/scroll/scroll";
import SongList from "base/song-list/song-list";
import NoResult from "base/no-result/no-result";
import Confirm from "base/confirm/confirm";
import Toast from "base/toast/toast";
import Song from "common/js/song";
import DeleteSong from "components/delete-song/delete-song";
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
    result() {
      if (this.currentIndex === 0) {
        return this.favoriteList;
      } else if (this.currentIndex === 1) {
        return this.playHistory;
      } else {
        return this.favoriteListList;
      }
    },
    ...mapGetters([
      "favoriteList",
      "playHistory",
      "favoriteListList",
      "deleteSongVisible"
    ])
  },
  methods: {
    showBtn() {
      if (this.currentIndex === 0) {
        if (this.favoriteList.length != 0) {
          return true;
        } else {
          return false;
        }
      } else if (this.currentIndex === 1) {
        if (this.playHistory.length != 0) {
          return true;
        } else {
          return false;
        }
      }
    },
    showDelete() {
      this.setDeleteSongVisible(true);
    },
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? "60px" : "";
      this.$refs.listWrapper.style.bottom = bottom;
      this.$refs.favoriteList && this.$refs.favoriteList.refresh();
      this.$refs.playList && this.$refs.playList.refresh();
      this.$refs.favoriteListList && this.$refs.favoriteListList.refresh();
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
      setDisc: "SET_DISC",
      setDeleteSongVisible: "SET_DELETE_SONG_VISIBLE"
    }),
    ...mapActions(["insertSong", "randomPlay", "selectPlay"])
  },
  watch: {
    deleteSongVisible() {
      if (this.deleteSongVisible) {
        this.$refs.userCenter.style["z-index"] = "200";
      } else {
        this.$refs.userCenter.style["z-index"] = "100";
      }
    }
  },
  components: {
    Switches,
    Scroll,
    SongList,
    NoResult,
    Confirm,
    Toast,
    DeleteSong
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

  .btn-wrapper {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;

    .play-btn, .del-btn {
      padding: 0 15px;
      color: $color-theme;
      align-items;
      border-radius: 100px;

      .icon-play, .icon-clear {
        vertical-align: middle;
        margin-right: 4px;
        font-size: $font-size-medium-x;
      }

      .text {
        color: #000;
        display: inline-block;
        vertical-align: middle;
        font-size: $font-size-medium-x;
      }
    }
  }

  .list-wrapper {
    border-top: 3px solid $color-theme;
    position: absolute;
    top: 90px;
    bottom: 0;
    width: 100%;
    background-color: #fff;
    padding-top: 7px;

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
}
</style>