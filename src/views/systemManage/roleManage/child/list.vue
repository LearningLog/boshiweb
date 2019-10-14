<template>
  <div class="list-box">
    <div id="topSearch">
      <el-input v-model="listQuery.rolename" placeholder="请输入分组名称" clearable @keyup.enter.native="topSearch">
        <el-button slot="append" type="primary" icon="el-icon-search" @click="topSearch" />
      </el-input>
      <span id="advancedSearchBtn" slot="reference" @click="popoverVisible = !popoverVisible">高级搜索<i v-show="popoverVisible" class="el-icon-caret-bottom" /><i v-show="!popoverVisible" class="el-icon-caret-top" /></span>
      <transition name="fade-advanced-search">
        <el-row v-show="popoverVisible">
          <el-card id="advancedSearchArea" shadow="never">
            <el-form ref="form" :model="listQuery" label-width="100px">
              <el-form-item label="创建人">
                <el-input v-model="listQuery.creater" clearable />
              </el-form-item>
              <el-form-item label="归属企业">
                <el-input v-model="listQuery.groupId" clearable />
              </el-form-item>
              <el-form-item label="创建时间">
                <el-date-picker
                  v-model="listQuery.time_range"
                  type="daterange"
                  clearable
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
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
      <el-button type="primary" @click="add"><i class="iconfont iconjia" />新增</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      @selection-change="select_fn"
    >
      <el-table-column
        type="selection"
        width="55"
      />
      <el-table-column align="center" label="名称" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.rolename }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述" min-width="220" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.desc }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建人" min-width="200" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.createuser }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" min-width="220" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.createtime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="所属企业" min-width="220" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.groupId }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="操作" min-width="280" align="center" fixed="right" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button size="mini" @click="go_edit_fn(scope.row)"><i class="iconfont iconxiugai" />修改</el-button>
          <el-button size="mini" @click="delet_fn(scope.row)"><i class="iconfont iconshanchu" />删除</el-button>
          <el-button size="mini" @click="auth_fn(scope.row)"><i class="iconfont iconshanchu" />授权</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="get_list" />
    <div id="bottomOperation">
      <el-button v-show="total>0" type="primary" @click="batch_del_fn"><i class="iconfont iconshanchu" />批量删除</el-button>
    </div>
  </div>
</template>

<script>
import { role_list, role_delet } from '@/api/systemManage-roleManage.js'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
  components: { Pagination },
  data() {
    return {
      listQuery: {
        currentPage: 1,
        pageSize: 10,
        rolename: '',
        creater: '',
        time_range: null,
        groupId: ''
      },
      checkedList: [],
      list: null,
      listLoading: false,
      total: 0,
      page_count: 0,
      status_map: { 1: '启用', 2: '停用' },
      popoverVisible: false
    }
  },
  created() {
    this.get_list()
  },
  methods: {
    topSearch() {
      this.get_list()
    },
    reset() {
      this.listQuery.rolename = ''
      this.listQuery.creater = ''
      this.listQuery.time_range = null
      this.listQuery.groupId = ''
    },
    get_list() {
      const that = this
      const status_map = that.status_map
      let stime = ''
      let edtime = ''
      if (that.listQuery.time_range && that.listQuery.time_range[0]) {
        stime = that.listQuery.time_range[0]
      }
      if (that.listQuery.time_range && that.listQuery.time_range[1]) {
        edtime = that.listQuery.time_range[1]
      }
      const param = {}
      param.rolename = that.listQuery.rolename ? that.listQuery.rolename : ''
      param.creater = that.listQuery.creater ? that.listQuery.creater : ''
      param.startTime = stime
      param.endTime = edtime
      param.groupId = that.listQuery.groupId ? that.listQuery.groupId : ''
      param.currentPage = that.listQuery.currentPage ? that.listQuery.currentPage : 1
      param.pageSize = that.listQuery.pageSize ? that.listQuery.pageSize : 10
      role_list(param).then(res => {
        const dt = res.data.page.list
        dt.forEach(item => {
          item.status_txt = status_map[item.enable_status]
        })
        that.list = res.data.page.list
        that.total = res.data.page.totalCount
        that.page_count = res.data.page.pageCount
      }).catch(error => {
        console.log(error)
      })
    },
    delet_fn(row) {
      this.$confirm('确定要删除【' + row.name + '】吗？', '删除角色', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const param = {}
        param.ids = []
        param.ids.push(row._id)
        role_delet(param).then(response => {
          this.$message.success('删除成功')
          if ((this.list.length - 1) === 0) { // 如果当前页数据已删完，则去往上一页
            this.listQuery.currentPage -= 1
          }
          this.get_list()
        })
      }).catch(() => {})
    },
    // 选中数据
    select_fn(row) {
      this.checkedList = row
    },
    batch_del_fn() {
      this.$confirm('确定要删除选中的角色吗？', '批量删除角色', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const _ids = []
        this.checkedList.forEach(item => {
          _ids.push(item._id)
        })
        const param = {}
        param._id = _ids
        role_delet(param).then(response => {
          this.$message.success('删除成功')
          if ((this.list.length - 1) === 0) { // 如果当前页数据已删完，则去往上一页
            this.listQuery.currentPage -= 1
          }
          this.get_list()
        })
      }).catch(() => {})
    },
    go_edit_fn(data) {
      const id = data.id
      this.$router.push({ path: '/systemManage/roleManage/edit', query: { ids: id }})
    },
    add() {
      this.$router.push({ path: '/systemManage/roleManage/add' })
    },
    auth_fn() {
      this.$router.push({ path: '/systemManage/roleManage/add' })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
