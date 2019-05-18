<template>
  <transition name="slide">
    <div class="container">
      <div class="back" @click="back">
        <mu-icon-button icon="arrow_back"/>
      </div>
      <div ref="dplayer" class="dplayer"></div>
    </div>
    <router-view></router-view>
  </transition>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import { getMvUrl } from "api/mv";
import { ERR_OK } from "api/config";
import "DPlayer/dist/DPlayer.min.css";
import DPlayer from "dplayer";
export default {
  computed: {
    ...mapGetters([ "playing"])
  },
  created() {
    this.init();
    this.setPlayingState(false);

  },

  methods: {
    ...mapMutations({
      setPlayingState: "SET_PLAYING_STATE",
    }),
    init() {
      if (window.history.length <= 1) {
        this.$router.push({ path: "/" });
        return;
      }
      this.getMV(this.$route.params.id);
    },
    async getMV(vid) {

      const response = await getMvUrl(vid);
      if (response.code === ERR_OK) {
        const MvUrlData = response.getMvUrl;
        if (MvUrlData.code === ERR_OK) {
          const mvUrl_mp4 = MvUrlData.data[vid].mp4;

          const result = [];
          for (let i = 0; i < mvUrl_mp4.length; i++) {
            if (mvUrl_mp4[i].freeflow_url.length !== 0) {
              for (let j = 0; j < mvUrl_mp4[i].freeflow_url.length; j++) {
                result.unshift(mvUrl_mp4[i].freeflow_url[j]);
              }
            }
          }

          if (result.length === 0) {
            console.log("无法播放");
            return;
          }
          this.initVideo(result[0]);
        }
      }
    },
    initVideo(url) {
      this.$nextTick(() => {
        const dp = new DPlayer({
          container: this.$refs.dplayer,
          video: {
            url: url,
          },
          autoplay: true
        });
      });
    },
    back() {
      this.$router.back();
    }
  }
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

.container {
  position: fixed;
  z-index: 1000;
  bottom: 0;
  width: 100%;
  top: 0;
  height: 100%;
  background: #000;
}

.dplayer {
  position: fixed;
  top: 40px;
  bottom: 0;
  width: 100%;
}

.back {
  position: absolute;
}
</style>