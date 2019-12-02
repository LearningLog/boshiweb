<template>
  <div class="form-edit">
    <el-form ref="form" class="form" :model="form" label-width="100px">
      <el-form-item class="" label="技能名称：">
        <span>{{ form.skill_name }}</span>
      </el-form-item>
      <el-form-item class="" label="技能描述：">
        <span>{{ form.skill_desc }}</span>
      </el-form-item>
      <el-form-item class="" label="所属租户：">
        <span>{{ form.customname }}</span>
      </el-form-item>
    </el-form>
    <div id="btnGroup">
      <el-button type="primary" @click="confirm">确定</el-button>
    </div>
  </div>
</template>

<script>
import { getItem } from '@/api/user-center/skillManage'

export default {
  data() {
    return {
      form: { // 表单数据
        skill_name: '', // 技能名称
        skill_desc: '', // 技能描述
        customname: '' // 所属租户
      },
      id: '' // 查询id
    }
  },
  created() {
    this.id = this.$route.query.id
    this.getInitData()
  },
  methods: {
    // 获取初始数据
    getInitData() {
      getItem({ _id: this.id }).then(response => {
        this.form = response.data.skill
        this.dataIsChange = -1
      })
    },
    // 获取技能授权页面管理类型
    confirm() {
      this.$router.push({ path: '/user-center/skill-manager/list' })
    }
  }
}
</script>

<style scoped>
  .el-form-item__content .el-input {
    width: calc(100% - 120px);
  }
  .el-scrollbar {
    height: calc(100vh - 400px);
    width: 100%;
  }
  #btnGroup {
    padding-left: 100px;
  }
</style>
