<template>
  <div class="container">
    <title-Bar :titleBarName="titleBarName"></title-Bar>
    <div class="searchWrapper" ref="search">
      <div class="search">
        <div class="search-box-wrapper">
          <search-box ref="searchBox" @query="onQueryChange"></search-box>
        </div>
        <div ref="shortcutWrapper" class="shortcut-wrapper" v-show="!query">
          <scroll :refreshDelay="refreshDelay" ref="shortcut" class="shortcut" :data="shortcut">
            <div>
              <div class="hot-key">
                <h1 class="title">热门搜索</h1>
                <ul>
                  <li
                    @click="addQuery(item.k)"
                    class="item"
                    v-for="(item,index) in hotKey"
                    :key="index"
                  >
                    <span>{{item.k}}</span>
                  </li>
                </ul>
              </div>
              <div class="search-history" v-show="searchHistory.length">
                <h1 class="title">
                  <span class="text">搜索历史</span>
                  <span @click="showConfirm" class="clear">
                    <i class="icon-clear"></i>
                  </span>
                </h1>
                <search-list
                  @delete="deleteSearchHistory"
                  @select="addQuery"
                  :searches="searchHistory"
                ></search-list>
              </div>
            </div>
          </scroll>
        </div>
        <div class="search-result" v-show="query" ref="searchResult">
          <suggest @listScroll="blurInput" @select="saveSearch" ref="suggest" :query="query"></suggest>
        </div>
        <confirm ref="confirm" @confirm="clearSearchHistory" text="是否清空搜索历史？" confirmBtnText="清空"></confirm>
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import SearchBox from "base/search-box/search-box";
import TitleBar from "base/title-bar/title-bar";
import SearchList from "base/search-list/search-list";
import Scroll from "base/scroll/scroll";
import Suggest from "components/suggest/suggest";
import Confirm from "base/confirm/confirm";
import { getHotKey } from "api/search";
import { ERR_OK } from "api/config";
import { mapActions, mapGetters } from "vuex";
import { playlistMixin, searchMixin } from "common/js/mixin";

export default {
  mixins: [playlistMixin, searchMixin],
  created() {
    this._getHotKey();
  },
  data() {
    return {
      titleBarName: "搜索",
      hotKey: [],
      query: ""
    };
  },
  computed: {
    shortcut() {
      return this.hotKey.concat(this.searchHistory);
    },
    ...mapGetters(["searchHistory", "palyHistory"])
  },
  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? "60px" : "";

      this.$refs.searchResult.style.bottom = bottom;
      this.$refs.suggest.refresh();

      this.$refs.shortcutWrapper.style.bottom = bottom;
      this.$refs.shortcut.refresh();
    },
    showConfirm() {
      this.$refs.confirm.show();
    },
    _getHotKey() {
      getHotKey().then(res => {
        if (res.code === ERR_OK) {
          this.hotKey = res.data.hotkey.slice(0, 10);
        }
      });
    },
    ...mapActions(["clearSearchHistory"])
  },
  watch: {
    query(newQuery) {
      if (!newQuery) {
        setTimeout(() => {
          this.$refs.shortcut.refresh();
        }, 20);
      }
    }
  },
  components: {
    SearchBox,
    SearchList,
    Scroll,
    Confirm,
    Suggest,
    TitleBar
  }
};
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.container {
  position: fixed;
  bottom: 0;
  width: 100%;
  top: 0;
}

.searchWrapper {
  position: fixed;
  width: 100%;
  top: $top-height;
  bottom: 0;
  background: #fff;
}

.search {
  .search-box-wrapper {
    padding: 12px 15px;
    background-color: $color-background;
  }

  .shortcut-wrapper {
    width: 100%;
    padding-top: 10px;
    position: fixed;
    top: 125px;
    bottom: 0;
    background-color: $color-highlight-background;

    .shortcut {
      height: 100%;
      overflow: hidden;

      .hot-key {
        margin: 0 20px 10px 20px;

        .title {
          margin-bottom: 15px;
          font-size: $font-size-medium;
          color: $color-theme;
        }

        .item {
          display: inline-block;
          padding: 5px 10px;
          margin: 0 12px 10px 0;
          border-radius: 15px;
          border: 1px solid $color-text-l;
          font-size: $font-size-medium;
          color: $color-text-l;
        }
      }

      .search-history {
        position: relative;
        margin: 0 20px;

        .title {
          display: flex;
          align-items: center;
          height: 40px;
          font-size: $font-size-medium;
          color: $color-theme;
          border-bottom: 1px solid $color-border;

          .text {
            flex: 1;
          }

          .clear {
            extend-click();

            .icon-clear {
              font-size: $font-size-medium;
              color: $color-text-d;
            }
          }
        }
      }
    }
  }

  .search-result {
    position: fixed;
    width: 100%;
    top: 135px;
    bottom: 0;
  }
}
</style>