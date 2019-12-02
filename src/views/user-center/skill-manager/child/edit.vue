<template>
  <div class="form-edit">
    <el-form ref="form" class="form" :model="form" :rules="rules" :status-icon="true" label-width="120px">
      <el-form-item class="required" label="技能名称" prop="skill_name">
        <el-input v-model="form.skill_name" placeholder="请输入技能名称" clearable />
      </el-form-item>
      <el-form-item label="技能描述" prop="skill_desc">
        <el-input v-model="form.skill_desc" placeholder="请输入技能描述" clearable />
      </el-form-item>
      <el-form-item v-if="isSystemManage" label="所属租户" prop="groupId">
        <el-select v-model="form.groupId" placeholder="请选择所属租户" clearable filterable disabled>
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
      <el-button v-no-more-click type="primary" @click="save('form')">保存</el-button>
      <el-button type="primary" plain @click="cancel('form')">取消</el-button>
    </div>
  </div>
</template>

<script>
import { getCustomManageList } from '@/api/user-center//roleManage'
import { getItem, modifyItem } from '@/api/user-center/skillManage'

export default {
  data() {
    return {
      dataIsChange: 0, // 计数器，据此判断表单是否已编辑
      noLeaveprompt: false, // 表单提交后，设置为true，据此判断提交不再弹出离开提示
      id: '', // 查询id
      form: {
        skill_name: '', // 技能名称
        desc: '', // 技能描述
        groupId: '' // 所属租户
      },
      custom_list: [], // 所属租户list
      rules: {
        skill_name: [
          { required: true, message: '请输入技能名称（长度在 2 到 20 个字符）', trigger: 'blur' },
          { required: true, message: '请输入技能名称（长度在 2 到 20 个字符）', trigger: 'change' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'change' }
        ],
        skill_desc: [
          { required: true, message: '请输入技能名称（长度在 1 到 100 个字符）', trigger: 'blur' },
          { required: true, message: '请输入技能名称（长度在 1 到 100 个字符）', trigger: 'change' },
          { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' },
          { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'change' }
        ],
        groupId: [
          { required: true, message: '请选择所属租户', trigger: 'blur' },
          { required: true, message: '请选择所属租户', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    isSystemManage() {
      return this.$store.state.user.isSystemManage
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
    this.getInitData()
    this.getCustomManageList()
  },
  methods: {
    // 获取初始数据
    getInitData() {
      getItem({ _id: this.id }).then(response => {
        this.form = response.data.skill
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
          modifyItem(this.form).then(response => {
            this.$message.success('修改技能成功！')
            this.noLeaveprompt = true
            this.$router.push({ path: '/user-center/skill-manager/detail', query: { id: this.id }})
          })
        }
      })
    },
    // 取消
    cancel(formName) {
      this.$router.push({ path: '/user-center/skill-manager/list' })
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
