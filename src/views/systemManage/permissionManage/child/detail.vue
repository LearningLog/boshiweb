<template>
  <div class="det-box">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="模块名称:">
        <p class="item">{{ form.modulename }}</p>
      </el-form-item>
      <el-form-item label="权限名称:">
        <p class="item">{{ form.permissionname }}</p>
      </el-form-item>
      <el-form-item label="权限标识:">
        <p class="item">{{ form.permissionmark }}</p>
      </el-form-item>
      <el-form-item label="权限code:">
        <p class="item">{{ form.permissioncode }}</p>
      </el-form-item>
      <el-form-item label="权限描述:">
        <p class="item">{{ form.permissiondesc }}</p>
      </el-form-item>
    </el-form>
    <div class="btn-box">
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
        that.form.modulename = res.data.permission.modulename ? res.data.permission.modulename : '--'
        that.form.permissionname = res.data.permission.permissionname ? res.data.permission.permissionname : '--'
        that.form.permissionmark = res.data.permission.permissionmark ? res.data.permission.permissionmark : '--'
        that.form.permissioncode = res.data.permission.permissioncode ? res.data.permission.permissioncode : '--'
        that.form.permissiondesc = res.data.permission.permissiondesc ? res.data.permission.permissiondesc : '--'
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
  .det-box{
    .item{
      font-size: 14px;
      margin: 0 0 0 5px;
    }
    .btn-box{
      margin-left: 120px;
    }
  }

</style>
