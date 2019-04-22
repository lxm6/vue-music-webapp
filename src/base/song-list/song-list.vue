<template>
  <div class="song-list">
    <mu-list>
      <mu-list-item
        v-for="(item,index) in songs"
        :key="index"
        class="listitem"
        :class="{'current-play-b':getCurrent(item)}"
        @click="selectSong(item,index)"
      >
          <div class="rank" v-show="rank" >
            <span :class="getRankCls(index)" v-text="getRankText(index)"></span>
          </div>
          <div class="content">
            <h2 class="name" :class="{'current-play':getCurrent(item)}">{{item.name}}</h2>
            <p class="desc" :class="{'current-play':getCurrent(item)}">
              <span class="vip" v-if="item.isPay">VIP</span>
              <span class="hq">HQ</span>
              <span>{{getDesc(item)}}</span>
            </p>
          </div>
      </mu-list-item>
    </mu-list>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";

export default {
  props: {
    songs: {
      type: Array,
      default: []
    },
    rank: {
      type: Boolean,
      default: false
    }
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
      return `${song.singerName} · ${song.album}`;
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
    }
  }
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">

@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.song-list {
  // padding-top: 8px;

  .listitem {
    box-sizing: border-box;
    border-left: 5px solid #fff;


    .rank {
      float left;
      width: 54px;
      height 63px;
      margin: 10px 15 0 10px;
      text-align: center;
      line-height 78px;

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
      line-height: 20px;
      overflow: hidden;
      margin-left 20px;
      padding 10px 10px  2px 0;
      border-bottom: 1px solid $color-border;


      .name {
        no-wrap();
        font-size: $font-size-medium-x;
        color: $color-text;
        display: inline-block;
        width: 98%;
      }

      .desc {
        display: inline-block;
        font-size: $font-size-small;
        no-wrap();
        color: $color-text-l;
        width: 98%;

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
  }

  .current-play-b {
    border-left: 5px solid $color-theme;
  }
}
</style>