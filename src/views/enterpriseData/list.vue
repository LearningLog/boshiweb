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
              <el-form-item label="套餐类型">
                <el-input v-model="listQuery.payTypeName" placeholder="请输入套餐名称" clearable />
              </el-form-item>
              <el-form-item label="创建时间">
                <el-date-picker
                  v-model="time_range"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  format="yyyy 年 MM 月 dd 日"
                  value-format="yyyy-MM-dd"
                />
              </el-form-item>
              <el-form-item label="有效期">
                <el-date-picker
                  v-model="effectTime"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  format="yyyy 年 MM 月 dd 日"
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
      >
      <el-table-column align="center" label="租户" min-width="150" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.customname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="套餐类型" min-width="150" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.payTypeName }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="员工规模" min-width="150" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.userTotalCount }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="短信使用" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.usedTotalSms }}</span><span>&nbsp;/&nbsp;</span><span>{{ scope.row.totalSms }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="存储空间" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ getFileShowSize(scope.row.usedStorageSpace) }}</span><span>&nbsp;/&nbsp;</span><span>{{ getFileShowSize(scope.row.totalStorageSpace) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.createtime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="有效期" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.effectTime }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="操作" width="220" align="center" fixed="right" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button size="mini" @click="detail(scope.row)"><i class="iconfont iconchakan" />查看</el-button>
          <el-button size="mini" @click="edit(scope.row)"><i class="iconfont iconxiugai" />修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="get_list" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { getCustomResourceList } from '@/api/enterprise-data'
import { getFileShowSize } from '@/utils/index'
export default {
  components: { Pagination },
  data() {
    return {
      popoverVisible: false, // 高级搜索是否显示
      total: 0, // 总条数
      listQuery: { // 查询条件
        currentPage: 1, // 当前页
        pageSize: 10, // 当前页请求条数
        customname: null, // 租户名称
        payTypeName: null, // 套餐类型
        startTime: null, // 创建开始时间
        endTime: null, // 创建结束时间
        effectStartTime: null, // 有效开始日期
        effectEndTime: null // 有效结束日期
      },
      time_range: [], // 创建时间
      effectTime: [], // 有效期
      list: [], // 表格数据
      listLoading: true // 表格是否开启遮罩
    }
  },
  created() {
    this.get_list()
  },
  methods: {
    // 获取列表数据
    get_list() {
      this.listLoading = true
      getCustomResourceList(this.listQuery).then(response => {
        this.list = response.data.page.list
        this.total = response.data.page.totalCount
        this.listLoading = false
      })
    },
    // 搜索
    topSearch() {
      this.listQuery.startTime = this.time_range[0]
      this.listQuery.endTime = this.time_range[1]

      this.listQuery.effectStartTime = this.effectTime[0]
      this.listQuery.effectEndTime = this.effectTime[1]
      this.get_list()
    },
    // 重置
    reset() {
      this.listQuery.customname = ''
      this.listQuery.payTypeName = ''
      this.time_range = []
      this.effectTime = []
      this.listQuery.startTime = ''
      this.listQuery.endTime = ''
      this.listQuery.effectStartTime = ''
      this.listQuery.effectEndTime = ''
      this.get_list()
    },
    // 详情
    detail(row) {
      this.$router.push({ path: '/enterpriseData/detail', query: { _id: row._id }})
    },
    // 编辑
    edit(row) {
      this.$router.push({ path: '/enterpriseData/edit', query: { _id: row._id }})
    },
    getFileShowSize(fileSize) {
      return getFileShowSize(fileSize)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
