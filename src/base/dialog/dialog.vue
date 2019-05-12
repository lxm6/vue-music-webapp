<template>
  <div>
    <mu-dialog :open="dialog" :title="dialogTitle" >
      <mu-flat-button label="确定" slot="actions" primary @click="close"/>
    </mu-dialog>
  </div>
</template>

<script>
export default {
  props: {
    dialogTitle: {
      type: String,
      default: "标题"
    },
    dialogText: {
      type: String,
      default: "内容"
    }
  },
  data() {
    return {
      dialog: false
    };
  },
  methods: {
    open() {
      this.dialog = true;
    },
    close() {
      this.dialog = false;
    }
  }
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
</style>