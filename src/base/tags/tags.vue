<template>
  <div class="tag-wrapper">
    <div v-if="titleName" class="titleName">{{titleName}}</div>
    <ul class="content">
      <li
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
    }
  },
  methods: {
    selectItem(item) {
      this.$emit("selectItemTag", item);
    }
  }
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.tag-wrapper {
  position: relative;

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
    padding-left: 50px;

    .item {
      display: inline-block;
      height: 26px;
      line-height: 27px;
      margin: 0 14px 14px 0;
      color: #333;
      font-size: 14px;
      cursor: pointer;

      &:hover {
        color: $color-theme;
      }

      &:first-child {
        font-size: 15px;
      }

      &.active {
        color: $color-theme;
      }
    }
  }
}
</style>
