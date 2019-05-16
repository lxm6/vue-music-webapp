<template>
  <div class="tag-wrapper" ref="tab">
    <ul class="content" ref="tabWrapper">
      <li ref="tabitem" class="item">{{titleName}}</li>
      <li
        ref="tabitem"
        class="item"
        v-for="item in tag"
        :class="currentId=== item.id? 'active':'' "
        :key="item.id"
        @click="selectItem(item)"
      >{{item.title}}</li>
    </ul>
  </div>
</template>

<script>
import BScroll from "better-scroll";
export default {
  props: {
    tag: {
      type: Array,
      default: []
    },
    currentId: {
      type: Number,
      default: 0
    },
    titleName: {
      type: String,
      default: ""
    },

  },
  created() {
    this.$nextTick(() => {
      this.InitTabScroll();
    });
  },
  methods: {
    selectItem(item) {
      this.$emit("selectItemTag", item);
    },
    InitTabScroll() {
      let width = 50;
      for (let i = 0; i < this.tag.length; i++) {
        width += this.$refs.tabitem[0].getBoundingClientRect().width+20;
      }
       this.$refs.tabWrapper.style.width = width + "px";

      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.tab, {
            startX: 0,
            click: true,
            scrollX: true,
            scrollY: false,
            eventPassthrough: "vertical"
          });
        } else {
          this.scroll.refresh();
        }
      });
    }
  }
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.tag-wrapper {
  position: relative;
  width: 100%;
  overflow: hidden;

  .titleName {
    position: absolute;
    top: 0;
    left: 0;
    display: inline-block;
    height: 26px;
    line-height: 27px;
    font-size: 14px;
  }

  .content {
    display: flex;

    .item {
      flex: 0 0 auto;
      margin-right 12px;
      height: 22px;
      line-height: 22px;
      margin-bottom: 10px;
      color: #333;
      font-size: 14px;
      cursor: pointer;

      &:hover, &.active {
        color: $color-theme;
      }
    }
  }
}
</style>
