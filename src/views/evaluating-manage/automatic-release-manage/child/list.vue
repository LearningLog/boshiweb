<template>
  <div class="tenant-list-box">
    <div id="topSearch">
      <el-input v-model="listQuery1.content" placeholder="请输入任务名称" clearable @keyup.enter.native="topSearch">
        <el-button slot="append" type="primary" icon="el-icon-search" @click="topSearch" />
      </el-input>
      <span id="advancedSearchBtn" slot="reference" @click="popoverVisible = !popoverVisible">高级搜索<i v-show="popoverVisible" class="el-icon-caret-bottom" /><i v-show="!popoverVisible" class="el-icon-caret-top" /></span>
      <transition name="fade-advanced-search">
        <el-row v-show="popoverVisible">
          <el-card id="advancedSearchArea" shadow="never">
            <el-form ref="form" :model="listQuery1" label-width="100px">
              <tenants-groups-roles :is-render-role="false" :is-reset="isReset" @tenantsGroupsRolesVal="tenantsGroupsRolesVal" @resetVal="resetVal" />
              <el-form-item label="状态">
                <el-select
                  v-model="listQuery1.autoStatus"
                  placeholder="请选择状态"
                  clearable
                  filterable
                >
                  <el-option
                    v-for="item in autostatusArray"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="周期类型">
                <el-select
                  v-model="listQuery1.revolution_type"
                  placeholder="请选择周期类型"
                  clearable
                  filterable
                >
                  <el-option
                    v-for="item in revolutionTypeArray"
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
      <el-table-column align="center" label="考试名称" min-width="100" show-overflow-tooltip prop="revolution_name" />
      <el-table-column align="center" label="周期类型" min-width="90" show-overflow-tooltip prop="revolutionTypeDesc" />
      <el-table-column align="center" label="周期" min-width="60" show-overflow-tooltip prop="revolution">
        <template slot-scope="scope">
          <span>{{ scope.row.revolution === 0?'--': scope.row.revolution }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="已发布场次" min-width="110" show-overflow-tooltip prop="total_count">
        <template slot-scope="scope">
          <el-link type="primary" @click="publicationsDetail(scope.row)">{{ scope.row.total_count }}</el-link>
        </template>
      </el-table-column>
      <el-table-column align="center" label="考核小组" min-width="90" show-overflow-tooltip prop="groupName" />
      <el-table-column align="center" label="状态" min-width="80" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-tag v-if="scope.row.auto_status === 1" type="warning">{{ scope.row.autoStatusDesc }}</el-tag>
          <el-tag v-if="scope.row.auto_status === 2" type="success">{{ scope.row.autoStatusDesc }}</el-tag>
          <el-tag v-if="scope.row.auto_status === 3" type="danger">{{ scope.row.autoStatusDesc }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建人" min-width="80" show-overflow-tooltip prop="userNickName" />
      <el-table-column align="center" label="创建时间" min-width="140" show-overflow-tooltip prop="c_time" />
      <el-table-column class-name="status-col" label="操作" width="230" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" :disabled="!hasThisBtnPermission('auto-edit', scope.row.egroup)" @click="edit(scope.row)"><i class="iconfont iconxiugai" />修改</el-button>
          <el-button v-if="scope.row.auto_status == 2" :disabled="!hasThisBtnPermission('auto-publishorstop', scope.row.egroup)" size="mini" @click="stop(scope.row)"><i class="iconfont iconzanting" />暂停</el-button>
          <el-button v-else size="mini" :disabled="!hasThisBtnPermission('auto-publishorstop', scope.row.egroup)" @click="publish(scope.row)"><i class="iconfont iconfabu" />发布</el-button>
          <el-button size="mini" :disabled="!hasThisBtnPermission('auto-delete', scope.row.egroup)" @click="del(scope.row)"><i class="iconfont iconshanchu" />删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="get_list" />
    <div id="bottomOperation">
      <el-button v-if="hasThisBtnPermission('auto-multioperate')" v-show="total>0" type="danger" plain @click="batchDel"><i class="iconfont iconshanchu" />批量删除</el-button>
    </div>
    <el-dialog v-el-drag-dialog class="publish" width="500px" title="发布任务" :visible.sync="visiblePublish">
      <el-form :model="publishForm" label-width="120px">
        <el-form-item label="活动名称：">
          <span>{{ publishForm.revolution_name }}</span>
        </el-form-item>
        <el-form-item label="考试开始时间：">
          <span>{{ publishForm.start_time }}</span>
        </el-form-item>
        <el-form-item label="考试结束时间：">
          <span>{{ publishForm.end_time }}</span>
        </el-form-item>
        <el-form-item label="及格分数：">
          <span>{{ publishForm.pass_score }}分</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="sure">确定</el-button>
        <el-button @click="visiblePublish = false">取 消</el-button>
      </div>
    </el-dialog>
    <AddSelectGroup :visible-select-group="visibleSelectGroup" @getSelectGroup="getSelectGroup" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import TenantsGroupsRoles from '@/components/TenantsGroupsRoles'
import AddSelectGroup from '@/components/AddSelectGroup'
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
import { getAutomaticList, delAuto, publish, stop } from '@/api/evolution-manage/automatic'
import { isCurrentEgroupManager, hasThisBtnPermission } from '@/utils/permission'

export default {
  components: { Pagination, TenantsGroupsRoles, AddSelectGroup },
  directives: { elDragDialog },
  data() {
    return {
      visiblePublish: false, // 发布弹窗
      visibleSelectGroup: false, // 是否弹出选择租户、小组
      isReset: false, // 是否重置三组联动数据
      total: 0, // 总条数
      listQuery: { // 查询条件
        sort: { _id: -1 }, // 排序
        currentPage: 1, // 当前页
        pageSize: 10, // 当前页请求条数
        content: '', // 自动发布考试任务名称
        autoStatus: null, // 发布状态
        revolution_type: null, // 周期类型
        selectCompanyId: null, // 租户
        egroup: null, // 小组
        startTime: null, // 创建开始时间
        endTime: null // 创建结束时间
      },
      listQuery1: { // 查询条件
        sort: { _id: -1 }, // 排序
        currentPage: 1, // 当前页
        pageSize: 10, // 当前页请求条数
        content: '', // 自动发布考试任务名称
        autoStatus: null, // 发布状态
        revolution_type: null, // 周期类型
        selectCompanyId: null, // 租户
        egroup: null, // 小组
        startTime: null, // 创建开始时间
        endTime: null // 创建结束时间
      },
      autostatusArray: [{ value: 1, name: '未生效' }, { value: 2, name: '生效中' }, { value: 3, name: '已失效' }],
      revolutionTypeArray: [{ value: 4, name: '单次考试' }, { value: 2, name: '按周' }, { value: 3, name: '按月' }],
      time_range: [], // 创建时间
      list: [], // 表格数据
      listLoading: true, // 是否开启表格遮罩
      popoverVisible: false, // 是否开启高级搜索
      checkedDelList: [], // 选择的list
      publishForm: { // 发布弹窗表单
        revolution_name: '', // 考试名称
        pass_score: '', // 及格分数
        start_time: '', // 开始时间
        end_time: '' // 结束时间
      },
      publishId: '', // 要发布的Id
      selectCompanyId: '', // 新增选择的租户
      egroup: '' // 新增选择的小组
    }
  },

  created() {
    this.get_list()
  },
  methods: {
    // 按钮权限
    hasThisBtnPermission(code, egroup) {
      return hasThisBtnPermission(code, isCurrentEgroupManager(egroup))
    },
    // 获取初始化数据
    get_list() {
      this.listLoading = true
      this.listQuery.startTime = this.time_range[0]
      this.listQuery.endTime = this.time_range[1]
      getAutomaticList(this.listQuery).then(response => {
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
      this.listQuery1.revolution_type = null
      this.listQuery1.autoStatus = null
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
      this.group = val.group
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
      if (!this.hasThisBtnPermission('auto-add', this.egroup)) {
        this.$message.warning('您没有该小组管理权限！')
        return false
      }
      this.visibleSelectGroup = false
      if (this.egroup) {
        this.$router.push({ path: '/evaluating-manage/automatic-release-manage/add', query: { selectCompanyId: this.companyId, egroup: this.egroup }})
      }
    },

    // 删除
    del(row) {
      this.$confirm('删除任务不会删除已经发布的考试，确定要删除【' + row.revolution_name + '】吗？', '删除任务', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delAuto({ _id: row._id }).then(response => {
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
        this.$message.warning('请选择自动发布任务！')
        return false
      }
      for (var i = 0; i < this.checkedDelList.length; i++) {
        var item = this.checkedDelList[i]
        if (!this.hasThisBtnPermission('auto-delete', item.egroup)) {
          this.$message.warning(`您没有的【${item.revolution_name}】的管理权限！`)
          return false
        }
      }
      this.$confirm('确定要删除选中的自动发布任务吗？', '批量删除自动发布任务', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let _ids = []
        this.checkedDelList.forEach(item => {
          _ids.push(item._id)
        })
        _ids = _ids.join()
        delAuto({ _id: _ids }).then(response => {
          this.$message.success('批量删除成功！')
          if ((this.list.length - this.checkedDelList.length) === 0) { // 如果当前页数据已删完，则去往上一页
            this.listQuery.currentPage -= 1
          }
          this.get_list()
        })
      }).catch(() => {})
    },

    // 发布
    publish(row) {
      this.publishForm.revolution_name = row.revolution_name
      this.publishForm.pass_score = row.pass_score
      this.publishForm.start_time = row.start_time
      this.publishForm.end_time = row.end_time
      this.publishId = row._id
      this.visiblePublish = true
    },

    // 确定发布
    sure() {
      publish({ _id: this.publishId }).then(res => {
        this.visiblePublish = false
        this.publishId = ''
        this.$message.success('发布成功！')
        this.get_list()
      })
    },

    // 暂停
    stop(row) {
      this.$confirm('自动发布考试任务暂停，不影响已发布的考试，请确认是否暂停？', '暂停任务', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        stop({ _id: row._id }).then(response => {
          this.$message.success('暂停成功！')
          this.get_list()
        })
      }).catch(() => {})
    },

    // 编辑
    edit(row) {
      this.$router.push({ path: '/evaluating-manage/automatic-release-manage/edit', query: { _id: row._id }})
    },

    // 详情
    publicationsDetail(row) {
      this.$router.push({ path: '/evaluating-manage/automatic-release-manage/detail', query: { _id: row._id }})
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
