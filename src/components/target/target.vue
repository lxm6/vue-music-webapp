<template>
  <transition name="slide">
    <div class="warp">
      <div  id="loading">
        <img src="../../base/loading/loading.gif" width="24" height="24">
        <p class="desc">正在载入</p>
      </div>

      <iframe
        id="iframe"
        :src=url
        width="100%"
        height="100%"
        frameborder="0"
        scrolling="yes"
      ></iframe>
    </div>
  </transition>
</template>

<script>

export default {
    data() {
        return {
            url:this.$route.params.data
        }
    },

  mounted() {
    var iframe = document.getElementById("iframe");
    var loading = document.getElementById("loading");

    if (!/*@cc_on!@*/ 0) {
      //如果不是IE，IE的条件注释
      iframe.onload = function() {
         loading.style.display = "none"
        
      };
    } else {
      iframe.onreadystatechange = function() {
        // IE下的节点都有onreadystatechange这个事件
        if (iframe.readyState == "complete") {
         loading.style.display = "none"
        }
      };
    }
  },

};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

.warp {
  position: fixed;
  top: 0;
  bottom: 0;
  z-index: 100;
  width: 100%;
  background: #fff;

  &.slide-enter-active, &.slide-leave-active {
    transition: all 0.3s;
  }

  &.slide-enter, &.slide-leave-to {
    transform: translate3d(100%, 0, 0);
  }

  #loading {
    position: absolute;
    top: 50%;
    width: 100%;
    text-align: center;

    .desc {
      line-height: 20px;
      font-size: $font-size-small;
      color: #333;
    }
  }
}
</style>