<template>
  <div class="form-edit">
    <el-form ref="form" class="form" :model="form" :rules="rules" :status-icon="true" label-width="120px">
      <el-form-item class="required" label="标签名称" prop="lname">
        <el-input v-model="form.lname" placeholder="请输入标签名称" clearable />
      </el-form-item>
      <el-form-item label="所属小组">
        <el-select v-model="form.egroup" placeholder="请选择所属小组" clearable filterable>
          <el-option
            v-for="item in groupList"
            :key="item.inc"
            :label="item.groupName"
            :value="item.inc"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="描述">
        <el-input
          type="textarea"
          :rows="2"
          placeholder="请输入内容"
          v-model="form.ldesc">
        </el-input>
      </el-form-item>
    </el-form>
    <div id="btnGroup">
      <el-button v-no-more-click type="primary" @click="save('form')">保存</el-button>
      <el-button type="primary" plain @click="cancel('form')">取消</el-button>
    </div>
  </div>
</template>

<script>
import { getOneLabel,label_edit } from '@/api/onlineclass-label-manage.js'
import { getUserEgroupInfo } from '@/api/userCenter-groupManage'
export default {
  data() {
    return {
      dataIsChange: 0, // 计数器，据此判断表单是否已编辑
      noLeaveprompt: false, // 表单提交后，设置为true，据此判断提交不再弹出离开提示
      id: '', // 查询id
      form: {
        lname: '', // 标签名称
        ldesc: '', // 标签描述
        _id:'',
        egroup:'',
      },
      groupList: [], // 所属小组list
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
    this.id = this.$route.query.id
    this.getInitData()
    this.getEgroups()
  },
  methods: {
    // 获取初始数据
    getInitData() {
      getOneLabel({ _id: this.id }).then(response => {
        this.form = response.data
        this.dataIsChange = -1
      })
    },
    // 获取所有小组
    getEgroups() {
      getUserEgroupInfo({ selectCompanyId: this.companyIds }).then(response => {
        this.groupList = response.data.egroupInfo
      })
    },
   

    // 保存
    save(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
        label_edit(this.form).then(response => {
            this.$message.success('修改标签成功！')
            this.noLeaveprompt = true
            this.$router.push({ path: '/online-class/label-manage/detail', query: { id: this.id }})
          })
        }
      })
    },
    // 取消
    cancel(formName) {
      this.$router.push({ path: '/online-class/label-manage/list' })
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
