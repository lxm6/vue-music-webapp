<template>
  <transition name="slide">
    <div class="container">
      <title-Bar :titleBarName="titleBarName"></title-Bar>
      <div class="radio" ref="radio">
        <scroll class="taglist-wrapper" ref="taglist-scroll" :data="tags" :scrollbar="false">
          <ul>
            <li
              class="taglistItem"
              :class="{'current':currentIndex===index}"
              @click="selectMenu(index)"
              v-for="(items,index) in tags"
              :key="index"
            >{{items}}</li>
          </ul>
        </scroll>

        <scroll class="radioList-wrapper" :data="radioList" ref="radioList">
          <div>
            <div v-if="radioList.length !== 0">
              <li v-for="(items,index) in radioList" :key="index">
                <ul class="radioItem">
                  <li class="radioItem_li" v-for="(item,index) in items.radioList" :key="index">
                    <div class="ablum" @click.stop="handelClickRadio(item)">
                      <img :src="item.radioImg">
                    </div>
                    <p class="radioName">{{item.radioName}}</p>
                  </li>
                </ul>
              </li>
            </div>
          </div>
        </scroll>

        <div class="loading-container">
          <!-- <loading  ></loading> -->
        </div>
      </div>
      <router-view></router-view>
    </div>
  </transition>
</template>

<script>
import { playlistMixin } from "common/js/mixin";
import { ERR_OK } from "api/config";
import Scroll from "base/scroll/scroll";
import Loading from "base/loading/loading";
import TitleBar from "base/title-bar/title-bar";
import { getRadio, getRadioDesc } from "api/radio";
import { createSong } from "common/js/song";

export default {
  //   mixins: [playlistMixin],

  data() {
    return {
      titleBarName: "电台",
      radioList: [],
      tags: [],
      currentIndex: 0
    };
  },
  created() {
    this._getRadio();
  },
  methods: {
    // handlePlaylist(playlist) {
    //   const bottom = playlist.length > 0 ? "60px" : "";
    //   this.$refs.radio.style.bottom = bottom;
    //   this.$refs.scroll.refresh();
    // },
    selectMenu(index) {
      this.currentIndex = index;
    },
    handelClickRadio(item) {
      if (Number(item.radioId) === 99) {
        return;
      }
      getRadioDesc(item.radioId).then(res => {
        if (res.code === ERR_OK) {
          const track_list = res.songlist.data;
          const songsData = processSongsUrl(this._normalizeSongs(track_list));
          this.songs = songsData.filter(currentSong => {
            return currentSong.url.length !== 0;
          });
        }
      });
    },
    _getRadio() {
      getRadio().then(res => {
        if (res.code === ERR_OK) {
          this.radioList = res.data.data.groupList;
          this.tags = this.radioList.map(currentVal => {
            return currentVal.name;
          });
        }
      });
    },
    _normalizeSongs(list) {
      let ret = [];
      list.forEach(musicData => {
        if (musicData.mid) {
          ret.push(createSong(musicData));
        }
      });
      return ret;
    }
  },
  components: {
    Scroll,
    Loading,
    TitleBar
  }
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.container {
  z-index: 100;
  position: fixed;
  bottom: 0;
  width: 100%;
  background: #fff;
  top: 0;
}

.radio {
  position: fixed;
  width: 100%;
  top: 65px;
  bottom: 0;

  .taglist-wrapper {
    float: left;
    height: 100%;
    width: 25%;
    overflow: hidden;

    .taglistItem {
      padding: 25px 0;
      font-size: 15px;
      text-align: center;

      &:hover {
        background: #eee;
      }

      &.current {
        color: $color-theme;
      }
    }
  }

  .radioList-wrapper {
    width: 75%;
    height: 100%;
    overflow: hidden;

    .radioItem {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;

      .radioItem_li {
        flex: 1;
        padding: 15px;
        text-align: center;

        .ablum {
          width: 100px;
          cursor: pointer;

          img {
            border-radius: 50%;
            width: 100%;
            height: 100px;
          }
        }

        .radioName {
          padding: 8px 0 3px 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: #333;
          font-size: 14px;
          text-align: center;
        }
      }
    }
  }
}

.loading-container {
  position: absolute;
  width: 100%;
  top: 50%;
  transform: translateY(-50%);
}
</style>