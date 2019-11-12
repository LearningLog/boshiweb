<template>
  <div class="tenant-list-box">
    <div id="topSearch">
      <el-input v-model="listQuery.content" placeholder="请输入任务名称" clearable @keyup.enter.native="topSearch">
        <el-button slot="append" type="primary" icon="el-icon-search" @click="topSearch" />
      </el-input>
      <span id="advancedSearchBtn" slot="reference" @click="popoverVisible = !popoverVisible">高级搜索<i v-show="popoverVisible" class="el-icon-caret-bottom" /><i v-show="!popoverVisible" class="el-icon-caret-top" /></span>
      <transition name="fade-advanced-search">
        <el-row v-show="popoverVisible">
          <el-card id="advancedSearchArea" shadow="never">
            <el-form ref="form" :model="listQuery" label-width="100px">
              <tenants-groups-roles :is-render-role="false" :is-reset="isReset" @tenantsGroupsRolesVal="tenantsGroupsRolesVal" />
              <el-form-item label="状态">
                <el-select
                  v-model="listQuery.autoStatus"
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
                  v-model="listQuery.revolution_type"
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
      <el-button type="primary" @click="add"><i class="iconfont iconjia" />新增</el-button>
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
      <el-table-column align="center" label="考试名称" min-width="70" prop="revolution_name" />
      <el-table-column align="center" label="周期类型" min-width="40" prop="revolutionTypeDesc" />
      <el-table-column align="center" label="周期" min-width="30" prop="revolution" >
        <template slot-scope="scope">
          <span>{{ scope.row.revolution === 0?'--': scope.row.revolution}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="已发布场次" min-width="30" prop="total_count">
        <template slot-scope="scope">
          <el-link type="primary" @click="operateDetail(scope.row)">{{ scope.row.total_count }}</el-link>
        </template>
      </el-table-column>
      <el-table-column align="center" label="考核小组" min-width="30" prop="groupName" />
      <el-table-column align="center" label="状态" min-width="40" prop="autoStatusDesc" />
      <el-table-column align="center" label="创建人" min-width="40" prop="userNickName" />
      <el-table-column align="center" label="创建时间" min-width="40" prop="c_time" />

      <el-table-column class-name="status-col" label="操作" width="250" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" @click="edit(scope.row)"><i class="iconfont iconxiugai" />修改</el-button>
          <el-button size="mini" @click="publishOrStop(scope.row)"><i class="iconfont iconxiugai" /><span v-if="scope.row.auto_status == 2">暂停</span><span v-else>发布</span></el-button>
          <el-button size="mini" @click="del(scope.row)"><i class="iconfont iconshanchu" />删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="get_list" />
    <div id="bottomOperation">
      <el-button v-show="total>0" type="danger" plain @click="batchDel"><i class="iconfont iconshanchu" />批量删除</el-button>
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import TenantsGroupsRoles from '@/components/TenantsGroupsRoles'
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
import { getAutomaticList, delAuto } from '@/api/evolutionManage-automatic'
export default {
  components: { Pagination, TenantsGroupsRoles },
  directives: { elDragDialog },
  data() {
    return {
      isReset: false, // 是否重置三组联动数据
      total: 0, // 总条数
      listQuery: { // 查询条件
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
      checkedDelList: [] // 选择删除的list
    }
  },

  created() {
    this.get_list()
    // this.get_topic_label_list()
    // this.get_topic_skill_list()
  },
  methods: {
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
      this.listQuery.revolution_type = null
      this.listQuery.autoStatus = null
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

    // 选中数据
    handleSelectionChange(row) {
      this.checkedDelList = row
    },
    // 新增
    add() {
      if (!this.listQuery.egroup) {
        this.$message.warning('请先选择分组信息再尝试添加试题！')
        return false
      }
      // this.$router.push({ path: '/evaluating-manage/question-bank-manage/add', query: { egroup: this.listQuery.egroup, selectCompanyId: this.group.groupId }})
    },
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
    batchDel() {
      if (!this.checkedDelList.length) {
        this.$message.warning('请选择自动发布任务！')
        return false
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
    }
    /*
      // 详情
      detail(row) {
        this.$router.push({ path: '/evaluating-manage/question-bank-manage/detail', query: { _id: row._id }})
      },
      // 单个删除
     */
    // 批量删除
    /*  ,
        // 编辑
        edit(row) {
          this.$router.push({ path: '/evaluating-manage/question-bank-manage/edit', query: { _id: row._id }})
        }*/
  }
}
</script>

<style lang="scss" scoped>

</style>
