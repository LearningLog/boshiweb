<template>
  <div class="form-edit">
    <el-form ref="form" class="form" :model="form" :rules="rules" :status-icon="true" label-width="120px">
      <el-form-item class="required" label="文件代码" prop="code">
        <el-input v-model="form.code" placeholder="请输入系统代码" clearable />
        <div class="tip">文件代码,长度2-64位字符</div>
      </el-form-item>
      <el-form-item class="required" label="文件名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入文件名称" clearable />
        <div class="tip">文件名称,长度2-64位字符</div>
      </el-form-item>
      <el-form-item label="是否启用" prop="enable_status">
        <el-radio-group v-model="form.enable_status">
          <el-radio :label="1">启用</el-radio>
          <el-radio :label="2">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div id="btnGroup">
      <el-button type="primary" @click="save('form')">保存</el-button>
      <el-button type="primary" plain @click="cancel('form')">取消</el-button>
    </div>
  </div>
</template>

<script>
import { source_file_edit } from '@/api/systemManage-sourceFile.js'
export default {
  data() {
    return {
      form: {
        code: '',
        name: '',
        enable_status: null
      },
      query_param: {},
      rules: {
        code: [
          { required: true, message: '请输入模块名称（长度在 2 到 64 个字符）', trigger: 'blur' },
          { required: true, message: '请输入模块名称（长度在 2 到 64 个字符）', trigger: 'change' },
          { min: 2, max: 64, message: '长度在 2 到 64 个字符', trigger: 'blur' },
          { min: 2, max: 64, message: '长度在 2 到 64 个字符', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入权限名称（长度在 2 到 64 个字符）', trigger: 'blur' },
          { required: true, message: '请输入权限名称（长度在 2 到 64 个字符）', trigger: 'change' },
          { min: 2, max: 64, message: '长度在 2 到 64 个字符', trigger: 'blur' },
          { min: 2, max: 64, message: '长度在 2 到 64 个字符', trigger: 'change' }
        ]
      }
    }
  },
  created(options) {
    this.query_param = this.$route.query.queryDt
    this.get_original_info()
  },
  methods: {
    get_original_info() {
      const that = this
      const param = {}
      param.ids = that.query_param._id
      // 根据id获取单个数据
      that.form.code = that.query_param.code
      that.form.name = that.query_param.name
      that.form.enable_status = that.query_param.enable_status
    },
    save(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.form._id = this.query_param._id
          source_file_edit(this.form).then(response => {
            this.$message.success('修改成功')
            this.$router.push({ path: '/systemManage/sourceFile' })
          })
        }
      })
    },
    cancel(formName) {
      this.$refs[formName].resetFields()
      this.$router.push({ path: '/systemManage/sourceFile' })
    }

  }

}
</script>

<style lang="scss" scoped>
  #btnGroup{
    padding-left: 120px;
  }
</style>
