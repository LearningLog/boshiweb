<template>
  <div class="tenant-list-box">
    <div id="topSearch">
      <el-input v-model="listQuery1.content" placeholder="请输入考试名称" clearable @keyup.enter.native="topSearch">
        <el-button slot="append" type="primary" icon="el-icon-search" @click="topSearch" />
      </el-input>
      <span id="advancedSearchBtn" slot="reference" @click="popoverVisible = !popoverVisible">高级搜索<i v-show="popoverVisible" class="advancedSearchIcon iconfont iconshousuoshangjiantou" /><i v-show="!popoverVisible" class="advancedSearchIcon iconfont iconshousuoxiajiantou" /></span>
      <transition name="fade-advanced-search">
        <el-row v-show="popoverVisible">
          <el-card id="advancedSearchArea" shadow="never">
            <el-form ref="form" :model="listQuery1" label-width="100px">
              <tenants-groups-roles :is-render-role="false" :is-reset="isReset" @tenantsGroupsRolesVal="tenantsGroupsRolesVal" @resetVal="resetVal" />
              <el-form-item label="考试状态">
                <el-select
                  v-model="listQuery1.examStatus"
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
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="50"
        fixed
      />
      <el-table-column align="center" label="考试名称" min-width="120" show-overflow-tooltip prop="exam_name" />
      <el-table-column align="center" label="小组" min-width="120" show-overflow-tooltip prop="groupName" />
      <el-table-column align="center" label="题目数" min-width="70" show-overflow-tooltip prop="topic_count" />
      <el-table-column align="center" label="总分数" min-width="70" show-overflow-tooltip prop="score_count" />
      <el-table-column align="center" label="及格分数" min-width="86" show-overflow-tooltip prop="passscore" />
      <el-table-column align="center" label="开始时间" min-width="140" show-overflow-tooltip prop="begin_time" />
      <el-table-column align="center" label="结束时间" min-width="140" show-overflow-tooltip prop="end_time" />
      <el-table-column align="center" label="考试状态" min-width="90" show-overflow-tooltip prop="examstatus" />

      <el-table-column class-name="status-col" label="操作" width="250" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" :disabled="scope.row.exam_status !== 1 || !hasThisBtnPermission('exam-edit', scope.row.egroup)" @click="edit(scope.row)"><i class="iconfont iconxiugai" />修改</el-button>
          <el-button size="mini" :disabled="scope.row.exam_status === 1 || !hasThisBtnPermission('exam-statistics', scope.row.egroup)" @click="detail(scope.row)"><i
            class="iconfont iconkaoshitongji
"
          />考试统计</el-button>
          <el-button size="mini" :disabled="!hasThisBtnPermission('exam-delete', scope.row.egroup)" @click="del(scope.row)"><i class="iconfont iconshanchu" />删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="get_list" />
    <div id="bottomOperation">
      <el-button v-if="hasThisBtnPermission('exam-multioperate')" v-show="total>0" type="danger" plain @click="batchDel"><i class="iconfont iconshanchu" />批量删除</el-button>
    </div>
    <AddSelectGroup :visible-select-group="visibleSelectGroup" @getSelectGroup="getSelectGroup" />
    <PublishExam :select-company-id="selectCompanyId" :publish-dialog="publishDialog" :score-count="scoreCount" :exam="exam" @publishExam="publishExam" @visiblePublish="visiblePublish" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import TenantsGroupsRoles from '@/components/TenantsGroupsRoles'
import AddSelectGroup from '@/components/AddSelectGroup'
import PublishExam from '@/components/PublishExam'
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
import { getExaminationList, delExam, examDetail, examUpdate } from '@/api/evolution-manage/examination'
import { isCurrentEgroupManager, hasThisBtnPermission } from '@/utils/permission'

export default {
  components: { Pagination, TenantsGroupsRoles, PublishExam, AddSelectGroup },
  directives: { elDragDialog },
  data() {
    return {
      isReset: false, // 是否重置三组联动数据
      publishDialog: false, // 发布考试弹窗
      visibleSelectGroup: false, // 是否弹出选择租户、小组
      total: 0, // 总条数
      listQuery: { // 查询条件
        currentPage: 1, // 当前页
        pageSize: 10, // 当前页请求条数
        content: '', // 考试名称
        examStatus: null, // 考试状态
        selectCompanyId: null, // 租户
        egroup: null, // 小组
        startTime: null, // 创建开始时间
        endTime: null // 创建结束时间
      },
      listQuery1: { // 查询条件
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
      checkedDelList: [], // 选择删除的list
      exam: {}, // 考试详情
      selectCompanyId: '', // 编辑的当前行selectCompanyId
      scoreCount: 0, // 编辑的当前行考试总分scoreCount
      companyId: '', // 新增选择的租户
      egroup: '' // 新增选择的小组
    }
  },

  created() {
    this.get_list()
  },
  methods: {
    // 按钮权限
    hasThisBtnPermission(code, egroup, rowUserId) {
      return hasThisBtnPermission(code, isCurrentEgroupManager(egroup), rowUserId)
    },
    // 获取初始化数据
    get_list() {
      this.listLoading = true
      this.time_range = this.time_range || []
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
      this.listQuery1.startTime = this.time_range[0]
      this.listQuery1.endTime = this.time_range[1]
      this.listQuery = JSON.parse(JSON.stringify(this.listQuery1))
      this.get_list()
    },

    // 重置
    reset() {
      this.isReset = true
      this.listQuery1.content = ''
      this.listQuery1.selectCompanyId = null
      this.listQuery1.egroup = null
      this.listQuery1.examStatus = null
      this.time_range = []
      this.listQuery1.startTime = ''
      this.listQuery1.endTime = ''
      this.listQuery = JSON.parse(JSON.stringify(this.listQuery1))
      this.get_list()
    },

    // 监听三组数据变化
    tenantsGroupsRolesVal(val) {
      this.listQuery1.selectCompanyId = val.companyIds
      this.listQuery1.egroup = val.egroupId
      this.listQuery1.roleId = val.roleId
    },
    // 重置监听三组数据变化
    resetVal(val) {
      this.isReset = false
    },

    // 选中数据
    handleSelectionChange(row) {
      this.checkedDelList = row
    },

    // 新增
    add() {
      this.visibleSelectGroup = true
    },

    // 监听选择小组返回数据
    getSelectGroup(val) {
      this.companyId = val.selectCompanyId
      this.egroup = val.egroup
      if (!this.hasThisBtnPermission('exam-add', this.egroup)) {
        this.$message.warning('您没有该小组管理权限！')
        return false
      }
      this.visibleSelectGroup = false
      if (this.egroup) {
        this.$router.push({ path: '/evaluating-manage/examination-manage/add', query: { selectCompanyId: this.companyId, egroup: this.egroup }})
      }
    },

    // 单个删除
    del(row) {
      let text = ''
      switch (row.exam_status) {
        case 1:
          text = `确定要删除【${row.exam_name}】吗？`
          break
        case 2:
          text = '考试正在进行，确定要删除吗？'
          break
        case 3:
          text = '删除后考试信息同步清空，确定要删除吗？'
          break
      }
      this.$confirm(text, '删除考试', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delExam({ _id: row._id }).then(response => {
          this.$message.success('删除成功！')
          if ((this.list.length - 1) === 0) { // 如果当前页数据已删完，则去往上一页
            this.listQuery.currentPage -= 1
          }
          this.get_list()
        })
      }).catch(() => {})
    },

    // 批量删除
    batchDel() {
      if (!this.checkedDelList.length) {
        this.$message.warning('请选择考试！')
        return false
      }
      for (var i = 0; i < this.checkedDelList.length; i++) {
        var item = this.checkedDelList[i]
        if (!this.hasThisBtnPermission('exam-delete', item.egroup)) {
          this.$message.warning(`您没有的【${item.exam_name}】的管理权限！`)
          return false
        }
      }

      var text = ''

      var has2 = this.checkedDelList.find(function(item) {
        return item.exam_status === 2
      })
      if (has2) {
        text = '存在正在进行中的考试，确定要删除吗？'
      } else {
        var has3 = this.checkedDelList.find(function(item) {
          return item.exam_status === 3
        })

        if (has3) {
          text = '删除后考试信息将同步清空，确定要删除吗？'
        } else {
          text = '确定要删除选中的考试吗？'
        }
      }

      this.$confirm(text, '批量删除考试', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let _ids = []
        this.checkedDelList.forEach(item => {
          _ids.push(item._id)
        })
        _ids = _ids.join()
        delExam({ _id: _ids }).then(response => {
          this.$message.success('批量删除成功！')
          if ((this.list.length - this.checkedDelList.length) === 0) { // 如果当前页数据已删完，则去往上一页
            this.listQuery.currentPage -= 1
            this.listQuery2.currentPage -= 1
          }
          this.get_list()
        })
      }).catch(() => {})
    },

    // 详情
    detail(row) {
      this.$router.push({ path: '/evaluating-manage/examination-manage/detail', query: { _id: row._id }})
    },

    // 编辑
    edit(row) {
      examDetail({ _id: row._id }).then(res => {
        this.selectCompanyId = res.data.exam.groupId
        this.scoreCount = res.data.exam.score_count
        this.exam = res.data.exam
        this.publishDialog = true
      })
    },

    // 监听修改弹窗关闭
    visiblePublish(val) {
      this.publishDialog = val.visible
    },

    // 监听发布考试
    publishExam(val) {
      const parpams = {
        _id: val._id,
        exam_name: val.exam_name,
        begin_time: val.begin_time,
        end_time: val.end_time,
        passscore: val.passscore,
        target_user: val.target_user,
        egroup: val.egroup[0],
        type: val.type
      }
      examUpdate(parpams).then(response => {
        this.publishDialog = false
        this.$message.success('发布考试成功！')
        this.get_list()
      })
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
