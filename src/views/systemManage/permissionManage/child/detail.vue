<template>
  <div class="form-edit">
    <el-form ref="form" class="form" :model="form" label-width="120px">
      <el-form-item label="模块名称:">
        <span>{{ form.modulename }}</span>
      </el-form-item>
      <el-form-item label="权限名称:">
        <span>{{ form.permissionname }}</span>
      </el-form-item>
      <el-form-item label="权限标识:">
        <span>{{ form.permissionmark }}</span>
      </el-form-item>
      <el-form-item label="权限code:">
        <span>{{ form.permissioncode }}</span>
      </el-form-item>
      <el-form-item label="权限描述:">
        <span>{{ form.permissiondesc }}</span>
      </el-form-item>
    </el-form>
    <div id="btnGroup">
      <el-button type="primary" @click="onSubmit">确定</el-button>
    </div>
  </div>
</template>

<script>
import { permission_det } from '@/api/systemManage-permissionManage.js'
export default {
  data() {
    return {
      form: {
        modulename: '',
        permissionname: '',
        permissionmark: '',
        permissioncode: '',
        permissiondesc: ''
      },
      query_param: ''
    }
  },
  created(options) {
    this.query_param = this.$route.query.ids
    this.get_det()
  },
  methods: {
    get_det() {
      const that = this
      const param = {}
      param._id = this.query_param
      permission_det(param).then(res => {
        that.form.modulename = res.data.permission.modulename ? res.data.permission.modulename : ''
        that.form.permissionname = res.data.permission.permissionname ? res.data.permission.permissionname : ''
        that.form.permissionmark = res.data.permission.permissionmark ? res.data.permission.permissionmark : ''
        that.form.permissioncode = res.data.permission.permissioncode ? res.data.permission.permissioncode : ''
        that.form.permissiondesc = res.data.permission.permissiondesc ? res.data.permission.permissiondesc : ''
      }).catch(error => {
        console.log(error)
      })
    },
    onSubmit() {
      this.$router.push({ path: '/systemManage/permissionManage' })
    }

  }

}
</script>

<style lang="scss" scoped>
    #btnGroup{
      padding-left: 120px;
    }
</style>
