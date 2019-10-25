<template>
  <div class="form-edit">
    <el-form ref="form" class="form" :model="form" :rules="rules" :status-icon="true" label-width="120px">
      <el-form-item class="required" label="类别名称" prop="newscategory_name">
        <el-input v-model="form.newscategory_name" placeholder="请输入类别名称" clearable />
      </el-form-item>
      <el-form-item label="类别描述">
        <el-input v-model="form.newscategory_desc" type="textarea" :rows="3" placeholder="请输入类别描述" clearable />
      </el-form-item>
    </el-form>
    <div id="btnGroup">
      <el-button v-no-more-click type="primary" @click="save('form')">提交</el-button>
      <el-button type="primary" plain @click="cancel('form')">取消</el-button>
    </div>
  </div>
</template>

<script>
import { newscategory_add } from '@/api/systemManage-newsCategorry.js'
export default {
  data() {
    return {
      dataIsChange: 0, // 计数器，据此判断表单是否已编辑
      noLeaveprompt: false, // 表单提交后，设置为true，据此判断提交不再弹出离开提示
      form: {
        newscategory_name: '',
        newscategory_desc: ''
      },
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
  methods: {
    // 确认添加类别
    save(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          newscategory_add(this.form).then(response => {
            this.$message.success('添加成功！')
            this.noLeaveprompt = true
            this.$router.push({ path: '/systemManage/newsCategory/detail', query: { id: response.data._id }})
          })
        }
      })
    },
    // 取消添加类别
    cancel(formName) {
      this.$router.push({ path: '/systemManage/newsCategory' })
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
