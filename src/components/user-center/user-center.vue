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
        <scroll ref="favoriteList" class="list-scroll" v-if="currentIndex===0">
          <div class="list-inner">
            <div class="song-list">
              <ul>
                <li
                  v-for="(item,index) in favoriteList"
                  :key="index"
                  class="item"
                  :class="{'current-play-b':getCurrent(item)}"
                  @click="selectSong(item)"
                >
                  <div class="content">
                    <h2 class="name" :class="{'current-play':getCurrent(item)}">{{item.name}}</h2>
                    <p class="desc" :class="{'current-play':getCurrent(item)}">
                      <span class="vip" v-if="item.isPay">VIP</span>
                      <span class="hq">HQ</span>
                      <span>{{getDesc(item)}}</span>
                    </p>
                    <div @click.stop="showMenu(item)" class="delete">
                      <img src="./menu2.png" width="20" height="20">
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </scroll>

        <scroll ref="playList" class="list-scroll" v-if="currentIndex===1">
          <div class="list-inner">
            <div class="song-list">
              <ul>
                <li
                  v-for="(item,index) in playHistory"
                  :key="index"
                  class="item"
                  :class="{'current-play-b':getCurrent(item)}"
                  @click="selectSong(item)"
                >
                  <div class="content">
                    <h2 class="name" :class="{'current-play':getCurrent(item)}">{{item.name}}</h2>
                    <p class="desc" :class="{'current-play':getCurrent(item)}">
                      <span class="vip" v-if="item.isPay">VIP</span>
                      <span class="hq">HQ</span>
                      <span>{{getDesc(item)}}</span>
                    </p>
                    <div @click.stop="showMenu(item)" class="delete">
                      <img src="./menu2.png" width="20" height="20">
                    </div>
                  </div>
                </li>
              </ul>
            </div>
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
                class="item2"
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
      <menuBar @findSinger="findSinger" @deleteOne="deleteOne"></menuBar>
      <router-view></router-view>
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
import Singer from "common/js/singer";
import DeleteSong from "components/delete-song/delete-song";
import { mapGetters, mapActions, mapMutations } from "vuex";
import { playlistMixin } from "common/js/mixin";
import { setTimeout } from "timers";
import MenuBar from "components/menuBar/menuBar";
export default {
  mixins: [playlistMixin],
  data() {
    return {
      item:{},
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
      "currentSong",
      "favoriteList",
      "playHistory",
      "favoriteListList",
      "deleteSongVisible",
      "menuBarVisible"
    ])
  },
  methods: {
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
    showMenu(item) {
      this.item=item;
      this.setMenuBarVisible(true);
    },
    deleteOne(){
      if(this.currentIndex==0){
        this.deleteFavoriteList(this.item);
      }else{
        this.deletePlayHistory(this.item);
      }
    },
    findSinger() {
      const singer = new Singer({
        id: this.item.singerMid,
        name: this.item.singerName
      });
      this.$router.push({
        path: `/user/${singer.id}`
      });
      this.setSinger(singer);
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
      "deleteFavoriteList"
    ])
  },
  watch: {
    deleteSongVisible() {
      if (this.deleteSongVisible) {
        this.$refs.userCenter.style["z-index"] = "200";
      } else {
        this.$refs.userCenter.style["z-index"] = "100";
      }
    },
    menuBarVisible() {
      if (this.menuBarVisible) {
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
    DeleteSong,
    MenuBar
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';
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
    .list-scroll {
      height: 100%;
      overflow: hidden;
      .list-inner {
        .song-list {
          padding-top:5px;
          .item {
            display: flex;
            align-items: center;
            box-sizing: border-box;
            margin 10px 0px;
            padding: 0px 0px 0px 25px;
            border-left: 5px solid #fff;
            .content {
              flex: 1;
              line-height: 20px;
              overflow: hidden;
              border-bottom: 1px solid $color-border;
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
              .current-play {
                color: $color-theme;
              }
            }
            .delete {
              width 30px;
              extend-click();
              float: right;
              font-size: $font-size-medium;
              color: rgba(0, 0, 0, 0.3);
            }
          }
          .current-play-b {
            border-left: 5px solid $color-theme;
          }
        }
        .item2 {
          display: flex;
          box-sizing: border-box;
          align-items: center;
          margin: 10px 20px;
          padding: 10px;
          background: $color-background;
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