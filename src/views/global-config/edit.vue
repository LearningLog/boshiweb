<template>
  <div class="app-container">
    <div class="form-edit">
      <el-form ref="form" class="form" :model="form" :rules="rules" label-width="100px" :status-icon="true">
        <el-form-item class="" label="key:">
          <el-input v-model="obj.key" placeholder="" maxlength="12" clearable readonly="readonly"/>
        </el-form-item>
        <el-form-item class="pas" label="管理员密码:">
          <el-input v-model="form.cmark" placeholder="" maxlength="64" clearable />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="obj.type" placeholder="" clearable>
            <el-option v-for="item in menuType" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="值">
          <el-input v-model="obj.value" type="textarea" resize="none" rows=" 7 " />
        </el-form-item>
      </el-form>
      <div id="btnGroup">
        <el-button v-no-more-click type="primary" @click="save('form')">提交</el-button>
        <el-button type="primary" plain @click="cancel">取消</el-button>
      </div>
    </div>
  </div>

</template>

<script>
import { mapGetters } from 'vuex'
import { setConfigValue } from '@/api/global-config'
import { updateMenuRoute } from '@/utils/update-menu-router'

export default {
  computed: {
    ...mapGetters([
      'menuType'
    ])
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
    this.obj = this.$route.query.obj
    console.log(this.obj)
    // this.pname = this.$route.query.pname
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
      obj: '', // 当前的对象
      pid: '', // 父级id
      pname: '', // 父级菜单
      rules: {
        // menuname: [
        //   { required: true, message: '请输入菜单名称（长度在 1 到 12 个字符）', trigger: 'blur' },
        //   { required: true, message: '请输入菜单名称（长度在 1 到 12 个字符）', trigger: 'change' },
        //   { min: 1, max: 12, message: '长度在 1 到 12 个字符', trigger: 'blur' },
        //   { min: 1, max: 12, message: '长度在 1 到 12 个字符', trigger: 'change' }
        // ],
        // cmark: [
        //   { required: true, message: '请输入菜单标识（长度在 1 到 64 个字符）', trigger: 'blur' },
        //   { required: true, message: '请输入菜单标识（长度在 1 到 64 个字符）', trigger: 'change' },
        //   { min: 1, max: 64, message: '长度在 1 到 64 个字符', trigger: 'blur' },
        //   { min: 1, max: 64, message: '长度在 1 到 64 个字符', trigger: 'change' }
        // ],
        // menuurl: [
        //   { required: true, message: '请输入菜单路径（长度在 1 到 120 个字符）', trigger: 'blur' },
        //   { required: true, message: '请输入菜单路径（长度在 1 到 120 个字符）', trigger: 'change' },
        //   { min: 1, max: 120, message: '长度在 1 到 120 个字符', trigger: 'blur' },
        //   { min: 1, max: 120, message: '长度在 1 到 120 个字符', trigger: 'change' }
        // ],
        type: [
          { required: true, message: '请选择菜单模块', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    // 保存
    // save(formName) {
    //   this.$refs[formName].validate((valid) => {
    //     if (valid) {
    //       this.form.pid = this.pid
    //       addMenu(this.form).then(async response => {
    //         this.$message.success('新增菜单成功！')
    //         this.noLeaveprompt = true
    //         updateMenuRoute()
    //         this.$router.push({ path: '/systemManage/menuManage/detail', query: { _id: response.data._id }})
    //       })
    //     }
    //   })
    // },
    // 取消
    cancel() {
      this.$router.push({ path: '/global-config/list' })
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

</style>
