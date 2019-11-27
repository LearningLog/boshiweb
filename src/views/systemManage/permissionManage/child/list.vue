<template>
  <div class="list-box">
    <div id="topSearch">
      <el-input v-model="listQuery.permissionname" placeholder="请输入权限名称" clearable @keyup.enter.native="topSearch">
        <el-button slot="append" type="primary" icon="el-icon-search" @click="topSearch" />
      </el-input>
      <span id="advancedSearchBtn" slot="reference" @click="popoverVisible = !popoverVisible">高级搜索<i v-show="popoverVisible" class="el-icon-caret-bottom" /><i v-show="!popoverVisible" class="el-icon-caret-top" /></span>
      <transition name="fade-advanced-search">
        <el-row v-show="popoverVisible">
          <el-card id="advancedSearchArea" shadow="never">
            <el-form ref="form" :model="listQuery" label-width="100px">
              <el-form-item label="菜单模块">
                <el-input v-model="listQuery.module" placeholder="请输入菜单模块" clearable @keyup.enter.native="topSearch" />
              </el-form-item>
              <el-form-item label="菜单">
                <el-input v-model="listQuery.menu" placeholder="请输入菜单" clearable @keyup.enter.native="topSearch" />
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
          </el-card>
        </el-row>
      </transition>
    </div>
    <div id="topBtn">
      <el-button type="primary" @click="add"><i class="iconfont iconzengjia" />新增</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="名称" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-link type="primary" @click="go_detail(scope.row._id)">{{ scope.row.permissionname }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="权限code" min-width="120" align="center" show-overflow-tooltip prop="permissioncode" />
      <el-table-column label="菜单模块" min-width="120" align="center" show-overflow-tooltip prop="modulename" />
      <el-table-column class-name="status-col" label="描述" align="center" show-overflow-tooltip prop="permissiondesc" />
      <el-table-column class-name="status-col" label="菜单" min-width="120" align="center" show-overflow-tooltip prop="permissionbelongmenuname" />
      <el-table-column align="center" label="创建时间" min-width="140" show-overflow-tooltip prop="createtime" />
      <el-table-column class-name="status-col" label="操作" width="230" align="center" fixed="right" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button size="mini" @click="go_edit_fn(scope.row._id)"><i class="iconfont iconxiugai" />修改</el-button>
          <el-button size="mini" @click="delet_fn(scope.row)"><i class="iconfont iconshanchu" />删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="get_list" />
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
    // 高级搜索
    topSearch() {
      this.get_list()
    },
    // 重置搜索条件
    reset() {
      this.listQuery.permissionname = ''
      this.listQuery.menu = ''
      this.listQuery.module = ''
      this.listQuery.time_range = null
      this.get_list()
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
        edtime = that.listQuery.time_range[1]
      }
      param.permissionname = that.listQuery.permissionname ? that.listQuery.permissionname : ''
      param.menu = that.listQuery.menu ? that.listQuery.menu : ''
      param.module = that.listQuery.module ? that.listQuery.module : ''
      param.startTime = stime
      param.endTime = edtime
      param.currentPage = that.listQuery.currentPage ? that.listQuery.currentPage : 1
      param.pageSize = that.listQuery.pageSize ? that.listQuery.pageSize : 10
      this.listLoading = true
      permission_list(param).then(res => {
        this.listLoading = false
        that.list = res.data.page.list
        that.total = res.data.page.totalCount
        that.page_count = res.data.page.pageCount
      }).catch(error => {
        console.log(error)
      })
    },
    // 删除权限
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
    // go详情
    go_detail(in_ids) {
      this.$router.push({ path: '/systemManage/permissionManage/detail', query: { ids: in_ids }})
    },
    // go编辑
    go_edit_fn(in_ids) {
      this.$router.push({ path: '/systemManage/permissionManage/edit', query: { ids: in_ids }})
    },
    // go添加
    add() {
      this.$router.push({ path: '/systemManage/permissionManage/add' })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
