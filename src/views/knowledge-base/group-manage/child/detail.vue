<template>
  <div class="form-edit">
    <el-form ref="form" class="form" :model="form" label-width="100px">
      <el-form-item class="" label="分组名称：">
        <span>{{ form.groupName }}</span>
      </el-form-item>
      <el-form-item class="" label="分组描述：">
        <span>{{ form.desc }}</span>
      </el-form-item>
      <el-form-item class="" label="所属企业:">
        <span>{{ form.customname }}</span>
      </el-form-item>
      <el-form-item class="" label="分组负责人">
        <span>{{ parseMinc(form.mincNameList ) }}</span>
      </el-form-item>
      <el-form-item class="" label="成员人数">
        <span>{{ form.incNameList.length }}</span>
      </el-form-item>
      <el-form-item class="" label="分组成员">
        <span>{{ parseInc(form.incNameList) }}</span>
      </el-form-item>
      <el-form-item class="" label="分组来源">
        <span>{{ form.dataTypeName?form.dataTypeName:'本系统创建' }}</span>
      </el-form-item>
      <el-form-item class="" label="分组技能">
        <span>{{ parseSkill(form.skillNameList) }}</span>
      </el-form-item>
    </el-form>
    <div id="btnGroup">
      <el-button type="primary" @click="confirm">确定</el-button>
    </div>
  </div>
</template>

<script>
import { getItem } from '@/api/user-center/groupManage'
export default {
  data() {
    return {
      form: { // 表单数据
        skill_name: '', // 分组名称
        desc: '', // 分组描述
        createtime: '', // 创建时间
        mincNameList: [],
        incNameList: [],
        skillNameList: []
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
        this.form = response.data.employeeGroup
        this.dataIsChange = -1
      })
    },
    // 获取分组授权页面管理类型
    confirm() {
      this.$router.push({ path: '/user-center/group-manage/list' })
    },
    parseSkill(data) {
      const skillNameList = data.map((v, k, arr) => {
        return v.skill_name
      })
      return skillNameList.join('、')
    },
    parseMinc(data) {
      const skillNameList = data.map((v, k, arr) => {
        return v.nickname
      })
      return skillNameList.join('、')
    },
    parseInc(data) {
      const nicknameList = data.map((v, k, arr) => {
        return v.nickname
      })
      return nicknameList.join('、')
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
