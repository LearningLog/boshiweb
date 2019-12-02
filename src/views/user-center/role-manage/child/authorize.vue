<template>
  <div class="form-edit">
    <el-form ref="form" class="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="角色名称：">
        <span>{{ form.rolename }}</span>
      </el-form-item>
      <el-form-item label="角色描述：">
        <span>{{ form.desc }}</span>
      </el-form-item>
      <el-form-item v-show="manageTypeList.length !== 1" label="角色类型：" prop="manageType">
        <el-radio-group v-model="manageType" @change="handleChangeManageType">
          <el-radio v-for="item in manageTypeList" :key="item.id" :label="item.id">{{ item.name }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="角色授权：">
        <el-scrollbar wrap-class="scrollbar-wrapper">
          <el-tree
            ref="menuTree"
            :data="menuTree"
            show-checkbox
            default-expand-all
            highlight-current
            :expand-on-click-node="false"
            :check-on-click-node="true"
            node-key="_id"
            :default-checked-keys="permissionids"
            :props="defaultProps"
          >
            <span slot-scope="{ node, data }" class="custom-tree-node">
              <span :dataType="data.type">
                <svg class="icon" aria-hidden="true">
                  <use :xlink:href="data.type === 'permission' ? '#iconyemian' : '#iconwenjianjia'" />
                </svg>
                {{ node.label }}
              </span>
            </span>
          </el-tree>
        </el-scrollbar>
      </el-form-item>
    </el-form>
    <div id="btnGroup">
      <el-button v-no-more-click type="primary" @click="save('form')">提交</el-button>
      <el-button type="primary" plain @click="cancel()">取消</el-button>
    </div>
  </div>
</template>

<script>
import { getOneRole, get_role_manage_type, getAllMenus, setRoleAuthority } from '@/api/user-center//roleManage'
export default {
  data() {
    return {
      dataIsChange: 0, // 计数器，据此判断表单是否已编辑
      noLeaveprompt: false, // 表单提交后，设置为true，据此判断提交不再弹出离开提示
      id: '', // 查询id
      form: {
        rolename: '', // 角色名称
        desc: '', // 角色描述
        manageType: 1 // 所属租户
      },
      manageType: 1, // 所属租户
      manageTypeList: [], // 管理类型
      menuTree: [], // 权限树
      defaultProps: {
        children: 'childs',
        label: 'menuname',
        id: '_id'
      },
      permissionids: [], // 功能权限集合
      rules: {
        manageType: [
          { required: true, message: '请选择角色类型', trigger: 'blur' },
          { required: true, message: '请选择角色类型', trigger: 'change' }
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
    this.getInitData()
    this.getAllMenus()
  },
  methods: {
    // 获取初始数据
    getInitData() {
      getOneRole({ _id: this.id }).then(response => {
        const { role } = response.data
        this.form.rolename = role.rolename
        this.form.desc = role.desc
        this.form.manageType = role.manageType || 3
        this.manageType = role.manageType || 3
        this.permissionids = role.permissionids || []
        this.dataIsChange = -1
        this.getManageType()
      })
    },

    // 处理更改角色类型
    handleChangeManageType(val) {
      this.form.manageType = val
    },

    // 获取角色授权页面管理类型
    getManageType() {
      get_role_manage_type().then(res => {
        this.manageTypeList = res.data
        if (this.manageTypeList.length === 1) {
          this.manageType = this.manageTypeList[0].id
        }
      })
    },
    // 获取权限树数据
    getAllMenus() {
      getAllMenus({ _id: this.id }).then(res => {
        this.menuTree = res.data
        this.getDefaultCheckedKeys(res.data)
      })
    },
    // 获取默认选中的节点
    getDefaultCheckedKeys(menuTree) {
      menuTree.forEach(item => {
        item.childs = item.childs || []
        item.permissions = item.permissions || []
        item.childs = item.childs.concat(item.permissions)

        if (item.childs.length) {
          this.getDefaultCheckedKeys(item.childs)
        }
      })
    },

    // 保存
    save(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const checkedKeys = this.$refs.menuTree.getCheckedKeys()
          const halfCheckedKeys = this.$refs.menuTree.getHalfCheckedKeys()
          const param = {
            _id: this.id,
            manageType: this.manageType,
            menuids: halfCheckedKeys,
            permissionids: checkedKeys
          }
          setRoleAuthority(param).then(response => {
            this.$message.success('角色授权成功！')
            this.noLeaveprompt = true
            this.$router.push({ path: '/user-center/role-manage/list' })
          })
        }
      })
    },
    // 取消
    cancel() {
      this.$router.push({ path: '/user-center/role-manage/list' })
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
  .el-scrollbar {
    height: calc(100vh - 340px);
    width: 100%;
  }
  .menuKey {
    color: #1980ff!important;
  }
  .authKey {
    color: #fdc931!important;
  }
</style>
