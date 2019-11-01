<template>
  <div class="form-edit">
    <el-form ref="form" class="form" :model="form" :rules="rules" :status-icon="true" label-width="120px">
      <el-form-item class="required" label="分组名称" prop="groupName">
        <el-input v-model="form.groupName" placeholder="请输入分组名称" clearable />
      </el-form-item>
      <el-form-item label="分组描述">
        <el-input v-model="form.desc" placeholder="请输入分组描述" clearable />
      </el-form-item>
      <el-form-item label="分组排序" prop="order">
        <el-input v-model.number="form.order" placeholder="请输入分组排序" clearable />
      </el-form-item>
      <div id="btnGroup">
        <el-button v-no-more-click type="primary" @click="save('form')">保存</el-button>
        <el-button type="primary" plain @click="cancel('form')">取消</el-button>
      </div>
    </el-form></div>
</template>

<script>
import { addItem } from '@/api/userCenter-groupManage'

export default {
  data() {
    return {
      dataIsChange: 0, // 计数器，据此判断表单是否已编辑
      noLeaveprompt: false, // 表单提交后，设置为true，据此判断提交不再弹出离开提示
      id: '', // 查询id
      form: {
        skill_name: '', // 分组名称
        desc: '', // 分组描述
        groupId: '' // 所属租户
      },
      custom_list: [], // 所属租户list
      rules: {
        skill_name: [
          { required: true, message: '请输入分组名称（长度在 2 到 20 个字符）', trigger: 'blur' },
          { required: true, message: '请输入分组名称（长度在 2 到 20 个字符）', trigger: 'change' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'change' }
        ],
        order: [
          { required: true, type: 'number', message: '请输入数字', trigger: 'blur' },
          { required: true, type: 'number', message: '请输入数字', trigger: 'change' },
          { min: 0, max: 100, type: 'number', message: '最大输入两位数', trigger: 'blur' },
          { min: 0, max: 100, type: 'number', message: '最大输入两位数', trigger: 'change' }
        ],
        groupId: [
          { required: true, message: '请选择所属租户', trigger: 'blur' },
          { required: true, message: '请选择所属租户', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    // this.id = this.$route.query.id
  },
  methods: {
    // 保存
    save(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          addItem(this.form).then(response => {
            this.$message.success('新建分组成功！')
            this.noLeaveprompt = true
            this.$router.push({ path: '/user-center/group-manage/list' })
          })
        }
      })
    },
    // 取消
    cancel(formName) {
      this.$router.push({ path: '/user-center/group-manage/list' })
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
