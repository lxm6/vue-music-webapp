<template>
  <div class="player" v-show="playlist.length>0">
    <transition
      name="normal"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave"
    >
      <div class="normal-player" v-show="fullScreen">
        <div class="background" ref="bg">
          <img width="100%" height="100%" :src="currentSong.image">
        </div>

        <div class="top">
          <div class="back" @click="back">
            <mu-icon-button icon="arrow_back" slot="left"/>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singerName"></h2>
          <div class="download" @click="download">
            <mu-icon-button icon="file_download" slot="right"/>
          </div>
        </div>

        <div
          class="middle"
          @touchstart.prevent="middleTouchStart"
          @touchmove.prevent="middleTouchMove"
          @touchend="middleTouchEnd"
          @click.stop="toggleShow"
        >
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="triger" :class="trCls">
                <img src="./triger.png">
              </div>
              <div class="cd" :class="cdCls">
                <img class="albumImg" :src="currentSong.image">
                <img class="cdImg" src="./cd.png">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{playingLyric}}</div>
            </div>
          </div>
          <scroll
            class="middle-r"
            ref="lyricList"
            :data="currentLyric && currentLyric.lines"
            :scrollbar="false"
          >
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p
                  ref="lyricLine"
                  class="text"
                  :style="{fontSize:defaultFontSize + 'px'}"
                  :class="[currentLineNum ===index?defaultColor:'']"
                  v-for="(line,index) in currentLyric.lines"
                  :key="index"
                >{{line.txt}}</p>
              </div>
              <div class="pure-music" :style="{fontSize:defaultFontSize + 'px'}" v-if="isPure">
                <p>此歌曲没有歌词</p>
              </div>
              <div class="blank"></div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <ul class="operator-wrapper">
            <li class="favorite">
              <i
                @click="toggleFavorite(currentSong)"
                class="icon"
                :class="getFavoriteIcon(currentSong)"
              ></i>
            </li>
            <li class="dot-wrapper">
              <span class="dot" :class="{'active':currentShow==='cd' }" @click.stop="toggleShow"></span>
              <span class="dot" :class="{'active':currentShow==='lyric'}" @click.stop="toggleShow"></span>
            </li>
            <li class="setLyric" @click="showLyricset">
              <img src="./Aa.png" width="24" height="24">
            </li>
            <li class="setBlur" @click="showSeekBar">
              <img src="./Aa.png" width="24" height="24">
            </li>
          </ul>

          <div class="progress-wrapper">
            <span class="time time-l">{{format(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar
                ref="progressBar"
                :percent="percent"
                @percentChange="onProgressBarChange"
                @percentChanging="onProgressBarChanging"
              ></progress-bar>
            </div>
            <span class="time time-r">{{format(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left" @click="changeMode">
              <i :class="iconMode"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i @click="prev" class="icon-prev"></i>
            </div>
            <div class="icon i-center" :class="disableCls">
              <i @click="togglePlaying" :class="playIcon"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i @click="next" class="icon-next"></i>
            </div>
            <div class="icon i-right" @click.stop="showPlaylist">
              <i class="icon-playlist"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon">
          <img :class="cdCls" width="40" height="40" :src="currentSong.image">
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="this.playing&&playingLyric?playingLyric:currentSong.singerName"></p>
        </div>
        <div class="control">
          <progress-circle :radius="radius" :percent="percent">
            <i @click.stop="togglePlaying" class="icon-mini" :class="miniIcon"></i>
          </progress-circle>
        </div>
        <div class="control" @click.stop="showPlaylist">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <playlist ref="playlist"></playlist>
    <lyricset
      ref="lyricset"
      :defaultFontSize="defaultFontSize"
      :defaultColor="defaultColor"
      :theme="theme"
      @setFontSize="setFontSize"
      @setColor="setColor"
    ></lyricset>
    <seekbar
      ref="seekBar"
      :seekBarPercent="seekBarPercent"
      @percentChange="onSeekBarChange"
      @percentChanging="onSeekBarChanging"
    ></seekbar>
    <audio
      ref="audio"
      :src="currentSong.url"
      @canplay="ready"
      @error="error"
      @timeupdate="updateTime"
      @ended="end"
    ></audio>
    <top-tip ref="topTip">
      <div class="tip-title">
        <span class="text">{{msg}}</span>
      </div>
    </top-tip>
    <toast :title="title" ref="toast1">
      <div class="content">
        <i class="icon-ok"></i>
        <p class="desc">{{title}}</p>
      </div>
    </toast>
    <toast :title="title" ref="toast2">
      <div class="content">
        <p class="desc">{{title}}</p>
      </div>
    </toast>
  </div>
</template>
<script>
import animations from "create-keyframe-animation";
import { prefixStyle } from "common/js/dom";
import { mapGetters, mapMutations, mapActions } from "vuex";
import ProgressBar from "base/progress-bar/progress-bar";
import Seekbar from "base/seekbar/seekbar";
import ProgressCircle from "base/progress-circle/progress-circle";
import { playMode } from "common/js/config";
import { shuffle, downloadSong } from "common/js/util";
import Lyric from "lyric-parser";
import Scroll from "base/scroll/scroll";
import Playlist from "components/playlist/playlist";
import Lyricset from "components/lyricset/lyricset";
import TopTip from "base/top-tip/top-tip";
import Toast from "base/toast/toast";
import { playerMixin } from "common/js/mixin";
import {
  saveFontsize,
  loadFontsize,
  saveColor,
  loadColor,
  loadBlur
} from "common/js/cache";
const transform = prefixStyle("transform");
const transitionDuration = prefixStyle("transitionDuration");
let nextFlag = true;
export default {
  mixins: [playerMixin],
  data() {
    return {
      title: "",
      songReady: false,
      currentTime: 0,
      // 环形进度条大小
      radius: 36,
      currentLyric: null,
      // 当前歌词所在行,用来高亮
      currentLineNum: 0,
      // 唱片碟界面与歌词界面
      currentShow: "cd",
      // playingLyric: 唱碟下面显示的一行歌词
      playingLyric: "",
      currentSongUrl: "",
      msg: "",
      isPure: false,
      seekBarPercent: 50,
      defaultFontSize: loadFontsize(),
      defaultColor: loadColor(),
      theme: {
        fontSizeList: [
          { fontSize: 14 },
          { fontSize: 16 },
          { fontSize: 18 },
          { fontSize: 20 },
          { fontSize: 22 }
        ],
        colorList: [
          { name: "green", color: "#31c27c" },
          { name: "blue", color: "#50baf8" },
          { name: "yellow", color: "#f1f13d" },
          { name: "pink", color: "#fa7fbd" },
          { name: "red", color: "#f96666" }
        ]
      }
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.loadBlur();
    });
  },
  computed: {
    cdCls() {
      return this.playing ? "play" : "play pause";
    },
    trCls() {
      return this.playing ? "triger" : "triger pause";
    },
    playIcon() {
      return this.playing ? "icon-pause" : "icon-play";
    },
    miniIcon() {
      return this.playing ? "icon-pause-mini" : "icon-play-mini";
    },
    iconMode() {
      return this.mode === playMode.sequence
        ? "icon-sequence"
        : this.mode === playMode.loop
        ? "icon-loop"
        : "icon-random";
    },
    disableCls() {
      return this.songReady ? "" : "disable";
    },

    // 进度条播放的比例
    percent() {
      return this.currentTime / this.currentSong.duration;
    },
    // 传入 vuex 的 state
    ...mapGetters(["fullScreen", "playing", "currentIndex"])
  },
  created() {
    this.touch = {};
  },
  methods: {
    loadBlur() {
      this.$refs.bg.style.filter = `blur(${loadBlur()}px)`;
    },
    toggleShow() {
      if (this.currentShow === "cd") {
        this.currentShow = "lyric";
        this.$refs.middleL.style.opacity = 0;
        this.$refs.lyricList.$el.style[
          transform
        ] = `translate3d(${-window.innerWidth}px,0,0)`;
        this.$refs.lyricList.$el.style[transitionDuration] = 0;
        this.$refs.middleL.style[transitionDuration] = 0;
      } else {
        this.currentShow = "cd";
        this.$refs.middleL.style.opacity = 1;
        this.$refs.lyricList.$el.style[transform] = `translate3d(0,0,0)`;
        this.$refs.lyricList.$el.style[transitionDuration] = 0;
        this.$refs.middleL.style[transitionDuration] = 0;
      }
    },
    setFontSize(fontSize) {
      this.defaultFontSize = fontSize;
      saveFontsize(fontSize);
    },
    setColor(color) {
      this.defaultColor = color;
      saveColor(color);
    },
    show() {
      this.showFlag = true;
    },
    hide() {
      this.showFlag = false;
    },
    // 唱片界面缩小到底部
    back() {
      this.setFullScreen(false);
    },
    // 底部界面放大到唱片界面
    open() {
      this.setFullScreen(true);
    },
    // create-keyframe-animation
    enter(el, done) {
      const { x, y, scale } = this._getPosAndScale();
      let animation = {
        0: {
          transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0,0,0) scale(1.1)`
        },
        100: {
          transform: `translate3d(0,0,0) scale(1)`
        }
      };
      animations.registerAnimation({
        name: "move",
        animation,
        presets: {
          duration: 500,
          easing: "linear"
        }
      });
      animations.runAnimation(this.$refs.cdWrapper, "move", done);
    },
    afterEnter() {
      animations.unregisterAnimation("move");
      this.$refs.cdWrapper.style.animation = "";
    },
    leave(el, done) {
      const { x, y, scale } = this._getPosAndScale();
      this.$refs.cdWrapper.style.transition = "all 0.4s";
      this.$refs.cdWrapper.style[
        transform
      ] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
      // 监听事件
      this.$refs.cdWrapper.addEventListener("transitionend", done);
    },
    afterLeave() {
      this.$refs.cdWrapper.style.transition = "";
      this.$refs.cdWrapper.style[transform] = "";
    },
    togglePlaying() {
      if (!this.songReady) {
        return;
      }
      this.setPlayingState(!this.playing);
      // 当歌词滚动时才能播放,防止停止播放时歌词还在滚动
      if (this.currentLyric) {
        this.currentLyric.togglePlay();
      }
    },

    loop() {
      this.$refs.audio.currentTime = 0;
      this.$refs.audio.play();
      this.setPlayingState(true);
      // 进入循环播放时，歌曲一开始就要求歌词位于最开始
      if (this.currentLyric) {
        // 歌曲跳到最开始
        this.currentLyric.seek(0);
      }
    },
    next() {
      nextFlag = true;
      if (!this.songReady) {
        return;
      }
      //只有一首歌，单曲循环
      if (this.playlist.length === 1) {
        this.loop();
        return;
      } else {
        let index = this.currentIndex + 1;
        if (index === this.playlist.length) {
          index = 0;
        }
        this.setCurrentIndex(index);
        if (!this.playing) {
          this.togglePlaying();
        }
      }
      this.songReady = false;
    },
    prev() {
      nextFlag = false;
      if (!this.songReady) {
        return;
      }
      if (this.playlist.length === 1) {
        this.loop();
        return;
      } else {
        let index = this.currentIndex - 1;
        if (index === -1) {
          index = this.playlist.length - 1;
        }
        this.setCurrentIndex(index);
        if (!this.playing) {
          this.togglePlaying();
        }
      }
      this.songReady = false;
    },
    ready() {
      setTimeout(() => {
        this.songReady = true;
      }, 200);
      this.savePlayHistory(this.currentSong);
      if (this.currentLyric) {
        this.currentLyric.seek(this.currentTime * 1000);
      }
    },
    end() {
      if (this.mode === playMode.loop) {
        this.loop();
      } else {
        this.next();
      }
    },
    error() {
      if (this.currentLyric) {
        this.currentLyric.stop();
      }
      this.songReady = true;
    },
    onProgressBarChanging(percent) {
      this.currentTime = this.currentSong.duration * percent;
      if (this.currentLyric) {
        this.currentLyric.seek(this.currentTime * 1000);
      }
    },
    onProgressBarChange(percent) {
      const currentTime = this.currentSong.duration * percent;
      // 根据进度条传过来的播放进度更改播放时间
      this.currentTime = this.$refs.audio.currentTime = currentTime;
      if (this.currentLyric) {
        this.currentLyric.seek(currentTime * 1000);
      }
      if (!this.playing) {
        this.togglePlaying();
      }
    },
    onSeekBarChange(seekBarPercent) {
      this.$refs.bg.style.filter = `blur(${seekBarPercent}px)`;
    },
    onSeekBarChanging(seekBarPercent) {
      this.$refs.bg.style.filter = `blur(${seekBarPercent}px)`;
    },
    // 确保切换模式的时候，当前歌曲是不变的
    resetCurrentIndex(list) {
      // findIndex: es6
      let index = list.findIndex(item => {
        return item.id === this.currentSong.id;
      });
      // mutation: setCurrentIndex
      this.setCurrentIndex(index);
    },
    // 获取歌词
    getLyric() {
      this.currentSong
        .getLyric()
        .then(lyric => {
          if (this.currentSong.lyric !== lyric) {
            return;
          }
          // 解析歌词
          this.currentLyric = new Lyric(
            lyric.replace(/&apos;/g, "'"),
            this.handleLyric
          );
          if (!this.currentLyric.lines.length) {
            this.playingLyric = "此歌曲没有歌词";
            this.isPure = true;
          } else {
            this.isPure = false;
          }
          if (this.playing) {
            // 如果已经播放了歌曲，要切到对应位置
            this.currentLyric.seek(this.currentTime * 1000);
          }
        })
        .catch(() => {
          this.currentLyric = null;
          this.playingLyric = "";
          this.currentLineNum = 0;
        });
    },
    // handleLyric: 歌词改变的时候调用
    // lineNum: 当前歌词所在行,高亮
    // txt: 歌词文案
    handleLyric({ lineNum, txt }) {
      this.currentLineNum = lineNum;
      if (lineNum > 3) {
        // 保证高亮歌词在中间
        let lineEl = this.$refs.lyricLine[lineNum - 3];
        this.$refs.lyricList.scrollToElement(lineEl, 1000);
      } else {
        //滚动到顶部
        this.$refs.lyricList.scrollTo(0, 0, 1000);
      }
      this.playingLyric = txt;
    },
    showPlaylist() {
      this.$refs.playlist.show();
    },
    showLyricset() {
      this.$refs.lyricset.show();
    },
    showSeekBar() {
      this.$refs.seekBar.show();
    },
    // 点击唱片部分
    middleTouchStart(e) {
      // 触控标志位
      this.touch.initiated = true;
      // 用来判断是否是一次移动
      this.touch.moved = false;
      const touch = e.touches[0];
      this.touch.startX = touch.pageX;
      this.touch.startY = touch.pageY;
    },
    middleTouchMove(e) {
      if (!this.touch.initiated) {
        return;
      }
      const touch = e.touches[0];
      // 移动的位置
      const deltaX = touch.pageX - this.touch.startX;
      const deltaY = touch.pageY - this.touch.startY;
      // 是否发生横向滚动切换唱片界面和歌词界面，取决于横向滚动比纵向滚动多
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        return;
      }
      if (!this.touch.moved) {
        this.touch.moved = true;
      }
      // 歌词界面还是唱片界面，二选一
      const left = this.currentShow === "cd" ? 0 : -window.innerWidth;
      // 歌词露出的宽带, 左滑动取负值
      const offsetWidth = Math.min(
        0,
        Math.max(-window.innerWidth, left + deltaX)
      );
      this.touch.percent = Math.abs(offsetWidth / window.innerWidth);
      // lyricList: vue组件, $el来访问dom
      this.$refs.lyricList.$el.style[
        transform
      ] = `translate3d(${offsetWidth}px,0,0)`;
      this.$refs.lyricList.$el.style[transitionDuration] = 0;
      this.$refs.middleL.style.opacity = 1 - this.touch.percent;
      this.$refs.middleL.style[transitionDuration] = 0;
    },
    middleTouchEnd() {
      if (!this.touch.moved) {
        return;
      }
      let offsetWidth;
      let opacity;
      if (this.currentShow === "cd") {
        if (this.touch.percent > 0.1) {
          offsetWidth = -window.innerWidth;
          opacity = 0;
          this.currentShow = "lyric";
        } else {
          offsetWidth = 0;
          opacity = 1;
        }
      } else {
        if (this.touch.percent < 0.9) {
          offsetWidth = 0;
          this.currentShow = "cd";
          opacity = 1;
        } else {
          offsetWidth = -window.innerWidth;
          opacity = 0;
        }
      }
      const time = 300;
      this.$refs.lyricList.$el.style[
        transform
      ] = `translate3d(${offsetWidth}px,0,0)`;
      this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`;
      this.$refs.middleL.style.opacity = opacity;
      this.$refs.middleL.style[transitionDuration] = `${time}ms`;
      this.touch.initiated = false;
    },
    updateTime(e) {
      this.currentTime = e.target.currentTime; //时间戳
    },
    format(interval) {
      interval = interval | 0;
      const minute = (interval / 60) | 0;
      const second = this._pad(interval % 60);
      return `${minute}:${second}`;
    },
    // 用 0 补位(补 2 位)
    _pad(num, n = 2) {
      let len = num.toString().length;
      while (len < n) {
        num = "0" + num;
        len++;
      }
      return num;
    },
    _getPosAndScale() {
      // 缩小后的唱片圆图大小
      const targetWidth = 40;
      // 缩小后的唱片圆图paddingLeft
      const paddingLeft = 40;
      // 缩小后的唱片圆图paddingBottom
      const paddingBottom = 30;
      // 大唱片距离容器顶部paddingTop
      const paddingTop = 80;
      const width = window.innerWidth * 0.8;
      // 大唱片缩小到小唱片的比例
      const scale = targetWidth / width;
      // 目标点(x,y)位于大圆图的中间
      // 第四象限,小圆图x位置为负方向
      const x = -(window.innerWidth / 2 - paddingLeft);
      const y = window.innerHeight - paddingTop - width / 2 - paddingBottom;
      return {
        x,
        y,
        scale
      };
    },
    download() {
      downloadSong(this.currentSong.name, this.currentSong.url);
    },
    // 数据通过mutations设置到state上
    ...mapMutations({
      setFullScreen: "SET_FULL_SCREEN"
    }),
    ...mapActions(["savePlayHistory"])
  },
  watch: {
    // 监听,当currentSong变化时调用
    currentSong(newSong, oldSong) {
      if (!newSong || !newSong.id) {
        return;
      }
      if (newSong.id === oldSong.id) {
        return;
      }
      // // 如果是付费歌曲
      // if (newSong.isPay) {
      //   this.msg = "已跳过付费歌曲";
      //   this.$refs.topTip.show();
      //   this.songReady = true;
      //   if (nextFlag) {
      //     this.next();
      //   } else {
      //     this.prev();
      //   }
      //   return;
      // }

      // setTimeout: 解决DOM异常
      // $nextTick: 在下次DOM更新循环结束之后执行的延迟回调。在修改数据之后立即使用这个方法，获取更新后的DOM。
      // setTimeout: 保证手机从后台切到前台js执行能正常播放
      // newSong
      //   .getSongUrl()
      //   .then(url => {
      //     this.currentSongUrl = url;
      //     this.$refs.audio.src = this.currentSongUrl;
      //     this.$refs.audio.play();
      //   })
      //   .then(() => {
      //     this.getLyric();
      //   })
      //   .catch(err => {
      //     console.log(err);
      //     this.msg = "已跳过无法播放的歌曲";
      //     this.$refs.topTip.show();
      //     this.songReady = true;
      //     if (nextFlag) {
      //       this.next();
      //     } else {
      //       this.prev();
      //     }
      //   });
      // 初始化
      if (this.currentLyric) {
        this.currentLyric.stop();
        this.currentTime = 0;
        this.playingLyric = "";
        this.currentLineNum = 0;
      }
      this.$nextTick(() => {
        this.$refs.audio.play();
        this.getLyric();
      });
    },

    playing(newPlaying) {
      if (!this.songReady) {
        return;
      }
      this.$nextTick(() => {
        const audio = this.$refs.audio;
        newPlaying ? audio.play() : audio.pause();
      });
    },
    fullScreen(newVal) {
      if (newVal) {
        setTimeout(() => {
          this.$refs.lyricList.refresh();
        }, 20);
      }
    }
  },
  components: {
    ProgressBar,
    ProgressCircle,
    Scroll,
    Playlist,
    Lyricset,
    TopTip,
    Toast,
    Seekbar
  }
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.player {
  .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: #222;

    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.4;
      filter: blur(50px);
    }

    .top {
      position: relative;
      z-index: 100;
      margin-bottom: 5px;
      color: #fff;

      .title {
        width: 77%;
        margin: 4px auto 0 auto;
        line-height: 40px;
        text-align: center;
        no-wrap();
        font-size: $font-size-large;
      }

      .subtitle {
        margin: 0 auto;
        width: 78%;
        line-height: 18px;
        text-align: center;
        font-size: $font-size-medium;
      }

      .download {
        top: 0px;
        position: absolute;
        right: 0;
      }

      .setlyric {
        font-size: $font-size-large-xx;
        position: absolute;
        top: 11px;
        right: 18px;
      }
    }

    .line {
      margin: 10px auto 0 auto;
      height: 0.5px;
      background-color: $color-text-l;
      width: 70%;
    }

    .middle {
      position: fixed;
      width: 100%;
      top: 70px;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;
      overflow: hidden;

      .middle-l {
        vertical-align: center;
        position: relative;
        width: 100%;

        .cd-wrapper {
          img {
            width: 100%;
            height: 100%;
          }

          .triger {
            width: 70px;
            height: 110px;
            left: 50%;
            margin-left: -10px;
            top: -50px;
            position: absolute;
            z-index: 1;
            transform-origin: 18% 8%;
            transition: all 0.4s;

            &.play {
              animation-play-state: paused;
            }

            &.pause {
              transform: rotate(-30deg);
            }
          }

          .cd {
            width: 260px;
            height: 260px;
            box-sizing: border-box;
            position: relative;
            margin-left: -130px;
            left: 50%;
            margin-top: 35px;

            &.play {
              animation: rotate 20s linear infinite;
            }

            &.pause {
              animation-play-state: paused;
            }

            .cdImg {
              border-radius: 50%;
              position: absolute;
            }

            .albumImg {
              width: 240px;
              height: 240px;
              top: 50%;
              left: 50%;
              margin-left: -120px;
              margin-top: -120px;
              position: absolute;
              border-radius: 50%;
            }
          }
        }

        .playing-lyric-wrapper {
          width: 80%;
          margin: 20px auto 0 auto;
          overflow: hidden;
          text-align: center;

          .playing-lyric {
            white-space: normal;
            line-height: 20px;
            font-size: $font-size-medium-x;
            color: rgba(255, 255, 255, 0.5);
          }
        }
      }

      .middle-r {
        position: absolute;
        top: 10px;
        bottom: 10px;
        left: 100%;
        width: 100%;
        overflow: hidden;

        .lyric-wrapper {
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;

          .blank {
            padding-top: 10%;
          }

          .pure-music {
            padding-top: 150px;
            color: rgba(255, 255, 255, 0.5);
            font-size: $font-size-large;
          }

          .text {
            line-height: 24px;
            padding: 10px 0;
            white-space: normal;
            color: rgba(255, 255, 255, 0.5);
            font-size: $font-size-large;

            &.green {
              color: $color-theme;
            }

            &.yellow {
              color: $color-yellow;
            }

            &.blue {
              color: $color-blue;
            }

            &.red {
              color: $color-red;
            }

            &.pink {
              color: $color-pink;
            }
          }
        }
      }
    }

    .bottom {
      position: absolute;
      bottom: 25px;
      width: 100%;

      .dot-wrapper {
        text-align: center;
        font-size: 0;
        margin-bottom: 10px;

        .dot {
          display: inline-block;
          vertical-align: middle;
          margin: 0 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.5);

          &.active {
            width: 20px;
            border-radius: 5px;
            background: $color-background;
          }
        }
      }

      .operator-wrapper {
        padding: 0px 20%;
        text-align: center;
        display: flex;
        align-items: center;
        color: $color-background;

        li {
          flex: 1;
        }

        .favorite {
          font-size: $font-size-large-x;

          .icon-favorite {
            color: $color-sub-theme;
          }
        }
      }

      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0px auto;
        padding: 0px 0px 10px 0;

        .time {
          color: #fff;
          font-size: $font-size-small;
          flex: 0 0 30px;
          line-height: 30px;
          width: 30px;

          &.time-l {
            text-align: left;
          }

          &.time-r {
            text-align: right;
          }
        }

        .progress-bar-wrapper {
          flex: 1;
        }
      }

      .operators {
        display: flex;
        align-items: center;

        .icon {
          flex: 1;
          color: #f2f2f2;

          &.disable {
            color: rgba(255, 255, 255, 0.5);
          }

          i {
            font-size: 35px;
          }
        }

        .i-left {
          text-align: right;
        }

        .i-center {
          padding: 0 20px;
          text-align: center;

          i {
            font-size: 55px;
          }
        }

        .i-right {
          text-align: left;
        }
      }
    }

    &.normal-enter-active, &.normal-leave-active {
      transition: all 0.4s;

      .top, .bottom {
        transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
      }
    }

    &.normal-enter, &.normal-leave-to {
      opacity: 0;

      .top {
        transform: translate3d(0, -100px, 0);
      }

      .bottom {
        transform: translate3d(0, 100px, 0);
      }
    }
  }

  .mini-player {
    display: flex;
    align-items: center;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 180;
    width: 100%;
    height: 60px;
    background: #fff;
    box-shadow: 0 -2px 14px 2px rgba(0, 0, 0, 0.1);

    &.mini-enter-active, &.mini-leave-active {
      transition: all 0.4s;
    }

    &.mini-enter, &.mini-leave-to {
      transform: translate3d(0, 100%, 0);
    }

    .icon {
      flex: 0 0 40px;
      width: 44px;
      padding: 0 10px 0 14px;

      img {
        border-radius: 50%;
        border: 3px solid #ddd;

        &.play {
          animation: rotate 20s linear infinite;
        }

        &.pause {
          animation-play-state: paused;
        }
      }
    }

    .text {
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex: 1;
      line-height: 20px;
      overflow: hidden;
      font-size: $font-size-medium;
      margin-left: 20px;

      .name {
        margin-bottom: 2px;
        no-wrap();
        color: $color-text;
      }

      .desc {
        no-wrap();
        color: $color-text-l;
      }
    }

    .control {
      flex: 0 0 40px;
      width: 36px;
      margin-right: 6px;

      .icon-play-mini, .icon-pause-mini, .icon-playlist {
        font-size: 30px;
        color: $color-theme;
      }

      .icon-mini {
        font-size: 36px;
        position: absolute;
        left: 0;
        top: 0;
      }
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

.content {
  width: 140px;
  padding: 10px 0;
  margin: 0 auto;
  text-align: center;
  background-color: #000;
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

@keyframes rotate {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>