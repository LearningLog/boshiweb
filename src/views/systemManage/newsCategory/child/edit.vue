<template>
  <div class="form-edit">
    <el-form ref="form" class="form" :model="form" :rules="rules" :status-icon="true" label-width="120px">
      <el-form-item class="required" label="类别名称" prop="newscategory_name">
        <el-input v-model="form.newscategory_name" placeholder="请输入类别名称" clearable />
      </el-form-item>
      <el-form-item class="required" label="类别描述" prop="newscategory_desc">
        <el-input v-model="form.newscategory_desc" type="textarea" :rows="3" placeholder="请输入权限名称" clearable />
      </el-form-item>
    </el-form>
    <div id="btnGroup">
      <el-button type="primary" :disabled="sub_dis" @click="save('form')">保存</el-button>
      <el-button type="primary" plain @click="cancel('form')">取消</el-button>
    </div>
  </div>
</template>

<script>
import { newscategory_one, newscategory_edit } from '@/api/systemManage-newsCategorry.js'
export default {
  data() {
    return {
      form: {
        newscategory_name: '',
        newscategory_desc: '',
        _id: ''
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
  created() {
    this.form._id = this.$route.query.id
    this.get_det()
  },
  methods: {
    // 根据id获取原始值
    get_det() {
      const that = this
      const param = {}
      param._id = this.form._id
      newscategory_one(param).then(res => {
        const dt = res.data.newscategory
        that.form.newscategory_name = dt.newscategory_name ? dt.newscategory_name : ''
        that.form.newscategory_desc = dt.newscategory_desc ? dt.newscategory_desc : ''
      }).catch(error => {
        console.log(error)
      })
    },
    // 保存修改
    save(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.sub_dis = true
          newscategory_edit(this.form).then(response => {
            this.$message.success('修改成功！')
            this.$router.push({ path: '/systemManage/newsCategory/detail', query: { id: this.form._id }})
          })
        }
      })
    },
    cancel(formName) {
      this.$router.push({ path: '/systemManage/newsCategory/list' })
    }
  }

}
</script>

<style lang="scss" scoped>
  #btnGroup{
    padding-left: 120px;
  }
</style>
