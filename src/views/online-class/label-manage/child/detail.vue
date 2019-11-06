<template>
  <div class="form-edit">
    <el-form
      class="form"
      :model="form"
      label-width="120px"
    >
      <el-form-item label="标签名称：">
        <span>{{ form.lname }}</span>
      </el-form-item>
      <el-form-item label="所属小组：">
        <span>{{ form.customname }}</span>
      </el-form-item>
      <el-form-item label="描述：">
        <span>{{ form.ldesc }}</span>
      </el-form-item>
    </el-form>
    <div id="btnGroup">
      <el-button type="primary" @click="confirm">确定</el-button>
    </div>
  </div>
</template>

<script>
import { getOneLabel } from '@/api/online-class.js'

export default {
  data() {
    return {
      id: null, // 查询id
      dataIsChange: 0, // 计数器，据此判断表单是否已编辑
      noLeaveprompt: false, // 表单提交后，设置为true，据此判断提交不再弹出离开提示
      setRolesDialogVisible: false,
      form: {
        
      }
    }
  },
  created() {
    this.id = this.$route.query.id
    this.getInitData()
  },
  methods: {
    // 获取初始数据
    getInitData() {
      getOneLabel({ _id: this.id }).then(response => {
        this.form = response.data
      })
    },
    // 确定
    confirm() {
      this.$router.push({ path: '/online-class/label-manage/list' })
    }
  }
}
</script>

<style lang="scss" scoped>
  #btnGroup {
    padding-left: 120px;
  }
</style>
