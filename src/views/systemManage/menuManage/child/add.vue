<template>
  <div class="form-edit">
    <el-form ref="form" class="form" :model="form" :rules="rules" label-width="80px" :status-icon="true">
      <el-form-item class="" label="菜单名称" prop="menuname">
        <el-input v-model="form.menuname" placeholder="请输入菜单名称" maxlength="12" clearable />
      </el-form-item>
      <el-form-item class="" label="菜单标识" prop="cmark">
        <el-input v-model="form.cmark" placeholder="请输入菜单标识" maxlength="64" clearable />
      </el-form-item>
      <el-form-item class="" label="菜单图标">
        <el-input v-model="form.imagename" placeholder="请输入菜单图标" maxlength="50" clearable />
      </el-form-item>
      <el-form-item class="" label="菜单路径" prop="menuurl">
        <el-input v-model="form.menuurl" placeholder="请输入菜单路径" maxlength="120" />
      </el-form-item>
      <el-form-item label="菜单类型" prop="type">
        <el-select v-model="form.type" placeholder="请选择菜单类型" clearable>
          <el-option v-for="item in menuType" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
        <div class="tip">系统后台归属的菜单，不会出现在租户菜单列表中</div>
      </el-form-item>
    </el-form>
    <div id="btnGroup">
      <el-button type="primary" @click="save('form')">提交</el-button>
      <el-button type="primary" plain @click="cancel('form')">取消</el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { addMenu } from '@/api/systemManage-menuManage'

export default {
  computed: {
    ...mapGetters([
      'menuType'
    ])
  },
  data() {
    return {
      form: {
        menuname: '',
        cmark: '',
        imagename: '',
        menuurl: '',
        type: ''
      },
      pid: '',
      rules: {
        menuname: [
          { required: true, message: '请输入菜单名称（长度在 1 到 12 个字符）', trigger: 'blur' },
          { required: true, message: '请输入菜单名称（长度在 1 到 12 个字符）', trigger: 'change' },
          { min: 1, max: 12, message: '长度在 1 到 12 个字符', trigger: 'blur' },
          { min: 1, max: 12, message: '长度在 1 到 12 个字符', trigger: 'change' }
        ],
        cmark: [
          { required: true, message: '请输入菜单标识（长度在 1 到 64 个字符）', trigger: 'blur' },
          { required: true, message: '请输入菜单标识（长度在 1 到 64 个字符）', trigger: 'change' },
          { min: 1, max: 64, message: '长度在 1 到 64 个字符', trigger: 'blur' },
          { min: 1, max: 64, message: '长度在 1 到 64 个字符', trigger: 'change' }
        ],
        menuurl: [
          { required: true, message: '请输入菜单路径（长度在 1 到 120 个字符）', trigger: 'blur' },
          { required: true, message: '请输入菜单路径（长度在 1 到 120 个字符）', trigger: 'change' },
          { min: 1, max: 120, message: '长度在 1 到 120 个字符', trigger: 'blur' },
          { min: 1, max: 120, message: '长度在 1 到 120 个字符', trigger: 'change' }
        ],
        type: [
          { required: true, message: '请选择菜单类型', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.pid = this.$route.query.pid
  },
  methods: {
    save(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.form.pid = this.pid
          addMenu(this.form).then(response => {
            this.$message.success('新增菜单成功')
            this.$router.push({ path: '/systemManage/menuManage/detail', query: { _id: response.data._id }})
          })
        }
      })
    },
    cancel(formName) {
      this.$refs[formName].resetFields()
      this.$router.push({ path: '/systemManage/menuManage/list' })
    }
  }
}
</script>

<style scoped>
.el-form-item__content .el-input {
  width: calc(100% - 120px);
}
</style>
