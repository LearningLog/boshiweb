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
        <el-input v-model="form.menuurl" placeholder="请输入菜单路径" maxlength="120" clearable />
      </el-form-item>
      <el-form-item label="菜单模块" prop="type">
        <el-select v-model="form.type" placeholder="请选择菜单模块" clearable>
          <el-option v-for="item in menuType" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
        <div class="tip">系统后台归属的菜单，不会出现在租户菜单列表中</div>
      </el-form-item>
      <el-form-item label="父级菜单">
        <el-input :value="form.pname" :disabled="true" />
      </el-form-item>
    </el-form>
    <div id="btnGroup">
      <el-button v-no-more-click type="primary" @click="save('form')">保存</el-button>
      <el-button type="primary" plain @click="cancel('form')">取消</el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { editMenu, getMenu } from '@/api/systemManage-menuManage'
import { updateMenuRoute } from '@/utils/update-menu-router'

export default {
  computed: {
    ...mapGetters([
      'menuType'
    ])
  },
  data() {
    return {
      dataIsChange: 0, // 计数器，据此判断表单是否已编辑
      noLeaveprompt: false, // 表单提交后，设置为true，据此判断提交不再弹出离开提示
      form: { // 表单数据
        menuname: '', // 菜单名称
        cmark: '', // 描述
        imagename: '', // 菜单图标
        menuurl: '', // 菜单路径path
        type: '' // 菜案模块
      },
      id: '', // 查询id
      rules: {
        menuname: [
          { required: true, message: '请输入菜单名称（长度在 1 到 12 个字符）', trigger: 'blur' },
          { required: true, message: '请输入菜单名称（长度在 1 到 12 个字符）', trigger: 'change' },
          { min: 1, max: 12, message: '长度在 1 到 12 个字符', trigger: 'change' },
          { min: 1, max: 12, message: '长度在 1 到 12 个字符', trigger: 'blur' }
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
          { required: true, message: '请选择菜单模块', trigger: 'change' }
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
    this.id = this.$route.query.id
    this.pname = this.$route.query.pname
    this.getMenu()
  },
  methods: {
    // 获取初始数据
    getMenu() {
      getMenu({ _id: this.id }).then(response => {
        this.form = response.data.MenuV2
        this.dataIsChange = -1
      })
    },
    // 保存
    save(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          editMenu(this.form).then(async response => {
            this.$message.success('修改菜单成功！')
            this.noLeaveprompt = true
            updateMenuRoute()

            this.$router.push({ path: '/systemManage/menuManage/detail', query: { _id: this.id }})
          })
        }
      })
    },
    // 取消
    cancel(formName) {
      this.$router.push({ path: '/systemManage/menuManage/list' })
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

<style scoped>
  .el-form-item__content .el-input {
    width: calc(100% - 120px);
  }
</style>
