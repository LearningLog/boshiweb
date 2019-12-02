<template>
  <div class="form-edit">
    <el-form ref="form" class="form" :model="form" :rules="rules" :status-icon="true" label-width="120px">
      <el-form-item class="required" label="角色名称" prop="rolename">
        <el-input v-model="form.rolename" placeholder="请输入角色名称" clearable />
      </el-form-item>
      <el-form-item label="角色描述">
        <el-input v-model="form.desc" placeholder="请输入角色描述" clearable />
      </el-form-item>
      <tenants-groups-roles :is-render-role="false" :is-render-group="false" @tenantsGroupsRolesVal="tenantsGroupsRolesVal" />
    </el-form>
    <div id="btnGroup">
      <el-button v-no-more-click type="primary" @click="save('form')">提交</el-button>
      <el-button type="primary" plain @click="cancel('form')">取消</el-button>
    </div>
  </div>
</template>

<script>
import TenantsGroupsRoles from '@/components/TenantsGroupsRoles'
import { getCustomManageList, role_add } from '@/api/user-center//roleManage'
export default {
  components: { TenantsGroupsRoles },
  data() {
    return {
      isReset: false, // 是否重置三组联动数据
      dataIsChange: 0, // 计数器，据此判断表单是否已编辑
      noLeaveprompt: false, // 表单提交后，设置为true，据此判断提交不再弹出离开提示
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

  },
  methods: {
    // 监听三组数据变化
    tenantsGroupsRolesVal(val) {
      this.form.roleGroupId = val.companyIds
    },

    // 提交
    save(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          role_add(this.form).then(response => {
            this.$message.success('添加角色成功！')
            this.noLeaveprompt = true
            this.$router.push({ path: '/user-center/role-manage/detail', query: { id: response.data._id }})
          })
        }
      })
    },
    // 取消
    cancel(formName) {
      this.$router.push({ path: '/user-center/role-manage/list' })
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
