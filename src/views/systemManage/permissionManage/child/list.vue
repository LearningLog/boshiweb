<template>
  <div class="list-box">
    <div id="topSearch">
      <el-input v-model="listQuery.permissionname" placeholder="请输入权限名称">
        <el-button slot="append" type="primary" icon="el-icon-search" clearable />
      </el-input>
      <el-popover
        v-model="popoverVisible"
        placement="bottom-start"
        width="456"
        title="高级搜索"
        :visible-arrow="false"
        trigger="click"
        popper-class="advancedSearch"
      >
        <el-form ref="form" :model="listQuery" label-width="80px">
          <el-form-item label="模块">
            <el-input v-model="listQuery.module" clearable />
          </el-form-item>
          <el-form-item label="菜单">
            <el-input v-model="listQuery.menu" clearable />
          </el-form-item>
          <el-form-item label="创建时间">
            <el-date-picker
              v-model="listQuery.time_range"
              type="daterange"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              clearable
            />
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
      <!--<el-table-column-->
      <!--type="selection"-->
      <!--width="55"-->
      <!--/>-->
      <el-table-column align="center" label="名称" show-overflow-tooltip>
        <template slot-scope="scope">
          <span class="pointer" @click="go_detail(scope.row._id)">{{ scope.row.permissionname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="菜单模块" min-width="150" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.modulename }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="描述" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.permissiondesc }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="菜单" min-width="200" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.permissionbelongmenuname }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" min-width="150" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.createtime }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="操作" min-width="180" align="center" fixed="right" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button size="mini" @click="go_edit_fn(scope.row._id)"><i class="iconfont iconxiugai" />修改</el-button>
          <el-button size="mini" @click="delet_fn(scope.row)"><i class="iconfont iconshanchu" />删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page-piliang">
      <!--<el-button type="primary"><i class="iconfont iconshanchu" />批量删除</el-button>-->
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="get_list" />
    </div>

  </div>
</template>

<script>
import { permission_list, permission_delet } from '@/api/systemManage-permissionManage.js'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
  components: { Pagination },
  data() {
    return {
      listQuery: {
        permissionname: '',
        menu: '',
        module: '',
        time_range: null,
        currentPage: 1,
        pageSize: 10
      },
      list: null,
      listLoading: false,
      total: 0,
      page_count: 0,
      popoverVisible: false
    }
  },
  created() {
    this.get_list()
  },
  methods: {
    topSearch() {
      this.popoverVisible = false
      this.get_list()
    },
    reset() {
      this.listQuery.permissionname = ''
      this.listQuery.menu = ''
      this.listQuery.module = ''
      this.listQuery.time_range = null
    },
    // 列表
    get_list() {
      const that = this
      const param = {}
      let stime = ''
      let edtime = ''
      if (that.listQuery.time_range && that.listQuery.time_range[0]) {
        stime = that.listQuery.time_range[0]
      }
      if (that.listQuery.time_range && that.listQuery.time_range[1]) {
        edtime = that.listQuery.edtime[1]
      }
      param.permissionname = that.listQuery.permissionname ? that.listQuery.permissionname : ''
      param.menu = that.listQuery.menu ? that.listQuery.menu : ''
      param.module = that.listQuery.module ? that.listQuery.module : ''
      param.startTime = stime
      param.endTime = edtime
      param.currentPage = that.listQuery.currentPage ? that.listQuery.currentPage : 1
      param.pageSize = that.listQuery.pageSize?that.listQuery.pageSize:10
      permission_list(param).then(res => {
        that.list = res.data.page.list
        that.total = res.data.page.totalCount
        that.page_count = res.data.page.pageCount
      }).catch(error => {
        console.log(error)
      })
    },
    // 删除
    delet_fn(row) {
      this.$confirm('确定要删除【' + row.permissionname + '】吗？', '删除权限', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const param = {}
        // param.ids = []
        // param.ids.push(row._id)
        param._id = row._id
        permission_delet(param).then(response => {
          this.$message.success(response.message)
          if ((this.list.length - 1) === 0) { // 如果当前页数据已删完，则去往上一页
            this.listQuery.currentPage -= 1
          }
          this.get_list()
        })
      }).catch(() => {})
    },
    // 查看
    go_detail(in_ids) {
      this.$router.push({ path: '/systemManage/permissionManage/detail', query: { ids: in_ids }})
    },
    // 编辑
    go_edit_fn(in_ids) {
      this.$router.push({ path: '/systemManage/permissionManage/edit', query: { ids: in_ids }})
    },
    // 添加
    add() {
      this.$router.push({ path: '/systemManage/permissionManage/add' })
    }
  }
}
</script>

<style lang="scss" scoped>
  .list-box{
    p{
      margin: 0 0 0 5px !important;
    }
    .page-piliang{
      padding-top: 15px;
    }
  }
</style>
