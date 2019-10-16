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
        <el-form-item label="员工规模（个）" prop="totalUserCount">
          <el-input v-model="form.totalUserCount" placeholder="请输入员工规模" maxlength="5" clearable @keyup.native="intNum(form.totalUserCount, 'totalUserCount')" />
        </el-form-item>
        <el-form-item label="短信总量（条）" prop="totalSms">
          <el-input v-model="form.totalSms" placeholder="请输入短信总量" maxlength="5" clearable @keyup.native="intNum(form.totalSms, 'totalSms')" />
        </el-form-item>
        <el-form-item label="存储总量（G）" prop="totalStorageSpace">
          <el-input v-model="form.totalStorageSpace" placeholder="请输入存储总量" maxlength="7" clearable @keyup.native="intNum(form.totalStorageSpace, 'totalStorageSpace')" @blur="blurNum(form.totalStorageSpace)" />
        </el-form-item>
        <el-form-item label="有效期" prop="effectTime">
          <el-date-picker
            v-model="form.effectTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
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
import { onKeyValid, validIntNum, validNum } from '@/utils/validate'
import { getCustomResourceDetail, editCustomResource } from '@/api/enterprise-data'

export default {
  data() {
    var validDate = (rule, value, callback) => {
      value = value || []
      if (!value[0] || !value[1]) {
        callback(new Error('请选择有效日期'))
      } else {
        callback()
      }
    }
    var validTotalStorageSpace = (rule, value, callback) => {
      debugger
      if (!value && value !== 0) {
        callback(new Error('请输入存储总量，最多9,999G'))
      } else if (value > 9999) {
        callback(new Error('请输入存储总量，最多9,999G'))
      }
      else {
        callback()
      }
    }
    return {
      isDisabled: false, // 防止重复提交
      id: '', // 查询id
      form: {
        customname: '', // 企业/租户名称
        payTypeName: '', // 套餐类型
        totalUserCount: '', // 员工规模
        totalSms: '', // 短信总量
        totalStorageSpace: '', // 存储总量
        startTime: '', // 有效开始日期
        endTime: '', // 有效结束日期
        effectTime: [] // 有效期
      },
      rules: {
        payTypeName: [
          { required: true, message: '套餐名称（长度在 1 到 20 个字符）', trigger: 'blur' },
          { required: true, message: '套餐名称（长度在 1 到 20 个字符）', trigger: 'change' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'change' }
        ],
        totalUserCount: [
          { required: true, message: '请输入员工规模', trigger: 'blur' },
          { required: true, message: '请输入员工规模', trigger: 'change' }
        ],
        totalSms: [
          { required: true, message: '请输入短信总量', trigger: 'blur' },
          { required: true, message: '请输入短信总量', trigger: 'change' }
        ],
        totalStorageSpace: [
          { required: true, validator: validTotalStorageSpace, message: '请输入存储总量，最多9,999G', trigger: 'blur' },
          { required: true, validator: validTotalStorageSpace, message: '请输入存储总量，最多9,999G', trigger: 'change' }
        ],
        effectTime: [
          { required: true, validator: validDate, trigger: 'blur' },
          { required: true, validator: validDate, trigger: 'change' }
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
          totalUserCount: response.data.totalUserCount,
          totalSms: response.data.totalSms,
          totalStorageSpace: response.data.totalStorageSpace,
          startTime: response.data.startTime,
          endTime: response.data.endTime,
          effectTime: response.data.startTime ? [response.data.startTime, response.data.endTime] : ''
        }
        this.form = obj
      })
    },
    // 提交
    onSubmit(formName) {
      this.time_range = this.effectTime || []
      this.form.startTime = this.form.effectTime[0]
      this.form.endTime = this.form.effectTime[1]
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.isDisabled = true
          editCustomResource(this.form).then(response => {
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
      if (!val) return false
      if (field === 'totalStorageSpace') {
        this.form[field] = validNum(val)
      } else {
        this.form[field] = validIntNum(val)
      }
    },
    blurNum(val) {
      this.form.totalStorageSpace = onKeyValid(val, 2)
    }
  }

}
</script>

<style lang="scss" scoped>
  #btnGroup{
    padding-left: 120px;
  }
</style>
