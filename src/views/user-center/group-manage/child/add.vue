<template>
  <div class="form-edit">
    <el-form ref="form" class="form" :model="form" :rules="rules" :status-icon="true" label-width="120px">
      <el-form-item class="required" label="分组名称" prop="groupName">
        <el-input v-model="form.groupName" placeholder="请输入分组名称" clearable />
      </el-form-item>
      <el-form-item label="分组描述">
        <el-input v-model="form.desc" placeholder="请输入分组描述" clearable />
      </el-form-item>
      <el-form-item v-if="isSystemManage" label="所属租户" prop="selectCompanyId">
        <el-select v-model="form.selectCompanyId" placeholder="请选择所属租户" clearable filterable @change="companyidChange">
          <el-option
            v-for="item in custom_list"
            :key="item._id"
            :label="item.customname"
            :value="item._id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="分组负责人" prop="alluserList">
        <el-select v-model="form.groupManageUser" multiple placeholder="请选择">
          <el-option v-for="item in alluserList" :key="item._id" :label="item.nickname" :value="item._id" />
        </el-select>
      </el-form-item>
      <el-form-item label="分组成员" prop="">
        <el-select v-model="form.groupUser" multiple placeholder="请选择">
          <el-option v-for="item in alluserList" :key="item._id" :label="item.nickname" :value="item._id" />
        </el-select>
      </el-form-item>
      <el-form-item label="分组技能" prop="">
        <el-select v-model="form.skillinfo" multiple placeholder="请选择">
          <el-option v-for="item in allskillList" :key="item.increase_id" :label="item.skill_name" :value="item.increase_id" />
        </el-select>
      </el-form-item>
      <div id="btnGroup">
        <el-button v-no-more-click type="primary" @click="save('form')">保存</el-button>
        <el-button type="primary" plain @click="cancel('form')">取消</el-button>
      </div>
    </el-form></div>
</template>

<script>
import { findUserListByGroupId, allskill, getItem, addItem, getCustomManageList } from '@/api/userCenter-groupManage'

export default {
  data() {
    return {
      value1: [],
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      allskillList: [], // 所有技能
      alluserList: [], // 所有用户下拉
      dataIsChange: 0, // 计数器，据此判断表单是否已编辑
      noLeaveprompt: false, // 表单提交后，设置为true，据此判断提交不再弹出离开提示
      id: '', // 查询id
      form: {
        groupName: '', // 分组名称
        desc: '', // 分组描述
        selectCompanyId: this.$store.state.user.userSystemInfo.userInfo.groupId, // 选择的租户
        groupManageUser: [], // 分组负责人
        groupUser: [], // 分组成员
        skillinfo: []// 分组技能
      },
      custom_list: [], // 所属租户list
      rules: {
        groupName: [
          { required: true, message: '请输入分组名称（长度在 2 到 20 个字符）', trigger: 'blur' },
          { required: true, message: '请输入分组名称（长度在 2 到 20 个字符）', trigger: 'change' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'change' }
        ],
        selectCompanyId: [
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
    // this.id = this.$route.query.id
    // this.getInitData()
    this.getCustomManageList()
    this.getAlluserList()
    this.getAllskill()
  },
  methods: {

    companyidChange() {
      this.getAlluserList()
    },
    // 获取所有技能
    getAllskill() {
      const data = {
        groupId: this.form.selectCompanyId
      }
      allskill(data).then(res => {
        this.allskillList = res.data.allSkill
      })
    },
    // 获取所有用户
    getAlluserList() {
      const data = {
        groupId: this.form.selectCompanyId
      }
      findUserListByGroupId(data).then(res => {
        this.alluserList = res.data
        console.log('this.alluserList ', this.alluserList)
      })
    },
    // 获取所属租户list
    getCustomManageList() {
      getCustomManageList().then(res => {
        this.custom_list = res.data
      })
    },
    // 获取初始数据
    getInitData() {
      getItem({ _id: this.id }).then(response => {
        this.form = response.data.employeeGroup
        this.dataIsChange = -1
      })
    },

    // 保存
    save(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const data = {}
          data.groupName = this.form.groupName
          data.desc = this.form.desc
          data.selectCompanyId = this.form.selectCompanyId
          data.groupManageUser = this.form.groupManageUser
          data.groupUser = this.form.groupUser
          data.skillinfo = this.form.skillinfo
          addItem(data).then(response => {
            this.$message.success('新增分组成功！')
            this.noLeaveprompt = true
            this.$router.push({ path: '/user-center/group-manage/detail', query: { id: response.data._id }})
          })
        }
      })
    },
    // 取消
    cancel(formName) {
      this.$router.push({ path: '/user-center/group-manage/list' })
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
