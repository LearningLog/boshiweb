<template>
  <div class="header">
    <div class="navbar1">
      <div class="logo">
        <img :src="logo ? logo : logo1" class="sidebar-logo">
        <h1 class="sidebar-title">{{ logo_name }} </h1>
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
          <el-menu-item index="/">知识门户</el-menu-item>
          <!--<el-menu-item index="2">我的学习</el-menu-item>-->
          <el-menu-item index="/backstageManage">后台管理</el-menu-item>
        </el-menu>
      </div>
      <div class="right-menu">
        <div class="search">
          <el-input v-model="keyword" class="global-search" placeholder="请输入关键词" clearable @clear="search" @keyup.enter.native="search">
            <el-button slot="append" icon="el-icon-search" @click="search" />
          </el-input>
        </div>
        <MiniPrograms />
        <help-center />
        <el-button @click="jumpOldVersion()">返回旧版</el-button>
        <user :style="customStyle" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import User from '@/components/User'
import HelpCenter from '@/components/HelpCenter'
import MiniPrograms from '@/components/MiniPrograms'
import logo1 from '@/assets/images/logo.png'
import store from '@/store'
import { createFullUrl } from '@/utils/index'

export default {
  components: {
    User,
    HelpCenter,
    MiniPrograms
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'logo',
      'logo_name'
    ])
  },
  data() {
    return {
      systemManage: this.$store.getters.homePath,
      backstageManage: this.$store.getters.homePath,
      activeIndex: '/',
      // title: '博识知识库',
      // logo: 'https://wpimg.wallstcn.com/69a1c46c-eb1c-4b46-8bd4-e9e686ef5251.png',
      customStyle: {
        color: '#ffffff'
      },
      keyword: '',
      logo1
    }
  },
  methods: {
    async handleSelect(key, keyPath) {
      switch (key) {
        case '/':
          this.$router.push({ path: '/' })
          break
        case '/backstageManage':
          this.$router.push({ path: this.$store.getters.homePath })
          break
      }
    },

    jumpOldVersion: function() {
      const path = createFullUrl('/portal.html')
      window.location.href = path
    },

    // 搜索文件
    search() {
      store.dispatch('door/setKeyword', this.keyword)
    }
  }
}
</script>

<style lang="scss" scoped>
  .header {
    width: 100%;
    background: #545c64;
  }
.navbar1 {
  width: 1100px;
  height: 50px;
  margin: 0 auto;
  overflow: hidden;
  position: relative;
  color: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  & .logo {
    float: left;

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
  .el-menu-item.is-active {
      background-color: rgb(84, 92, 100) !important;
  }
  & .left-menu {
    float: left;
    margin-left: 20px;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    & .search {
      width: 200px;
      height: 50px;
      line-height: 50px;
      float: left;
      margin-right: 20px;
      .global-search{
        vertical-align: middle;
      }
    }

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

    /deep/ .avatar-container {
      margin-right: 0!important;
    }
  }
}
</style>
