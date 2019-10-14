<template>
  <div class="form-edit">
    <el-form ref="form" class="form" :model="form" label-width="120px">
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
      <el-form-item label="所属菜单:">
        <span>{{ form.permissionbelongmenuname }}</span>
      </el-form-item>
      <el-form-item label="权限类别:">
        <span>{{ form.permissionmanage_name }}</span>
      </el-form-item>
    </el-form>
    <div id="btnGroup">
      <el-button type="primary" @click="onSubmit">确定</el-button>
    </div>
  </div>
</template>

<script>
import { permission_det, permission_manage_type } from '@/api/systemManage-permissionManage.js'
export default {
  data() {
    return {
      form: {
        permissionname: '',
        permissionmark: '',
        permissioncode: '',
        permissiondesc: '',
        permissionmanage: '',
        permissionbelongmenuname: '',
        permissionmanage_name: ''
      },
      manage_type: [],
      query_param: ''
    }
  },
  created(options) {
    this.query_param = this.$route.query.ids
    this.get_permission_manage_type()
    this.get_det()
  },
  methods: {
    get_det() {
      const that = this
      const param = {}
      param._id = this.query_param
      permission_det(param).then(res => {
        const res_dt = res.data.permission
        that.form.permissionname = res_dt.permissionname
        that.form.permissionmark = res_dt.permissionmark
        that.form.permissioncode = res_dt.permissioncode
        that.form.permissiondesc = res_dt.permissiondesc
        that.form.permissionbelongmenuname = res_dt.permissionbelongmenuname
        that.manage_type.forEach(item => {
          if (res_dt.permissionmanage === item.permissionmanage) {
            that.form.permissionmanage_name = item.name
          }
        })
      }).catch(error => {
        console.log(error)
      })
    },
    get_permission_manage_type() {
      const param = {}
      permission_manage_type(param).then(response => {
        this.manage_type = response.data
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
