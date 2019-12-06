<template>
  <div class="tenant-list-box">
    <div id="topSearch">
      <el-input v-model="listQuery1.content" placeholder="请输入试卷名称" clearable @keyup.enter.native="topSearch">
        <el-button slot="append" type="primary" icon="el-icon-search" @click="topSearch" />
      </el-input>
      <span id="advancedSearchBtn" slot="reference" @click="popoverVisible = !popoverVisible">高级搜索<i v-show="popoverVisible" class="advancedSearchIcon iconfont iconshousuoshangjiantou" /><i v-show="!popoverVisible" class="advancedSearchIcon iconfont iconshousuoxiajiantou" /></span>
      <transition name="fade-advanced-search">
        <el-row v-show="popoverVisible">
          <el-card id="advancedSearchArea" shadow="never">
            <el-form ref="form" :model="listQuery1" label-width="100px">
              <tenants-groups-roles :is-render-role="false" :is-reset="isReset" @tenantsGroupsRolesVal="tenantsGroupsRolesVal" @resetVal="resetVal" />
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
      <el-table-column label="试卷名称" min-width="120" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-link type="primary" @click="detail(scope.row)">{{ scope.row.exampaper_name }}</el-link>
        </template>
      </el-table-column>
      <el-table-column align="center" label="标签" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.labelName || '' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="小组" min-width="120" prop="groupName" show-overflow-tooltip />
      <el-table-column align="center" label="题目数" min-width="70" show-overflow-tooltip prop="topic_count" />
      <el-table-column align="center" label="总分数" min-width="70" show-overflow-tooltip prop="score_count" />
      <el-table-column align="center" label="创建时间" min-width="140" prop="c_time" show-overflow-tooltip />
      <el-table-column align="center" label="引用次数" min-width="90" prop="usedcount" show-overflow-tooltip />
      <el-table-column class-name="status-col" label="操作" width="250" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" :disabled="!hasThisBtnPermission('exampaper-edit', scope.row.egroup)" @click="edit(scope.row)"><i class="iconfont iconxiugai" />修改</el-button>
          <el-button size="mini" :disabled="!hasThisBtnPermission('exampaper-publish', scope.row.egroup)" @click="beginPublish(scope.row)"><i class="iconfont iconfabu" />发布考试</el-button>
          <el-button size="mini" :disabled="!hasThisBtnPermission('exampaper-delete', scope.row.egroup)" @click="del(scope.row)"><i class="iconfont iconshanchu" />删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="get_list" />
    <div id="bottomOperation">
      <el-button v-if="hasThisBtnPermission('exampaper-multioperate')" v-show="total>0" type="danger" plain @click="batchDel"><i class="iconfont iconshanchu" />批量删除</el-button>
      <el-button v-if="hasThisBtnPermission('exampaper-export')" v-show="total>0" type="primary" plain @click="exportPaper"><i class="iconfont iconpilianngdaochu" />批量导出</el-button>
    </div>
    <PublishExam :select-company-id="selectCompanyId" :publish-dialog="publishDialog" :score-count="scoreCount" @publishExam="publishExam" @visiblePublish="visiblePublish" />
    <AddSelectGroup :visible-select-group="visibleSelectGroup" @getSelectGroup="getSelectGroup" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import TenantsGroupsRoles from '@/components/TenantsGroupsRoles'
import AddSelectGroup from '@/components/AddSelectGroup'
import PublishExam from '@/components/PublishExam'
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
import { evaluationPaperList, delPaper, generateExportPaper, exportPaperOne, exportPaperMore, publish } from '@/api/evolution-manage/test-paper-manage'
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
      topic_label: [], // 试卷标签
      topic_skill: [], // 试卷技能
      time_range: [], // 创建时间
      list: [], // 表格数据
      listLoading: true, // 是否开启表格遮罩
      popoverVisible: false, // 是否开启高级搜索
      checkedDelList: [], // 选择删除的list
      exampaper_id: '', // 发布的试卷id
      selectCompanyId: '', // 发布的试卷的selectCompanyId
      scoreCount: 0, // 发布的试卷的总分
      companyId: '', // 系统管理员选择的租户id
      egroup: '' // 系统管理员选择的小组id
    }
  },
  watch: {},
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
      this.isReset = true
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
      if (!this.hasThisBtnPermission('exampaper-add', this.egroup)) {
        this.$message.warning('您没有该小组管理权限！')
        return false
      }
      this.visibleSelectGroup = false
      if (this.egroup) {
        this.$router.push({ path: '/evaluating-manage/test-paper-manage/add', query: { selectCompanyId: this.companyId, egroup: this.egroup }})
      }
    },

    // 详情
    detail(row) {
      this.$router.push({ path: '/evaluating-manage/test-paper-manage/detail', query: { _id: row._id }})
    },
    // 发布
    beginPublish(row) {
      this.exampaper_id = row._id
      this.selectCompanyId = row.groupId
      this.scoreCount = row.score_count
      this.publishDialog = true
    },

    // 监听修改弹窗关闭
    visiblePublish(val) {
      this.publishDialog = val.visible
    },

    // 监听发布考试
    publishExam(val) {
      val.exampaper_id = this.exampaper_id
      publish(val).then(response => {
        this.publishDialog = false
        this.$message.success('发布考试成功！')
        this.get_list()
      })
    },
    // 单个删除
    del(row) {
      this.$confirm('确定要删除【' + row.exampaper_name + '】吗？', '删除试卷', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delPaper({ _id: row._id }).then(response => {
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
        this.$message.warning('请选择试卷！')
        return false
      }
      for (var i = 0; i < this.checkedDelList.length; i++) {
        var item = this.checkedDelList[i]
        if (!this.hasThisBtnPermission('exampaper-delete', item.egroup)) {
          this.$message.warning(`您没有的【${item.exampaper_name}】的管理权限！`)
          return false
        }
      }
      this.$confirm('确定要删除选中的试卷吗？', '批量删除试卷', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let _ids = []
        this.checkedDelList.forEach(item => {
          _ids.push(item._id)
        })
        _ids = _ids.join()
        delPaper({ _id: _ids }).then(response => {
          this.$message.success('批量删除成功！')
          if ((this.list.length - this.checkedDelList.length) === 0) { // 如果当前页数据已删完，则去往上一页
            this.listQuery.currentPage -= 1
          }
          this.get_list()
        })
      }).catch(() => {})
    },
    // 批量导出
    exportPaper() {
      if (!this.checkedDelList.length) {
        this.$message.warning('请选择试卷！')
        return false
      }
      let _ids = []
      this.checkedDelList.forEach(item => {
        _ids.push(item._id)
      })
      _ids = _ids.join()
      generateExportPaper({ examPapers: _ids }).then(res => {
        if (res.data.length === 1) {
          exportPaperOne({ version: res.data[0] }).then(res2 => {
            const headers = res2.headers
            const contentDisposition = headers['content-disposition'].replace(/["|']/g, '')
            const matched = /filename=(.*)/g.exec(contentDisposition)
            const filename = decodeURI(matched[1])
            const blob = res2.data
            const reader = new FileReader()
            reader.readAsDataURL(blob)
            reader.onload = (e) => {
              // 创建a标签，插入到文档中并click，最后移除
              const a = document.createElement('a')
              a.download = filename
              a.href = e.target.result
              document.body.appendChild(a)
              a.click()
              document.body.removeChild(a)
            }
          })
        } else {
          const fileNmae = res.data.join('.')
          exportPaperMore({ version: res.data[0] }).then(res2 => {
            const headers = res2.headers
            const contentDisposition = headers['content-disposition'].replace(/["|']/g, '')
            const matched = /filename=(.*)/g.exec(contentDisposition)
            const filename = fileNmae || decodeURI(matched[1])
            const blob = res2.data
            const reader = new FileReader()
            reader.readAsDataURL(blob)
            reader.onload = (e) => {
              // 创建a标签，插入到文档中并click，最后移除
              const a = document.createElement('a')
              a.download = filename
              a.href = e.target.result
              document.body.appendChild(a)
              a.click()
              document.body.removeChild(a)
            }
          })
        }
      })
    },
    // 编辑
    edit(row) {
      this.$router.push({ path: '/evaluating-manage/test-paper-manage/edit', query: { _id: row._id, selectCompanyId: row.groupId, egroup: row.egroup[0] }})
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
