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
      <el-button type="primary" v-no-more-click @click="save('form')">保存</el-button>
      <el-button type="primary" plain @click="cancel('form')">取消</el-button>
    </div>
  </div>
</template>

<script>
import { getOneRole, getCustomManageList, role_edit } from '@/api/systemManage-roleManage'
export default {
  data() {
    return {
      dataIsChange: 0, // 计数器，据此判断表单是否已编辑
      noLeaveprompt: false, // 表单提交后，设置为true，据此判断提交不再弹出离开提示
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
        this.dataIsChange = -1
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
            this.noLeaveprompt = true
            this.$router.push({ path: '/systemManage/roleManage/detail', query: { id: this.id }})
          })
        }
      })
    },
    // 取消
    cancel(formName) {
      this.$router.push({ path: '/systemManage/roleManage/list' })
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
