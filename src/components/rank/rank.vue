<template>
  <transition name="slide">
  <div class="container">
    <title-Bar :titleBarName="titleBarName"></title-Bar>
    <div class="rank" ref="rank">
      <scroll :data="topList" class="toplist" ref="toplist">
        <ul>
          <mu-list-item
            @click="selectItem(item)"
            class="item"
            v-for="(item,index) in topList"
            :key="index"
          >
            <mu-flexbox>
              <mu-flexbox-item class="flexitem">
                <div class="ablum">
                  <img width="100" height="100" v-lazy="item.picUrl">
                  <div class="info">
                    <img src="~@/common/image/earphone.png">
                    <span >{{Math.round(item.listenCount/1000)/10}}万</span>
                  </div>
                </div>
              </mu-flexbox-item>
              <mu-flexbox-item>
                <ul class="songlist">
                  <li class="song" v-for="(song,index) in item.songList" :key="index">
                    <span>{{index + 1}}</span>
                    <span>{{song.songname}}-{{song.singername}}</span>
                  </li>
                </ul>
              </mu-flexbox-item>
            </mu-flexbox>
          </mu-list-item>
        </ul>
        <div class="loading-container" v-show="!topList.length">
          <loading></loading>
        </div>
      </scroll>
      <router-view></router-view>
    </div>
  </div>
  </transition>

</template>

<script>
import Scroll from "base/scroll/scroll";
import Loading from "base/loading/loading";
import TitleBar from "base/title-bar/title-bar";
import { getTopList, getMusicList } from "api/rank";
import { ERR_OK } from "api/config";
import { playlistMixin } from "common/js/mixin";
import { createSong } from "common/js/song";
import { mapMutations, mapGetters, mapActions } from "vuex";
export default {
  mixins: [playlistMixin],
  created() {
    this._getTopList();
  },
  data() {
    return {
      topList: [],
      titleBarName: "排行"
    };
  },
  methods: {
    selectItem(item) {
      this.$router.push({
        path: `/rank/${item.id}`
      });
      this.setTopList(item);
    },
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? "60px" : "";
      this.$refs.rank.style.bottom = bottom;
      this.$refs.toplist.refresh();
    },
    _getTopList() {
      getTopList().then(res => {
        if (res.code === ERR_OK) {
          this.topList = res.data.topList;
        }
      });
    },
    ...mapMutations({
      setTopList: "SET_TOP_LIST"
    })
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
  z-index 100;
  position: fixed;
  bottom: 0;
  width: 100%;
  background $color-background;
  top: 0;
}

.rank {
  position: fixed;
  width: 100%;
  top: 72px;
  bottom: 0

  .toplist {
    height: 100%;
    overflow: hidden;

    .item {
      position: relative;
      margin: 15px;
      background: $color-highlight-background;

      .flexitem {
        flex: 0 0 90px !important;
      }

      .ablum {
        width: 100px;
        height: 100px;
        color: #eee;

        .info {
          position: absolute;
          bottom: 2px;
          left: 5px;
          color: #fff;
          font-size: 9px;
          display: flex;
          flex-direction: row;
          align-items: center;

          img {
            width: 11px;
            height: 11px;
            display: inline-block;
            margin-right: 3px;
          }
        }
      }

      .songlist {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 0 20px;
        height: 100px;
        overflow: hidden;
        color: $color-text;
        font-size: $font-size-small-m;

        .song {
          no-wrap();
          line-height: 26px;
        }
      }
    }

    .loading-container {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>