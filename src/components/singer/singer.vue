<template>
  <transition name="slide">
    <div class="container">
      <title-Bar :titleBarName="titleBarName"></title-Bar>
      <div class="singer" ref="singer">
        <list-view @select="selectSinger" :data="singers" ref="list"></list-view>
      </div>
      <router-view></router-view>
    </div>
  </transition>
</template>

<script>
import { getSingerList } from "api/singer";
import { ERR_OK } from "api/config";
import Singer from "common/js/singer";
import ListView from "base/listview/listview";
import TitleBar from "base/title-bar/title-bar";
import { mapMutations } from "vuex";
import { playlistMixin } from "common/js/mixin";

const HOT_SINGER_LEN = 30;
const HOT_NAME = "热门";
const NUM_NAME = "#";

export default {
  mixins: [playlistMixin],
  data() {
    return {
      singers: [],
      titleBarName: "歌手"
    };
  },
  created() {
    this._getSingerList();
  },
  methods: {
    // 解决播放器遮挡列表的问题
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? "60px" : "";
      this.$refs.singer.style.bottom = bottom;
      this.$refs.list.refresh();
    },
    selectSinger(singer) {
      this.$router.push({
        path: `/singer/${singer.id}`
      });
      this.setSinger(singer);
    },
    _getSingerList() {
      getSingerList(1).then(res => {
        if (res.code === ERR_OK) {
          this.singers = this._normalizeSinger(res.data.list);

        }
      });
    },
    _normalizeSinger(list) {
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        },
        num: {
          title: NUM_NAME,
          items: []
        }
      };
      list.forEach((item, index) => {
        if (index < HOT_SINGER_LEN) {
          map.hot.items.push(
            new Singer({
              name: item.Fsinger_name,
              id: item.Fsinger_mid
            })
          );
        }
        const key = item.Findex;
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          };
        }
        map[key].items.push(
          new Singer({
            name: item.Fsinger_name,
            id: item.Fsinger_mid
          })
        );
      });
      // 为了得到有序列表，我们需要处理 map
      let ret = [];
      let hot = [];
      let num = [];
      for (let key in map) {
        let val = map[key];
        if (val.title.match(/[a-zA-Z]/)) {
          ret.push(val);
        } else if (val.title === HOT_NAME) {
          hot.push(val);
        } else if (val.title === "9") {
          num.push(val);
        }
      }
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0);
      });
      return hot.concat(ret).concat(num);
    },
    ...mapMutations({
      setSinger: "SET_SINGER" //对应mutation-types中定义的常量
    })
  },
  components: {
    ListView,
    TitleBar
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
.container {
  z-index 100;
  position: fixed;
  bottom: 0;
  width: 100%;
  top: 0;
}

.singer {
  width: 100%;
  top: $top-height;
  position: fixed;
  bottom: 0;
}
</style>
