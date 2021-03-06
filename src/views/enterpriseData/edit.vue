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
        <el-form-item label="存储总量（G）" prop="totalStorageSpace2">
          <el-input v-model="form.totalStorageSpace2" placeholder="请输入存储总量" maxlength="7" clearable @keyup.native="intNum(form.totalStorageSpace2, 'totalStorageSpace2')" @blur="blurNum(form.totalStorageSpace2)" />
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
        <el-button v-no-more-click type="primary" @click="onSubmit('form')">保存</el-button>
        <el-button type="primary" plain @click="cancel('form')">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { onKeyValid, validIntNum, validNum } from '@/utils/validate'
import { getFileShowSizeToG, getFileShowSizeToBT } from '@/utils/index'
import { getCustomResourceDetail, editCustomResource } from '@/api/enterprise-data'

export default {
  data() {
    const validDate = (rule, value, callback) => {
      value = value || []
      if (!value[0] || !value[1]) {
        callback(new Error('请选择有效日期'))
      } else {
        callback()
      }
    }
    const validtotalStorageSpace2 = (rule, value, callback) => {
      if (!value && value !== 0) {
        callback(new Error('请输入存储总量，最多9,999G'))
      } else if (value > 9999) {
        callback(new Error('请输入存储总量，最多9,999G'))
      } else {
        callback()
      }
    }
    return {
      dataIsChange: 0, // 计数器，据此判断表单是否已编辑
      noLeaveprompt: false, // 表单提交后，设置为true，据此判断提交不再弹出离开提示
      id: '', // 查询id
      form: {
        customname: '', // 企业/租户名称
        payTypeName: '', // 套餐类型
        totalUserCount: '', // 员工规模
        totalSms: '', // 短信总量
        totalStorageSpace: '', // 存储总量
        totalStorageSpace2: '', // 存储总量
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
        totalStorageSpace2: [
          { required: true, validator: validtotalStorageSpace2, message: '请输入存储总量，最多9,999G', trigger: 'blur' },
          { required: true, validator: validtotalStorageSpace2, message: '请输入存储总量，最多9,999G', trigger: 'change' }
        ],
        effectTime: [
          { required: true, validator: validDate, trigger: 'blur' },
          { required: true, validator: validDate, trigger: 'change' }
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
          totalStorageSpace2: getFileShowSizeToG(response.data.totalStorageSpace),
          startTime: response.data.startTime,
          endTime: response.data.endTime,
          effectTime: response.data.startTime ? [response.data.startTime, response.data.endTime] : ''
        }
        this.form = obj
        this.dataIsChange = -1
      })
    },
    // 提交
    onSubmit(formName) {
      this.time_range = this.effectTime || []
      this.form.startTime = this.form.effectTime[0]
      this.form.endTime = this.form.effectTime[1]
      this.form.totalStorageSpace = getFileShowSizeToBT(this.form.totalStorageSpace2)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          editCustomResource(this.form).then(response => {
            this.$message.success('修改租户成功！')
            this.noLeaveprompt = true
            this.$router.push({ path: '/enterpriseData/detail', query: { _id: this.id }})
          })
        }
      })
    },
    // 取消
    cancel(formName) {
      this.$router.push({ path: '/enterpriseData/list' })
    },
    // 校验正整数
    intNum(val, field) {
      if (!val) return false
      if (field === 'totalStorageSpace2') {
        this.form[field] = validNum(val)
      } else {
        this.form[field] = validIntNum(val)
      }
    },
    // 失焦校验
    blurNum(val) {
      this.form.totalStorageSpace2 = onKeyValid(val, 2)
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
