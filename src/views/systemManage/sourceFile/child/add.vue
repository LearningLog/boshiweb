<template>
  <div class="form-edit">
    <el-form ref="form" class="form" :model="form" :rules="rules" :status-icon="true" label-width="120px">
      <el-form-item class="required" label="文件代码" prop="code">
        <el-input v-model="form.code" placeholder="请输入文件代码" clearable />
      </el-form-item>
      <el-form-item class="required" label="文件名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入文件名称" clearable />
      </el-form-item>
      <el-form-item label="是否启用" prop="enable_status">
        <el-radio-group v-model="form.enable_status">
          <el-radio :label="1">启用</el-radio>
          <el-radio :label="2">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div id="btnGroup">
      <el-button type="primary" @click="save('form')">提交</el-button>
      <el-button type="primary" plain @click="cancel('form')">取消</el-button>
    </div>
  </div>
</template>

<script>
import { source_file_add } from '@/api/systemManage-sourceFile.js'
export default {
  data() {
    return {
      form: {
        code: '',
        name: '',
        enable_status: 1
      },
      rules: {
        code: [
          { required: true, message: '请输入文件代码（长度在 2 到 64 个字符）', trigger: 'blur' },
          { required: true, message: '请输入文件代码（长度在 2 到 64 个字符）', trigger: 'change' },
          { min: 2, max: 64, message: '长度在 2 到 64 个字符', trigger: 'blur' },
          { min: 2, max: 64, message: '长度在 2 到 64 个字符', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入文件名称（长度在 2 到 64 个字符）', trigger: 'blur' },
          { required: true, message: '请输入文件名称（长度在 2 到 64 个字符）', trigger: 'change' },
          { min: 2, max: 64, message: '长度在 2 到 64 个字符', trigger: 'blur' },
          { min: 2, max: 64, message: '长度在 2 到 64 个字符', trigger: 'change' }
        ]
      }
    }
  },
  created() {
  },
  methods: {
    // 添加文件来源
    save(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          source_file_add(this.form).then(response => {
            this.$message.success('添加成功')
            this.$router.push({ path: '/systemManage/sourceFile/list' })
          })
        }
      })
    },
    // 取消添加文件来源
    cancel(formName) {
      this.$refs[formName].resetFields()
      this.$router.push({ path: '/systemManage/sourceFile/list' })
    }

  }

}
</script>

<style lang="scss" scoped>
  #btnGroup{
    padding-left: 120px;
  }
</style>
