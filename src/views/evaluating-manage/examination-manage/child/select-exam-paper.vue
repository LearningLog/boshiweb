<template>
  <div class="tenant-list-box">
    <div id="topSearch">
      <el-input v-model="listQuery1.content" placeholder="请输入试卷名称" clearable @keyup.enter.native="topSearch">
        <el-button slot="append" type="primary" icon="el-icon-search" @click="topSearch" />
      </el-input>
      <span id="advancedSearchBtn" slot="reference" @click="popoverVisible = !popoverVisible">高级搜索<i v-show="popoverVisible" class="el-icon-caret-bottom" /><i v-show="!popoverVisible" class="el-icon-caret-top" /></span>
      <transition name="fade-advanced-search">
        <el-row v-show="popoverVisible">
          <el-card id="advancedSearchArea" shadow="never">
            <el-form ref="form" :model="listQuery1" label-width="100px">
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
      <el-button type="primary" @click="save"><i class="iconfont iconbaocun" />保存</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="选择" align="center" width="60" fixed>
        <template scope="scope">
          <el-radio v-model="examPaperId" :label="scope.row._id" @change.native="getExamRow(scope.$index, scope.row)"><span v-show="false" /></el-radio>
        </template>
      </el-table-column>
      <el-table-column label="试卷名称" min-width="120" align="center" show-overflow-tooltip prop="exampaper_name" />
      <el-table-column align="center" label="标签" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.labelName || '' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="小组" min-width="120" prop="groupName" show-overflow-tooltip />
      <el-table-column align="center" label="题目数" min-width="50" show-overflow-tooltip prop="topic_count" />
      <el-table-column align="center" label="总分数" min-width="50" show-overflow-tooltip prop="score_count" />
      <el-table-column align="center" label="创建时间" min-width="140" prop="c_time" show-overflow-tooltip />
      <el-table-column align="center" label="引用次数" min-width="50" prop="usedcount" show-overflow-tooltip />
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="get_list" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
import { evaluationPaperList } from '@/api/evolution-manage/test-paper-manage'
import store from '@/store'
export default {
  components: { Pagination },
  directives: { elDragDialog },
  data() {
    return {
      total: 0, // 总条数
      listQuery: { // 查询条件
        currentPage: 1, // 当前页
        pageSize: 10, // 当前页请求条数
        content: '', // 试卷名称
        selectCompanyId: null, // 租户
        egroup: null, // 小组
        startTime: null, // 创建开始时间
        endTime: null // 创建结束时间
      },
      listQuery1: { // 查询条件
        currentPage: 1, // 当前页
        pageSize: 10, // 当前页请求条数
        content: '', // 试卷名称
        selectCompanyId: null, // 租户
        egroup: null, // 小组
        startTime: null, // 创建开始时间
        endTime: null // 创建结束时间
      },
      time_range: [], // 创建时间
      list: [], // 表格数据
      listLoading: true, // 是否开启表格遮罩
      popoverVisible: false, // 是否开启高级搜索
      examPaperId: '', // 试卷id
      id: '', // 试卷id
      selectCompanyId: '', // 发布的试卷的selectCompanyId
      examRadio: '',
      checkedList: {} // 选择的试卷
    }
  },
  created() {
    this.examPaperId = this.$store.state.examinationManage.examPaperId
    this.id = this.$route.query._id
    this.selectCompanyId = this.$route.query.selectCompanyId
    this.egroup = this.$route.query.egroup
    this.get_list()
  },
  methods: {
    // 获取初始化数据
    get_list() {
      this.listLoading = true
      this.time_range = this.time_range || []
      this.listQuery.startTime = this.time_range[0]
      this.listQuery.endTime = this.time_range[1]
      evaluationPaperList(this.listQuery).then(response => {
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
      this.listQuery1.content = ''
      this.listQuery1.topic_label = null
      this.listQuery1.topic_skill = null
      this.listQuery1.topicType = null
      this.listQuery1.selectCompanyId = null
      this.listQuery1.egroup = null
      this.time_range = []
      this.listQuery1.startTime = ''
      this.listQuery1.endTime = ''
      this.listQuery = JSON.parse(JSON.stringify(this.listQuery1))
      this.get_list()
    },

    // 获取选中的试卷
    getExamRow(index, row) {
      this.checkedList = row
    },

    // 保存
    save() {
      store.dispatch('examinationManage/temporaryStorageExamPaper', this.checkedList)
      store.dispatch('examinationManage/examPaperId', this.checkedList._id)
      this.noLeaveprompt = true
      if (this.id) {
        this.$router.push({
          path: '/evaluating-manage/examination-manage/edit',
          query: { _id: this.id, selectCompanyId: this.selectCompanyId, egroup: this.egroup, isedit: 1 }
        })
      } else {
        this.$router.push({
          path: '/evaluating-manage/examination-manage/add',
          query: { selectCompanyId: this.selectCompanyId, egroup: this.egroup }
        })
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    if (!this.noLeaveprompt) {
      // 判断表单数据是否变化，以及提交后不进行此保存提示
      setTimeout(() => {
        // 此处必须要加延迟执行，主要解决浏览器前进后退带来的闪现
        this.$confirm('您的数据尚未保存，是否离开？', '离开页面', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            store.dispatch('examinationManage/examLabels', [])
            store.dispatch('examinationManage/temporaryStorageExam', {})
            store.dispatch('examinationManage/temporaryStorageExamPaper', {})
            store.dispatch('examinationManage/activeStep', 1)
            store.dispatch('examinationManage/createType', '1')
            store.dispatch('examinationManage/examPaperId', '')
            store.dispatch('examinationManage/temporaryStorageTopics', [])
            next()
          })
          .catch(() => {
            next(false)
          })
      }, 200)
    } else {
      next()
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
	.el-table /deep/ .el-radio .el-radio__label {
		display: none;
	}
</style>
