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
      <el-form-item label="用户名称">
        <el-input
          v-model="form.username"
          :disabled="true"
        />
      </el-form-item>
      <el-form-item label="所属企业">
        <el-input
          v-model="form.customname"
          :disabled="true"
        />
      </el-form-item>
      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="form.nickname" placeholder="请输入昵称" :max-length="20" clearable />
      </el-form-item>
      <el-form-item label="用户类型" prop="type">
        <el-radio-group v-model="form.type">
          <el-radio :label="1">非管理层</el-radio>
          <el-radio :label="2">管理层</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="form.phone" placeholder="请输入手机号" clearable />
      </el-form-item>
      <el-form-item label="是否修改密码">
        <el-radio-group v-model="setUpPwd">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="setUpPwd" label="新密码" prop="password">
        <el-input
          v-model="form.password"
          placeholder="请输入密码"
          type="password"
          autocomplete="new-password"
          maxlength="50"
          clearable
        />
      </el-form-item>
      <el-form-item label="用户状态" prop="userStatus">
        <el-radio-group v-model="form.userStatus">
          <el-radio :label="1">生效</el-radio>
          <el-radio :label="2">失效</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" placeholder="请输入邮箱地址" clearable />
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
      <el-form-item label="角色" prop="falseRole">
        <el-input
          v-show="false"
          v-model="form.falseRole"
        />
        <span v-for="role in roles" :key="role._id" class="role">{{ role.rolename }}</span>
        <span class="pointer" @click="getAllRoles">修改</span>
      </el-form-item>
      <el-form-item label="小组" prop="einc">
        <span v-for="egroup in egroups" :key="egroup._id" class="role">{{
          egroup.groupName
        }}</span>
        <span class="pointer" @click="getEgroups">修改</span>
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
    <el-dialog v-el-drag-dialog class="setRolesDialog" width="650px" title="分配角色" :visible.sync="setRolesDialogVisible">
      <el-transfer v-model="roleIdList" :data="form.noList" :titles="['未分配角色', '已分配角色']" :props="defaultProps" @change="handleTransferChange" />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="setRoles">确定</el-button>
        <el-button @click="setRolesDialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog v-el-drag-dialog class="setRolesDialog" width="650px" title="分配小组" :visible.sync="setEgroupsDialogVisible">
      <el-transfer v-model="einc" class="setEgroups" :data="form.noList2" :titles="['未分配小组', '已分配小组']" :props="defaultProps2" @change="handleTransferChange2">
        <span slot-scope="{ option }">{{ option.label }}
          <span class="groupName">{{ option.groupName }}</span>
          <div class="fr eincs">
            <el-checkbox-group v-model="chargemanList">
              <el-checkbox :label="option.inc" :checked="option.manage">组长</el-checkbox>
            </el-checkbox-group>
          </div>
        </span>
      </el-transfer>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="setEgroups">确定</el-button>
        <el-button @click="setEgroupsDialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getCustomManageList, getAllRole } from '@/api/user-center//roleManage'
import { getAllEmployeeGroup } from '@/api/user-center/groupManage'
import { updateUser, getUserById } from '@/api/user-center/userManage'
import { validPhone, validPassword } from '@/utils/validate'
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui

export default {
  directives: { elDragDialog },
  data() {
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
      id: '', // 查询id
      form: {
        username: '', // 用户名称
        groupId: '', // 所属企业
        nickname: '', // 昵称
        type: 1, // 用户类型
        phone: '', // 手机号
        password: '', // 密码
        setUpPwd: 0, // 默认不修改密码
        userStatus: 1, // 状态
        email: '', // 邮箱
        desc: '', // 描述
        roleIdList: [], // 角色id集合
        falseRole: '', // 假的角色，用于角色校验
        einc: [], // 加入的小组
        minc: [] // 小组管理员
      },
      setUpPwd: 0, // 默认不修改密码
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
      roleIdList: [], // 角色id集合
      einc: [], // 已分配的小组
      chargemanList: [], // 已分配的小组
      rules: {
        nickname: [
          { required: true, message: '请输入用户登入平台后显示的名称（长度在 2 到 20 位字符）', trigger: 'blur' },
          { required: true, message: '请输入用户登入平台后显示的名称（长度在 2 到 20 位字符）', trigger: 'change' },
          { min: 2, max: 20, message: '长度在 2 到 20 位字符', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 位字符', trigger: 'change' }
        ],
        type: [
          { required: true, message: '请选择用户类型', trigger: 'blur' },
          { required: true, message: '请选择用户类型', trigger: 'change' }
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
          { required: true, message: '请选择用户状态', trigger: 'blur' },
          { required: true, message: '请选择用户状态', trigger: 'change' }
        ],
        email: [
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
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
    this.id = this.$route.query.id
    this.form._id = this.$route.query.id
    this.getCustomManageList()
  },
  methods: {
    // 获取所属企业list
    getUserById() {
      getUserById({ _id: this.id }).then(res => {
        const { user } = res.data
        this.form.username = user.username
        this.form.customname = user.customname
        this.form.nickname = user.nickname
        this.form.type = user.type ? user.type * 1 : 1
        this.form.phone = user.phone
        this.form.userStatus = user.userStatus
        this.form.email = user.email
        this.form.desc = user.desc

        this.roleIdList.length = 0
        user.roleList.forEach(item => {
          this.roleIdList.push(item._id)
        })
        this.roles = JSON.parse(JSON.stringify(user.roleList))
        if (this.roles.length) {
          this.form.falseRole = '11111'
        }
        this.egroups = user.groupList
        this.einc.length = 0
        user.groupList.forEach(item => {
          this.einc.push(item.inc)
          if (item.manage) {
            this.chargemanList.push(item.inc)
          }
        })
        this.dataIsChange = -1
      })
    },
    // 获取所属企业list
    getCustomManageList() {
      getCustomManageList().then(res => {
        this.custom_list = res.data
        this.getUserById()
      })
    },
    // 提交
    save(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          switch (this.setUpPwd) {
            case 0:
              this.form.setUpPwd = 'N'
              break
            case 1:
              this.form.setUpPwd = 'Y'
              break
          }
          this.form.minc = this.chargemanList
          this.form.roleIdList = this.roleIdList
          delete this.form.falseRole
          delete this.form.noList
          delete this.form.noList2
          delete this.form.roleList
          delete this.form.groupList
          updateUser(this.form).then(response => {
            this.$message.success('修改用户成功！')
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
      getAllRole({ _id: this.id }).then(response => {
        this.form.noList = response.data.allRoleList.concat(response.data.existRoleList)
        // response.data.existRoleList.forEach(item => {
        //   this.roleIdList.push(item._id)
        // })
        this.setRolesDialogVisible = true
      })
    },
    handleTransferChange(value, direction, movedKeys) {
      // this.roleIdList = value
    },
    handleTransferChange2(value, direction, movedKeys) {
      this.form.einc = value
      for (var i = this.chargemanList.length - 1; i >= 0; i--) {
        var item = this.chargemanList[i]
        if (this.form.einc.indexOf(item) === -1) {
          this.chargemanList.splice(i, 1)
        }
      }
    },
    // 设置角色
    setRoles() {
      this.setRolesDialogVisible = false
      this.roles = []
      if (this.roleIdList.length) {
        this.form.falseRole = '11111'
        this.form.noList.forEach((item, index) => {
          this.roleIdList.forEach(item1 => {
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
      getAllEmployeeGroup({ _id: this.id }).then(response => {
        this.form.noList2 = response.data.allEmployeeGroupList.concat(response.data.existEmployeeGroupList || [])
        // response.data.existEmployeeGroupList.forEach(item => {
        //   this.einc.push(item._id)
        // })
        this.setEgroupsDialogVisible = true
      })
    },
    // 设置小组
    setEgroups() {
      this.setEgroupsDialogVisible = false
      if (this.einc.length) {
        this.egroups = []
        this.form.noList2.forEach((item, index) => {
          this.einc.forEach(item1 => {
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
