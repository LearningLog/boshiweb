<template>
  <div class="form-edit">
    <el-form ref="form" class="form" :model="form" :rules="rules" :status-icon="true" label-width="120px">
      <el-form-item class="required" label="模块名称" prop="modulename">
        <el-input v-model="form.modulename" placeholder="请输入模块名称" clearable />
      </el-form-item>
      <el-form-item class="required" label="权限名称" prop="permissionname">
        <el-input v-model="form.permissionname" placeholder="请输入权限名称" clearable />
      </el-form-item>
      <el-form-item class="required" label="权限标识" prop="permissionmark">
        <el-input v-model="form.permissionmark" placeholder="请输入权限标识" clearable />
      </el-form-item>
      <el-form-item class="required" label="权限code" prop="permissioncode">
        <el-input v-model="form.permissioncode" placeholder="请输入权限code" clearable />
      </el-form-item>
      <el-form-item label="权限描述">
        <el-input v-model="form.permissiondesc" type="textarea" :rows="3" placeholder="请输入权限描述" />
      </el-form-item>
    </el-form>
    <div id="btnGroup">
      <el-button type="primary" @click="save('form')">保存</el-button>
      <el-button type="primary" plain @click="cancel('form')">取消</el-button>
    </div>
  </div>
</template>

<script>
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
      query_param: '',
      rules: {
        modulename: [
          { required: true, message: '请输入模块名称（长度在 1 到 64 个字符）', trigger: 'blur' },
          { required: true, message: '请输入模块名称（长度在 1 到 64 个字符）', trigger: 'change' },
          { min: 1, max: 64, message: '长度在 1 到 64 个字符', trigger: 'blur' },
          { min: 1, max: 64, message: '长度在 1 到 64 个字符', trigger: 'change' }
        ],
        permissionname: [
          { required: true, message: '请输入权限名称（长度在 1 到 64 个字符）', trigger: 'blur' },
          { required: true, message: '请输入权限名称（长度在 1 到 64 个字符）', trigger: 'change' },
          { min: 1, max: 64, message: '长度在 1 到 64 个字符', trigger: 'blur' },
          { min: 1, max: 64, message: '长度在 1 到 64 个字符', trigger: 'change' }
        ],
        permissionmark: [
          { required: true, message: '请输入权限标识（长度在 1 到 64 个字符）', trigger: 'blur' },
          { required: true, message: '请输入权限标识（长度在 1 到 64 个字符）', trigger: 'change' },
          { min: 1, max: 64, message: '长度在 1 到 64 个字符', trigger: 'blur' },
          { min: 1, max: 64, message: '长度在 1 到 64 个字符', trigger: 'change' }
        ],
        permissioncode: [
          { required: true, message: '请输入权限code（长度在 1 到 64 个字符）', trigger: 'blur' },
          { required: true, message: '请输入权限code（长度在 1 到 64 个字符）', trigger: 'change' },
          { min: 1, max: 64, message: '长度在 1 到 64 个字符', trigger: 'blur' },
          { min: 1, max: 64, message: '长度在 1 到 64 个字符', trigger: 'change' }
        ]
      }
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
        that.form.modulename = res.data.permission.modulename
        that.form.permissionname = res.data.permission.permissionname
        that.form.permissionmark = res.data.permission.permissionmark
        that.form.permissioncode = res.data.permission.permissioncode
        that.form.permissiondesc = res.data.permission.permissiondesc
      }).catch(error => {
        console.log(error)
      })
    },
    save(formName) {
      const query_param = this.query_param
      this.$refs[formName].validate((valid) => {
        if (valid) {
          permission_edit(this.form).then(response => {
            this.$message.success('修改成功')
            this.$router.push({ path: '/systemManage/permissionManage/detail', query: { ids: query_param }})
          })
        }
      })
    },
    cancel(formName) {
      this.$refs[formName].resetFields()
      this.$router.push({ path: '/systemManage/permissionManage/list' })
    }
  }

}
</script>

<style lang="scss" scoped>
  #btnGroup{
    padding-left: 120px;
  }
</style>
