<template>
  <div class="form-edit">
    <el-form ref="form" class="form" :model="form" :rules="rules" :status-icon="true" label-width="120px">
      <el-form-item class="required" label="角色名称" prop="rolename">
        <el-input v-model="form.rolename" placeholder="请输入角色名称" clearable />
      </el-form-item>
      <el-form-item label="角色描述">
        <el-input v-model="form.desc" placeholder="请输入角色描述" clearable />
      </el-form-item>
      <el-form-item label="所属租户" prop="roleGroupId">
        <el-select v-model="form.roleGroupId" placeholder="请选择所属租户" clearable filterable>
          <el-option
            v-for="item in custom_list"
            :key="item._id"
            :label="item.customname"
            :value="item._id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <div id="btnGroup">
      <el-button type="primary" v-no-more-click @click="save('form')">提交</el-button>
      <el-button type="primary" plain @click="cancel('form')">取消</el-button>
    </div>
  </div>
</template>

<script>
import { getOneRole, getCustomManageList, role_edit } from '@/api/systemManage-roleManage'
export default {
  data() {
    return {
      id: '', // 查询id
      form: {
        rolename: '', // 角色名称
        desc: '', // 角色描述
        roleGroupId: '' // 所属租户
      },
      custom_list: [], // 所属租户list
      rules: {
        rolename: [
          { required: true, message: '请输入角色名称（长度在 2 到 20 个字符）', trigger: 'blur' },
          { required: true, message: '请输入角色名称（长度在 2 到 20 个字符）', trigger: 'change' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'change' }
        ],
        roleGroupId: [
          { required: true, message: '请选择所属租户', trigger: 'blur' },
          { required: true, message: '请选择所属租户', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.id = this.$route.query.id
    this.getInitData()
    this.getCustomManageList()
  },
  methods: {
    // 获取初始数据
    getInitData() {
      getOneRole({ _id: this.id }).then(response => {
        this.form = response.data.role
      })
    },
    // 获取所属租户list
    getCustomManageList() {
      getCustomManageList().then(res => {
        this.custom_list = res.data
      })
    },
    // 保存
    save(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          role_edit(this.form).then(response => {
            this.$message.success('修改角色成功！')
            this.$router.push({ path: '/systemManage/roleManage/detail', query: { id: this.id }})
          })
        }
      })
    },
    // 取消
    cancel(formName) {
      this.$refs[formName].resetFields()
      this.$router.push({ path: '/systemManage/roleManage/list' })
    }
  },
  beforeRouteLeave(to, from, next) {
    this.$confirm('您的数据尚未保存，是否离开？', '离开页面', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      next()
    }).catch(() => {
      next(false)
    })
  }
}
</script>

<style lang="scss" scoped>
  #btnGroup{
    padding-left: 120px;
  }
</style>
