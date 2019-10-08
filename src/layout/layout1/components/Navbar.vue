<template>
  <div class="navbar1">
    <div class="logo">
      <img :src="logo" class="sidebar-logo">
      <h1 class="sidebar-title">{{ title }} </h1>
    </div>
    <div class="left-menu">
      <el-menu
        :default-active="activeIndex"
        class="el-nav-menu"
        mode="horizontal"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
        @select="handleSelect"
      >
        <el-menu-item index="1">首页</el-menu-item>
        <el-menu-item index="2">我的学习</el-menu-item>
        <el-menu-item :index="systemManage">系统管理</el-menu-item>
        <el-menu-item :index="backstageManage">后台管理</el-menu-item>
      </el-menu>
    </div>
    <div class="right-menu">
      <help-center />
      <user />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import User from '@/components/User'
import HelpCenter from '@/components/HelpCenter'

export default {
  components: {
    User,
    HelpCenter
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ])
  },
  data() {
    return {
      systemManage: this.$store.getters.homePath,
      backstageManage: this.$store.getters.homePath,
      activeIndex: '1',
      title: '博识知识库',
      logo: 'https://wpimg.wallstcn.com/69a1c46c-eb1c-4b46-8bd4-e9e686ef5251.png'
    }
  },
  methods: {
    handleSelect(key, keyPath) {
      debugger
      console.log(key, keyPath)
      this.$router.push({ path: keyPath.join() })
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/element-variables.scss";
.navbar1 {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #545c64;
  color: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  & .logo {
    float: left;
    margin-left: 20px;

    & .sidebar-logo {
      width: 32px;
      height: 32px;
      vertical-align: middle;
      margin-right: 12px;
    }
    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: 600;
      line-height: 50px;
      font-size: 16px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

  & .left-menu {
    float: left;
    margin-left: 20px;

  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }
  }
}
</style>
