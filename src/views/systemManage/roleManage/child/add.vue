<template>
  <div class="form-edit">
    <el-form ref="form" class="form" :model="form" :rules="rules" :status-icon="true" label-width="120px">
      <el-form-item class="required" label="角色名称" prop="rolename">
        <el-input v-model="form.rolename" placeholder="请输入角色名称" clearable />
      </el-form-item>
      <el-form-item label="角色描述" prop="desc">
        <el-input v-model="form.desc" placeholder="请输入角色描述" clearable />
      </el-form-item>
      <el-form-item label="所属企业" prop="roleGroupId">
        <el-select v-model="value" placeholder="请选择所属企业">
          <el-option
            v-for="item in role_gr_list"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <div id="btnGroup">
      <el-button type="primary" @click="save('form')">提交</el-button>
      <el-button type="primary" plain @click="cancel('form')">取消</el-button>
    </div>
  </div>
</template>

<script>
import { role_add, role_gr_list } from '@/api/systemManage-sourceFile.js'
export default {
  data() {
    return {
      form: {
        rolename: '',
        desc: '',
        roleGroupId: ''
      },
      role_gr_list: [],
      rules: {
        rolename: [
          { required: true, message: '请输入角色名称（长度在 2 到 20 个字符）', trigger: 'blur' },
          { required: true, message: '请输入角色名称（长度在 2 到 20 个字符）', trigger: 'change' },
          { min: 2, max: 20, message: '长度在 2 到 64 个字符', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 64 个字符', trigger: 'change' }
        ],
        roleGroupId: [
          { required: true, message: '请选择所属企业', trigger: 'change' }
        ]
      }
    }
  },
  created() {
  },
  methods: {
    get_role_gr_list_fn() {
      role_gr_list().then(res => {
        this.role_gr_list = res.data
      })
    },
    save(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          role_add(this.form).then(response => {
            this.$message.success('添加成功')
            this.$router.push({ path: '/systemManage/roleManage/detail' })
          })
        }
      })
    },
    cancel(formName) {
      this.$refs[formName].resetFields()
      this.$router.push({ path: '/systemManage/sourceFile/list' })
    }

  }

}
</script>

<style lang="scss" scoped>
  #btnGroup{
    padding-left: 120px;
  }
</style>
