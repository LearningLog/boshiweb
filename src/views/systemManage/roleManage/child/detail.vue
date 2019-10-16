<template>
  <div class="form-edit">
    <el-form ref="form" class="form" :model="form" label-width="100px">
      <el-form-item class="" label="角色名称：">
        <span>{{ form.rolename }}</span>
      </el-form-item>
      <el-form-item class="" label="角色描述：">
        <span>{{ form.desc }}</span>
      </el-form-item>
      <el-form-item class="" label="所属租户：">
        <span>{{ form.customname }}</span>
      </el-form-item>
    </el-form>
    <div id="btnGroup">
      <el-button type="primary" @click="confirm">确定</el-button>
    </div>
  </div>
</template>

<script>
import { getOneRole } from '@/api/systemManage-roleManage'

export default {
  data() {
    return {
      form: { // 表单数据
        rolename: '', // 角色名称
        desc: '', // 角色描述
        customname: '' // 所属租户
      },
      id: '' // 查询id
    }
  },
  created() {
    this.id = this.$route.query.id
    this.getInitData()
  },
  methods: {
    // 获取初始数据
    getInitData() {
      getOneRole({ _id: this.id }).then(response => {
        this.form = response.data.role
      })
    },
    // 确定
    confirm() {
      this.$router.push({ path: '/systemManage/roleManage/list' })
    }
  }
}
</script>

<style scoped>
  .el-form-item__content .el-input {
    width: calc(100% - 120px);
  }
  #btnGroup {
    padding-left: 100px;
  }
</style>
