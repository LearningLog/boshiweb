<template>
  <div class="form-edit">
    <el-form ref="form" class="form" :model="form" :rules="rules" :status-icon="true" label-width="120px">
      <el-form-item class="required" label="模块名称" prop="modulename">
        <el-input v-model="form.modulename" placeholder="请输入模块名称" clearable />
      </el-form-item>
      <el-form-item class="required" label="权限名称" prop="permissionname">
        <el-input v-model="form.permissionname" placeholder="请输入权限名称" clearable />
      </el-form-item>
      <el-form-item class="required" label="权限标识" prop="permissionmark">
        <el-input v-model="form.permissionmark" placeholder="请输入权限标识" clearable />
      </el-form-item>
      <el-form-item class="required" label="权限code" prop="permissioncode">
        <el-input v-model="form.permissioncode" placeholder="请输入权限code" clearable />
      </el-form-item>
      <el-form-item label="权限描述">
        <el-input v-model="form.permissiondesc" type="textarea" :rows="3" placeholder="请输入权限描述" />
      </el-form-item>
      <el-form-item class="required" label="所属菜单">
        <span class="pointer" @click="show_menu_tree_fn">{{ menu_tip_txt }}</span>
      </el-form-item>
      <el-form-item label="管理类别">
        <el-radio-group v-model="form.permissionmanage">
          <el-radio v-for="item in manage_type" :key="item.permissionmanage" :label="item.permissionmanage">{{ item.name }}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div id="btnGroup">
      <el-button type="primary" @click="save('form')">保存</el-button>
      <el-button type="primary" plain @click="cancel('form')">取消</el-button>
    </div>
    <!--菜单选择列表-->
    <el-dialog
      title="所属菜单"
      :visible.sync="menu_tree_flag"
      width="50%"
      center
    >
      <div class="menu_tree_box">
        <!--<el-scrollbar wrap-class="scrollbar-wrapper">-->
        <el-tree
          ref="tree"
          :data="treeData"
          :props="defaultProps"
          show-checkbox
          node-key="id"
          :check-strictly="true"
          default-expand-all
          :expand-on-click-node="false"
          @check-change="menu_tree_check_fn"
        />
        <!--</el-scrollbar>-->
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="save_menu">确认</el-button>
        <el-button type="primary" plain @click="cancel_menu">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { permission_edit, permission_det } from '@/api/systemManage-permissionManage.js'
export default {
  data() {
    return {
      form: {
        modulename: '',
        permissionname: '',
        permissionmark: '',
        permissioncode: '',
        permissiondesc: '',
        permissionbelongmenu: [],
        permissionmanage: ''
      },
      treeData: [],
      menu_tip_txt: '请选择菜单',
      menu_tree_flag: false,
      menu_tree_checked: {
        id: [],
        checkey: [],
        dt: {}
      },
      manage_type: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      query_param: '',
      rules: {
        modulename: [
          { required: true, message: '请输入模块名称（长度在 1 到 64 个字符）', trigger: 'blur' },
          { required: true, message: '请输入模块名称（长度在 1 到 64 个字符）', trigger: 'change' },
          { min: 1, max: 64, message: '长度在 1 到 64 个字符', trigger: 'blur' },
          { min: 1, max: 64, message: '长度在 1 到 64 个字符', trigger: 'change' }
        ],
        permissionname: [
          { required: true, message: '请输入权限名称（长度在 1 到 64 个字符）', trigger: 'blur' },
          { required: true, message: '请输入权限名称（长度在 1 到 64 个字符）', trigger: 'change' },
          { min: 1, max: 64, message: '长度在 1 到 64 个字符', trigger: 'blur' },
          { min: 1, max: 64, message: '长度在 1 到 64 个字符', trigger: 'change' }
        ],
        permissionmark: [
          { required: true, message: '请输入权限标识（长度在 1 到 64 个字符）', trigger: 'blur' },
          { required: true, message: '请输入权限标识（长度在 1 到 64 个字符）', trigger: 'change' },
          { min: 1, max: 64, message: '长度在 1 到 64 个字符', trigger: 'blur' },
          { min: 1, max: 64, message: '长度在 1 到 64 个字符', trigger: 'change' }
        ],
        permissioncode: [
          { required: true, message: '请输入权限code（长度在 1 到 64 个字符）', trigger: 'blur' },
          { required: true, message: '请输入权限code（长度在 1 到 64 个字符）', trigger: 'change' },
          { min: 1, max: 64, message: '长度在 1 到 64 个字符', trigger: 'blur' },
          { min: 1, max: 64, message: '长度在 1 到 64 个字符', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.query_param = this.$route.query.ids
    this.get_det()
    this.get_munu()
    this.get_permission_manage_type()
  },
  methods: {
    get_munu() {
      const param = {}
      permission_menu(param).then(response => {
        const { MenuV2List } = response.data
        this.treeData = this.translate(MenuV2List)
      })
    },
    get_permission_manage_type() {
      const param = {}
      permission_manage_type(param).then(response => {
        this.form.manage_type = response.data
      })
    },
    translate(menuList) {
      if (!(menuList && menuList.length > 0)) {
        return []
      }

      var firstMenuList = []
      var cidMenu = {}
      var cidChildren = {}
      // 该数组元素是每一级菜单数组，用于排序
      var allNeedSortMenuList = []
      allNeedSortMenuList.push(firstMenuList)

      var getCidChildren = function(cid) {
        if (cid in cidChildren) {
          return cidChildren[cid]
        }
        var newChildren = []
        cidChildren[cid] = newChildren
        allNeedSortMenuList.push(newChildren)
        return cidChildren[cid]
      }

      for (var i = 0; i < menuList.length; i++) {
        var oldMenu = menuList[i]

        var newMenu = {}
        var children = getCidChildren(oldMenu.cid)
        newMenu['label'] = oldMenu['menuname']
        newMenu['children'] = children
        newMenu['orders'] = oldMenu['orders']
        newMenu['id'] = oldMenu['_id']

        var parrentId = oldMenu.pid
        if (parrentId === 'firstMenu') {
          firstMenuList.push(newMenu)
        } else {
          var parrentChildren = getCidChildren(parrentId)
          parrentChildren.push(newMenu)
        }
        cidMenu[oldMenu.cid] = newMenu
      }

      var compare = function(val1, val2) {
        return val1.orders - val2.orders
      }

      for (let i = 0; i < allNeedSortMenuList.length; i++) {
        var oneMenuList = allNeedSortMenuList[i]
        oneMenuList.sort(compare)
      }

      const arr = [{}]
      arr[0].children = firstMenuList
      arr[0].id = 'firstMenu'
      arr[0].label = '菜单管理'
      arr[0].orders = 1

      return arr
    },
    show_menu_tree_fn() {
      this.menu_tree_flag = true
    },
    menu_tree_check_fn(data, checked, indeterminate) {
      this.menu_tree_checked.checkey = [data.id]
      // this.menu_tree_checked_id.id = data.id
      if (checked === true) {
        this.menu_tree_checked.id = data.id
        this.$refs.tree.setCheckedKeys([data.id])
        this.menu_tree_checked.dt = data
      } else {
        if (this.menu_tree_checked.id === data.id) {
          this.$refs.tree.setCheckedKeys([data.id])
        }
      }
    },
    save_menu() {
      const tip = this.menu_tree_checked.dt.label
      this.menu_tip_txt = tip
      this.form.permissionbelongmenu.push(this.menu_tree_checked.id)
      this.menu_tree_flag = false
    },
    cancel_menu() {
      this.menu_tree_flag = false
      this.menu_tree_checked = { id: [], checkey: [], dt: {}}
      this.menu_tip_txt = '请选择菜单'
    },
    get_det() {
      const that = this
      const param = {}
      param._id = this.query_param
      permission_det(param).then(res => {
        that.form.modulename = res.data.permission.modulename
        that.form.permissionname = res.data.permission.permissionname
        that.form.permissionmark = res.data.permission.permissionmark
        that.form.permissioncode = res.data.permission.permissioncode
        that.form.permissiondesc = res.data.permission.permissiondesc
      }).catch(error => {
        console.log(error)
      })
    },
    save(formName) {
      const query_param = this.query_param
      this.$refs[formName].validate((valid) => {
        if (valid) {
          permission_edit(this.form).then(response => {
            this.$message.success('修改成功')
            this.$router.push({ path: '/systemManage/permissionManage/detail', query: { ids: query_param }})
          })
        }
      })
    },
    cancel(formName) {
      this.$refs[formName].resetFields()
      this.$router.push({ path: '/systemManage/permissionManage/list' })
    }
  }

}
</script>

<style lang="scss" scoped>
  #btnGroup{
    padding-left: 120px;
  }
</style>
