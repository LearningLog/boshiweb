<template>
  <div class="form-edit">
    <el-form ref="form" class="form" :model="form" label-width="120px">
      <el-form-item class="required" label="模块名称">
        <el-input v-model="form.modulename" placeholder="请输入模块名称" @blur="modulename_blur_fn" />
        <div class="tip">模块名称,长度1-64位字符</div>
      </el-form-item>
      <el-form-item class="required" label="权限名称">
        <el-input v-model="form.permissionname" placeholder="请输入权限名称" @blur="name_blur_fn" />
        <div class="tip">权限名称,长度1-64位字符</div>
      </el-form-item>
      <el-form-item class="required" label="权限标识">
        <el-input v-model="form.permissionmark" placeholder="请输入权限标识" @blur="mark_blur_fn" />
        <div class="tip">权限标识,长度1-64位字符</div>
      </el-form-item>
      <el-form-item class="required" label="权限code">
        <el-input v-model="form.permissioncode" placeholder="请输入权限code" @blur="code_blur_fn" />
        <div class="tip">权限code,长度1-64位字符</div>
      </el-form-item>
      <el-form-item label="权限描述">
        <el-input v-model="form.permissiondesc" placeholder="请输入权限描述" />
      </el-form-item>
    </el-form>
    <div id="btnGroup">
      <el-button type="primary" @click="onSubmit">确定</el-button>
      <el-button type="primary" plain>取消</el-button>
    </div>
  </div>
</template>

<script>
import { strLength } from '@/utils/validate'
import { permission_edit, permission_det } from '@/api/systemManage-permissionManage.js'
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
  created() {
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
      const that = this
      const query_param = that.query_param
      const param = {}
      const modulename = that.form.modulename
      const permissionmark = that.form.permissionmark
      const code = that.form.permissioncode
      const name = that.form.permissionname
      if (!strLength(modulename, 1, 64)) {
        that.$message.error('模块名称,长度1-64位字符')
        return
      }
      if (!strLength(name, 1, 64)) {
        that.$message.error('权限名称,长度1-64位字符')
        return
      }
      if (!strLength(permissionmark, 1, 64)) {
        this.$message.error('权限标识,长度1-64位字符')
        return
      }
      if (!strLength(code, 1, 64)) {
        that.$message.error('权限code,长度1-64位字符')
        return
      }
      param.modulename = modulename
      param.permissionname = name
      param.permissioncode = code
      param.permissionmark = permissionmark
      permission_edit(param).then(res => {
        that.$message({
          message: res.message,
          type: 'success'
        })
        this.$router.push({ path: '/systemManage/permissionManage/detail', query: { ids: query_param }})
      }).catch(error => {
        console.log(error)
      })
    },
    modulename_blur_fn() {
      const modulename = this.form.modulename
      if (!strLength(modulename, 1, 64)) {
        this.$message.error('模块名称,长度1-64位字符')
        return
      }
    },
    name_blur_fn() {
      const name = this.form.permissionname
      if (!strLength(name, 1, 64)) {
        this.$message.error('权限名称,长度1-64位字符')
        return
      }
    },
    mark_blur_fn() {
      const mark = this.form.permissionmark
      if (!strLength(mark, 1, 64)) {
        this.$message.error('权限标识,长度1-64位字符')
        return
      }
    },
    code_blur_fn() {
      const code = this.form.permissioncode
      if (!strLength(code, 1, 64)) {
        this.$message.error('权限code,长度1-64位字符')
        return
      }
    }
  }

}
</script>

<style lang="scss" scoped>
  #btnGroup{
    padding-left: 120px;
  }
</style>
