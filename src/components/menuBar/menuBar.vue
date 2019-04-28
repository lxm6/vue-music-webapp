<template>
  <transition name="list-fade">
    <div class="menuBar" @click.stop="hide" v-if="menuBarVisible">
      <div class="list-wrapper">
        <ul v-show="!isDisc">
          <li @click="findSinger">
            <i>
              <mu-icon-button icon="person"/>
            </i>
            <p>查看歌手</p>
          </li>
          <li @click="deleteOne">
            <i>
              <mu-icon-button icon="delete"/>
            </i>
            <p>删除</p>
          </li>
          <li @click="download">
            <i>
              <mu-icon-button icon="file_download"/>
            </i>
            <p>下载</p>
          </li>
        </ul>
        <ul v-show="isDisc">
          <li @click="deleteDisc">
            <i>
              <mu-icon-button icon="delete"/>
            </i>
            <p>删除</p>
          </li>
        </ul>
        <mu-flat-button @click="hide" label="取消" class="demo-flat-button"/>
      </div>
    </div>
  </transition>
</template>
<script>
import { mapActions, mapGetters, mapMutations } from "vuex";

export default {
  props: {
    isDisc: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters(["menuBarVisible"])
  },
  methods: {
    show() {
      this.setMenuBarVisible(true);
    },
    hide() {
      this.setMenuBarVisible(false);
    },
    findSinger() {
      this.$emit("findSinger");
    },
    deleteOne() {
      this.$emit("deleteOne");
    },
    download() {
      this.$emit("download");
    },
    deleteDisc() {
      this.$emit("deleteDisc");
    },
    ...mapMutations({
      setMenuBarVisible: "SET_MENUBAR_VISIBLE"
    })
  }
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.menuBar {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 300;
  background-color: rgba(0, 0, 0, 0.3);

  .list-wrapper {
    ul {
      width: 100%;
      height: 120px;
      padding: 10px;

      li {
        color: $color-text-ll;
        float: left;
        text-align: center;
        margin-left: 20px;
        margin-top: 10px;

        i {
          display: inline-block;
          border-radius: 8px;
          font-size: $font-size-large;
          margin-bottom: 10px;
          padding-right: 3px;
          padding-bottom: 3px;
          background : #eee;
          color:#666;
        }

        p {
          font-size: $font-size-medium;
        }
      }
    }

    .demo-flat-button {
      width: 100%;
      background: $color-theme;
      font-size: $font-size-medium-x;
      color: #fff;
      height: 50px;
    }
  }

  &.list-fade-enter-active, &.list-fade-leave-active {
    transition: opacity 0.3s;

    .list-wrapper {
      transition: all 0.3s;
    }
  }

  &.list-fade-enter, &.list-fade-leave-to {
    opacity: 0;

    .list-wrapper {
      transform: translate3d(0, 100%, 0);
    }
  }

  &.list-fade-enter, .list-wrapper {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    background-color: #fff;
  }
}
</style>