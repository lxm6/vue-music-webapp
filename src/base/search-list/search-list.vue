<template>
  <div class="search-list" v-show="searches.length">
    <transition-group name="list" tag="ul">
      <mu-list-item :key="item" class="search-item" @click="selectItem(item)" v-for="item in searches">
          <mu-flexbox>
            <mu-flexbox-item>
              <span class="text">{{item}}</span>
            </mu-flexbox-item>
            <span class="icon" @click.stop="deleteOne(item)">
              <i class="icon-delete"></i>
            </span>
          </mu-flexbox>
        </mu-list-item>
    </transition-group>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    searches: {
      type: Array,
      default: []
    }
  },
  methods: {
    selectItem(item) {
      this.$emit("select", item);
    },
    deleteOne(item) {
      this.$emit("delete", item);
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

.search-list {
  .search-item {
    overflow: hidden;
    border-bottom: 1px solid $color-border;
    padding 0px;

    &.list-enter-active, &.list-leave-active {
      transition: all 0.1s;
    }

    &.list-enter, &.list-leave-to {
      height: 0;
    }

    .text {
      color: $color-text-ll;
    }

    .icon {
      display:inline-block;
      padding 10px 0px 10px 10px;
      extend-click();

      .icon-delete {
        font-size: $font-size-small;
        color: $color-text-d;
      }
    }
  }
}
</style>