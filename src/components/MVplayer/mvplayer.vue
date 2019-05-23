<template>
  <transition name="slide">
    <div class="video-wrapper" v-if="videoVisible">
      <div class="back" @click="closeplayer">
        <mu-icon-menu icon="close"/>
      </div>
      <div class="dplayer" ref="dplayerd"></div>
    </div>
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
    ...mapGetters(["videoVisible", "vid"])
  },

  methods: {
    ...mapMutations({
      setVideoVisible: "SET_VIDEO_VISIBLE"
    }),
    is_weixn_qq() {
      var ua = navigator.userAgent.toLowerCase();
      //微信
      if (ua.match(/MicroMessenger/i) == "micromessenger"||ua.match(/QQ/i) == "qq") {
        this.$refs.dplayerd.style.top='35px';
      } 
    },
    closeplayer() {
      this.setVideoVisible(false);
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
          container: this.$refs.dplayerd,
          video: {
            url: url
          },
          autoplay: true
        });
        this.is_weixn_qq();

      });
    }
  },
  watch: {
    videoVisible(visible) {
      if (visible) {

        if (!this.vid) {
          this.setVideoVisible(false);
        } else {
          this.getMV(this.vid);

        }
      }
    }
  }
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

.video-wrapper {
  position: fixed;
  z-index: 500;
  bottom: 0;
  width: 100%;
  top: 0;
  height: 100%;
  background: #000;
}

.dplayer {
  position: absolute;
  top: 0px;
  bottom: 0px;
  width: 100%;
}
</style>