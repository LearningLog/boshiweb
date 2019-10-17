<template>
  <div class="form-edit">
    <el-form ref="form" class="form" :model="form" :rules="rules" :status-icon="true" label-width="120px">
      <el-form-item class="required" label="类别名称" prop="newscategory_name">
        <el-input v-model="form.newscategory_name" placeholder="请输入类别名称" clearable />
      </el-form-item>
      <el-form-item label="类别描述">
        <el-input v-model="form.newscategory_desc" type="textarea" :rows="3" placeholder="请输入权限名称" clearable />
      </el-form-item>
    </el-form>
    <div id="btnGroup">
      <el-button type="primary" :disabled="sub_dis" @click="save('form')">提交</el-button>
      <el-button type="primary" plain @click="cancel('form')">取消</el-button>
    </div>
  </div>
</template>

<script>
import { newscategory_add } from '@/api/systemManage-newsCategorry.js'
export default {
  data() {
    return {
      form: {
        newscategory_name: '',
        newscategory_desc: ''
      },
      sub_dis: false,
      rules: {
        newscategory_name: [
          { required: true, message: '请输入类别名称（长度在 2 到 20个字符）', trigger: 'blur' },
          { required: true, message: '请输入类别名称（长度在 2 到 20 个字符）', trigger: 'change' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    // 确认添加类别
    save(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.sub_dis = true
          newscategory_add(this.form).then(response => {
            this.$message.success('添加成功！')
            this.$router.push({ path: '/systemManage/newsCategory/detail', query: { id: response.data._id }})
          })
        }
      })
    },
    // 取消添加类别
    cancel(formName) {
      this.$refs[formName].resetFields()
      this.$router.push({ path: '/systemManage/newsCategory' })
    }
  }

}
</script>

<style lang="scss" scoped>
  #btnGroup{
    padding-left: 120px;
  }
</style>
