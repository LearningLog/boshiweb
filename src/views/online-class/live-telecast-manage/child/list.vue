<template>
  <div class="tenant-list-box">
    <div id="topSearch">
      <el-input v-model="listQuery.cname" placeholder="请输入课程名称" clearable @keyup.enter.native="topSearch">
        <el-button slot="append" type="primary" icon="el-icon-search" @click="topSearch" />
      </el-input>
      <span id="advancedSearchBtn" slot="reference" @click="popoverVisible = !popoverVisible">高级搜索<i v-show="popoverVisible" class="el-icon-caret-bottom" /><i v-show="!popoverVisible" class="el-icon-caret-top" /></span>
      <transition name="fade-advanced-search">
        <el-row v-show="popoverVisible">
          <el-card id="advancedSearchArea" shadow="never">
            <el-form ref="form" :model="listQuery" label-width="100px">
              <el-form-item label="讲师">
                <el-input v-model="listQuery.teacher" placeholder="请输入讲师" clearable @keyup.enter.native="topSearch" />
              </el-form-item>
              <el-form-item label="开始时间">
                <el-date-picker
                    v-model="start_time_range"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd"
                />
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
              <tenants-groups-roles :is-render-role="false" :isReset="isReset" which-group="manageEgroupInfo" @tenantsGroupsRolesVal="tenantsGroupsRolesVal" @resetVal="resetVal" />
              <el-form-item label="标签名称">
                <el-select
                    v-model="listQuery.labels"
                    placeholder="请选择标签"
                    clearable
                    filterable
                >
                  <el-option
                      v-for="item in lablesList"
                      :key="item.linc"
                      :label="item.lname"
                      :value="item.linc"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="创建人">
                <el-select
                    v-model="listQuery.createUser"
                    placeholder="请选择创建人"
                    clearable
                    filterable
                >
                  <el-option
                      v-for="item in createrList"
                      :key="item._id"
                      :label="item.nickname"
                      :value="item._id"
                  />
                </el-select>
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
      <el-table-column align="center" label="课堂封面" min-width="120">
        <template slot-scope="scope">
          <el-image
              class="thumbnail"
              :src="scope.row.cover_pic"
              fit="contain"></el-image>
        </template>
      </el-table-column>
      <el-table-column align="center" label="课堂名称" min-width="120">
        <template slot-scope="scope">
          <el-link type="primary" @click="detail(scope.row)">{{ scope.row.cname }}</el-link>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="开始时间" min-width="130" align="center" prop="s_time" />
      <el-table-column class-name="status-col" label="发布小组" min-width="120" align="center" prop="groupName" />
      <el-table-column class-name="status-col" label="标签" min-width="100" align="center" prop="labels" />
      <el-table-column align="center" label="创建人" min-width="90" prop="username" />
      <el-table-column align="center" label="创建时间" min-width="130" prop="c_time" />
      <el-table-column class-name="status-col" label="操作" width="230" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" @click="edit(scope.row)"><i class="iconfont iconxiugai" />修改</el-button>
          <el-button size="mini" @click="del(scope.row)"><i class="iconfont iconshanchu" />删除</el-button>
          <el-dropdown trigger="click">
            <el-button size="mini">
              <i class="iconfont icongengduo" />更多
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="getInformation(scope.row)"><i class="iconfont iconzixun" />分享</el-dropdown-item>
              <el-dropdown-item @click.native="detail(scope.row)"><i class="iconfont iconzixun" />详情</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
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
import { chapetrList, chapetr_del } from '@/api/live-telecast-manage'
import { findUserListByGroupId } from '@/api/work-desk'
import { getLabelListNoPagination } from '@/api/onlineclass-label-manage'
export default {
  components: { Pagination, TenantsGroupsRoles },
  directives: { elDragDialog },
  data() {
    return {
      isReset: false, // 是否重置三组
      total: 0, // 总条数
      listQuery: { // 查询条件
        currentPage: 1, // 当前页
        pageSize: 10, // 当前页请求条数
        cname: '', // 课堂名称
        createUser: '', // 创建人
        selectCompanyId: '', // 租户
        egroup: '', // 小组
        labels: [], // 标签
        teacher: '', // 讲师
        startTime: '', // 开始时间
        endTime: '', // 开始时间
        createTimebegin: '', // 创建开始时间
        createTimeend: '' // 创建结束时间
      },
      start_time_range: [], // 开始时间
      time_range: [], // 创建时间
      list: [], // 表格数据
      createrList: [], // 创建人list
      lablesList: [], // 标签list
      listLoading: true, // 是否开启表格遮罩
      popoverVisible: false, // 是否开启高级搜索
      checkedDelList: [] // 选择的list
    }
  },
  created() {
    this.get_list()
    this.getCreater()
    this.getLablesList()
  },
  methods: {
    // 获取初始化数据
    get_list() {
      this.listLoading = true
      this.time_range = this.time_range || []
      this.listQuery.startTime = this.start_time_range[0]
      this.listQuery.endTime = this.start_time_range[1]
      this.listQuery.createTimebegin = this.time_range[0]
      this.listQuery.createTimeend = this.time_range[1]
      chapetrList(this.listQuery).then(response => {
        this.listLoading = false
        this.list = response.data.page.list
        this.total = response.data.page.totalCount
      })
    },

    // 获取创建人（实际就是用户）
    getCreater() {
      findUserListByGroupId({ groupId: this.listQuery.selectCompanyId }).then(res => {
        this.createrList = res.data
      })
    },

    // 获取标签list
    getLablesList() {
      getLabelListNoPagination({ selectCompanyId: this.listQuery.selectCompanyId, egroup: this.listQuery.egroup }).then(res => {
        this.lablesList = res.data
      })
    },

    // 监听三组数据变化
    tenantsGroupsRolesVal(val) {
      this.listQuery.selectCompanyId = val.companyIds
      this.listQuery.egroup = val.egroupId
      this.getCreater()
      this.getLablesList()
    },
    // 重置监听三组数据变化
    resetVal(val) {
      this.isReset = false
    },

    // 搜索
    topSearch() {
      this.get_list()
    },

    // 重置
    reset() {
      this.isReset = true
      this.listQuery.cname = ''
      this.listQuery.createUser = ''
      this.listQuery.labels = ''
      this.listQuery.createUser = ''
      this.listQuery.teacher = ''
      this.listQuery.selectCompanyId = ''
      this.listQuery.egroup = ''
      this.start_time_range = []
      this.time_range = []
      this.listQuery.startTime = ''
      this.listQuery.endTime = ''
      this.listQuery.createTimebegin = ''
      this.listQuery.createTimeend = ''
      this.get_list()
    },

    // 选中数据
    handleSelectionChange(row) {
      this.checkedDelList = row
    },

    // 新增
    add() {
      this.$router.push({ path: '/online-class/live-telecast-manage/add' })
    },

    // 详情
    detail(row) {
      this.$router.push({ path: '/online-class/live-telecast-manage/detail', query: { _id: row._id }})
    },

    // 单个删除
    del(row) {
      this.$confirm('确定要删除【' + row.cname + '】吗？', '删除课程', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        chapetr_del({ _id: row._id }).then(response => {
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
        this.$message.warning('请选择课程！')
        return false
      }
      this.$confirm('确定要删除选中的课程吗？', '批量删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const _ids = []
        this.checkedDelList.forEach(item => {
          _ids.push(item._id)
        })
        chapetr_del({ idList: _ids }).then(response => {
          this.$message.success('批量删除成功！')
          if ((this.list.length - this.checkedDelList.length) === 0) { // 如果当前页数据已删完，则去往上一页
            this.listQuery.currentPage -= 1
          }
          this.get_list()
        })
      }).catch(() => {})
    },

    // 修改
    edit(row) {
      this.$router.push({ path: '/online-class/live-telecast-manage/edit', query: { _id: row._id }})
    }
  }
}
</script>

<style lang="scss" scoped>
  .setInformationDialog /deep/ .el-transfer {
    margin: 0 auto;
    text-align: center;
  }
  .setInformationDialog /deep/ .el-transfer-panel {
    text-align: left;
  }
  img.logoImg {
    width: 120px;
    height: auto;
  }
  .el-table /deep/ .el-table__body tr {
    height: 90px!important;
  }

</style>
