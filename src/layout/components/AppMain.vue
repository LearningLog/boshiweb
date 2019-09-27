<template>
  <section class="app-main">
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <transition name="fade-transform" mode="out-in">
        <router-view :key="key" />
      </transition>
    </el-scrollbar>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    key() { // 保证路由切换时都会重新渲染触发钩子了
      return this.$route.path
    }
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
