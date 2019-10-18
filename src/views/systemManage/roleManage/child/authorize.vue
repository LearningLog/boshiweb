<template>
  <div class="form-edit">
    <el-form ref="form" class="form" :model="form" label-width="120px">
      <el-form-item label="角色名称：">
        <span>{{ form.rolename }}</span>
      </el-form-item>
      <el-form-item label="角色描述：">
        <span>{{ form.desc }}</span>
      </el-form-item>
      <el-form-item label="角色类型：" prop="roleGroupId">
        <el-radio-group v-model="manageType">
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
            :default-checked-keys="treecheckedKeys"
            :props="defaultProps"
            :render-content="renderContent"
          />
        </el-scrollbar>
      </el-form-item>
    </el-form>
    <div id="btnGroup">
      <el-button type="primary" v-no-more-click @click="save">提交</el-button>
      <el-button type="primary" plain @click="cancel('form')">取消</el-button>
    </div>
  </div>
</template>

<script>
import { getOneRole, get_role_manage_type, getAllMenus, setRoleAuthority } from '@/api/systemManage-roleManage'
export default {
  data() {
    return {
      id: '', // 查询id
      form: {
        rolename: '', // 角色名称
        desc: '', // 角色描述
        manageType: 1 // 所属租户
      },
      manageType: 1, // 所属租户
      manageTypeList: [], // 管理类型
      menuTree: [], // 权限树
      treecheckedKeys: [],
      defaultProps: {
        children: 'childs',
        label: 'menuname',
        id: '_id'
      },
      menuids: [], // 菜单权限集合
      permissionids: [] // 功能权限集合
    }
  },
  created() {
    this.id = this.$route.query.id
    this.getInitData()
    this.getManageType()
    this.getAllMenus()
  },
  methods: {
    // 获取初始数据
    getInitData() {
      getOneRole({ _id: this.id }).then(response => {
        this.form = response.data.role
      })
    },
    // 获取角色授权页面管理类型
    getManageType() {
      get_role_manage_type().then(res => {
        this.manageTypeList = res.data
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
    // 获取 menuids 和 permissionids
    getMenuidsAndPermissionids(checkedNodes) {
      checkedNodes.forEach(item => {
        if (item.type !== 'permission' && !item.ispush) {
          this.menuids.push(item._id)
          item.ispush = true
        } else if (!item.ispush) {
          this.permissionids.push(item._id)
          item.ispush = true
        }
        if (item.childs.length) {
          this.getMenuidsAndPermissionids(item.childs)
        }
      })
    },
    // 自定义树节点
    renderContent(h, { node, data, store }) {
      if (data.type === 'permission') {
        return (
          <span class='custom-tree-node'>
            <i class='iconfont iconzu authKey' style='color:#1980ff;'></i>
            <span style='margin-left:5px;'>{node.label}</span>
          </span>
        )
      } else {
        return (
          <span class='custom-tree-node'>
            <i class='iconfont iconwenjianjia menuKey' style='color:#fdc931;'></i>
            <span style='margin-left:5px;'>{node.label}</span>
          </span>
        )
      }
    },
    // 保存
    save() {
      const menuTree = this.$refs.menuTree.getCheckedNodes()
      this.getMenuidsAndPermissionids(menuTree)
      console.log('menuids', this.menuids)
      console.log('permissionids', this.permissionids)
      const param = {
        _id: this.id,
        manageType: this.manageType,
        menuids: this.menuids,
        permissionids: this.permissionids
      }
      setRoleAuthority(param).then(response => {
        this.$message.success('角色授权成功！')
        this.noLeaveprompt = true
        this.$router.push({ path: '/systemManage/roleManage/list' })
      })
    },
    // 取消
    cancel(formName) {
      this.$refs[formName].resetFields()
      this.$router.push({ path: '/systemManage/roleManage/list' })
    }
  },
  beforeRouteLeave(to, from, next) {
    if (!this.noLeaveprompt) {
      this.$confirm('您的数据尚未保存，是否离开？', '离开页面', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        next()
      }).catch(() => {
        next(false)
      })
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
