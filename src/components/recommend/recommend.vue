<template>
  <div>
    <div class="recommend" ref="recommend" >
      <!-- <img src="~@/common/image/paint.png" class="paint"> -->
      <scroll ref="scroll" class="recommend-content" :data="discList">
        <div>
          <!-- 注意此处, 必须有v-if, 否则获取不到数据使得slider的DOM出错-->
          <div v-if="recommends.length" class="slider-wrapper">
            <slider>
              <!-- 作为插槽插入组件内部的slot之中 -->
              <div v-for="(item,index) in recommends" :key="index">
                <a @click="openLink(item.linkUrl)">
                  <img class="needsclick" @load="loadImage" :src="item.picUrl">
                </a>
              </div>
            </slider>
          </div>
          <mu-flexbox class="nav">
            <mu-flexbox-item class="nav-item">
              <mu-float-button icon="person" class="demo-float-button" to="/singer"/>
              <h1>歌手</h1>
            </mu-flexbox-item>
            <mu-flexbox-item class="nav-item">
              <mu-float-button icon="equalizer" class="demo-float-button" to="/rank"/>
              <h1>排行</h1>
            </mu-flexbox-item>
            <mu-flexbox-item class="nav-item">
              <mu-float-button icon="queue_music" class="demo-float-button" to="/sort"/>
              <h1>歌单</h1>
            </mu-flexbox-item>
            <mu-flexbox-item class="nav-item">
              <mu-float-button icon="radio" class="demo-float-button" to="/singer"/>
              <h1>电台</h1>
            </mu-flexbox-item>
          </mu-flexbox>
          <div class="recommend-list" ref="recommendList" v-show="discList.length">
            <h1 class="list-title">热门歌单推荐</h1>
            <ul>
              <mu-list-item
                @click="selectItem(item)"
                v-for="(item,index) in discList"
                :key="index"
                class="item"
              >
                <mu-flexbox class="flexbox">
                  <mu-flexbox-item class="flexitem">
                    <div class="ablum">
                      <img v-lazy="item.imgurl" width="60" height="60">
                    </div>
                  </mu-flexbox-item>
                  <mu-flexbox-item>
                    <div class="text">
                      <p class="desc" v-html="item.dissname"></p>
                      <h2 class="name" v-html="item.creator.name"></h2>
                    </div>
                  </mu-flexbox-item>
                </mu-flexbox>
              </mu-list-item>
            </ul>
          </div>
        </div>
        <div class="loading-container" v-show="!discList.length">
          <loading></loading>
        </div>
      </scroll>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import Loading from "base/loading/loading";
import Scroll from "base/scroll/scroll";
import Slider from "base/slider/slider";

import { getRecommend, getDiscList } from "api/recommend";
import { ERR_OK } from "api/config";
import { playlistMixin } from "common/js/mixin";
import { mapMutations } from "vuex";
import { openUrl } from "common/js/openUrl";
export default {
  mixins: [playlistMixin],
  data() {
    return {
      recommends: [],
      discList: []
    };
  },
  created() {
    this._getRecommend();
    this._getDiscList();
  },
  methods: {
    openLink(url) {
      openUrl(url);
    },
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? "60px" : "";
      this.$refs.recommend.style.bottom = bottom;
      this.$refs.scroll.refresh();
    },
    selectItem(item) {
      this.$router.push({
        path: `/recommend/${item.dissid}`
      });
      this.setDisc(item);
    },
    _getRecommend() {
      getRecommend().then(res => {
        if (res.code === ERR_OK) {
          this.recommends = res.data.slider;
        }
      });
    },
    _getDiscList() {
      getDiscList().then(res => {
        if (res.code === ERR_OK) {
          this.discList = res.data.list;
        }
      });
    },
    loadImage() {
      if (!this.checkloaded) {
        this.checkloaded = true;
        this.$refs.scroll.refresh();
      }
    },
    ...mapMutations({
      setDisc: "SET_DISC"
    })
  },
  components: {
    Slider,
    Scroll,
    Loading,

  }
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

// .paint {
// position: fixed;
// width: 330px;
// height: auto;
// margin-left:10px;
// }

// .header {
//   position: fixed;
//   width: 100%;
//   z-index: 100;
// }

.recommend {
  position: fixed;
  width: 100%;
  top: 94px;
  bottom: 0;
  background: #fff;

  .recommend-content {
    height: 100%;
    overflow: hidden;

    .slider-wrapper {
      position: relative;
      width: 100%;
      overflow: hidden;
    }

    .nav {
      padding: 15px;
      text-align: center;
      border-bottom: 1px solid $color-border;

      .nav-item {
        h1 {
          font-size: 14px;
          margin-top: 5px;
          color: $color-text-ll;
        }

        .mu-float-button {
          color: #fff;
          width: 50px;
          height: 50px;
          background-color: $color-theme;
        }
      }
    }

    .recommend-list {
      background: #fff;

      .list-title {
        height: 50px;
        line-height: 50px;
        text-align: center;
        font-size: $font-size-medium-x;
        color: $color-theme;
      }

      .flexbox {
        padding: 10px 10px 8px 10px;
      }

      .flexitem {
        flex: 0 0 70px !important;
      }

      .item {
        margin: 0 15px 10px;

        .ablum {
          width: 60px;
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
          }
        }
      }
    }

    .loading-container {
      position: absolute;
      width: 100%;
      top: 70%;
      transform: translateY(-50%);

    }
  }
}
</style>