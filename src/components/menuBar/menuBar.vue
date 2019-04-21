<template>
  <transition name="list-fade">
    <div class="menuBar" @click.stop="hide" v-if="menuBarVisible">
      <div class="list-wrapper">
        <ul>
          <li @click="findSinger">
            <i class="icon-mine"></i>
            <p>查看歌手</p>
          </li>
          <li @click="deleteOne">
            <i class="icon-clear"></i>
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
  props: {},
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
          padding: 15px;
          display: inline-block;
          background-color: #eee;
          border-radius: 8px;
          font-size: $font-size-large;
          margin-bottom: 10px;
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
      height 50px;
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