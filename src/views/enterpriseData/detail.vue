<template>
  <div class="app-container">
    <div class="form-edit">
      <el-form ref="form" class="form" label-width="140px">
        <el-form-item label="企业名称：">
          <span>{{ form.customname }}</span>
        </el-form-item>
        <el-form-item label="套餐名称：">
          <span>{{ form.payTypeName }}</span>
        </el-form-item>
        <el-form-item label="员工规模（个）：">
          <span>{{ form.totalUserCount }}</span>
        </el-form-item>
        <el-form-item label="短信总量（条）：">
          <span>{{ form.totalSms }}</span>
        </el-form-item>
        <el-form-item label="存储总量（G）：">
          <span>{{ form.totalStorageSpace }}</span>
        </el-form-item>
        <el-form-item label="有效期：">
          <span>{{ parseTime(form.startTime, '{y}-{m}-{d}') }}</span><span>&nbsp;至&nbsp;</span><span>{{ parseTime(form.endTime, '{y}-{m}-{d}') }}</span>
        </el-form-item>
      </el-form>
      <div id="btnGroup">
        <el-button type="primary" @click="confirm">确定</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { getCustomResourceDetail } from '@/api/enterprise-data'
import { parseTime } from '@/utils/index'

export default {
  data() {
    return {
      id: '', // 查询id
      form: {
        customname: '', // 企业/租户名称
        payTypeName: '', // 套餐类型
        totalUserCount: '', // 员工规模
        totalSms: '', // 短信总量
        totalStorageSpace: '', // 存储总量
        startTime: '', // 有效开始日期
        endTime: '' // 有效结束日期
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
          startTime: response.data.startTime || '',
          endTime: response.data.endTime || ''
        }
        this.form = obj
      })
    },
    // 确定
    confirm() {
      this.$router.push({ path: '/enterpriseData/list' })
    },
    parseTime(time, cFormat) {
      return parseTime(time, cFormat)
    }
  }

}
</script>

<style lang="scss" scoped>
  #btnGroup{
    padding-left: 140px;
  }
</style>
