<template>
  <div class="form-edit">
    <el-form
      class="form"
      :model="form"
      label-width="120px"
    >
      <el-form-item label="用户名称：">
        <span>{{ form.username }}</span>
      </el-form-item>
      <el-form-item label="所属企业：">
        <span>{{ form.customname }}</span>
      </el-form-item>
      <el-form-item label="昵称：">
        <span>{{ form.nickname }}</span>
      </el-form-item>
      <el-form-item label="用户类型：">
        <span>{{ form.type == 2 ? '管理层' : '非管理层' }}</span>
      </el-form-item>
      <el-form-item label="手机号：">
        <span>{{ form.phone }}</span>
      </el-form-item>
      <el-form-item label="用户状态：">
        <span>{{ form.userStatusName }}</span>
      </el-form-item>
      <el-form-item label="邮箱：">
        <span>{{ form.email }}</span>
      </el-form-item>
      <el-form-item label="描述：">
        <span class="pre-wrap">{{ form.desc }}</span>
      </el-form-item>
      <el-form-item label="角色：">
        <span class="rolename" v-for="role in roleList" :key="role._id">{{ role.rolename }}</span>
      </el-form-item>
      <el-form-item label="小组：">
        <span class="groupName" v-for="group in groupList" :key="group.inc">{{ group.groupName }}</span>
      </el-form-item>
      <el-form-item label="管理小组：">
        <span class="groupName" v-for="group in groupList" :key="group.inc"><span v-if="group.manage">{{ group.groupName }}</span></span>
      </el-form-item>
    </el-form>
    <div id="btnGroup">
      <el-button type="primary" @click="confirm">确定</el-button>
    </div>
  </div>
</template>

<script>
import { getUserById } from '@/api/user-center/userManage'

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
        roleList: [], // 角色集合
        groupList: [] // 所属分组
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
        this.roleList = res.data.user.roleList || []
        this.groupList = res.data.user.groupList || []
      })
    },
    // 确定
    confirm() {
      this.$router.push({ path: '/user-center/user-manage/list' })
    }
  }
}
</script>

<style lang="scss" scoped>
  #btnGroup {
    padding-left: 120px;
  }
  .rolename, .groupName {
    display: inline-block;
    margin-right: 20px;
  }
</style>
