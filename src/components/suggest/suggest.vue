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
      <li @click="selectItem(item)" class="suggest-item" v-for="item in result" :key="item.docid">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore" title="加载更多"></loading>
      <div class="tip" v-show="!hasMore">没有更多数据了</div>
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
import Loading from "base/loading/loading";
import NoResult from "base/no-result/no-result";
import { search } from "api/search";
import { ERR_OK } from "api/config";
import { createSong } from "common/js/song";
import { mapMutations, mapActions } from "vuex";
import Singer from "common/js/singer";
import TopTip from "base/top-tip/top-tip";
const TYPE_SINGER = "singer";
const perpage = 20;

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
    listScroll() {
      this.$emit("listScroll");
    },
    selectItem(item) {
      if (item.isPay) {
        console.log("dd");
        this.$refs.topTip.show();
        return;
      }
      if (item.type === TYPE_SINGER) {
        const singer = new Singer({
          id: item.singermid,
          name: item.singername
        });
        this.$router.push({
          path: `/search/${singer.id}`
        });
        this.setSinger(singer);
      } else {
        this.insertSong(item);
      }
      this.$emit("select", item);
    },
    getDisplayName(item) {
      if (item.type === TYPE_SINGER) {
        return item.singername;
      } else {
        return `${item.name}-${item.singer}`;
      }
    },
    getIconCls(item) {
      if (item.type === TYPE_SINGER) {
        return "icon-mine";
      } else {
        return "icon-music";
      }
    },
    _genResult(data) {
      let ret = [];
      if (data.zhida && data.zhida.singerid) {
        ret.push({ ...data.zhida, ...{ type: TYPE_SINGER } });
      }
      if (data.song) {
        ret = ret.concat(this._normalizeSongs(data.song.list));
      }
      return ret;
    },
    _normalizeSongs(list) {
      let ret = [];
      list.forEach(musicData => {
        if (musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData));
        }
      });
      return ret;
    },
    _checkMore(data) {
      const song = data.song;
      if (
        !song.list.length ||
        song.curnum + song.curpage * perpage > song.totalnum
      ) {
        this.hasMore = false;
      }
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
    Loading,
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
    padding: 0 30px;

    .suggest-item {
      display: flex;
      align-items: center;
      padding: 15px 0;
      border-top: 1px solid rgba(255, 255, 255, 0.07);
    }

    .icon {
      flex: 0 0 30px;
      width: 30px;

      [class^='icon-'] {
        font-size: $font-size-medium-x;
        color: $color-text-l;
      }
    }

    .name {
      flex: 1;
      font-size: $font-size-medium-x;
      color: $color-text-l;
      overflow: hidden;

      .text {
        no-wrap();
      }
      
    }
    .tip{
        color: $color-text-ll;
        text-align center;
        padding 20px 0
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
      color: $color-text;
    }
  }
}
</style>