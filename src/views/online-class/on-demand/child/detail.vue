<template>
  <div class="form-edit">
    <el-form
      class="form"
      :model="form"
      label-width="130px"
    >
      <el-form-item label="租户名称：">
        <span>{{ form.customname }}</span>
      </el-form-item>
      <el-form-item label="租户描述：">
        <span>{{ form.desc }}</span>
      </el-form-item>
      <el-form-item label="最大用户数：">
        <span>{{ form.userCount }}</span>
      </el-form-item>
      <el-form-item label="租户状态：">
        <span>{{ form.customStatus === 1 ? '生效' : '失效' }}</span>
      </el-form-item>
      <el-form-item label="开通智能搜索：">
        <span>{{ form.text_extraction === 1 ? '开启' : '关闭' }}</span>
      </el-form-item>
      <el-form-item label="租户管理员：">
        <span>{{ form.username }}</span>
      </el-form-item>
      <el-form-item label="管理员昵称：">
        <span>{{ form.nickname }}</span>
      </el-form-item>
      <el-form-item label="平台Logo：">
        <img v-if="form.pcLogoFileUrl" :src="form.pcLogoFileUrl">
      </el-form-item>
      <el-form-item label="移动端Logo：">
        <img v-if="form.mobileLogoFileUrl" :src="form.mobileLogoFileUrl">
      </el-form-item>
      <el-form-item label="个性化系统名称：">
        <span>{{ form.customSystemName }}</span>
      </el-form-item>
    </el-form>
    <div id="btnGroup">
      <el-button type="primary" @click="confirm">确定</el-button>
    </div>
  </div>
</template>

<script>
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
import { getOneTenant } from '@/api/system-manage/tenantManage'

export default {
  directives: { elDragDialog },
  data() {
    return {
      form: { // 表单数据
        customname: '', // 租户名称
        desc: '', // 描述
        userCount: '', // 最大用户数量
        customStatus: 1, // 租户状态
        text_extraction: 1, // 开通智能搜索
        uName: '', // 租户管理员
        uNickname: '', // 管理员昵称
        uPwd: '', // 管理员密码
        pcLogoFileId: '', // 平台Logo id
        pcLogoFileUrl: '', // 平台Logo url
        mobileLogoFileId: '', // 移动端Logo id
        mobileLogoFileUrl: '', // 移动端Logo url
        customSystemName: '' // 个性化系统名称
      },
      id: '' // 查询id
    }
  },
  created() {
    this.id = this.$route.query._id
    this.getTenant()
  },
  methods: {
    // 获取初始数据
    getTenant() {
      getOneTenant({ _id: this.id }).then(response => {
        this.form = response.data.custom
        this.form.nickname = response.data.user.nickname
        this.form.username = response.data.user.username
      })
    },
    // 确定
    confirm() {
      this.$router.push({ path: '/systemManage/tenantManage/list' })
    }
  }
}
</script>

<style lang="scss" scoped>
#btnGroup {
  padding-left: 130px;
}
.el-form-item__content img {
  width: 200px;
}

</style>
