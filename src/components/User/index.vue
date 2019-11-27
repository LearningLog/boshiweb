<template>
  <div class="box">
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
        <el-dropdown-item>
          <span @click="modifyPasswordVisible = true">修改密码</span>
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
    <el-dialog
        v-el-drag-dialog
        title="修改密码"
        :visible.sync="modifyPasswordVisible"
        :append-to-body="true"
        width="700px"
    >
      <el-form
          class="modifyPassword"
          ref="modifyPassword"
          :model="user"
          :rules="rules"
          label-width="80px"
      >
        <el-form-item label="原始密码" prop="password">
          <el-input
              v-model="user.password"
              placeholder="请输入原始密码"
              type="password"
              autocomplete="new-password"
              clearable
          />
        </el-form-item>
        <el-form-item label="新密码" prop="confirmpassword">
          <el-input
              v-model="user.confirmpassword"
              placeholder="请输入新密码"
              type="password"
              autocomplete="new-password"
              clearable
          />
        </el-form-item>
        <el-form-item label="确认密码" prop="secondconfirmpassword">
          <el-input
              v-model="user.secondconfirmpassword"
              placeholder="请输入确认密码"
              type="password"
              autocomplete="new-password"
              clearable
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="save">确定</el-button>
        <el-button
            type="primary"
            plain
            @click="cancel"
        >取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { regPwd } from '@/utils/validate'
import { mapGetters } from 'vuex'
import { updatePassword } from '@/api/user'
import elDragDialog from '@/directive/el-drag-dialog'
import avatar1 from '@/assets/images/avatar.png'
export default {
  name: 'User',
  directives: { elDragDialog },
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
    // 校验密码
    var validatePassword = (rule, value, callback) => {
      if (!value && value !== 0) {
        callback(new Error('请输入原始密码'))
      } else if (!regPwd(value)) {
        callback(new Error('6 到 50 位字母和数字的组合'))
      } else {
        callback()
      }
    }
    var validateConfirmpassword = (rule, value, callback) => {
      if (!value && value !== 0) {
        callback(new Error('请输入新密码'))
      } else if (!regPwd(value)) {
        callback(new Error('6 到 50 位字母和数字的组合'))
      } else if (this.user.secondconfirmpassword && value !== this.user.secondconfirmpassword) {
        callback(new Error('两次密码输入不一致'))
      } else {
        callback()
      }
    }
    var validateSecondcon = (rule, value, callback) => {
      if (!value && value !== 0) {
        callback(new Error('请再次输入密码'))
      } else if (!regPwd(value)) {
        callback(new Error('6 到 50 位字母和数字的组合'))
      } else if (this.user.confirmpassword && value !== this.user.confirmpassword) {
        callback(new Error('两次密码输入不一致'))
      } else {
        callback()
      }
    }
    return {
      avatar1,
      modifyPasswordVisible: false,
      user: {
        _id: '', // 用户id
        password: '', // 原密码
        confirmpassword: '', // 新密码
        secondconfirmpassword: '' // 再次密码
      },
      rules: {
        password: [
          { required: true, validator: validatePassword, trigger: 'blur' },
          { required: true, validator: validatePassword, trigger: 'change' }
        ],
        confirmpassword: [
          { required: true, validator: validateConfirmpassword, trigger: 'blur' },
          { required: true, validator: validateConfirmpassword, trigger: 'change' }
        ],
        secondconfirmpassword: [
          { required: true, validator: validateSecondcon, trigger: 'blur' },
          { required: true, validator: validateSecondcon, trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'avatar'
    ])
  },
  methods: {
    // 退出
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push('/login?redirect=/')
      // this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },

    // 修改密码
    save() {
      this.$refs.modifyPassword.validate(valid => {
        if (valid) {
          this.user._id = this.$store.state.user.userSystemInfo.userInfo._id
          console.log(this.user)
          updatePassword(this.user).then(res => {
            this.$message.success('修改密码成功！')
            this.modifyPasswordVisible = false
            this.user.password = ''
            this.user.confirmpassword = ''
            this.user.secondconfirmpassword = ''
            this.$refs.modifyPassword.resetFields()
          })
        }
      })
    },

    // 取消
    cancel() {
      this.modifyPasswordVisible = false
      this.user.password = ''
      this.user.confirmpassword = ''
      this.user.secondconfirmpassword = ''
      this.$refs.modifyPassword.resetFields()
    },

    // 头像加载失败的回调
    avatarErrorHandler() {
      return true
    }
  }
}
</script>

<style lang="scss" scoped>
  .box {
    display: inline-block;
  }
  .modifyPassword {
    width: 500px;
    margin: 0 auto;
  }
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
