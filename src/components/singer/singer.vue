<template>
  <div class="singer" ref="singer">
    <list-view @select="selectSinger" :data="singers" ref="list"></list-view>
    <router-view></router-view>
  </div>
</template>

<script>
import { getSingerList } from "api/singer";
import { ERR_OK } from "api/config";
import Singer from "common/js/singer";
import ListView from "base/listview/listview";
import { mapMutations } from "vuex";
import { playlistMixin } from "common/js/mixin";

const HOT_SINGER_LEN = 10;
const HOT_NAME = "热门";

export default {
  mounted() {
    var router = this.$router;
    this.$refs.singer.addEventListener("touchstart", e => {
      this.startX = e.touches[0].pageX;
    });
    this.$refs.singer.addEventListener("touchmove", e => {
      var moveEndX = e.changedTouches[0].pageX;
      var X = moveEndX - this.startX;
      if (X < -100) {
        this.$refs.singer.style.left = X + "px";
      } else if (X > 100) {
        this.$refs.singer.style.left = X - 100 + "px";
      }
    });
    this.$refs.singer.addEventListener("touchend", e => {
      if (this.$refs.singer.offsetLeft < -100) {
        router.push("./rank");
        this.$refs.singer.style.left = 0 + "px";

      } else if (this.$refs.singer.offsetLeft > 100) {
        router.push("./recommend");
        this.$refs.singer.style.left = 0 + "px";

      } else {
        this.$refs.singer.style.left = 0 + "px";
      }
    });
  },
  mixins: [playlistMixin],
  data() {
    return {
      singers: []
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
      getSingerList().then(res => {
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
      for (let key in map) {
        let val = map[key];
        if (val.title.match(/[a-zA-Z]/)) {
          ret.push(val);
        } else if (val.title === HOT_NAME) {
          hot.push(val);
        }
      }
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0);
      });
      return hot.concat(ret);
    },
    ...mapMutations({
      setSinger: "SET_SINGER"
    })
  },
  components: {
    ListView
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.singer {
  position: fixed;
  top: 88px;
  bottom: 0;
  width: 100%;
}
</style>
