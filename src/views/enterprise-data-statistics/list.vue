<template>
  <div class="app-container">
    <div id="topSearch">
      <el-input v-model="listQuery.customname" placeholder="请输入租户名称" clearable @keyup.enter.native="topSearch">
        <el-button slot="append" type="primary" icon="el-icon-search" @click="topSearch" />
      </el-input>
      <span id="advancedSearchBtn" slot="reference" @click="popoverVisible = !popoverVisible">高级搜索<i v-show="popoverVisible" class="el-icon-caret-bottom" /><i v-show="!popoverVisible" class="el-icon-caret-top" /></span>
      <transition name="fade-advanced-search">
        <el-row v-show="popoverVisible">
          <el-card id="advancedSearchArea" shadow="never">
            <el-form ref="form" :model="listQuery" label-width="100px">

              <el-form-item label="创建时间">
                <el-date-picker
                  v-model="time_range"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd"
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
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="租户名称" min-width="180" show-overflow-tooltip prop="customname" />
      <el-table-column label="创建时间" min-width="100" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createtime || '', '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="上次登录时间" min-width="100" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.lastLoginTime || '', '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="套餐用户量" min-width="70" show-overflow-tooltip prop="userTotalCount" />
      <el-table-column align="center" label="已创建用户数" min-width="80" show-overflow-tooltip prop="userCount" />
      <el-table-column align="center" label="已使用存储量" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ getFileShowSize(scope.row.usedStorageSpace) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="已发布课程数" min-width="50" show-overflow-tooltip prop="publishTrainCount" />
      <el-table-column align="center" label="已发布考试数" min-width="50" show-overflow-tooltip prop="publishExamCount" />
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="get_list" />

  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { getEnterpriseList } from '@/api/enterprise-data-statistics'
import { getFileShowSize, parseTime } from '@/utils/index'
export default {
  components: { Pagination },
  data() {
    return {
      popoverVisible: false, // 高级搜索是否显示
      total: 0, // 总条数
      listQuery: { // 查询条件
        currentPage: 1, // 当前页
        pageSize: 10, // 当前页请求条数
        customname: null, // 消息内容
        startTime: null, // 操作模块
        endTime: null // 租户id
      },
      current_time: parseTime(new Date(), '{y}-{m}-{d}'),
      time_range: [parseTime(new Date(), '{y}-{m}-{d}'), parseTime(new Date(), '{y}-{m}-{d}')],
      list: [], // 表格数据
      listLoading: true // 表格是否开启遮罩
    }
  },
  /* computed:{
    time_range:function () {
      var date = new Date();
      var year = date.getFullYear();
      return
    }
  }*/
  created() {
    this.topSearch()
  },
  methods: {
    // 获取列表数据
    get_list() {
      this.listLoading = true
      getEnterpriseList(this.listQuery).then(response => {
        this.list = response.data.page.list
        this.total = response.data.page.totalCount
        this.listLoading = false
      })
    },
    // 重置
    reset() {
      this.listQuery.customname = ''
      this.time_range = [this.current_time, this.current_time]
      this.listQuery.startTime = this.time_range[0]
      this.listQuery.endTime = this.time_range[1]
      this.get_list()
    },
    // 搜索
    topSearch() {
      this.time_range = this.time_range || []
      this.listQuery.startTime = this.time_range[0]
      this.listQuery.endTime = this.time_range[1]
      this.get_list()
    },
    getFileShowSize(fileSize) {
      return getFileShowSize(fileSize)
    },
    parseTime(time, cFormat) {
      return parseTime(time, cFormat)
    }
  }
}
</script>
<style>

</style>
