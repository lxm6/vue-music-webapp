<template>
  <div class="music-list">
    <div class="back" @click="back">
      <mu-icon-button icon="arrow_back"/>
    </div>
    <div class="title">
      <h1 v-text="title"></h1>
      <p v-show="rank" v-text="updateTime" ref="updateTime"></p>
    </div>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-wrapper" v-show="songs.length>0" ref="wrapperBtn">
        <div ref="playBtn" class="play" @click="random">
          <i class="icon-play"></i>
          <span class="text">全部播放</span>
        </div>
        <div ref="favorBtn" v-show="isDisc" @click="toggleFavorite" class="favor">
          <i :class="isFavorite?'icon-favorite':'icon-not-favorite'"></i>
          <span class="text" v-text="isFavorite?'取消收藏':'收藏歌单'"></span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <div class="backTop" v-show="showBackTop" @click="backTop">
      <mu-float-button icon="keyboard_arrow_up" class="demo-float-button"/>
    </div>

    <scroll
      @scroll="scroll"
      :listen-scroll="listenScroll"
      :probe-type="probeType"
      :data="songs"
      class="list"
      ref="list"
    >
      <div class="song-list-wrapper" v-show="songs.length">
        <ul class="tab" v-show="!rank">
          <li class="tab-item active">歌曲 {{ songs.length}}首</li>
        </ul>
        <ul class="tab" v-show="rank">
          <li
            v-for="(item,index) in items"
            class="tab-item"
            :class="{'active':currentIndex === index}"
            @click="currentIndex=index"
            :key="index"
            v-text="item.name"
          ></li>
        </ul>
        <div class="content" v-if="currentIndex===1&&rank" v-text="info"></div>
        <song-list :rank="rank" :songs="songs" @select="selectItem" @showMenu="showMenu" v-if="currentIndex===0"></song-list>
      </div>
      <div v-show="!songs.length" class="loading-container">
        <loading></loading>
      </div>
    </scroll>
    <top-tip ref="topTip">
      <div class="tip-title">
        <span class="text">付费歌曲不能播放</span>
      </div>
    </top-tip>
    <menuBar :item=item :isSinger="isSinger"></menuBar>

  </div>
</template>

<script>
import Scroll from "base/scroll/scroll";
import Loading from "base/loading/loading";
import SongList from "base/song-list/song-list";
import { prefixStyle } from "common/js/dom";
import { mapActions,mapGetters,mapMutations } from "vuex";
import { playlistMixin } from "common/js/mixin";
import TopTip from "base/top-tip/top-tip";
import MenuBar from "components/menuBar/menuBar";

const RESERVED_HEIGHT = 50;
const transform = prefixStyle("transform");
const backdrop = prefixStyle("backdrop-filter");

export default {
  mixins: [playlistMixin],
  props: {
    bgImage: {
      type: String,
      default: ""
    },
    songs: {
      type: Array,
      default: []
    },
    title: {
      type: String,
      default: ""
    },
    updateTime: {
      type: String,
      default: ""
    },
    info: {
      type: String,
      default: ""
    },
    rank: {
      type: Boolean,
      default: false
    },
    isDisc: {
      type: Boolean,
      default: false
    },
      isSinger: {
      type: Boolean,
      default: false
    },
    isFavorite: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      scrollY: 0,
      showBackTop: false,
      currentIndex: 0,
      items: [{ name: "歌曲" }, { name: "详情" }],
      item:{},

    };
  },
  computed: {
    bgStyle() {
      return `background-image:url(${this.bgImage})`;
    },
    ...mapGetters(["menuBarVisible"])
    
  },
  created() {
    this.probeType = 3;
    this.listenScroll = true;
  },
  mounted() {
    // 顶部图片的高度
    this.imageHeight = this.$refs.bgImage.clientHeight;
    this.minTransalteY = -this.imageHeight + RESERVED_HEIGHT;
    this.$refs.list.$el.style.top = `${this.imageHeight}px`;
  },
  methods: {
    ...mapMutations({
      setMenuBarVisible: "SET_MENUBAR_VISIBLE"

    }),
    showMenu(item){
      this.item=item;
      this.setMenuBarVisible(true);
    },
    backTop() {
      this.$refs.list.scrollTo(0, 0, 500);
    },
    show() {
      this.showFlag = true;
    },
    hide() {
      this.showFlag = false;
    },
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? "60px" : "";
      this.$refs.list.$el.style.bottom = bottom;
      this.$refs.list.refresh();
    },

    scroll(pos) {
      this.scrollY = pos.y;
    },
    back() {
      this.$router.back();
    },

    selectItem(item, index) {
      // if (item.isPay) {
      //   this.$refs.topTip.show();
      //   return;
      // }
      this.selectPlay({
        list: this.songs,
        index
      });
    },
    random() {
      //随机播放
      // this.randomPlay({
      //   list: this.songs
      // });

      //顺序播放全部
      this.selectItem(0, 0);
    },
    toggleFavorite() {
      this.$emit("favoriteChange");
    },
    ...mapActions(["selectPlay", "randomPlay"])
  },
  watch: {
    scrollY(newVal) {
      let translateY = Math.max(this.minTransalteY, newVal);
      let scale = 1;
      let zIndex = 0;
      let blur = 0;
      const percent = Math.abs(newVal / this.imageHeight);
      if (newVal < -1000) {
        this.showBackTop = true;
      } else {
        this.showBackTop = false;
      }
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
        this.$refs.wrapperBtn.style.display = "none";
        this.$refs.updateTime.style.display = "none";
      } else {
        this.$refs.bgImage.style.paddingTop = "200px";
        this.$refs.bgImage.style.height = 0;
        this.$refs.wrapperBtn.style.display = "";
        this.$refs.updateTime.style.display = "";
      }
      this.$refs.bgImage.style[transform] = `scale(${scale})`;
      this.$refs.bgImage.style.zIndex = zIndex;
    }
  },
  components: {
    Scroll,
    Loading,
    SongList,
    TopTip,
    MenuBar,

  }
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.music-list {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: $color-background;

  .title {
    position: absolute;
    top: 8px;
    left: 10%;
    z-index: 40;
    width: 80%;
    text-align: center;
    line-height: 40px;
    font-size: $font-size-large;
    color: #fff;

    h1 {
      no-wrap();
    }

    p {
      font-size: $font-size-medium;
      color: #f4f4f4;
    }
  }

  .bg-image {
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 200px;
    transform-origin: top;
    background-size: cover;

    .play-wrapper {
      position: absolute;
      bottom: 30px;
      z-index: 50;
      width: 100%;
      display: flex;
      justify-content: center;

      .favor, .play {
        box-sizing: border-box;
        width: 120px;
        padding: 10px 0;
        margin: 0 auto;
        text-align: center;
        border: 1px solid $color-theme;
        color: $color-theme;
        border-radius: 100px;
        background-color: rgba(0, 0, 0, 0.1);
        font-size: 0;
        cursor pointer;

        &:active {
          background-color: rgba(0, 0, 0, 0.3);
        }

        .icon-play, .icon-favorite, .icon-not-favorite {
          display: inline-block;
          vertical-align: middle;
          margin-right: 6px;
          font-size: $font-size-medium-x;
        }

        .text {
          display: inline-block;
          vertical-align: middle;
          font-size: $font-size-small;
        }
      }
    }

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
    background: #fff;
  }

  .tab {
    display: flex;
    height: 42px;
    line-height: 42px;
    font-size: $font-size-medium-x;
    color: #000;
    background: #fff;

    .tab-item {
      flex: 1;
      text-align: center;

      &.active {
        color: $color-theme;
        border-bottom: 3px solid $color-theme;
      }
    }
  }

  .list {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    background: #fff;

    .content {
      line-height: 25px;
      padding: 10px 24px;
      color: $color-text-ll;
      font-size: $font-size-medium;
    }

    .loading-container {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }

  .backTop {
    z-index: 300;
    position: absolute;
    bottom: 80px;
    right: 30px;

    .mu-float-button {
      background-color: #fff;
      width: 50px;
      height: 50px;
      color: $color-theme;
    }
  }

  .tip-title {
    text-align: center;
    padding: 18px 0;
    font-size: 0;

    .text {
      font-size: $font-size-medium-x;
      color: #fff;
    }
  }
}
</style>