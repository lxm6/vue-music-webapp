<template>
  <transition name="slide">

  <div class="container">
    <title-Bar :titleBarName="titleBarName"></title-Bar>
    <div class="sort-wrapper" ref="sort">
      <scroll class="sort-tags-wrapper" ref="scroll" :data="categories">
        <ul>
          <li class="categoriesWrapper" v-for="(item1,indexs) in categories" :key="indexs">
            <h4 class="title">{{item1.categoryGroupName}}</h4>
            <ul class="item-Wrapper">
              <li
                v-for="(item2,index) in item1.items"
                :key="index"
                class="items"
                v-html="item2.categoryName"
                @click="SelectTags(item2)"
              ></li>
            </ul>
          </li>
        </ul>

        <div class="loading-container" v-show="!categories.length">
          <loading></loading>
        </div>
      </scroll>
      <router-view></router-view>
    </div>
  </div>
  </transition>

</template>

<script>
import Loading from "base/loading/loading";
import TitleBar from "base/title-bar/title-bar";
import Scroll from "base/scroll/scroll";
import { getSortTags } from "api/sort";
import { ERR_OK } from "api/config";
import { playlistMixin } from "common/js/mixin";

export default {
  mixins: [playlistMixin],
  data() {
    return {
      categories: [],
      categoryId: 100,
      titleBarName: "歌单分类"
    };
  },
  created() {
    this._getSortTags();
  },
  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? "60px" : "";
      this.$refs.sort.style.bottom = bottom;
      this.$refs.scroll.refresh();
    },
    _getSortTags() {
      getSortTags().then(res => {
        if (res.code === ERR_OK) {
          this.categories = res.data.categories.slice(1);
        }
      });
    },
    SelectTags(item) {
      this.$router.push({
        name: "SortDetail",
        params: {
          categoryId: item.categoryId,
          categoryName: item.categoryName
        }
      });
    }
  },
  components: {
    Scroll,
    Loading,
    TitleBar
  }
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

.slide-enter-active, .slide-leave-active {
  transition: all 0.3s;
}

.slide-enter, .slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
.container {
  position: absolute;
  bottom: 0;
  width: 100%;
  top: 0;
  height: 100%;
  background: $color-background;
}

.sort-wrapper {
  top: $top-height;
  bottom: 0;
  position: fixed;
  width: 100%;

  .sort-tags-wrapper {
    height: 100%;
    overflow: hidden;

    .categoriesWrapper {
      background-color: #fff;
      border-bottom:12px solid #eee;
      display: flex;
      align-items: center;
      text-align: center;

      &:nth-child(1) .title {
        background: url('icon1.png') no-repeat 50% 0% / 26px;
      }

      &:nth-child(2) .title {
        background: url('icon2.png') no-repeat 50% 0% / 26px;
      }

      &:nth-child(3) .title {
        background: url('icon3.png') no-repeat 50% 0% / 26px;
      }

      &:nth-child(4) .title {
        background: url('icon4.png') no-repeat 50% 0% / 26px;
      }

      &:nth-child(5) .title {
        background: url('icon5.png') no-repeat 50% 0% / 26px;
      }

      .title {
        color: #999;
        font-size: 16px;
        flex: 1;
        height: 60px;
        line-height: 80px;
      }

      .item-Wrapper {
        flex: 4;
        display: flex;
        flex-wrap: wrap;
        flex-direction: row;
        align-items: center;
        border-left: 1px solid $color-border;

        .items {
          font-size: 14px;
          cursor: pointer;
          flex: 0 0 33%;
          text-align: center;
          padding: 20px 0;
          border-right: 1px solid $color-border;
          border-bottom: 1px solid $color-background;

          &:last-child {
            border-bottom: 1px solid $color-background;
          }

          &.active, &:hover {
            background: $color-theme;
            color: #fff;
          }
        }
      }
    }
  }
}

.loading-container {
  position: absolute;
  width: 100%;
  top: 50%;
  transform: translateY(-50%);
}
</style>