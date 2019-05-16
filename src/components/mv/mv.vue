<template>
  <transition name="slide">
    <div class="container">
      <title-Bar :titleBarName="titleBarName"></title-Bar>
      <div class="mv-wrapper" ref="mv">
        <scroll class="mvlist-wrapper" ref="mvlist" :data="mvlist">
          <div>
            <Tags
              v-if="taglist"
              titleName="排序"
              :tag="switches"
              :currentId="currentType"
              @selectItemTag="selectOrder"
            />

            <Tags
              v-if="taglist"
              titleName="地区"
              :tag="taglist.area"
              :currentId="currentAreaId"
              :area="true"
              @selectItemTag="selectAreaIndex"
            />
            <Tags
              v-if="taglist"
              titleName="类型"
              :tag="taglist.tag"
              :currentId="currentTagId"
              @selectItemTag="selectTagIndex"
            />
            <Tags
              v-if="taglist"
              titleName="年份"
              :tag="taglist.year"
              :currentId="currentYearId"
              @selectItemTag="selectYearIndex"
            />
            <div class="mv-list" v-show="mvlist.length">
              <mu-list-item
                @click="selectItem(item)"
                v-for="(item,index) in mvlist"
                :key="index"
                class="item"
              >
                <mu-flexbox class="flexbox">
                  <mu-flexbox-item class="flexitem">
                    <div class="ablum">
                      <img v-lazy="item.picurl" :key="item.picurl">
                      <div class="info">
                        <img src="~@/common/image/video.png">
                        <span>{{formatNum(item.listennum)}}</span>
                      </div>
                    </div>
                  </mu-flexbox-item>
                  <mu-flexbox-item>
                    <div class="text">
                      <p class="desc" v-html="item.mvtitle"></p>
                      <p class="name" v-html="filterSinger(item.singers)"></p>
                    </div>
                  </mu-flexbox-item>
                </mu-flexbox>
              </mu-list-item>
            </div>
          </div>
        </scroll>
        <div class="loading-container" ref="loading">
          <loading></loading>
        </div>
        <router-view></router-view>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapMutations, mapGetters } from "vuex";

import TitleBar from "base/title-bar/title-bar";
import Tags from "base/tags/tags";
import Loading from "base/loading/loading";
import Scroll from "base/scroll/scroll";
import { getMvlist, getMvUrl } from "api/mv";
import { ERR_OK } from "api/config";
import { playlistMixin } from "common/js/mixin";

export default {
  mixins: [playlistMixin],

  data() {
    return {
      mvlist: [],
      MvData: {},
      titleBarName: "MV",
      taglist: null,
      currentType: 2,
      currentAreaId: 0,
      currentTagId: 0,
      currentYearId: 0,
      pageno: 0,
      allpage: null,
      switches: [{ id: 2, title: "推荐" }, { id: 1, title: "最新" }],
      pullup: true,
      beforeScroll: true,
      hasMore: true
    };
  },
  created() {
    this._getMvlist();
  },
  computed: {
    ...mapGetters(["mv"])
  },
  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? "60px" : "";
      this.$refs.mv.style.bottom = bottom;
      this.$refs.mvlist.refresh();
    },
    filterSinger(singer) {
      let ret = [];
      if (!singer) {
        return "";
      }
      singer.forEach(s => {
        ret.push(s.name);
      });
      return ret.join("/");
    },
    formatNum(num) {
      if (num > 10000) {
        return Math.round(num / 1000) / 10 + "万";
      } else {
        return num;
      }
    },
    selectOrder(item) {
      this.currentType = item.id;
      this.pageno = 0;
      this.$refs.loading.style.display = "block";
      this._getMvlist();
    },
    selectAreaIndex(item) {
      this.currentAreaId = item.id;
      this.pageno = 0;
      this.$refs.loading.style.display = "block";
      this._getMvlist();
    },
    selectTagIndex(item) {
      this.currentTagId = item.id;
      this.pageno = 0;
      this.$refs.loading.style.display = "block";
      this._getMvlist();
    },
    selectYearIndex(item) {
      this.currentYearId = item.id;
      this.pageno = 0;
      this.$refs.loading.style.display = "block";
      this._getMvlist();
    },
    _getMvlist() {
      getMvlist({
        type: this.currentType,
        year: this.currentYearId,
        area: this.currentAreaId,
        tag: this.currentTagId,
        pageno: this.pageno
      }).then(res => {
        if (res.code === ERR_OK) {
          this.MvData = res.data;
          this.mvlist = this.MvData.mvlist;
          this.taglist = this.MvData.taglist;
          this.allpage = this.MvData.sum;
          this.$refs.loading.style.display = "none";
        }
      });
    },
    async selectItem(item) {
      const vid = item.vid;
      const response = await getMvUrl(vid);
      if (response.code === ERR_OK) {
        const MvUrlData = response.getMvUrl;
        if (MvUrlData.code === ERR_OK) {
          const mvUrl_mp4 = MvUrlData.data[vid].mp4;

          const result = [];
          for (let i = 0; i < mvUrl_mp4.length; i++) {
            if (mvUrl_mp4[i].freeflow_url.length !== 0) {
              for (let j = 0; j < mvUrl_mp4[i].freeflow_url.length; j++) {
                result.unshift(mvUrl_mp4[i].freeflow_url[j]);
              }
            }
          }

          if (result.length === 0) {
            console.log("无法播放");
            return;
          }
          this.setMV({
            mvtitle: item.mvtitle,
            singername: this.filterSinger(item.singers),
            picurl: item.picurl,
            publictime: item.publictime,
            listennum: this.formatNum(item.listennum),
            url: result[0]
          });
        }
      }
      this.$router.push({
        path: `/mv/${vid}`
      });
    },

    ...mapMutations({
      setPlayState: "SET_PLAYING_STATE",
      setMV: "SET_MV"
    })
  },
  components: {
    Scroll,
    Loading,
    TitleBar,
    Tags
  }
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.container {
  position: fixed;
  z-index: 100;
  bottom: 0;
  width: 100%;
  top: 0;
  height: 100%;
  background: #fff;
}

.mv-wrapper {
  top: $top-height;
  bottom: 0;
  position: fixed;
  width: 100%;
  padding: 10px 0;

  .mvlist-wrapper {
    height: 100%;
    overflow: hidden;
    margin-left: 10px;

    .mv-list {
      margin-top: 10px;

      .ablum {
        width: 140px;
        box-shadow: 3px 3px 3px 1px rgba(0, 0, 0, 0.1);

        img {
          filter: brightness(90%);
          width: 140px;
          height: 81px;
        }

        .info {
          position: absolute;
          bottom: 5px;
          left: 5px;
          color: #fff;
          font-size: 10px;
          display: flex;
          flex-direction: row;
          align-items: center;

          span {
            margin-top: 3px;
          }

          img {
            width: 14px;
            height: 14px;
            display: inline-block;
            margin-right: 3px;
          }
        }
      }

      .flexitem {
        flex: 0 0 145px !important;
      }

      .item {
        padding-right: 8px;
        margin-bottom: 8px;
        cursor: pointer;
        border-top: 1px solid $color-border;

        .text {
          overflow: hidden;
          font-size: 13px;
          line-height: 22px;

          .name {
            color: $color-text-l;
            margin-top: 5px;
            no-wrap();
          }

          .desc {
            color: $color-text;
            limit_lines();
          }
        }
      }
    }
  }
}

.loading-container {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 50%;
  transform: translateY(-50%);

  .loading {
    width: 75px;
    height: 70px;
    padding: 5px;
    border-radius: 5px;
    background: #eee;
    margin: 300px auto;
  }
}
</style>