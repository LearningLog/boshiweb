<template>
  <div class="list-box">
    <div id="topSearch">
      <el-input v-model="listQuery.newscategory_name" placeholder="请输入类别名称" clearable @keyup.enter.native="topSearch">
        <el-button slot="append" type="primary" icon="el-icon-search" @click="topSearch" />
      </el-input>
      <span id="advancedSearchBtn" slot="reference" @click="popoverVisible = !popoverVisible">高级搜索<i v-show="popoverVisible" class="el-icon-caret-bottom" /><i v-show="!popoverVisible" class="el-icon-caret-top" /></span>
      <transition name="fade-advanced-search">
        <el-row v-show="popoverVisible">
          <el-card id="advancedSearchArea" shadow="never">
            <el-form ref="form" :model="listQuery" label-width="100px">
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
      <el-table-column align="center" label="类别" show-overflow-tooltip>
        <template slot-scope="scope">
          <span class="pointer" @click="go_detail(scope.row._id)">{{ scope.row.newscategory_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述" min-width="130" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.newscategory_desc }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建人" min-width="80" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.createuser }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.createtime }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="操作" width="230" align="center" fixed="right" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button size="mini" @click="go_edit_fn(scope.row._id)"><i class="iconfont iconxiugai" />修改</el-button>
          <el-button size="mini" @click="go_netList(scope.row._id)"><i class="iconfont iconxitong" />设置</el-button>
          <el-button size="mini" @click="delet_fn(scope.row)"><i class="iconfont iconshanchu" />删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="get_list" />
  </div>
</template>

<script>
import { newscategory_list, newscategory_delet } from '@/api/systemManage-newsCategorry.js'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
  components: { Pagination },
  data() {
    return {
      listQuery: {
        newscategory_name: '',
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
    // 重置
    reset() {
      this.listQuery.newscategory_name = ''
      this.listQuery.creater = ''
      this.listQuery.time_range = null
      this.get_list()
    },
    // 列表资讯类别
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
      param.newscategory_name = that.listQuery.newscategory_name ? that.listQuery.newscategory_name : ''
      param.startTime = stime
      param.endTime = edtime
      param.currentPage = that.listQuery.currentPage ? that.listQuery.currentPage : 1
      param.pageSize = that.listQuery.pageSize ? that.listQuery.pageSize : 10
      this.listLoading = true
      newscategory_list(param).then(res => {
        this.listLoading = false
        that.list = res.data.page.list
        that.total = res.data.page.totalCount
        that.page_count = res.data.page.pageCount
      }).catch(error => {
        console.log(error)
      })
    },
    // 删除资讯类别
    delet_fn(row) {
      this.$confirm('确定要删除【' + row.newscategory_name + '】吗？', '删除资讯类别', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        newscategory_delet({ _id: row._id }).then(response => {
          this.$message.success(response.message)
          if ((this.list.length - 1) === 0) { // 如果当前页数据已删完，则去往上一页
            this.listQuery.currentPage -= 1
          }
          this.get_list()
        })
      }).catch(() => {})
    },
    // 查看资讯类别
    go_detail(id) {
      this.$router.push({ path: '/systemManage/newsCategory/detail', query: { id: id }})
    },
    // go网站管理
    go_netList(id) {
      this.$router.push({ path: '/systemManage/newsCategory/netList', query: { id: id }})
    },
    // 编辑资讯类别
    go_edit_fn(id) {
      this.$router.push({ path: '/systemManage/newsCategory/edit', query: { id: id }})
    },
    // 添加资讯类别
    add() {
      this.$router.push({ path: '/systemManage/newsCategory/add' })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
