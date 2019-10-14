<template>
  <div class="app-container">
    <div class="form-edit">
      <el-form ref="form" class="form" :model="form" :rules="rules" label-width="120px" :status-icon="true">
        <el-form-item label="企业名称">
          <span>{{ form.customname }}</span>
        </el-form-item>
        <el-form-item label="套餐名称" prop="payTypeName">
          <el-input v-model="form.payTypeName" placeholder="请输入套餐名称" maxlength="20" clearable />
        </el-form-item>
        <el-form-item label="员工规模（个）" prop="userTotalCount">
          <el-input v-model="form.userTotalCount" @keyup.native="intNum(form.userTotalCount, 'userTotalCount')" placeholder="请输入员工规模" maxlength="5" clearable />
        </el-form-item>
        <el-form-item label="短信总量（条）" prop="totalSms">
          <el-input v-model="form.totalSms" @keyup.native="intNum(form.totalSms, 'totalSms')" placeholder="请输入短信总量" maxlength="5" clearable />
        </el-form-item>
        <el-form-item label="存储总量（G）" prop="totalStorageSpace">
          <el-input v-model="form.totalStorageSpace" @keyup.native="intNum(form.totalStorageSpace, 'totalStorageSpace')" placeholder="请输入存储总量" maxlength="5" clearable />
        </el-form-item>
        <el-form-item label="有效期" prop="effectTime">
          <el-date-picker
              v-model="effectTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
          />
        </el-form-item>
      </el-form>
      <div id="btnGroup">
        <el-button type="primary" :disabled="isDisabled" @click="onSubmit('form')">确定</el-button>
        <el-button type="primary" plain @click="cancel('form')">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { validIntNum } from '@/utils/validate'
import { getCustomResourceDetail, editCustomResource } from '@/api/enterprise-data'

export default {
  data() {
    return {
      isDisabled: false, // 防止重复提交
      id: '', // 查询id
      form: {
        customname: '', // 企业/租户名称
        payTypeName: '', // 套餐类型
        userTotalCount: '', // 员工规模
        totalSms: '', // 短信总量
        totalStorageSpace: '', // 存储总量
        effectStartTime: null, // 有效开始日期
        effectEndTime: null // 有效结束日期
      },
      effectTime: [], // 有效期
      rules: {
        payTypeName: [
          { required: true, message: '套餐名称（长度在 1 到 20 个字符）', trigger: 'blur' },
          { required: true, message: '套餐名称（长度在 1 到 20 个字符）', trigger: 'change' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'change' }
        ],
        userTotalCount: [
          { required: true, message: '请输入员工规模', trigger: 'blur' },
          { required: true, message: '请输入员工规模', trigger: 'change' },
          { min: 1, max: 5, message: '长度在 1 到 5 个字符', trigger: 'blur' },
          { min: 1, max: 5, message: '长度在 1 到 5 个字符', trigger: 'change' }
        ],
        totalSms: [
          { required: true, message: '请输入短信总量', trigger: 'blur' },
          { required: true, message: '请输入短信总量', trigger: 'change' },
          { min: 1, max: 5, message: '长度在 1 到 5 个字符', trigger: 'blur' },
          { min: 1, max: 5, message: '长度在 1 到 5 个字符', trigger: 'change' }
        ],
        totalStorageSpace: [
          { required: true, message: '请输入存储总量', trigger: 'blur' },
          { required: true, message: '请输入存储总量', trigger: 'change' },
          { min: 1, max: 5, message: '长度在 1 到 5 个字符', trigger: 'blur' },
          { min: 1, max: 5, message: '长度在 1 到 5 个字符', trigger: 'change' }
        ],
        effectTime: [
          { type: 'date', required: true, message: '请选择有效日期', trigger: 'blur' },
          { type: 'date', required: true, message: '请选择有效日期', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.id = this.$route.query._id
    this.getInitData()
  },
  methods: {
    // 获取初始数据
    getInitData() {
      getCustomResourceDetail({ _id: this.id }).then(response => {
        const obj = {
          _id: response.data._id,
          customname: response.data.customname,
          payTypeName: response.data.payTypeName,
          userTotalCount: response.data.userTotalCount,
          totalSms: response.data.totalSms,
          totalStorageSpace: response.data.totalStorageSpace,
          effectStartTime: response.data.user.effectStartTime,
          effectEndTime: response.data.user.effectEndTime
        }
        this.effectTime = [response.data.user.effectStartTime, response.data.user.effectEndTime]
        this.form = obj
      })
    },
    // 提交
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          editCustomResource(this.form).then(response => {
            this.isDisabled = true
            this.$message.success('修改租户成功！')
            this.$router.push({ path: '/enterpriseData/detail', query: { _id: this.id }})
          })
        }
      })
    },
    // 取消
    cancel(formName) {
      this.$refs[formName].resetFields()
      this.$router.push({ path: '/enterpriseData/list' })
    },
    // 校验正整数
    intNum(val, field) {
      this.form[field] = validIntNum(val)
    }
  }

}
</script>

<style lang="scss" scoped>
  #btnGroup{
    padding-left: 120px;
  }
</style>
