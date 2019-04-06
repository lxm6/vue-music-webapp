<template>
  <div class="song-list">
    <ul>
      <li
        v-for="(item,index) in songs"
        :key="index"
        class="item"
        :class="{'current-play-b':getCurrent(item)}"
        @click="selectSong(item,index)"
      >
        <div class="rank" v-show="rank">
          <span :class="getRankCls(index)" v-text="getRankText(index)"></span>
        </div>
        <div class="content">
          <h2 class="name" :class="{'current-play':getCurrent(item)}">{{item.name}}</h2>
          <p class="desc" :class="{'current-play':getCurrent(item)}">
            <span class="vip" v-if="item.isPay">VIP</span>
            <span class="hq">HQ</span>
            <span>{{getDesc(item)}}</span>
          </p>
          <div @click.stop="deletePlay(item)" class="delete" v-if="isPlayHistory">
            <i class="icon-delete"></i>
          </div>
          <div @click.stop="deleteFavorite(item)" class="delete" v-if="isFavorite">
            <i class="icon-delete"></i>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters,mapActions } from "vuex";
export default {
  props: {
    songs: {
      type: Array,
      default: []
    },
    rank: {
      type: Boolean,
      default: false
    },
    isFavorite:Boolean,
    isPlayHistory:Boolean
  },
  computed: {
    ...mapGetters(["currentSong"])
  },
  methods: {
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
    getDesc(song) {
      return `${song.singer} · ${song.album}`;
    },
    selectSong(item, index) {
      this.$emit("select", item, index);
    },
    getRankCls(index) {
      if (index <= 2) {
        return `icon icon${index}`;
      } else {
        return "text";
      }
    },

    getRankText(index) {
      if (index > 2) {
        return index + 1;
      }
    },
     deletePlay(item) {
      this.deletePlayHistory(item);
    },
    deleteFavorite(item) {
      this.deleteFavoriteList(item);
    },
    ...mapActions(["deletePlayHistory","deleteFavoriteList"])
  }
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.song-list {

  .item {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    padding: 0px 0px 0px 25px;
    border-left: 5px solid #fff;

    .rank {
      flex: 0 0 25px;
      width: 25px;
      margin-right: 20px;
      text-align: center;

      .icon {
        display: inline-block;
        width: 25px;
        height: 24px;
        background-size: 25px 24px;

        &.icon0 {
          bg-image('first');
        }

        &.icon1 {
          bg-image('second');
        }

        &.icon2 {
          bg-image('third');
        }
      }

      .text {
        color: $color-theme;
        font-size: $font-size-large;
      }
    }

    .content {
      flex: 1;
      line-height: 20px;
      overflow: hidden;
      border-bottom: 1px solid $color-border;
      padding: 8px 0px 0px 0;

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
      padding: 0 3px;
      float: right;
      right: 15px;
      extend-click();
      font-size: $font-size-medium;
      color: rgba(0, 0, 0, 0.3);
    }
  }

  .current-play-b {
    border-left: 5px solid $color-theme;
  }
}
</style>