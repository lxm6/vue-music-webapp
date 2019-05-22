<template>
  <div>
    <mu-bottom-sheet :open="bottomSheetVisible" @close="closeBottomSheet">
      <mu-list @itemClick="closeBottomSheet">
        <mu-sub-header>请选择下载品质</mu-sub-header>
          <mu-list-item title="流畅音质" @click="download(192)" />
          <mu-list-item title="标准音质" @click="download(128)" />
          <mu-list-item title="高品音质" @click="download(320)" />
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
      setMenuBarVisible: "SET_MENUBAR_VISIBLE",

      
    })
  }
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
</style>



