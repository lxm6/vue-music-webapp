<template>
  <transition name="slide">
    <div class="top-list">
      <music-list
        :rank="rank"
        :title="title"
        :updateTime="updateTime"
        :info="info"
        :bg-image="bgImage"
        :songs="songs"
      ></music-list>
      <router-view></router-view>
    </div>
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
    info() {
      if (this.songs.length) {
        return info.info;
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
@import '~common/stylus/variable';

.top-list {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>