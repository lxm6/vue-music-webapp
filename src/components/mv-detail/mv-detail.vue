<template>
  <transition name="slide">
    <div class="container">
      <div class="back" @click="back">
        <mu-icon-button icon="arrow_back"/>
      </div>
      <div class="video-wrapper"></div>
      <div class="dplayer">
        <div ref="dplayer"></div>
      </div>
      <div class="info">
        <h2>
          <i class="mv-icon">MV</i>
          {{this.mv.mvtitle}}
        </h2>
        <p>
          <i class="icon-mine"></i>
          {{this.mv.singername}}
        </p>
        <p>
          {{this.mv.listennum}}次播放
          <span>{{this.mv.publictime}}</span>
        </p>
      </div>
      <div class="tab">
        <li class="tab-item">
          <i>
            <mu-icon value="favorite" class="icon"/>
          </i>收藏
        </li>
        <li class="tab-item">
          <i>
            <mu-icon value="file_download" class="icon"/>
          </i>下载
        </li>
      </div>
    </div>
    <router-view></router-view>
  </transition>
</template>

<script>
import "DPlayer/dist/DPlayer.min.css";
import DPlayer from "dplayer";
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["mv"])
  },
  mounted() {
    this.$nextTick(() => {
      const dp = new DPlayer({
        container: this.$refs.dplayer,
        video: {
          url: this.mv.url,
          pic: this.mv.picurl
        },
        autoplay: true
      });
     
    });
  },
  methods: {
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
  z-index: 100;
  bottom: 0;
  width: 100%;
  top: 0;
  height: 100%;
  background: #fff;
}

.video-wrapper {
}

.tab {
  display: flex;
  height: 40px;
  font-size: 16px;
  border-bottom: 1px solid $color-border;

  .tab-item {
    line-height: 40px;
    flex: 1;
    text-align: center;
    color: #666;
  }
}

.info {
  padding: 10px 15px;
  line-height: 25px;
  color: $color-text-l;
  font-size: 14px;

  .mv-icon {
    font-size: 13px;
    font-style: normal;
    color: $color-theme;
    border-radius: 4px;
    border: 1px solid $color-theme;
  }

  h2 {
    color: #000;
    font-weight: bold;
    font-size: 18px;
  }

  span {
    display: inline-block;
    text-indent: 10px;
  }

  .icon-mine {
    display: inline-block;
    padding: 3px;
    font-size: 14px;
  }
}

.icon {
  font-size: 22px;
}
</style>