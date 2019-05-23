<template>
  <div>
    <mu-bottom-sheet :open="bottomSheetVisible" @close="closeBottomSheet">
      <mu-list @itemClick="closeBottomSheet">
        <mu-sub-header>请选择下载品质</mu-sub-header>
        <mu-list-item @click="download(192)">
          <span>流畅音质</span>
        </mu-list-item>
        <mu-list-item @click="download(128)">
          <span>标准音质</span>
        </mu-list-item>
        <mu-list-item @click="download(320)">
          <span>高品音质</span>
        </mu-list-item>
      </mu-list>
    </mu-bottom-sheet>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from "vuex";

export default {
  data() {
    return {
      bottomSheet: false
    };
  },
  computed: {
    ...mapGetters(["bottomSheetVisible"])
  },
  methods: {
    download(quality) {
      this.$emit("download", quality);
    },
    closeBottomSheet() {
      this.setBottomSheetVisible(false);
    },
    ...mapMutations({
      setBottomSheetVisible: "SET_BOTTOMSHEET_VISIBLE",
      setMenuBarVisible: "SET_MENUBAR_VISIBLE"
    })
  }
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
.wrapper {
  padding-bottom: 20px;
}

span {
  display: block;
  padding: 20px;
}
</style>



