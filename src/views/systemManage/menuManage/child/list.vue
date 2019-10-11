<template>
  <div class="clearfix">
    <div class="left">
      <h4>博士知识库</h4>
      <el-scrollbar wrap-class="scrollbar-wrapper">
        <el-tree :data="treeData" :props="defaultProps" default-expand-all :expand-on-click-node="false" @node-click="handleNodeClick" />
      </el-scrollbar>
    </div>
    <div class="right">
      <div id="topSearch">
        <el-input v-model="listQuery.menuname" placeholder="请输入菜单名称" clearable @keyup.enter.native="topSearch" >
          <el-button slot="append" type="primary" icon="el-icon-search" @click="topSearch" />
        </el-input>
        <el-popover
          v-model="popoverVisible"
          placement="bottom-start"
          title="高级搜索"
          width="500"
          :visible-arrow="false"
          trigger="click"
          popper-class="advancedSearch"
        >
          <el-form ref="form" :model="listQuery" label-width="80px">
            <el-form-item label="标识">
              <el-input v-model="listQuery.cmark" clearable />
            </el-form-item>
            <el-form-item label="类型">
              <el-select v-model="listQuery.type" placeholder="请选择类型" clearable>
                <el-option v-for="item in menuType" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-form>

          <div id="searchPopoverBtn">
            <el-button type="primary" @click="topSearch">搜索</el-button>
            <el-button type="primary" plain @click="reset">重置</el-button>
          </div>

          <span id="advancedSearch" slot="reference">高级搜索<i class="el-icon-caret-bottom" /></span>
        </el-popover>
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
        <el-table-column align="center" show-overflow-tooltip label="名称">
          <template slot-scope="scope">
            <span class="pointer" @click="detail(scope.row)">{{ scope.row.menuname }}</span>
          </template>
        </el-table-column>
        <el-table-column label="标识" width="200" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.cmark }}</span>
          </template>
        </el-table-column>
        <el-table-column label="图标" width="110" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <i v-if="scope.row.imagename" :class="'iconfont ' + scope.row.imagename" />
          </template>
        </el-table-column>
        <el-table-column class-name="status-col" label="路径" width="300" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.menuurl }}
          </template>
        </el-table-column>
        <el-table-column align="center" show-overflow-tooltip prop="created_at" label="类型" width="200">
          <template slot-scope="scope">
            <span>{{ scope.row.type }}</span>
          </template>
        </el-table-column>
        <el-table-column class-name="status-col" label="操作" width="240" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button size="mini" @click="edit(scope.row)"><i class="iconfont iconxiugai" />修改</el-button>
            <el-button size="mini" @click="del(scope.row)"><i class="iconfont iconshanchu" />删除</el-button>
            <el-dropdown>
              <el-button size="mini">
                <i class="iconfont icongengduo" />更多
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="upMenu(scope.row)">上移</el-dropdown-item>
                <el-dropdown-item @click.native="downMenu(scope.row)">下移</el-dropdown-item>
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
import { getSerialNum } from '@/utils'
import { mapGetters } from 'vuex'

export default {
  components: { Pagination },
  computed: {
    ...mapGetters([
      'menuType'
    ])
  },
  data() {
    return {
      list: null,
      listLoading: true,
      total: 0,
      listQuery: {
        currentPage: 1,
        pageSize: 10,
        pid: 'firstMenu',
        menuname: '',
        cmark: '',
        type: ''
      },
      searchVal: '',
      popoverVisible: false,
      treeData: [{}],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      pid: 'firstMenu'
    }
  },
  created() {
    this.getAllMenuList()
    this.getMenuList()
  },
  methods: {
    getSerialNum(index, currentPage, pageSize) {
      getSerialNum(index, currentPage, pageSize)
    },
    getMenuList() {
      this.listLoading = true
      findMenuList(this.listQuery).then(response => {
        this.list = response.data.page.list
        this.total = response.data.page.totalCount
        this.listLoading = false
      })
    },
    getAllMenuList() {
      getAllMenuList().then(response => {
        const { MenuV2List } = response.data
        this.treeData = this.translate(MenuV2List)
      })
    },
    topSearch() {
      this.popoverVisible = false
      this.getMenuList()
    },
    reset() {
      this.listQuery.menuname = ''
      this.listQuery.cmark = ''
      this.listQuery.type = ''
      this.getMenuList()
    },
    handleNodeClick(data) {
      this.listQuery.menuname = ''
      this.listQuery.cmark = ''
      this.listQuery.type = ''
      this.listQuery.pid = data.id
      this.pid = data.id
      this.getMenuList()
    },
    add() {
      this.$router.push({ path: '/systemManage/menuManage/add', query: { pid: this.pid }})
    },
    detail(row) {
      this.$router.push({ path: '/systemManage/menuManage/detail', query: { _id: row._id }})
    },
    del(row) {
      this.$confirm('确定要删除【' + row.menuname + '】吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delMenu({ _id: row._id }).then(response => {
          this.$message.success('删除成功')
          if ((this.list.length - 1) === 0) { // 如果当前页数据已删完，则去往上一页
            this.listQuery.currentPage -= 1
          }
          this.getAllMenuList()
          this.getMenuList()
        })
      }).catch(() => {})
    },
    edit(row) {
      this.$router.push({ path: '/systemManage/menuManage/edit', query: { pid: row._id }})
    },
    upMenu(row) {
      moveMenu({ orderby: 'up', pid: row.pid, _id: row._id }).then(response => {
        this.$message.success('上移成功')
        this.getAllMenuList()
        this.getMenuList()
      })
    },
    downMenu(row) {
      moveMenu({ orderby: 'down', pid: row.pid, _id: row._id }).then(response => {
        this.$message.success('下移成功')
        this.getAllMenuList()
        this.getMenuList()
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
  }
}
</script>

<style lang="scss" scoped>
  .left {
    float: left;
    width:300px;
    height: calc(100vh - 120px);
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
    .scrollbar-wrapper {
      overflow-x: hidden !important;
    }
  }
  .right {
    width: calc(100% - 320px) !important;
    float: right;
  }
</style>
