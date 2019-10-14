<template>
  <div class="app-container">
    <div class="form-edit">
      <el-form ref="form" class="form" label-width="140px">
        <el-form-item label="企业名称：">
          <span>{{ form.customname }}</span>
        </el-form-item>
        <el-form-item label="套餐名称：" prop="payTypeName">
          <span>{{ form.payTypeName }}</span>
        </el-form-item>
        <el-form-item label="员工规模（个）：" prop="userTotalCount">
          <span>{{ form.userTotalCount }}</span>
        </el-form-item>
        <el-form-item label="短信总量（条）：" prop="totalSms">
          <span>{{ form.totalSms }}</span>
        </el-form-item>
        <el-form-item label="存储总量（G）：" prop="totalStorageSpace">
          <span>{{ form.totalStorageSpace }}</span>
        </el-form-item>
        <el-form-item label="有效截止期：" prop="effectTime">
          <span>{{ form.effectTime }}</span>
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

export default {
  data() {
    return {
      id: '', // 查询id
      form: {
        customname: '', // 企业名称
        payTypeName: '', // 套餐名称
        userTotalCount: '', // 员工规模
        totalSms: '', // 短信总量
        totalStorageSpace: '', // 存储总量
        effectTime: '' // 有效截止期
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
          effectTime: response.data.user.effectTime
        }
        this.form = obj
      })
    },
    // 确定
    confirm() {
      this.$router.push({ path: '/enterpriseData/list' })
    }
  }

}
</script>

<style lang="scss" scoped>
  #btnGroup{
    padding-left: 140px;
  }
</style>
