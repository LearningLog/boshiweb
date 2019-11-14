<template>
  <section class="app-main">
    <!--<el-scrollbar wrap-class="scrollbar-wrapper">-->
    <transition name="fade-transform" mode="out-in">
      <router-view :key="key" />
    </transition>
    <!--</el-scrollbar>-->
    <el-tooltip placement="top" content="返回顶部">
      <back-to-top :visibility-height="mainContentHeight" :back-position="0" transition-name="fade" />
    </el-tooltip>
    <file-uploader />
  </section>
</template>

<script>
import BackToTop from '@/components/BackToTop'
import FileUploader from '@/components/VueWebuploader'

export default {
  name: 'AppMain',
  components: { BackToTop, FileUploader },
  data() {
    return {
      mainContentHeight: 400
    }
  },
  computed: {
    key() { // 保证路由切换时都会重新渲染触发钩子了
      return this.$route.path
    }
  },
  mounted() {
    // 动态设置返回顶部出现位置
    this.mainContentHeight = (document.body.offsetHeight - 100) / 2
  }
}
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}
.app-main .el-scrollbar {
  height: calc(100vh - 50px);
}
.fixed-header+.app-main {
  padding-top: 50px;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
