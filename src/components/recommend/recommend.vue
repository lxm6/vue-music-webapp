<template>
  <div class="recommend" ref="recommend">
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
        <div class="recommend-list" ref="recommendList">
          <h1 class="list-title">热门歌单推荐</h1>
          <mu-list>
            <mu-list-item
              @click="selectItem(item)"
              v-for="(item,index) in discList"
              :key="index"
              class="listItem"
            >
              <div class="ablum">
                <img v-lazy="item.imgurl" width="60" height="60">
              </div>
              <div class="text">
                <h2 class="name" v-html="item.creator.name"></h2>
                <p class="desc" v-html="item.dissname"></p>
              </div>
 
            </mu-list-item>
          </mu-list>
        </div>
      </div>
      <div class="loading-container" v-show="!discList.length">
        <loading></loading>
      </div>
    </scroll>
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
    Loading
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
.recommend {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;

  .recommend-content {
    height: 100%;
    overflow: hidden;

    .slider-wrapper {
      position: relative;
      width: 100%;
      overflow: hidden;
    }

    .recommend-list {
      margin: 0 15px;

      .list-title {
        padding: 15px 0 10px 0;
        text-align: center;
        font-size: $font-size-medium-x;
        color: $color-theme;
      }

      .listItem {
        background: $color-highlight-background;
        margin-bottom: 10px;
        line-height: 14px;

        .ablum {
          float: left;
          margin-right: 20px;
        }

        .text {
          float: left;
          line-height: 20px;
          overflow: hidden;
          font-size: $font-size-medium;
          margin-top: 5px;

          .name {
            margin-bottom: 10px;
            color: $color-text;
          }

          .desc {
            color: $color-text-l;
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
  }
}
</style>