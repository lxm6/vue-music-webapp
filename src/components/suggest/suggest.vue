<template>
  <scroll
    class="suggest"
    :data="result"
    :pullup="pullup"
    @scrollToEnd="searchMore"
    ref="suggest"
    :beforeScroll="beforeScroll"
    @beforeScroll="listScroll"
  >
    <ul class="suggest-list">
      <mu-list-item
        @click="selectItem(item)"
        class="suggest-item"
        v-for="item in result"
        :key="item.docid"
      >
        <mu-avatar :src="getAvatar(item.singerMID)" slot="leftAvatar" v-if="item.singerMID"/>
        <!-- <img :src="getAvatar(item.singermid)" class="avatar" v-if="item.singermid"> -->
        <div class="name" slot="title">
          <p class="text" v-text="getDisplayName(item)"></p>
          <p class="subtext" v-show="getDesc(item)">
            <span class="vip" v-if="item.isPay">VIP</span>
            <span class="only" v-if="item.isOnly">独家</span>
            <span class="mv" v-if="item.vid!=''">MV</span>
            <span v-text="getDesc(item)"></span>
          </p>
          <p
            class="subtext"
            v-if="item.singerMID"
          >单曲:{{item.songNum}}&nbsp;&nbsp;专辑:{{item.albumNum}}&nbsp;&nbsp;MV:{{item.mvNum}}</p>
        </div>
      </mu-list-item>
      <loading2 v-show="hasMore"></loading2>
      <div class="tip" v-show="!hasMore && result.length">没有更多数据了</div>
    </ul>
    <div class="no-result-wrapper" v-show="!hasMore && !result.length">
      <no-result title="抱歉，暂无搜索结果"></no-result>
    </div>
    <top-tip ref="topTip">
      <div class="tip-title">
        <span class="text">付费歌曲不能播放</span>
      </div>
    </top-tip>
  </scroll>
</template>

<script>
import Scroll from "base/scroll/scroll";
import Loading2 from "base/loading/loading2";
import NoResult from "base/no-result/no-result";
import { search } from "api/search";
import { ERR_OK } from "api/config";
import { createSearchSong } from "common/js/song";
import { mapMutations, mapActions } from "vuex";
import Singer from "common/js/singer";
import TopTip from "base/top-tip/top-tip";
const TYPE_SINGER = "singer";
const perpage = 15;
let pagenum;
export default {
  props: {
    showSinger: {
      type: Boolean,
      default: true
    },
    query: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      page: 1,
      pullup: true,
      beforeScroll: true,
      hasMore: true,
      first: true,
      result: []
    };
  },

  methods: {
    show() {
      this.showFlag = true;
    },
    hide() {
      this.showFlag = false;
    },
    refresh() {
      this.$refs.suggest.refresh();
    },
    search() {
      this.page = 1;
      this.hasMore = true;
      this.$refs.suggest.scrollTo(0, 0);
      search(this.query, this.page, this.showSinger, perpage).then(res => {
        if (res.code === ERR_OK) {
          pagenum = Math.ceil(res.data.song.totalnum / perpage); //总页数
          // console.log(res.data.song.totalnum)
          // console.log(pagenum);
          this.result = this._genResult(res.data);
          this._checkMore(res.data);
        }
      });
    },
    searchMore() {
      if (!this.hasMore) {
        return;
      }
      this.page++;
      search(this.query, this.page, this.showSinger, perpage).then(res => {
        if (res.code === ERR_OK) {
          this.result = this.result.concat(this._genResult(res.data));
          this._checkMore(res.data);
        }
      });
    },
    _checkMore(data) {
      const song = data.song;
      if (!song.list.length || pagenum == this.page) {
        this.hasMore = false;
      }
    },
    listScroll() {
      this.$emit("listScroll");
    },
    selectItem(item) {
      // if (item.isPay) {
      //   this.$refs.topTip.show();
      //   return;
      // }
      if (item.type === TYPE_SINGER) {
        const singer = new Singer({
          id: item.singerMID,
          name: item.singerName
        });
        this.$router.push({
          path: `/search/${singer.id}`
        });
        this.setSinger(singer);
      } else {
        this.insertSong([item, false]);
      }
      this.$emit("select", item);
    },
    getAvatar(mid) {
      return `//y.gtimg.cn/music/photo_new/T001R150x150M000${mid}.jpg?max_age=2592000`;
    },
    getDesc(item) {
      if (item.type != TYPE_SINGER) {
        if (item.album!='') {
          return `${item.singerName} · ${item.album}`;
        } else {
          return item.singerName;
        }
      }
    },
    getDisplayName(item) {
      if (item.type === TYPE_SINGER) {
        return item.singerName;
      } else {
        return item.name;
      }
    },

    _genResult(data) {
      let ret = [];
      if (
        data.zhida.zhida_singer &&
        data.zhida.zhida_singer.singerID &&
        this.page === 1
      ) {
        ret.push({
          ...data.zhida.zhida_singer,
          ...{ type: TYPE_SINGER }
        });
      }
      if (data.song) {
        ret = ret.concat(this._normalizeSongs(data.song.list));
      }
      return ret;
    },
    _normalizeSongs(list) {
      let ret = [];
      list.forEach(musicData => {
        if (musicData.id) {
          ret.push(createSearchSong(musicData));
        }
      });

      return ret;
    },

    ...mapMutations({
      setSinger: "SET_SINGER"
    }),
    ...mapActions(["insertSong"])
  },
  watch: {
    query(newQuery) {
      this.search(newQuery);
    }
  },
  components: {
    Scroll,
    Loading2,
    NoResult,
    TopTip
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.suggest {
  height: 100%;
  overflow: hidden;

  .suggest-list {
    .suggest-item {
      line-height: 16px;
    }

    .name {
      font-size: $font-size-medium-x;
      color: $color-text-ll;
      overflow: hidden;
      margin-left: 20px;
      padding: 10px 0;
      line-height: 16px;
      border-bottom: 1px solid $color-border;
      padding-right: 15px;

      .text {
        no-wrap();
        font-size: 16px;
      }

    .only, .mv, .vip {
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
      .subtext {
        font-size: 13px;
        no-wrap();
        color: $color-text-l;
        width: 98%;
        padding: 10px 0 2px 0;
      }
    }

    .tip {
      color: $color-text-ll;
      text-align: center;
      padding: 20px 0;
    }
  }

  .no-result-wrapper {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
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