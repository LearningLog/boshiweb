<template>
  <div class="tenant-list-box">
    <div id="topSearch">
      <el-input
        v-model="listQuery.content"
        placeholder="请输入试题名称"
        clearable
        @keyup.enter.native="topSearch"
      >
        <el-button
          slot="append"
          type="primary"
          icon="el-icon-search"
          @click="topSearch"
        />
      </el-input>
      <span
        id="advancedSearchBtn"
        slot="reference"
        @click="popoverVisible = !popoverVisible"
      >高级搜索<i v-show="popoverVisible" class="el-icon-caret-bottom" /><i
        v-show="!popoverVisible"
        class="el-icon-caret-top"
      /></span>
      <transition name="fade-advanced-search">
        <el-row v-show="popoverVisible">
          <el-card id="advancedSearchArea" shadow="never">
            <el-form ref="form" :model="listQuery" label-width="100px">
              <tenants-groups-roles
                :is-render-role="false"
                :is-reset="isReset"
                @tenantsGroupsRolesVal="tenantsGroupsRolesVal"
              />
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
      <el-button
        type="primary"
        @click="save"
      ><i class="iconfont iconjia" />保存</el-button>
    </div>
    <el-table
      ref="topics"
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="50" fixed />
      <el-table-column align="center" label="题型" min-width="40">
        <template slot-scope="scope">
          <span>{{ switchTopicTypeToName(scope.row.topic_type) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="题目内容"
        min-width="120"
        align="center"
        show-overflow-tooltip
        prop="topic_content"
      />
      <el-table-column
        class-name="status-col"
        label="难度"
        min-width="40"
        align="center"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span>{{ switchTopicLevelToName(scope.row.topic_level) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="标签"
        min-width="100"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span>{{ scope.row.labelName || "" }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="小组"
        min-width="100"
        prop="groupName"
        show-overflow-tooltip
      />
      <el-table-column
        align="center"
        label="技能"
        min-width="100"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span>{{ scope.row.skillName || "" }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="创建时间"
        min-width="130"
        prop="c_time"
        show-overflow-tooltip
      />
      <el-table-column
        align="center"
        label="引用次数"
        min-width="80"
        prop="quote_count"
        show-overflow-tooltip
      />
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.currentPage"
      :limit.sync="listQuery.pageSize"
      @pagination="get_list"
    />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import TenantsGroupsRoles from '@/components/TenantsGroupsRoles'
import { evaluationTopicList } from '@/api/question-bank-manage'
import store from '@/store'

export default {
  components: { Pagination, TenantsGroupsRoles },
  data() {
    return {
      isReset: false, // 是否重置三组联动数据
      total: 0, // 总条数
      listQuery: {
        // 查询条件
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
      topicType: [
        { _id: 1, topicName: '简单' },
        { _id: 2, topicName: '普通' },
        { _id: 3, topicName: '困难' }
      ],
      time_range: [], // 创建时间
      list: [], // 表格数据
      listLoading: true, // 是否开启表格遮罩
      popoverVisible: false, // 是否开启高级搜索
      checkedDelList: [], // 选择的list
      companyId: '', // 系统管理员选择的租户id
      egroup: '', // 系统管理员选择的小组id
      selectCompanyId: '', // 带过来的租户id
      egroup2: '', // 带过来的小组id
      topics: [] // store中的试题
    }
  },
  created() {
    this.selectCompanyId = this.$route.query.selectCompanyId
    this.egroup2 = this.$route.query.egroup
    this.topics = this.$store.state.testPaper.topics
    this.get_list()
  },
  methods: {
    // 获取初始化数据
    get_list() {
      this.listLoading = true
      this.listQuery.startTime = this.time_range[0]
      this.listQuery.endTime = this.time_range[1]
      evaluationTopicList(this.listQuery).then(response => {
        this.listLoading = false
        this.list = response.data.page.list
        this.total = response.data.page.totalCount

        this.$nextTick(() => {
          const topics = this.$store.state.testPaper.topics || []
          for (var i = 0, len = topics.length; i < len; i++) {
            var item1 = topics[i]
            for (var j = 0, len2 = this.list.length; j < len2; j++) {
              var item2 = this.list[j]
              if (item1._id === item2._id) {
                this.$refs.topics.toggleRowSelection(this.list[j], true)
                break
              }
            }
          }
        })
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
      this.listQuery.topic_label = null
      this.listQuery.topic_skill = null
      this.listQuery.topicType = null
      this.listQuery.selectCompanyId = null
      this.listQuery.egroup = null
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
      this.group = val.group
    },
    // 新增监听三组数据变化
    tenantsGroupsRolesVal2(val) {
      this.companyId = val.companyIds
      this.egroup = val.egroupId
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
      const arr = this.topics.concat(this.checkedDelList)
      store.dispatch('testPaper/temporaryStorageTopics', arr)
    },

    save() {
      store.dispatch('testPaper/temporaryStorageTopics', this.checkedDelList)
      this.$router.push({
        path: '/evaluating-manage/test-paper-manage/add',
        query: { selectCompanyId: this.selectCompanyId, egroup: this.egroup2 }
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
