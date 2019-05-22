<template>
  <transition name="list-fade">
    <div class="menuBar" @click.stop="hide" v-show="menuBarVisible">
      <div class="list-wrapper">
        <ul v-show="!isDisc">
          <li @click.stop="nextPlay" v-show="playlist.length>0">
            <i>
              <mu-icon-button icon="skip_next"/>
            </i>
            <p >下一首播放</p>
          </li>
          <li @click.stop="toggleLike" v-show="!isSavelist">
            <i>
              <mu-icon-button icon="favorite" v-show="getFavorite(item)"/>
              <mu-icon-button icon='favorite_border' v-show="!getFavorite(item)"/>
            </i>
            <p >{{getFavorite(item)?'取消喜欢':'我喜欢'}}</p>
          </li>
          <li @click.stop="playMV" v-show="item.vid">
            <i>
              <mu-icon-button icon="ondemand_video"/>
            </i>
            <p>播放视频</p>
          </li>
          <li @click.stop="findSinger" v-show="!isSinger">
            <i>
              <mu-icon-button icon="person"/>
            </i>
            <p>查看歌手</p>
          </li>

          <li @click.stop="deleteOne" v-if="isSavelist">
            <i>
              <mu-icon-button icon="delete"/>
            </i>
            <p>删除</p>
          </li>
          <li @click.stop="download">
            <i>
              <mu-icon-button icon="file_download"/>
            </i>
            <p>下载</p>
          </li>
        </ul>
        <ul v-if="isDisc">
          <li @click.stop="deleteDisc">
            <i>
              <mu-icon-button icon="delete"/>
            </i>
            <p>删除</p>
          </li>
        </ul>
        <mu-flat-button @click.stop="hide" label="取消" class="demo-flat-button"/>
      </div>
        <toast :title="title" ref="toast1">
        <div class="content">
          <i class="icon-ok"></i>
          <p class="desc">{{title}}</p>
        </div>
      </toast>
    </div>
  </transition>
</template>
<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import { downloadSong } from "common/js/util";
import Singer from "common/js/singer";
import { playerMixin } from "common/js/mixin";
import Toast from "base/toast/toast";
import Song from "common/js/song";

export default {
  mixins: [playerMixin],
  data() {
    return {
      title: ""
      
    }
  },

  props: {
    isDisc: {
      type: Boolean,
      default: false
    },
    item: {
      type: Object
    },
    isSinger: {
      type: Boolean,
      default: false
    },
    isSavelist: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters(["menuBarVisible","playlist"])
  },
  methods: {
    show() {
      this.setMenuBarVisible(true);
    },
    hide() {
      this.setMenuBarVisible(false);

    },
    findSinger() {
      this.hide();
      const singer = new Singer({
        id: this.item.singerMid,
        name: this.item.singerName
      });
      this.$router.push({
        path: `${this.$route.path}/${singer.id}`
      });
      this.setSinger(singer);
    },
    deleteOne() {
      this.hide();
      this.$emit("deleteOne");
    },
    download() {
      this.hide();
      downloadSong(this.item.name, this.item.url);
    },
    deleteDisc() {
      this.hide();
      this.$emit("deleteDisc");
    },
    playMV() {
      this.hide();
      this.selectMV(this.item.vid);
    },
    toggleLike() {
      this.toggleFavorite(this.item);
      setTimeout(() => {
      this.hide();
      }, 700);
    },
    nextPlay() {
      this.title="已加入到下一首播放"
      this.$refs.toast1.show();
      this.insertSong([new Song(this.item), true]);
      setTimeout(() => {
      this.hide();
      }, 700);

    },
    ...mapMutations({
      setMenuBarVisible: "SET_MENUBAR_VISIBLE",
      setSinger: "SET_SINGER",
    }),
    ...mapActions(["selectMV","insertSong"]),

  },

  components:{
    Toast
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.menuBar {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 300;
  background-color: rgba(0, 0, 0, 0.3);

  .list-wrapper {
    ul {
      width: 100%;
      height: 120px;
      padding: 8px;

      li {
        color: $color-text-ll;
        float: left;
        text-align: center;
        margin-left: 12px;
        margin-top: 10px;

        i {
          display: inline-block;
          border-radius: 8px;
          font-size: $font-size-large;
          margin-bottom: 10px;
          background: #eee;
          color: #666;
        }

        p {
          font-size: $font-size-medium;
        }
      }
    }

    .demo-flat-button {
      width: 100%;
      background: $color-theme;
      font-size: $font-size-medium-x;
      color: #fff;
      height: 50px;
    }
  }

  &.list-fade-enter-active, &.list-fade-leave-active {
    transition: opacity 0.3s;

    .list-wrapper {
      transition: all 0.3s;
    }
  }

  &.list-fade-enter, &.list-fade-leave-to {
    opacity: 0;

    .list-wrapper {
      transform: translate3d(0, 100%, 0);
    }
  }

  &.list-fade-enter, .list-wrapper {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    background-color: #fff;
  }
}
  .content {
    width: 140px;
    padding: 10px 0;
    margin: 0 auto;
    text-align: center;
    background-color #000;
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
</style>