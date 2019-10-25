<template>
  <el-dropdown class="avatar-container" trigger="click">
    <div class="avatar-wrapper">
      <img :src="avatar ? avatar : avatar1 " class="user-avatar">
      <i :style="customStyle" class="el-icon-caret-bottom" />
    </div>
    <el-dropdown-menu slot="dropdown" class="user-dropdown">
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
    }
  }
}
</script>

<style lang="scss" scoped>
	.avatar-container {
		margin-right: 30px;
    padding: 0 8px;
    transition: background 0.5s;

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
      background-color: #f9f9f9;
      cursor: pointer;
    }
	}
</style>
