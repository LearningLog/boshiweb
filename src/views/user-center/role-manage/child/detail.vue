<template>
  <div class="form-edit">
    <el-form ref="form" class="form" :model="form" label-width="100px">
      <el-form-item class="" label="角色名称：">
        <span>{{ form.rolename }}</span>
      </el-form-item>
      <el-form-item class="" label="角色描述：">
        <span>{{ form.desc }}</span>
      </el-form-item>
      <el-form-item class="" label="所属租户：">
        <span>{{ form.customname }}</span>
      </el-form-item>
      <el-form-item v-show="this.form.manageType === 3?false:true" label="角色类型：" prop="roleGroupId">
        <span>{{ form.manageTypeName }}</span>
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
            :default-checked-keys="treecheckedKeys"
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
      <el-button type="primary" @click="confirm">确定</el-button>
    </div>
  </div>
</template>

<script>
import { getOneRole, get_role_manage_type, getAllMenus } from '@/api/systemManage-roleManage'

export default {
  data() {
    return {
      form: { // 表单数据
        rolename: '', // 角色名称
        desc: '', // 角色描述
        customname: '' // 所属租户
      },
      id: '', // 查询id
      menuTree: [], // 权限树
      treecheckedKeys: [],
      defaultProps: {
        children: 'childs',
        label: 'menuname',
        id: '_id'
      },
      manageTypeList: []
    }
  },
  created() {
    this.id = this.$route.query.id
    this.getManageType()
    this.getAllMenus()
  },
  methods: {
    // 获取初始数据
    getInitData() {
      getOneRole({ _id: this.id }).then(response => {
        this.form = response.data.role
        this.manageTypeList.forEach(item => {
          if (item.id === response.data.role.manageType) {
            this.form.manageTypeName = item.name
            return
          }
        })
      })
    },
    // 获取角色授权页面管理类型
    getManageType() {
      get_role_manage_type().then(res => {
        this.manageTypeList = res.data
        this.getInitData()
      })
    },
    // 获取权限树数据
    getAllMenus() {
      getAllMenus({ _id: this.id }).then(res => {
        this.getDefaultCheckedKeys(res.data)
        this.menuTree = res.data
      })
    },
    // 获取默认选中的节点
    getDefaultCheckedKeys(menuTree) {
      menuTree.forEach(item => {
        item.disabled = true
        if (item.select) {
          this.treecheckedKeys.push(item._id)
        }
        item.childs = item.childs || []
        item.permissions = item.permissions || []
        item.childs = item.childs.concat(item.permissions)

        if (item.childs.length) {
          this.getDefaultCheckedKeys(item.childs)
        }
      })
    },
    // 确定
    confirm() {
      this.$router.push({ path: '/user-center/role-manage/list' })
    }
  }
}
</script>

<style scoped>
  .el-form-item__content .el-input {
    width: calc(100% - 120px);
  }
  .el-scrollbar {
    height: calc(100vh - 400px);
    width: 100%;
  }
  #btnGroup {
    padding-left: 100px;
  }
</style>
