<template>
  <el-dropdown class="avatar-container" trigger="click">
    <div class="avatar-wrapper">
      <el-avatar class="" :src="avatar || avatar1" @error="avatarErrorHandler">
        <img :src="avatar1">
      </el-avatar>
      <i :style="customStyle" :hover="customStyle" class="el-icon-caret-bottom" />
    </div>
    <el-dropdown-menu slot="dropdown" class="user-dropdown">
      <el-dropdown-item>
        {{ this.$store.state.user.userSystemInfo.userInfo.nickname }}
      </el-dropdown-item>
      <router-link to="/">
        <el-dropdown-item>
          Home
        </el-dropdown-item>
      </router-link>
      <el-dropdown-item divided>
        <span style="display:block;" @click="logout">退出</span>
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { mapGetters } from 'vuex'
import avatar1 from '@/assets/images/avatar.png'
export default {
  name: 'User',
  props: {
    customStyle: {
      type: Object,
      default: function() {
        return {
          color: '#66666'
        }
      }
    }
  },
  data() {
    return {
      avatar1
    }
  },
  computed: {
    ...mapGetters([
      'avatar'
    ])
  },
  methods: {
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },

    // 头像加载失败的回调
    avatarErrorHandler() {
      return true
    }
  }
}
</script>

<style lang="scss" scoped>
	.avatar-container {
		margin-right: 30px;
    padding: 0 8px;
    transition: background 0.5s;
    display: inline-block;
    vertical-align: middle;

		.avatar-wrapper {
			margin-top: 5px;
			position: relative;
      height: 45px;

			.user-avatar {
				cursor: pointer;
				width: 40px;
				height: 40px;
				border-radius: 10px;
			}

			.el-icon-caret-bottom {
				cursor: pointer;
				position: absolute;
				right: -20px;
				top: 25px;
				font-size: 12px;
			}
		}
    &:hover {
      box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
      cursor: pointer;
    }
	}
</style>
