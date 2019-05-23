<template>
  <transition name="slide">
    <div class="singer-detail">
      <music-list
        :title="title"
        :bg-image="bgImage"
        :songs="songs"
        :isSinger="true"
        @searchMore="searchMore"
        :hasMore="hasMore"
        :totalNum="totalNum"
      ></music-list>
      <router-view></router-view>
    </div>
  </transition>
</template>

<script>
import { mapGetters } from "vuex";
import { getSingerMusic, getSingerDetail} from "api/singer";
import { ERR_OK } from "api/config";
import { createSong } from "common/js/song";
import MusicList from "components/music-list/music-list";

export default {
  data() {
    return {
      songs: [],
      page: 1,
      hasMore:true,
      totalNum:0
    };
  },
  computed: {
    title() {
      return this.singer.name;
    },
    bgImage() {
      return this.singer.avatar;
    },
    ...mapGetters(["singer"])
  },
  created() {
    this._getDetail();
  
  },
  methods: {
    _getDetail() {
      if (!this.singer.id) {
        this.$router.push("/singer");
        return;
      }
      //qq音乐接口
      getSingerDetail(this.singer.id).then(res => {
        if (res.code === ERR_OK) {
         this.totalNum=res.data.total;
        }
      });

      getSingerMusic(this.singer.id, this.page).then(res => {
        if (res.code === 200) {
          this.songs = this._normalizeSongs(res.data);
        }
      });
    },
    searchMore() {
     if (!this.hasMore) {
        return;
      }
      console.log("d");
      this.page++;
      getSingerMusic(this.singer.id, this.page).then(res => {
        if (res.code === 200) {
          if (res.data.length) {
            this.songs = this.songs.concat(this._normalizeSongs(res.data));
          } else {
            console.log("f");
            this.hasMore = false;
          }
        }
      });
    },

    _normalizeSongs(list) {
      let ret = [];
      list.forEach(item => {
        let { musicData } = item;
        if (musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData));
        }
      });
      return ret;
    }
  },
  components: {
    MusicList
  }
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

.singer-detail {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>