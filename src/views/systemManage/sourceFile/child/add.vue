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
          <el-radio :label="2">停用</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div id="btnGroup">
      <el-button v-no-more-click type="primary" @click="save('form')">提交</el-button>
      <el-button type="primary" plain @click="cancel('form')">取消</el-button>
    </div>
  </div>
</template>

<script>
import { source_file_add } from '@/api/system-manage/sourceFile.js'
export default {
  data() {
    return {
      dataIsChange: 0, // 计数器，据此判断表单是否已编辑
      noLeaveprompt: false, // 表单提交后，设置为true，据此判断提交不再弹出离开提示
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
  watch: {
    // 监听表单数据变化
    form: {
      handler(val) {
        if (val) {
          this.dataIsChange++
        }
      },
      deep: true // 深层次监听
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
            this.noLeaveprompt = true
            this.$router.push({ path: '/systemManage/sourceFile/list' })
          })
        }
      })
    },
    // 取消添加文件来源
    cancel(formName) {
      this.$router.push({ path: '/systemManage/sourceFile/list' })
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.dataIsChange && !this.noLeaveprompt) { // 判断表单数据是否变化，以及提交后不进行此保存提示
      setTimeout(() => { // 此处必须要加延迟执行，主要解决浏览器前进后退带来的闪现
        this.$confirm('您的数据尚未保存，是否离开？', '离开页面', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          next()
        }).catch(() => {
          next(false)
        })
      }, 200)
    } else {
      next()
    }
  }
}
</script>

<style lang="scss" scoped>
  #btnGroup{
    padding-left: 120px;
  }
</style>
