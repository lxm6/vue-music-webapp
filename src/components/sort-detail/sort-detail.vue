<template>
    <div class="disc-list">
      <div class="back" @click="back">
        <mu-icon-button>
          <i class="icon-back"></i>
        </mu-icon-button>
      </div>
      <div class="small-title" ref="smallTitle" v-show="false">
        <h1 v-html="categoryName"></h1>
      </div>
      <div class="bg-image" :style="bgStyle" ref="bgImage">
        <div class="large-title" ref="largeTitle">
          <h1 v-html="categoryName"></h1>
        </div>

        <div class="filter" ref="filter"></div>
      </div>
      <div class="bg-layer" ref="layer"></div>
      <scroll
        @scroll="scroll"
        :listen-scroll="listenScroll"
        :probe-type="probeType"
        :data="discList"
        class="recommend-content"
        ref="discList"
      >
        <div v-show="discList.length">
          <div class="switches-wrapper">
            <switches @switch="switchItem" :switches="switches" :currentIndex="currentIndex"></switches>
          </div>
          <div class="recommend-list" ref="recommendList">
            <li
              @click="selectItem(item)"
              v-for="(item,index) in discList"
              :key="index"
              class="item"
            >
              <div class="ablum">
                <img v-lazy="item.imgurl" :key="item.imgurl">
                <div class="info">
                  <img src="~@/common/image/earphone.png">
                  <span>{{Math.round(item.listennum/1000)/10}}万</span>
                </div>
              </div>
              <div class="text">
                <p class="desc" v-html="item.dissname"></p>
                <h2 class="name" v-html="item.creator.name"></h2>
              </div>
            </li>
          </div>
        </div>
        <div v-show="showFlag" class="loading-container">
          <loading></loading>
        </div>
      </scroll>
      <router-view></router-view>
    </div>
</template>

<script>
import Loading from "base/loading/loading";
import Scroll from "base/scroll/scroll";
import Switches from "base/switches/switches";
import { ERR_OK } from "api/config";
import { getDiscList } from "api/recommend";
import { prefixStyle } from "common/js/dom";
import { playlistMixin } from "common/js/mixin";
import { mapMutations } from "vuex";
const RESERVED_HEIGHT = 45;
const transform = prefixStyle("transform");
const backdrop = prefixStyle("backdrop-filter");

export default {
  mixins: [playlistMixin],

  data() {
    return {
      discList: [],
      scrollY: 0,
      categoryName: this.$route.params.categoryName,
      categoryId: this.$route.params.categoryId,
      bgImage: "",
      currentIndex: 0,
      sortId: 2,
      showFlag: true,
      switches: [
        {
          name: "最新"
        },
        {
          name: "最热"
        }
      ]
    };
  },

  computed: {
    bgStyle() {
      return `background-image:url(${this.bgImage})`;
    }
  },
  created() {
    this._getDiscList();
    this.probeType = 3;
    this.listenScroll = true;
  },
  mounted() {
    // 顶部图片的高度
    this.imageHeight = this.$refs.bgImage.clientHeight;
    this.minTransalteY = -this.imageHeight + RESERVED_HEIGHT;
    this.$refs.discList.$el.style.top = `${this.imageHeight}px`;
  },
  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? "60px" : "";
      this.$refs.discList.$el.style.bottom = bottom;
      this.$refs.discList.refresh();
    },
    scroll(pos) {
      this.scrollY = pos.y;
    },
    back() {
      this.$router.back();
    },
    selectItem(item) {
      this.$router.push({
        path: `/sortDetail/${item.dissid}`
      });
      this.setDisc(item);
    },
    switchItem(index) {
      this.currentIndex = index;
      this.showFlag = true;
      this.sortId = this.currentIndex + 2;
      getDiscList(this.categoryId, this.sortId).then(res => {
        if (res.code === ERR_OK) {
          this.discList = res.data.list;
          this.showFlag = false;
        }
      });
    },
    _getDiscList() {
      if (!this.categoryId) {
        this.$router.push("/sort");
        return;
      }
      getDiscList(this.categoryId, this.sortId).then(res => {
        if (res.code === ERR_OK) {
          this.discList = res.data.list;
          this.bgImage = this.discList[0].imgurl;
          this.showFlag = false;
        }
      });
    },
    ...mapMutations({
      setDisc: "SET_DISC"
    })
  },
  watch: {
    scrollY(newVal) {
      let translateY = Math.max(this.minTransalteY, newVal);
      let scale = 1;
      let zIndex = 0;
      let blur = 0;
      const percent = Math.abs(newVal / this.imageHeight);

      if (newVal > 0) {
        scale = 1 + percent;
        zIndex = 10;
      } else {
        blur = Math.min(20, percent * 20);
      }

      this.$refs.layer.style[transform] = `translate3d(0,${translateY}px,0)`;
      this.$refs.filter.style[backdrop] = `blur(${blur}px)`;

      if (newVal < this.minTransalteY) {
        zIndex = 10;
        this.$refs.bgImage.style.paddingTop = 0;
        this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`;
        this.$refs.largeTitle.style.display = "none";
        this.$refs.smallTitle.style.display = "";
      } else {
        this.$refs.bgImage.style.paddingTop = "190px";
        this.$refs.bgImage.style.height = 0;
        this.$refs.largeTitle.style.display = "";
        this.$refs.smallTitle.style.display = "none";
      }
      this.$refs.bgImage.style[transform] = `scale(${scale})`;
      this.$refs.bgImage.style.zIndex = zIndex;
    }
  },

  components: {
    Scroll,
    Loading,
    Switches
  }
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.disc-list {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: $color-background;

  .large-title, .small-title {
    position: absolute;
    left: 10%;
    z-index: 40;
    width: 80%;
    text-align: center;
    color: #fff;
    top: 80px;
    font-weight: bold;
    line-height: 40px;
    font-size: 36px;
    letter-spacing: 10px;
  }

  .small-title {
    top: 4px;
    line-height: 40px;
    font-size: 18px;
    letter-spacing: 0;
  }

  .bg-image {
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 190px;
    transform-origin: top;
    background-size: cover;

    .filter {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(7, 17, 27, 0.4);
    }
  }

  .bg-layer {
    position: relative;
    height: 100%;
  }

  .recommend-content {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    background: $color-background;

    .switches-wrapper {
      background: $color-background;
      padding-top: 10px;

      .switches {
        width: 148px;
        border-radius: 0;
      }
    }

    .recommend-list {
      background: $color-background;
      padding: 15px;
      z-index: 100;

      .ablum {
        position: relative;

        img {
          width: 100%;
          height: 100%;
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

          img {
            width: 12px;
            height: 12px;
            display: inline-block;
            margin-right: 3px;
          }
        }
      }

      .item {
        width: 48%;
        cursor: pointer;
        margin-bottom: 10px;
        display: inline-block;

        &:nth-child(odd) {
          margin-right: 12px;
        }

        .text {
          overflow: hidden;
          font-size: $font-size-small;

          .name {
            color: $color-text-l;
          }

          .desc {
            color: $color-text;
            height: 36px;
            line-height: 15px;
            margin-top: 5px;
          }
        }
      }
    }
  }

  .loading-container {
    background: $color-background;
    position: absolute;
    width: 100%;
    top: 50%;
    height: 100%;
    transform: translateY(-50%);

    .loading {
      margin-top: 50%;
    }
  }
}
</style>