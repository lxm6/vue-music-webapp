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
        <div class="rank" v-show="rank">
          <span :class="getRankCls(index)" v-text="getRankText(index)"></span>
        </div>
        <div class="content">
          <h2 class="name" :class="{'current-play':getCurrent(item)}">{{item.name}}</h2>
          <p class="desc" :class="{'current-play':getCurrent(item)}">
            <span class="vip" v-if="item.isPay">VIP</span>
            <span class="only" v-if="item.isOnly">独家</span>
            <span class="mv" v-if="item.vid!=''">MV</span>
            <span class="singername">{{getDesc(item)}}</span>
          </p>
        </div>
        <div @click.stop="playMV(item)" class="mv-icon" slot="right">
          <mu-icon-button icon="more_vert"/>
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
    playMV(item) {
      this.$router.push({
        path: `${this.$route.path}/${item.vid}`
      });
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
  .listitem {
    box-sizing: border-box;
    border-left: 5px solid #fff;

    .rank {
      float: left;
      width: 54px;
      height: 63px;
      margin: 10px 15 0 10px;
      text-align: center;
      line-height: 78px;

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
      margin-left: 20px;
      padding: 10px 10px 2px 0;
      border-bottom: 1px solid $color-border;

      .name {
        no-wrap();
        font-size: $font-size-medium-x;
        color: $color-text;
        display: inline-block;
      }

      .desc {
        display: inline-block;
        font-size: $font-size-small;
        no-wrap();
        color: $color-text-l;
        width: 98%;
      }

      .only, .mv,.vip {
        font-size: 8px;
        padding: 2px 2px;
        color: $color-theme;
        border: 1px solid $color-theme;
        border-radius: 3px;
        margin-right: 1px;
      }
      .vip {
        padding: 2px 3px 2px 3px;
        color: $color-theme;
        border: 1px solid $color-theme;
      }
      .mv {
        padding: 2px 3px 2px 3px;
        color: orange;
        border: 1px solid orange;
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

.mv-icon {
  margin-right: 6px;
  color: rgba(0, 0, 0, 0.2);
}

.material-icons {
  font-size: 24px;
}
</style>