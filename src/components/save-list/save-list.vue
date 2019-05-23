<template>
  <transition name="slide">
    <div class="container" ref="saveList">
      <title-Bar :titleBarName="titleBarName"></title-Bar>
      <div class="save-list">
        <div class="list-wrapper" ref="listWrapper">
          <scroll ref="Songlist" class="list-scroll" v-if="currentIndex!=2">
            <div class="list-inner">
              <div class="btn-wrapper" v-show="!noResult">
                <div class="play-btn" @click="random">
                  <mu-flat-button :label="palyAll" icon="play_circle_outline" color="#31c27c"/>
                </div>
                <div class="del-btn" @click="showDelete">
                  <mu-flat-button label="删除" icon="delete" color="#31c27c"/>
                </div>
              </div>
              <div class="song-list">
                <ul>
                  <mu-list-item
                    v-for="(item,index) in result"
                    :key="index"
                    class="item"
                    :class="{'current-play-b':getCurrent(item)}"
                    @click="selectSong(item)"
                  >
                    <div class="content" slot="title">
                      <h2 class="name" :class="{'current-play':getCurrent(item)}" v-text="item.name"></h2>
                      <p class="desc" :class="{'current-play':getCurrent(item)}">
                        <span class="vip" v-if="item.isPay">VIP</span>
                        <span class="only" v-if="item.isOnly">独家</span>
                        <span class="mv" v-if="item.vid!=''">MV</span>
                        <span v-text="getDesc(item)"></span>
                      </p>
                    </div>
                    <div @click.stop="showMenu(item)" class="mv-icon" slot="right">
                      <mu-icon-button icon="more_vert"/>
                    </div>
                  </mu-list-item>
                </ul>
              </div>
            </div>
          </scroll>
          <scroll
            ref="DiscList"
            class="list-scroll"
            v-if="currentIndex===2"
            :data="favoriteListList"
          >
            <div class="list-inner">
              <div class="discText" v-text="DiscText"></div>
              <ul>
                <mu-list-item
                  @click="selectItem(item)"
                  v-for="(item,index) in favoriteListList"
                  :key="index"
                  class="item2"
                >
                  <mu-flexbox class="flexbox">
                    <mu-flexbox-item class="flexitem">
                      <div class="ablum">
                        <img :src="item.imgurl" width="60" height="60">
                      </div>
                    </mu-flexbox-item>
                    <mu-flexbox-item class="flexitem2">
                      <div class="text">
                        <p class="desc" v-text="item.dissname"></p>
                        <h2 class="name" v-text="item.creator.name"></h2>
                      </div>
                    </mu-flexbox-item>
                  </mu-flexbox>
                  <div @click.stop="showMenu(item)" class="mv-icon" slot="right">
                    <mu-icon-button icon="more_vert"/>
                  </div>
                </mu-list-item>
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
        <menuBar
        @deleteOne="deleteOne"
        @deleteDisc="deleteDisc"
          :item=item
          :isDisc="currentIndex===2"
          :isSavelist="true"
        ></menuBar>

        <router-view></router-view>
      </div>
    </div>
  </transition>
</template>

<script>
import TitleBar from "base/title-bar/title-bar";
import Scroll from "base/scroll/scroll";
import SongList from "base/song-list/song-list";
import NoResult from "base/no-result/no-result";
import Toast from "base/toast/toast";
import Song from "common/js/song";
import Singer from "common/js/singer";
import { downloadSong } from "common/js/util";
import DeleteSong from "components/delete-song/delete-song";
import { mapGetters, mapActions, mapMutations } from "vuex";
import { playlistMixin } from "common/js/mixin";
import { setTimeout } from "timers";
import MenuBar from "components/menuBar/menuBar";
export default {
  mixins: [playlistMixin],
  data() {
    return {
      item: {},
      currentIndex: 0,
    };
  },
  created() {
    this.getCurrentIndex();
  },
  computed: {
    titleBarName() {
      if (this.currentIndex === 0) {
        return "我喜欢的";
      } else if (this.currentIndex === 1) {
        return "最近播放";
      } else {
        return "收藏歌单";
      }
    },
    palyAll() {
      return `全部播放 (${this.result.length})`;
    },
    DiscText() {
      return `收藏的歌单 (${this.favoriteListList.length})`;
    },
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
        return "没有喜欢的歌曲";
      } else if (this.currentIndex === 1) {
        return "没有最近播放歌曲";
      } else {
        return "没有收藏歌单";
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
      "currentSong",
      "favoriteList",
      "playHistory",
      "favoriteListList",
      "deleteSongVisible",
      "menuBarVisible"
    ])
  },

  methods: {

    getCurrentIndex() {
      this.currentIndex = Number(this.$route.params.index);
    },
    getDesc(song) {
      return `${song.singerName} · ${song.album}`;
    },
    getCurrent(item) {
      if (this.currentSong.id === item.id) {
        return true;
      }
    },
    getCurrentB(item) {
      if (this.currentSong.id === item.id) {
        return "current-play-b";
      }
      return "";
    },
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
        }
      }
    },
    showMenu(item) {
      this.item = item;
      this.setMenuBarVisible(true);
    },
    download() {
      downloadSong(this.item.name, this.item.url);
    },
    deleteOne() {
      if (this.currentIndex == 0) {
        this.deleteFavoriteList(this.item);
      } else {
        this.deletePlayHistory(this.item);
      }
      this.$refs.toast.show();
    },
    findSinger() {
      const singer = new Singer({
        id: this.item.singerMid,
        name: this.item.singerName
      });
      this.$router.push({
        path: `/user/singer/${singer.id}`
      });
      this.setSinger(singer);
    },
    deleteDisc() {
      this.deleteFavoriteListList(this.item);
      this.$refs.toast.show();
    },
    showDelete() {
      this.setDeleteSongVisible(true);
    },
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? "60px" : "";
      this.$refs.listWrapper.style.bottom = bottom;
      this.$refs.Songlist && this.$refs.Songlist.refresh();
      this.$refs.DiscList && this.$refs.DiscList.refresh();
    },

    selectSong(song) {
      this.insertSong([new Song(song), false]);
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
        path: `/user/recommend/${item.dissid}`
      });
      this.setDisc(item);
    },
    ...mapMutations({
      setDisc: "SET_DISC",
      setSinger: "SET_SINGER",
      setDeleteSongVisible: "SET_DELETE_SONG_VISIBLE",
      setMenuBarVisible: "SET_MENUBAR_VISIBLE"
    }),
    ...mapActions([
      "insertSong",
      "randomPlay",
      "selectPlay",
      "deletePlayHistory",
      "deleteFavoriteList",
      "deleteFavoriteListList"
    ])
  },
  watch: {
    deleteSongVisible() {
      if (this.deleteSongVisible) {
        this.$refs.saveList.style["z-index"] = "200";
      } else {
        this.$refs.saveList.style["z-index"] = "100";
      }
    },
    menuBarVisible() {
      if (this.menuBarVisible) {
        this.$refs.saveList.style["z-index"] = "200";
      } else {
        this.$refs.saveList.style["z-index"] = "100";
      }
    }
  },
  components: {
    Scroll,
    SongList,
    NoResult,
    Toast,
    DeleteSong,
    MenuBar,
    TitleBar
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.container {
  position: fixed;
  width: 100%;
  height: 100%;
  background: #fff;
  top: 0;
  bottom: 0;
}

.save-list {
  position: fixed;
  top: $top-height;
  width: 100%;
  bottom: 0;

  .discText {
    color: $color-theme;
    border-bottom: 1px solid $color-border;
    height: 42px;
    line-height: 42px;
    text-indent: 20px;
    font-size 14px;
  }

  .btn-wrapper {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    border-bottom: 1px solid $color-border;
    background-color: #fff;

    .play-btn, .del-btn {
      color: $color-theme;
      align-items: center;
      border-radius: 100px;
      margin-bottom: 5px;

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
    position: absolute;
    top: 0px;
    bottom: 0;
    width: 100%;
    background-color: #fff;

    .list-scroll {
      height: 100%;
      overflow: hidden;

      .list-inner {
        .song-list {
          .item {
            box-sizing: border-box;
            border-left: 5px solid #fff;

            .content {
              line-height: 20px;
              overflow: hidden;
              margin-left: 20px;
              padding: 10px 0 2px 0;
              border-bottom: 1px solid $color-border;

              .name {
                no-wrap();
                font-size: $font-size-medium-x;
                color: $color-text;
                display: inline-block;
                width: 100%;
              }

              .desc {
                display: inline-block;
                font-size: $font-size-small;
                no-wrap();
                margin-top: 3px;
                color: $color-text-l;
                width: 100%;
              }

              .only, .mv, .vip {
                font-size: 8px;
                padding: 2px 2px;
                color: $color-theme;
                border: 1px solid $color-theme;
                border-radius: 3px;
                margin-right: 1px;
              }

              .vip {
                padding: 2px 3px 2px 3px;
                color: $color-theme;
                border: 1px solid $color-theme;
              }

              .mv {
                padding: 2px 3px 2px 3px;
                color: orange;
                border: 1px solid orange;
              }

              .current-play {
                color: $color-theme;
              }
            }

          }

          .current-play-b {
            border-left: 5px solid $color-theme;
          }
        }

        .flexbox {
          padding: 8px 0 6px 0;
        }

        .flexitem {
          flex: 0 0 80px !important;
        }

        .flexitem2 {
          width: 100%;
        }

        .item2 {
          border-bottom: 1px solid $color-border;

          .ablum {
            width: 60px;
            margin-left 12px;
          }

          .text {
            line-height: 20px;
            overflow: hidden;
            font-size: $font-size-medium;

            .name {
              color: $color-text-l;
            }

            .desc {
              color: $color-text;
              margin-bottom: 10px;
              no-wrap();
            }
          }
        }
      }
    }
  }

  .no-result-wrapper {
    position: absolute;
    width: 100%;
    top: 40%;
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