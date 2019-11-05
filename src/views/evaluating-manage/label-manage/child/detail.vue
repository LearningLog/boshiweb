<template>
  <div class="form-edit">
    <el-form
      class="form"
      :model="form"
      label-width="120px"
    >
      <el-form-item label="标签名称：">
        <span>{{ form.username }}</span>
      </el-form-item>
      <el-form-item label="所属小组：">
        <span>{{ form.customname }}</span>
      </el-form-item>
      <el-form-item label="描述：">
        <span>{{ form.nickname }}</span>
      </el-form-item>
    </el-form>
    <div id="btnGroup">
      <el-button type="primary" @click="confirm">确定</el-button>
    </div>
  </div>
</template>

<script>
import { getUserById } from '@/api/userCenter-userManage'

export default {
  data() {
    return {
      id: null, // 查询id
      dataIsChange: 0, // 计数器，据此判断表单是否已编辑
      noLeaveprompt: false, // 表单提交后，设置为true，据此判断提交不再弹出离开提示
      setRolesDialogVisible: false,
      form: {
        username: '', // 用户名称
        customname: '', // 所属企业
        nickname: '', // 昵称
        phone: '', // 手机号
        password: '', // 密码
        userStatusName: '', // 状态
        email: '', // 邮箱
        desc: '', // 描述
        rolename: [], // 角色名称集合
        egroups: [], // 所属分组名称
        incName: [] // 管理小组名称
      }
    }
  },
  created() {
    this.id = this.$route.query.id
    this.getUserById()
  },
  methods: {
    // 获取所属企业list
    getUserById() {
      getUserById({ _id: this.id }).then(res => {
        this.form = res.data.user
        this.form.rolename = []
        this.form.egroups = []
        this.form.incName = []
        res.data.user.roleList.forEach(item => {
          this.form.rolename.push(item.rolename)
        })
        res.data.user.groupList.forEach(item => {
          this.form.egroups.push(item.groupName)
          if (item.manage) {
            this.form.incName.push(item.groupName)
          }
        })
      })
    },
    // 确定
    confirm() {
      this.$router.push({ path: '/evaluating-manage/label-manage/list' })
    }
  }
}
</script>

<style lang="scss" scoped>
  #btnGroup {
    padding-left: 120px;
  }
</style>
