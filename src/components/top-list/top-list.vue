<template>
  <transition name="slide">
    <music-list
      :rank="rank"
      :title="title"
      :updateTime="updateTime"
      :bg-image="bgImage"
      :songs="songs"
    ></music-list>
  </transition>
</template>

<script>
let info = {};
import MusicList from "components/music-list/music-list";
import { getMusicList } from "api/rank";
import { ERR_OK } from "api/config";
import { mapGetters } from "vuex";
import { createSong } from "common/js/song";
export default {
  computed: {
    title() {
      return this.topList.topTitle;
    },
    updateTime() {
      if (this.songs.length) {
        return info.updateTime + "更新";
      }
      return "";
    },
    bgImage() {
      if (this.songs.length) {
        return this.songs[0].image;
      }
      return "";
    },
    ...mapGetters(["topList"])
  },
  data() {
    return {
      songs: [],
      rank: true
    };
  },
  created() {
    this._getMusicList();
  },
  methods: {
    _getMusicList() {
      if (!this.topList.id) {
        this.$router.push("/rank");
        return;
      }
      getMusicList(this.topList.id).then(res => {
        if (res.code === ERR_OK) {
          info = {
            title: res.topinfo.ListName,
            updateTime: res.update_time,
            img: res.topinfo.pic_v12,
            date: res.date,
            day_of_year: res.day_of_year,
            info: res.topinfo.info
          };
          this.songs = this._normalizeSongs(res.songlist);
        }
      });
    },
    _normalizeSongs(list) {
      let ret = [];
      list.forEach(item => {
        const musicData = item.data;
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
.slide-enter-active, .slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter, .slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>