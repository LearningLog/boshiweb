<template>
  <div class="form-edit">
    <el-form
      class="form"
      :model="form"
      label-width="130px"
    >
      <el-form-item label="租户名称：">
        <span>{{form.customname}}</span>
      </el-form-item>
      <el-form-item label="租户描述：">
        <span>{{form.desc}}</span>
      </el-form-item>
      <el-form-item label="最大用户数：">
        <span>{{form.userCount}}</span>
      </el-form-item>
      <el-form-item label="租户状态：">
        <span>{{ form.customStatus === 1 ? '生效' : '失效' }}</span>
      </el-form-item>
      <el-form-item label="开通智能搜索：">
        <span>{{ form.text_extraction === 1 ? '开启' : '关闭' }}</span>
      </el-form-item>
      <el-form-item label="租户管理员：">
        <span>{{form.username}}</span>
      </el-form-item>
      <el-form-item label="管理员昵称：">
        <span>{{form.nickname}}</span>
      </el-form-item>
      <el-form-item label="平台Logo：">
        <img v-if="form.pcLogoFileUrl" :src="form.pcLogoFileUrl" />
      </el-form-item>
      <el-form-item label="移动端Logo：">
        <img v-if="form.mobileLogoFileUrl" :src="form.mobileLogoFileUrl" />
      </el-form-item>
      <el-form-item label="个性化系统名称：">
        <span>{{form.customSystemName}}</span>
      </el-form-item>
    </el-form>
    <div id="btnGroup">
      <el-button type="primary" @click="confirm">确定</el-button>
    </div>
  </div>
</template>

<script>
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
import { getOneTenant } from '@/api/systemManage-tenantManage'

export default {
  directives: { elDragDialog },
  data() {
    return {
      form: {
        customname: '',
        desc: '',
        userCount: '',
        customStatus: 1,
        text_extraction: 1,
        username: '',
        nickname: '',
        uPwd: '',
        pcLogoFileId: '',
        pcLogoFileUrl: '',
        mobileLogoFileId: '',
        mobileLogoFileUrl: '',
        customSystemName: ''
      },
      id: ''
    }
  },
  created() {
    this.id = this.$route.query._id
    this.getTenant()
  },
  methods: {
    getTenant() {
      getOneTenant({ _id: this.id }).then(response => {
        this.form = response.data.custom
        this.form.nickname = response.data.user.nickname
        this.form.username = response.data.user.username
      })
    },
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
