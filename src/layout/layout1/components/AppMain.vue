<template>
  <section class="app-main">
    <!--<el-scrollbar wrap-class="scrollbar-wrapper">-->
    <transition name="fade-transform" mode="out-in">
      <div :key="key">
        <keep-alive :max="1">
          <router-view v-if="isKeepAlive" :key="key" />
        </keep-alive>
        <router-view v-if="!isKeepAlive" :key="key" />
      </div>
    </transition>
    <!--</el-scrollbar>-->
    <el-tooltip placement="top" content="tooltip">
      <back-to-top :custom-style="myBackToTopStyle" :visibility-height="mainContentHeight" :back-position="0" transition-name="fade" />
    </el-tooltip>
  </section>
</template>

<script>
import BackToTop from '@/components/BackToTop'

export default {
  name: 'AppMain1',
  components: { BackToTop },
  data() {
    return {
      mainContentHeight: 400,
      myBackToTopStyle: {
        right: '50px',
        bottom: '50px',
        width: '40px',
        height: '40px',
        'border-radius': '4px',
        'line-height': '45px', // 请保持与高度一致以垂直居中 Please keep consistent with height to center vertically
        background: '#e7eaf1'// 按钮的背景颜色 The background color of the button
      }
    }
  },
  computed: {
    key() { // 保证路由切换时都会重新渲染触发钩子了
      return this.$route.path
    },
    isKeepAlive() { // 是否需要被缓存的组件
      return this.$route.meta.keepAlive
    }
  },
  mounted() {
    this.mainContentHeight = document.body.offsetHeight - 50
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
