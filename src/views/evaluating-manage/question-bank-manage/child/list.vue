<template>
  <div class="tenant-list-box">
    <div id="topSearch">
      <el-input v-model="listQuery1.content" placeholder="请输入试题名称" clearable @keyup.enter.native="topSearch">
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
      <el-table-column align="center" show-overflow-tooltip label="题型" min-width="70">
        <template slot-scope="scope">
          <span>{{ switchTopicTypeToName(scope.row.topic_type) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="题目内容" min-width="120" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-link type="primary" @click="detail(scope.row)">{{ scope.row.topic_content }}</el-link>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="难度" min-width="60" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ switchTopicLevelToName(scope.row.topic_level) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="标签" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.labelName || '' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="小组" min-width="100" prop="groupName" show-overflow-tooltip />
      <el-table-column align="center" label="技能" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.skillName || '' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" min-width="140" prop="c_time" show-overflow-tooltip />
      <el-table-column align="center" label="引用次数" min-width="84" prop="quote_count" show-overflow-tooltip />
      <el-table-column class-name="status-col" label="操作" width="160" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" :disabled="!hasThisBtnPermission('topic-edit', scope.row.egroup)" @click="edit(scope.row)"><i class="iconfont iconxiugai" />修改</el-button>
          <el-button size="mini" :disabled="!hasThisBtnPermission('topic-delete', scope.row.egroup)" @click="del(scope.row)"><i class="iconfont iconshanchu" />删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="get_list" />
    <div id="bottomOperation">
      <el-button v-if="hasThisBtnPermission('topic-multioperate')" v-show="total>0" type="danger" plain @click="batchDel"><i class="iconfont iconshanchu" />批量删除</el-button>
    </div>
    <AddSelectGroup :visible-select-group="visibleSelectGroup" @getSelectGroup="getSelectGroup" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import TenantsGroupsRoles from '@/components/TenantsGroupsRoles'
import AddSelectGroup from '@/components/AddSelectGroup'
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
import { evaluationTopicList, delTopic } from '@/api/evolution-manage/question-bank-manage'
import { isCurrentEgroupManager, hasThisBtnPermission } from '@/utils/permission'

export default {
  components: { Pagination, TenantsGroupsRoles, AddSelectGroup },
  directives: { elDragDialog },
  data() {
    return {
      isReset: false, // 是否重置三组联动数据
      visibleSelectGroup: false, // 是否弹出选择租户、小组
      total: 0, // 总条数
      listQuery: { // 查询条件
        currentPage: 1, // 当前页
        pageSize: 10, // 当前页请求条数
        content: '', // 试题名称
        topic_label: null, // 试题标签
        topic_skill: null, // 试题技能
        topicType: null, // 试题类型
        selectCompanyId: null, // 租户
        egroup: null, // 小组
        startTime: null, // 创建开始时间
        endTime: null // 创建结束时间
      },
      listQuery1: { // 查询条件
        currentPage: 1, // 当前页
        pageSize: 10, // 当前页请求条数
        content: '', // 试题名称
        topic_label: null, // 试题标签
        topic_skill: null, // 试题技能
        topicType: null, // 试题类型
        selectCompanyId: null, // 租户
        egroup: null, // 小组
        startTime: null, // 创建开始时间
        endTime: null // 创建结束时间
      },
      topic_label: [], // 试题标签
      topic_skill: [], // 试题技能
      topicType: [{ _id: 1, topicName: '单选' }, { _id: 2, topicName: '多选' }, { _id: 3, topicName: '判断' }],
      time_range: [], // 创建时间
      list: [], // 表格数据
      listLoading: true, // 是否开启表格遮罩
      popoverVisible: false, // 是否开启高级搜索
      checkedDelList: [], // 选择删除的list
      setInformationId: '', // 当前设置资讯的id
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
      evaluationTopicList(this.listQuery).then(response => {
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

    // 题型转换为name
    switchTopicTypeToName(topic_type) {
      switch (topic_type) {
        case 1:
          return '单选'
        case 2:
          return '多选'
        case 3:
          return '判断'
      }
    },

    // 难度转换为name
    switchTopicLevelToName(topic_level) {
      switch (topic_level) {
        case 1:
          return '简单'
        case 2:
          return '普通'
        case 3:
          return '困难'
      }
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
      if (!this.hasThisBtnPermission('topic-add', this.egroup)) {
        this.$message.warning('您没有该小组管理权限！')
        return false
      }
      this.visibleSelectGroup = false
      if (this.egroup) {
        this.$router.push({ path: '/evaluating-manage/question-bank-manage/add', query: { selectCompanyId: this.companyId, egroup: this.egroup }})
      }
    },

    // 详情
    detail(row) {
      this.$router.push({ path: '/evaluating-manage/question-bank-manage/detail', query: { _id: row._id }})
    },

    // 单个删除
    del(row) {
      this.$confirm('确定要删除【' + row.topic_content + '】吗？', '删除试题', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delTopic({ _id: row._id }).then(response => {
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
        this.$message.warning('请选择试题！')
        return false
      }
      for (var i = 0; i < this.checkedDelList.length; i++) {
        var item = this.checkedDelList[i]
        if (!this.hasThisBtnPermission('topic-delete', item.egroup)) {
          this.$message.warning(`您没有的【${item.topic_content}】的管理权限！`)
          return false
        }
      }
      this.$confirm('确定要删除选中的试题吗？', '批量删除试题', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let _ids = []
        this.checkedDelList.forEach(item => {
          _ids.push(item._id)
        })
        _ids = _ids.join()
        delTopic({ _id: _ids }).then(response => {
          this.$message.success('批量删除成功！')
          if ((this.list.length - this.checkedDelList.length) === 0) { // 如果当前页数据已删完，则去往上一页
            this.listQuery.currentPage -= 1
          }
          this.get_list()
        })
      }).catch(() => {})
    },

    // 编辑
    edit(row) {
      this.$router.push({ path: '/evaluating-manage/question-bank-manage/edit', query: { _id: row._id }})
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
