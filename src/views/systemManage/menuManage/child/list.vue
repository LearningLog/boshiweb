<template>
  <div class="clearfix">
    <div class="left">
      <h4>博识知识库</h4>
      <el-scrollbar wrap-class="scrollbar-wrapper">
        <el-tree :data="treeData" :props="defaultProps" default-expand-all highlight-current :expand-on-click-node="false" @node-click="handleNodeClick" />
      </el-scrollbar>
    </div>
    <div class="right">
      <div id="topSearch">
        <el-input v-model="listQuery.menuname" placeholder="请输入菜单名称" clearable @keyup.enter.native="topSearch">
          <el-button slot="append" type="primary" icon="el-icon-search" @click="topSearch" />
        </el-input>
        <span id="advancedSearchBtn" slot="reference" @click="popoverVisible = !popoverVisible">高级搜索<i v-show="popoverVisible" class="el-icon-caret-bottom" /><i v-show="!popoverVisible" class="el-icon-caret-top" /></span>
        <transition name="fade-advanced-search">
          <el-row v-show="popoverVisible">
            <el-card id="advancedSearchArea" shadow="never">
              <el-form ref="form" :model="listQuery" label-width="100px">
                <el-form-item label="标识">
                  <el-input v-model="listQuery.cmark" placeholder="请输入菜单标识" clearable />
                </el-form-item>
                <el-form-item label="菜单模块">
                  <el-select v-model="listQuery.type" placeholder="请选择菜单模块" clearable>
                    <el-option v-for="item in menuType" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
                </el-form-item>
              </el-form>
              <div id="searchPopoverBtn">
                <el-button type="primary" @click="topSearch">搜索</el-button>
                <el-button type="primary" plain @click="reset">重置</el-button>
              </div>
            </el-card>
          </el-row>
        </transition>
      </div>
      <div id="topBtn">
        <el-button type="primary" @click="add"><i class="iconfont iconjia" />新增</el-button>
      </div>
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
      >
        <el-table-column align="center" label="序号" width="60">
          <template slot-scope="scope">
            <span>{{ ((scope.$index + 1) + (listQuery.currentPage - 1) * listQuery.pageSize ) }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" show-overflow-tooltip min-width="100" label="名称">
          <template slot-scope="scope">
            <span class="pointer" @click="detail(scope.row)">{{ scope.row.menuname }}</span>
          </template>
        </el-table-column>
        <el-table-column label="标识" min-width="100" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.cmark }}</span>
          </template>
        </el-table-column>
        <el-table-column label="图标" min-width="60" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <i v-if="scope.row.imagename" :class="'iconfont ' + scope.row.imagename" />
          </template>
        </el-table-column>
        <el-table-column class-name="status-col" label="路径" min-width="160" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.menuurl }}
          </template>
        </el-table-column>
        <el-table-column align="center" show-overflow-tooltip prop="created_at" label="模块" min-width="90">
          <template slot-scope="scope">
            <span>{{ getMenuTypeName(scope.row.type) }}</span>
          </template>
        </el-table-column>
        <el-table-column class-name="status-col" label="操作" width="230" align="center" fixed="right" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button size="mini" @click="edit(scope.row)"><i class="iconfont iconxiugai" />修改</el-button>
            <el-button size="mini" @click="del(scope.row)"><i class="iconfont iconshanchu" />删除</el-button>
            <el-dropdown trigger="click">
              <el-button size="mini">
                <i class="iconfont icongengduo" />更多
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="upMenu(scope.row)"><i class="iconfont iconshangyi1" />上移</el-dropdown-item>
                <el-dropdown-item @click.native="downMenu(scope.row)"><i class="iconfont iconxiayi1" />下移</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="getMenuList" />
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { getAllMenuList, findMenuList, delMenu, moveMenu } from '@/api/systemManage-menuManage'
import { mapGetters } from 'vuex'
import { updateMenuRoute } from '@/utils/update-menu-router'

export default {
  components: { Pagination },
  computed: {
    ...mapGetters([
      'menuType' // 菜单模块
    ])
  },
  data() {
    return {
      list: [], // 表格数据
      listLoading: true, // 是否开启表格遮罩
      total: 0, // 总条数
      listQuery: { // 查询条件
        currentPage: 1, // 当前页
        pageSize: 10, // 当前请求条数
        pid: 'firstMenu', // 父id
        menuname: '', // 菜单名称
        cmark: '', // 描述
        type: '' // 菜单模块
      },
      popoverVisible: false, // 是否展开高级搜索
      treeData: [], // 菜单树list
      defaultProps: { // 菜单树节点数据别名
        children: 'children',
        label: 'label'
      },
      pid: 'firstMenu', // 父id
      pname: '菜单管理' // 父级菜单
    }
  },
  created() {
    this.listQuery.pid = this.$store.state.menuManage.pid || 'firstMenu'
    this.getAllMenuList()
    this.getMenuList()
  },
  methods: {
    // 获取右侧菜单列表
    getMenuList() {
      this.listLoading = true
      findMenuList(this.listQuery).then(response => {
        this.list = response.data.page.list
        this.total = response.data.page.totalCount
        this.listLoading = false
      })
    },
    // 获取左侧菜单树
    getAllMenuList() {
      getAllMenuList().then(response => {
        const { MenuV2List } = response.data
        this.treeData = this.translate(MenuV2List)
      })
    },
    // 搜索
    topSearch() {
      this.getMenuList()
    },
    // 重置
    reset() {
      this.listQuery.menuname = ''
      this.listQuery.cmark = ''
      this.listQuery.type = ''
      this.getMenuList()
    },
    // 选中左侧菜单树节点的回调
    handleNodeClick(data) {
      this.listQuery.currentPage = 1
      this.listQuery.menuname = ''
      this.listQuery.cmark = ''
      this.listQuery.type = ''
      this.listQuery.pid = data.id
      this.pid = data.id
      this.pname = data.label
      this.getMenuList()
    },
    // 新增
    add() {
      this.$router.push({ path: '/systemManage/menuManage/add', query: { pid: this.pid, pname: this.pname }})
    },
    // 详情
    detail(row) {
      this.$router.push({ path: '/systemManage/menuManage/detail', query: { _id: row._id }})
    },
    // 删除
    del(row) {
      this.$confirm('确定要删除【' + row.menuname + '】吗？', '删除菜单', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delMenu({ _id: row._id }).then(async response => {
          this.$message.success('删除成功！')
          updateMenuRoute()
          if ((this.list.length - 1) === 0) { // 如果当前页数据已删完，则去往上一页
            this.listQuery.currentPage -= 1
          }
          this.getAllMenuList()
          this.getMenuList()
        })
      }).catch(() => {})
    },
    // 编辑
    edit(row) {
      this.$router.push({ path: '/systemManage/menuManage/edit', query: { id: row._id }})
    },
    // 上移
    upMenu(row) {
      moveMenu({ orderby: 'up', pid: row.pid, _id: row._id }).then(async response => {
        this.$message.success('上移成功！')
        updateMenuRoute()
        this.getAllMenuList()
        this.getMenuList()
      })
    },
    // 下移
    downMenu(row) {
      moveMenu({ orderby: 'down', pid: row.pid, _id: row._id }).then(response => {
        this.$message.success('下移成功！')
        updateMenuRoute()
        this.getAllMenuList()
        this.getMenuList()
      })
    },
    // 获取菜单模块
    getMenuTypeName(type) {
      let name = ''
      this.menuType.forEach(item => {
        if (item.id === type) {
          name = item.name
        }
      })
      return name
    },
    // 将左侧返回的扁平数据转换为树结构
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
        newMenu['id'] = oldMenu['cid']

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
    }
  },
  // 因为需求：去往子页面，回来时查询离开前的pid，去往其他页面，回来时默认查询 ‘firstMenu’
  beforeRouteLeave(to, from, next) {
    if (to.path.indexOf('/menuManage/') === -1) {
      this.$store.dispatch('menuManage/setMenuPid', 'firstMenu')
    } else {
      this.$store.dispatch('menuManage/setMenuPid', this.listQuery.pid)
    }
    next()
  }
}
</script>

<style lang="scss" scoped>
  .left {
    float: left;
    width:240px;
    height: calc(100vh - 140px);
    margin-right: 20px;
    border:1px solid rgba(222, 222, 222, 1);
    padding-left: 10px;
    & h4 {
      margin-left: 10px;
    }
    .el-scrollbar {
      height: calc(100% - 70px);
      width: 100%;
    }
  }
  .right {
    width: calc(100% - 260px) !important;
    float: right;
  }
  #topSearch #advancedSearchArea /deep/ .el-form-item {
    width: 49%;
    display: inline-block;
  }
</style>
