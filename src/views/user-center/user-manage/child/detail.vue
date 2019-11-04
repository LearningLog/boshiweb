<template>
  <div class="form-edit">
    <el-form
      class="form"
      :model="form"
      label-width="120px"
    >
      <el-form-item label="用户名称：">
        <span>{{ form.username }}</span>
      </el-form-item>
      <el-form-item label="所属企业：" prop="groupId">
        <span>{{ form.username }}</span>
        <el-select
          v-model="form.groupId"
          placeholder="请选择所属企业"
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
      <el-form-item label="昵称：" prop="nickname">
        <span>{{ form.username }}</span>
        <el-input v-model="form.nickname" placeholder="请输入昵称" :max-length="20" clearable />
      </el-form-item>
      <el-form-item label="手机号：" prop="phone">
        <span>{{ form.username }}</span>
        <el-input v-model="form.phone" placeholder="请输入手机号" clearable />
      </el-form-item>
      <el-form-item label="密码：" prop="password">
        <span>{{ form.username }}</span>
        <el-input
          v-model="form.password"
          placeholder="请输入密码"
          type="password"
          autocomplete="new-password"
          maxlength="50"
          clearable
        />
      </el-form-item>
      <el-form-item label="用户状态：" prop="userStatus">
        <span>{{ form.username }}</span>
        <el-radio-group v-model="form.userStatus">
          <el-radio :label="1">生效</el-radio>
          <el-radio :label="0">失效</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="邮箱：" prop="email">
        <span>{{ form.username }}</span>
        <el-input v-model="form.email" placeholder="请输入邮箱地址" clearable />
      </el-form-item>
      <el-form-item label="描述：" prop="desc">
        <el-input
          :value="form.desc"
          type="textarea"
          :disabled="true"
        />
      </el-form-item>
      <el-form-item label="角色：" prop="falseRole">
        <el-input
          v-show="false"
          v-model="form.falseRole"
        />
        <span v-for="role in roles" :key="role.id">{{ role.name }}</span>
        <span @click="editRoles">修改</span>
      </el-form-item>
      <el-form-item label="小组：" prop="einc">
        <span v-for="egroup in egroups" :key="egroup.id">{{
          egroup.name
        }}</span>
        <span @click="editEgroups">修改</span>
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
      <el-transfer v-model="hasList" :data="noList" :titles="['未分配角色', '已分配角色']" :props="defaultProps" @change="handleTransferChange" />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="setInformation">确定</el-button>
        <el-button @click="setRolesDialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getCustomManageList, getAllRole } from '@/api/systemManage-roleManage'
import { getUserById } from '@/api/userCenter-userManage'
import { validUserName, validPhone, validPassword } from '@/utils/validate'

export default {
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
        einc: [], // 角色
        minc: [] // 角色
      },
      custom_list: [], // 所属企业list
      roles: [], // 加入小组inc集合
      egroups: [], // 管理小组inc集合
      defaultProps: { // 穿梭框节点别名
        key: '_id',
        label: 'newscategory_name'
      },
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
    editRoles() {
      getAllRole().then(response => {
        debugger
        this.noList = []
        this.hasList = []
        this.noList = response.data.noList.concat(response.data.hasList)
        response.data.hasList.forEach((item, index) => {
          this.hasList.push(item._id)
        })
      })
      this.setRolesDialogVisible = true
    },
    handleTransferChange(value, direction, movedKeys) {
      this.hasList = value
      if (this.roles.length) {
        this.falseRole = true
      }
    },
    // 修改小组
    editEgroups() {
      debugger
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
  #btnGroup {
    padding-left: 120px;
  }
</style>
