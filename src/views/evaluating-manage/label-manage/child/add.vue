<template>
  <div class="form-edit">
    <el-form ref="form" class="form" :model="form" :rules="rules" :status-icon="true" label-width="120px">
      <el-form-item class="required" label="标签名称" prop="lname">
        <el-input v-model="form.lname" placeholder="请输入标签名称" clearable />
      </el-form-item>
      <el-form-item label="标签描述">
        <el-input v-model="form.ldesc" type="textarea" placeholder="请输入标签描述" clearable />
      </el-form-item>
    </el-form>
    <div id="btnGroup">
      <el-button v-no-more-click type="primary" @click="save('form')">提交</el-button>
      <el-button type="primary" plain @click="cancel('form')">取消</el-button>
    </div>
  </div>
</template>

<script>
import { label_add } from '@/api/evolution-manage/labelManage.js'
import { getCustomManageList } from '@/api/user-center//roleManage'
import { getUserEgroupInfo } from '@/api/user-center/groupManage'
export default {
  data() {
    return {
      dataIsChange: -1, // 计数器，据此判断表单是否已编辑
      noLeaveprompt: false, // 表单提交后，设置为true，据此判断提交不再弹出离开提示
      form: {
        lname: '', // 标签名称
        ldesc: '', // 标签描述
        egroup: '', // 分组
        selectCompanyId: ''// 租户

      },
      groupList: [], // 所属小组list
      custom_list: [], // 所属租户list
      rules: {
        lname: [
          { required: true, message: '请输入标签名称（长度在 2 到 20 个字符）', trigger: 'blur' },
          { required: true, message: '请输入标签名称（长度在 2 到 20 个字符）', trigger: 'change' },
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
  created() {
    this.form.selectCompanyId = this.$route.query.selectCompanyId
    this.form.egroup = this.$route.query.egroup
    this.getCustomManageList()
    this.getEgroups()
  },
  methods: {
    // 获取所有小组
    getEgroups() {
      getUserEgroupInfo({ selectCompanyId: this.companyIds }).then(response => {
        this.groupList = response.data.egroupInfo
      })
    },
    // 获取所属租户list
    getCustomManageList() {
      getCustomManageList().then(res => {
        this.custom_list = res.data
      })
    },
    // 提交
    save(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          label_add(this.form).then(response => {
            this.$message.success('添加标签成功！')
            this.noLeaveprompt = true
            this.$router.push({ path: '/evaluating-manage/label-manage/detail', query: { id: response.data }})
          })
        }
      })
    },

    // 取消
    cancel(formName) {
      this.$router.push({ path: '/evaluating-manage/label-manage/list' })
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
