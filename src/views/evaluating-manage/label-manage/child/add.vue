<template>
  <div class="form-edit">
    <el-form
      ref="form"
      class="form"
      :model="form"
      :rules="rules"
      :status-icon="true"
      label-width="120px"
    >
      <el-form-item class="required" label="标签名称" prop="username">
        <el-input
          v-model="form.username"
          placeholder="请输入标签名称"
          :max-length="20"
          clearable
        />
      </el-form-item>
      <el-form-item label="所属小组" prop="groupId">
        <el-select
          v-model="form.groupId"
          placeholder="请选择所属小组"
          clearable
          filterable
        >
          <el-option
            v-for="item in custom_list"
            :key="item._id"
            :label="item.customname"
            :value="item._id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="描述" prop="desc">
        <el-input
          v-model="form.desc"
          type="textarea"
          placeholder="请输入描述"
          :max-length="256"
          clearable
        />
      </el-form-item>
    </el-form>
    <div id="btnGroup">
      <el-button
        v-no-more-click
        type="primary"
        @click="save('form')"
      >提交</el-button>
      <el-button type="primary" plain @click="cancel('form')">取消</el-button>
    </div>
  </div>
</template>

<script>
import { getCustomManageList, getAllRole } from '@/api/systemManage-roleManage'
import { getAllEmployeeGroup } from '@/api/userCenter-groupManage.js'
import { createUser } from '@/api/userCenter-userManage'
import { validUserName, validPhone, validPassword } from '@/utils/validate'
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui

export default {
  directives: { elDragDialog },
  data() {
    const validUsername = (rule, value, callback) => {
      value = value || ''
      if (!validUserName(value)) {
        callback(new Error('请输入用户登入平台的名称（长度在 2 到 20 位字母或数字）'))
      } else {
        callback()
      }
    }
    const phone = (rule, value, callback) => {
      value = value || ''
      if (!validPhone(value)) {
        callback(new Error('请输入用户登入平台的名称（长度在 2 到 20 位字母或数字）'))
      } else {
        callback()
      }
    }
    const password = (rule, value, callback) => {
      value = value || ''
      if (!validPassword(value)) {
        callback(new Error('请输入密码，（长度 6 到 50 位，字母和数字组成）'))
      } else {
        callback()
      }
    }
    return {
      dataIsChange: 0, // 计数器，据此判断表单是否已编辑
      noLeaveprompt: false, // 表单提交后，设置为true，据此判断提交不再弹出离开提示
      setRolesDialogVisible: false,
      setEgroupsDialogVisible: false,
      form: {
        username: '', // 用户名称
        groupId: '', // 所属企业
        nickname: '', // 昵称
        phone: '', // 手机号
        password: '', // 密码
        userStatus: 1, // 状态
        email: '', // 邮箱
        desc: '', // 描述
        roleIdList: [], // 角色id集合
        falseRole: '', // 假的角色，用于角色校验
        einc: [], // 加入的小组
        minc: [] // 小组管理员
      },
      custom_list: [], // 所属企业list
      roles: [], // 加入小组inc集合
      egroups: [], // 管理小组inc集合
      defaultProps: { // 穿梭框节点别名
        key: '_id',
        label: 'rolename'
      },
      defaultProps2: { // 穿梭框节点别名
        key: 'inc',
        label: 'groupName'
      },
      noList: [], // 未分配的角色
      roleIdList: [], // 已分配的角色
      noList2: [], // 未分配的小组
      einc: [], // 已分配的小组
      chargemanList: [], // 已分配的小组
      rules: {
        username: [
          { required: true, validator: validUsername, message: '请输入用户登入平台的名称（长度在 2 到 20 位字母或数字）', trigger: 'blur' },
          { required: true, validator: validUsername, message: '请输入用户登入平台的名称（长度在 2 到 20 位字母或数字）', trigger: 'change' },
          { min: 2, max: 20, message: '长度在 2 到 20 位字符', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 位字符', trigger: 'change' }
        ],
        groupId: [
          { required: true, message: '请选择所属企业', trigger: 'blur' },
          { required: true, message: '请选择所属企业', trigger: 'change' }
        ],
        nickname: [
          { required: true, message: '请输入用户登入平台后显示的名称（长度在 2 到 20 位字符）', trigger: 'blur' },
          { required: true, message: '请输入用户登入平台后显示的名称（长度在 2 到 20 位字符）', trigger: 'change' },
          { min: 2, max: 20, message: '长度在 2 到 20 位字符', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 位字符', trigger: 'change' }
        ],
        phone: [
          { required: true, validator: phone, message: '请输入11位手机号', trigger: 'blur' },
          { required: true, validator: phone, message: '请输入11位手机号', trigger: 'change' }
        ],
        password: [
          { required: true, validator: password, message: '请输入密码，（长度 6 到 50 位，字母和数字组成）', trigger: 'blur' },
          { required: true, validator: password, message: '请输入密码，（长度 6 到 50 位，字母和数字组成）', trigger: 'change' },
          { min: 6, max: 50, message: '长度在 6 到 50 位字符', trigger: 'blur' },
          { min: 6, max: 50, message: '长度在 6 到 50 位字符', trigger: 'change' }
        ],
        userStatus: [
          { required: true, message: '请输入11位手机号', trigger: 'blur' },
          { required: true, message: '请输入11位手机号', trigger: 'change' }
        ],
        falseRole: [
          { required: true, message: '请选择角色', trigger: 'blur' },
          { required: true, message: '请选择角色', trigger: 'change' }
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
    this.getCustomManageList()
  },
  methods: {
    // 获取所属企业list
    getCustomManageList() {
      getCustomManageList().then(res => {
        this.custom_list = res.data
      })
    },
    // 提交
    save(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.form.minc = this.chargemanList
          delete this.form.falseRole
          delete this.form.noList
          delete this.form.noList2
          createUser(this.form).then(response => {
            this.$message.success('添加用户成功！')
            this.noLeaveprompt = true
            this.$router.push({
              path: '/user-center/user-manage/detail',
              query: { id: response.data._id }
            })
          })
        }
      })
    },
    // 取消
    cancel() {
      this.$router.push({ path: '/user-center/user-manage/list' })
    },
    // 获取全部角色
    getAllRoles() {
      getAllRole({}).then(response => {
        this.form.noList = response.data.allRoleList
        this.setRolesDialogVisible = true
      })
    },
    handleTransferChange(value, direction, movedKeys) {
      this.form.roleIdList = value
    },
    handleTransferChange2(value, direction, movedKeys) {
      this.form.einc = value
    },
    // 设置角色
    setRoles() {
      this.setRolesDialogVisible = false
      this.roles = []
      if (this.form.roleIdList.length) {
        this.form.falseRole = '11111'
        this.form.noList.forEach((item, index) => {
          this.form.roleIdList.forEach(item1 => {
            if (item1 === item._id) {
              this.roles.push(item)
            }
          })
        })
      } else {
        this.form.falseRole = ''
      }
    },

    // 获取所有小组
    getEgroups() {
      getAllEmployeeGroup({}).then(response => {
        this.form.noList2 = response.data.allEmployeeGroupList
        this.setEgroupsDialogVisible = true
      })
    },
    // 设置小组
    setEgroups() {
      this.setEgroupsDialogVisible = false
      this.egroups = []
      if (this.form.einc.length) {
        this.form.noList2.forEach((item, index) => {
          this.form.einc.forEach(item1 => {
            if (item1 === item.inc) {
              this.egroups.push(item)
            }
          })
        })
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.dataIsChange && !this.noLeaveprompt) {
      // 判断表单数据是否变化，以及提交后不进行此保存提示
      setTimeout(() => {
        // 此处必须要加延迟执行，主要解决浏览器前进后退带来的闪现
        this.$confirm('您的数据尚未保存，是否离开？', '离开页面', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            next()
          })
          .catch(() => {
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
  @import "~@/styles/theme.scss";
#btnGroup {
  padding-left: 120px;
}
.setRolesDialog /deep/ .el-transfer {
  margin: 0 auto;
  text-align: center;
}
.setRolesDialog /deep/ .el-transfer-panel {
  text-align: left;
}
  .pointer {
    color: $themeColor;
  }
  .role {
    margin-right: 6px;
  }
  .setEgroups /deep/ .el-transfer-panel:first-child .eincs {
    display: none;
  }
  .setEgroups /deep/ .el-transfer-panel:last-child {
    width: 250px;
  }
  .setEgroups /deep/ .el-transfer-panel:last-child .el-checkbox {
    margin-right: 0!important;
  }
  /deep/ .groupName {
    max-width: 150px;
    display: inline-block;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .eincs {
    display: inline-block;
    position: absolute;
    right: 0;
    z-index: 2;
    margin-right: 6px;
  }
</style>
