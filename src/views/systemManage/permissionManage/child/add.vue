<template>
  <div class="form-edit">
    <el-form ref="form" class="form" :model="form" :rules="rules" :status-icon="true" label-width="120px">
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
      <el-form-item class="required" label="所属菜单" prop="permissionbelongmenu2">
        <span class="pointer actcolor" @click="show_menu_tree_fn">{{ menu_tip_txt }}</span>
        <el-input v-show="false" v-model="form.permissionbelongmenu2" />
      </el-form-item>
      <el-form-item class="required" label="权限类别" prop="permissionmanage">
        <el-radio-group v-model="form.permissionmanage">
          <el-radio v-for="item in manage_type" :key="item.permissionmanage" :label="item.permissionmanage">{{ item.name }}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div id="btnGroup">
      <el-button v-no-more-click type="primary" @click="save('form')">提交</el-button>
      <el-button type="primary" plain @click="cancel('form')">取消</el-button>
    </div>
    <!--菜单选择列表-->
    <el-dialog
      v-el-drag-dialog
      title="所属菜单"
      :visible.sync="menu_tree_flag"
      width="38%"
      height="60vh"
    >
      <div class="menu_tree_box">
        <el-scrollbar wrap-class="scrollbar-wrapper">
          <el-tree
            ref="tree"
            :data="treeData"
            :props="defaultProps"
            show-checkbox
            node-key="id"
            :check-strictly="true"
            :expand-on-click-node="false"
            :check-on-click-node="true"
            default-expand-all
            highlight-current
            @check-change="menu_tree_check_fn"
          />
        </el-scrollbar>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="save_menu">确认</el-button>
        <el-button type="primary" plain @click="cancel_menu">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { permission_add, permission_menu, permission_manage_type } from '@/api/system-manage/permissionManage.js'
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui

export default {
  directives: { elDragDialog },
  data() {
    return {
      dataIsChange: 0, // 计数器，据此判断表单是否已编辑
      noLeaveprompt: false, // 表单提交后，设置为true，据此判断提交不再弹出离开提示
      form: {
        permissionname: '',
        permissionmark: '',
        permissioncode: '',
        permissiondesc: '',
        permissionbelongmenu: [],
        permissionmanage: '',
        permissionbelongmenu2: ''
      },
      menu_dt: [],
      treeData: [],
      menu_tip_txt: '请选择菜单',
      menu_tree_flag: false,
      menu_tree_checked: {
        ids: [],
        checkey: [],
        dt: {},
        lables: []
      },
      manage_type: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      rules: {
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
        ],
        permissionbelongmenu2: [
          { required: true, message: '请选择所属菜单', trigger: 'blur' },
          { required: true, message: '请选择所属菜单', trigger: 'change' }
        ],
        permissionmanage: [
          { required: true, message: '请选择权限类别', trigger: 'change' }
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
  mounted() {
  },
  created() {
    this.get_menu()
    this.get_permission_manage_type()
  },
  methods: {
    // 获取所有菜单
    get_menu() {
      const param = {}
      permission_menu(param).then(response => {
        const { MenuV2List } = response.data
        this.menu_dt = this.translate(MenuV2List)
        this.treeData = this.menu_dt[0]
      })
    },
    // 获取权限类别
    get_permission_manage_type() {
      const param = {}
      permission_manage_type(param).then(response => {
        this.manage_type = response.data
      })
    },
    // 处理菜单数据为tree
    translate(menuList) {
      if (!(menuList && menuList.length > 0)) {
        return []
      }

      var menuIdMenu = {}
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

      for (let i = 0; i < menuList.length; i++) {
        var oldMenu = menuList[i]

        var newMenu = {}
        var menuId = oldMenu['_id']
        var children = getCidChildren(oldMenu.cid)
        newMenu['label'] = oldMenu['menuname']
        newMenu['children'] = children
        newMenu['orders'] = oldMenu['orders']
        newMenu['id'] = oldMenu['_id']

        menuIdMenu[menuId] = newMenu

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

      for (var i = 0; i < allNeedSortMenuList.length; i++) {
        var oneMenuList = allNeedSortMenuList[i]
        oneMenuList.sort(compare)
      }

      var menuIdParrentMenus = {}
      var createParrentIds = function(menuList, parentIds) {
        if (!(menuList && menuList.length > 0)) {
          return
        }

        for (var i = 0; i < menuList.length; i++) {
          var menu = menuList[i]
          var menuId = menu.id

          var parrentMenus = []
          if (parentIds && parentIds.length > 0) {
            for (var j = 0; j < parentIds.length; j++) {
              var parentId = parentIds[0]
              var parentMenu = menuIdMenu[parentId]
              parrentMenus.push({ id: parentId, label: parentMenu.label })
            }
          }
          parrentMenus.push({ id: menuId, label: menu.label })
          menuIdParrentMenus[menuId] = parrentMenus
          var menuChilds = menu.children

          if (!(menuChilds && menuChilds.length > 0)) {
            continue
          }
          var nextParentIds = parentIds.concat()
          nextParentIds.push(menuId)

          createParrentIds(menuChilds, nextParentIds)
        }
      }

      createParrentIds(firstMenuList, [])

      return [firstMenuList, menuIdParrentMenus]
    },
    // 显示菜单树
    show_menu_tree_fn() {
      const temp = this.menu_tree_checked.ids
      if (temp.length !== 0) {
        const last_id = temp[temp.length - 1]
        this.$refs.tree.setCheckedKeys([last_id])
      }
      this.menu_tree_flag = true
    },
    // 选择菜单 单选
    menu_tree_check_fn(data, checked, indeterminate) {
      this.menu_tree_checked.checkey = [data.id]
      if (checked === true) {
        const need_ids = []
        const need_lables = []
        const cur_id = data.id
        const menu_dt = this.menu_dt[1]
        const cur_arr = menu_dt[cur_id]
        cur_arr.forEach(item => {
          need_ids.push(item.id)
          need_lables.push(item.label)
        })
        this.menu_tree_checked.ids = need_ids
        this.menu_tree_checked.lables = need_lables
        this.$refs.tree.setCheckedKeys([data.id])
        this.menu_tree_checked.dt = data
      } else {
        if (this.menu_tree_checked.id === data.id) {
          this.$refs.tree.setCheckedKeys([data.id])
        }
      }
    },
    // 保存选择的菜单
    save_menu() {
      const tip = this.menu_tree_checked.lables
      let tip_copy = ''
      tip.forEach(item => {
        tip_copy += item + '/'
      })
      this.menu_tip_txt = tip_copy.substring(0, tip_copy.length - 1)
      this.form.permissionbelongmenu = this.menu_tree_checked.ids
      this.form.permissionbelongmenu2 = this.form.permissionbelongmenu.length ? '11111' : ''
      this.menu_tree_flag = false
    },
    // 菜单选择取消
    cancel_menu() {
      this.menu_tree_flag = false
      if (this.menu_tree_checked.ids === []) {
        this.$refs.tree.setCheckedKeys([])
        this.menu_tree_checked = { ids: [], checkey: [], dt: {}, lables: [] }
        this.menu_tip_txt = '请选择菜单'
      }
    },
    // 权限添加
    save(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.form.permissionbelongmenu === []) {
            this.$message.error('请选择菜单！')
            return
          }
          if (this.form.permissionmanage === '') {
            this.$message.warning('请选择权限类别！')
            return
          }
          permission_add(this.form).then(response => {
            this.$message.success('新增权限成功！')
            this.noLeaveprompt = true
            const resId = response.data.resId
            this.$router.push({ path: '/systemManage/permissionManage/detail', query: { ids: resId }})
          })
        }
      })
    },
    // 取消权限添加
    cancel(formName) {
      this.$router.push({ path: '/systemManage/permissionManage/list' })
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
  @import "~@/styles/theme.scss";
  #btnGroup{
    padding-left: 120px;
  }
  .actcolor{
    color: $themeColor;
  }
  .menu_tree_box {
    width: 60%;
    margin: 0 auto;
  }
  .menu_tree_box /deep/ .el-scrollbar {
    height: calc(60vh - 170px);
    width: 100%;
  }
</style>
