<template>
  <div class="tenant-list-box">
    <div id="topSearch">
      <el-input v-model="listQuery.content" placeholder="请输入考试名称" clearable @keyup.enter.native="topSearch">
        <el-button slot="append" type="primary" icon="el-icon-search" @click="topSearch" />
      </el-input>
      <span id="advancedSearchBtn" slot="reference" @click="popoverVisible = !popoverVisible">高级搜索<i v-show="popoverVisible" class="el-icon-caret-bottom" /><i v-show="!popoverVisible" class="el-icon-caret-top" /></span>
      <transition name="fade-advanced-search">
        <el-row v-show="popoverVisible">
          <el-card id="advancedSearchArea" shadow="never">
            <el-form ref="form" :model="listQuery" label-width="100px">
              <tenants-groups-roles :is-render-role="false" :is-reset="isReset" @tenantsGroupsRolesVal="tenantsGroupsRolesVal" @resetVal="resetVal" />
              <el-form-item label="考试状态">
                <el-select
                  v-model="listQuery.examStatus"
                  placeholder="请选择考试状态"
                  clearable
                  filterable
                >
                  <el-option
                    v-for="item in examstatusArray"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
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

      <el-table-column align="center" label="考试名称" min-width="70" show-overflow-tooltip prop="exam_name" />
      <el-table-column align="center" label="小组" min-width="40" show-overflow-tooltip prop="groupName" />
      <el-table-column align="center" label="题目数" min-width="30" show-overflow-tooltip prop="topic_count" />
      <el-table-column align="center" label="总分数" min-width="30" show-overflow-tooltip prop="score_count" />
      <el-table-column align="center" label="及格分数" min-width="30" show-overflow-tooltip prop="passscore" />
      <el-table-column align="center" label="开始时间" min-width="40" show-overflow-tooltip prop="begin_time" />
      <el-table-column align="center" label="结束时间" min-width="40" show-overflow-tooltip prop="end_time" />
      <el-table-column align="center" label="考试状态" min-width="40" show-overflow-tooltip prop="examstatus" />

      <el-table-column class-name="status-col" label="操作" width="250" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" :disabled="scope.row.exam_status === 1" @click="detail(scope.row)"><i class="iconfont iconxiangqing" />考试统计</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="get_list" />

  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import TenantsGroupsRoles from '@/components/TenantsGroupsRoles'
import { getExaminationList } from '@/api/evolution-manage/examination'
export default {
  components: { Pagination, TenantsGroupsRoles },
  data() {
    return {
      isReset: false, // 是否重置三组联动数据
      isVisibleSystemManage: false, // 是否弹出选择租户、小组
      total: 0, // 总条数
      listQuery: { // 查询条件
        autoId: null, // 自动发布id
        currentPage: 1, // 当前页
        pageSize: 10, // 当前页请求条数
        content: '', // 考试名称
        examStatus: null, // 考试状态
        selectCompanyId: null, // 租户
        egroup: null, // 小组
        startTime: null, // 创建开始时间
        endTime: null // 创建结束时间
      },
      examstatusArray: [{ value: 1, name: '未开始' }, { value: 2, name: '考试中' }, { value: 3, name: '考试结束' }],
      time_range: [], // 创建时间
      list: [], // 表格数据
      listLoading: true, // 是否开启表格遮罩
      popoverVisible: false, // 是否开启高级搜索
      exam: {}// 考试详情
    }
  },

  created() {
    this.listQuery.autoId = this.$route.query._id
    this.get_list()
  },
  methods: {
    // 获取初始化数据
    get_list() {
      this.listLoading = true
      this.listQuery.startTime = this.time_range[0]
      this.listQuery.endTime = this.time_range[1]
      getExaminationList(this.listQuery).then(response => {
        this.listLoading = false
        this.list = response.data.page.list
        this.total = response.data.page.totalCount
      })
    },

    // 搜索
    topSearch() {
      this.time_range = this.time_range || []
      this.listQuery.startTime = this.time_range[0]
      this.listQuery.endTime = this.time_range[1]
      this.get_list()
    },

    // 重置
    reset() {
      this.isReset = true
      this.listQuery.content = ''
      this.listQuery.selectCompanyId = null
      this.listQuery.egroup = null
      this.listQuery.examStatus = null
      this.time_range = []
      this.listQuery.startTime = ''
      this.listQuery.endTime = ''
      this.get_list()
    },

    // 监听三组数据变化
    tenantsGroupsRolesVal(val) {
      this.listQuery.selectCompanyId = val.companyIds
      this.listQuery.egroup = val.egroupId
      this.listQuery.roleId = val.roleId
    },

    // 监听三组数据变化
    resetVal() {
      this.isReset = false
    },

    // 新增监听三组数据变化
    tenantsGroupsRolesVal2(val) {
      this.companyId = val.companyIds
      this.egroup = val.egroupId
    },

    // 详情
    detail(row) {
      this.$router.push({ path: '/evaluating-manage/automatic-release-manage/statistics', query: { _id: row._id }})
    }

  }
}
</script>

<style lang="scss" scoped>
  .selectCompany /deep/ .tenantsGroupsRoles {
    width: 100% !important;
  }
  .selectCompany /deep/ .tenantsGroupsRoles .el-form-item {
    width: 100% !important;
  }
</style>
