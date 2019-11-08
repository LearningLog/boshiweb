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
              <el-form-item label="标签名称">
                <el-input v-model="listQuery.labels[0]" placeholder="请输入标签名称" clearable @keyup.enter.native="topSearch" />
              </el-form-item>
              <el-form-item label="创建人">
                <el-input v-model="listQuery.username" placeholder="请输入创建人" clearable @keyup.enter.native="topSearch" />
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
              <el-form-item label="讲师">
                <el-input v-model="listQuery.teacher" placeholder="请输入讲师" clearable @keyup.enter.native="topSearch" />
              </el-form-item>
              <el-form-item label="所属小组">
                <el-select v-model="listQuery.egroup" placeholder="请选择所属小组" clearable filterable>
                  <el-option
                    v-for="item in group_list"
                    :key="item.inc"
                    :label="item.groupName"
                    :value="item.inc"
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
      <el-table-column align="center" label="课堂封面" min-width="220">
        <template slot-scope="scope">
          <img v-if="scope.row.cover_pic" class="logoImg" :src="scope.row.cover_pic" alt="">
        </template>
      </el-table-column>
      <el-table-column align="center" label="课堂名称" min-width="100">
        <template slot-scope="scope">
          <el-link type="primary" @click="detail(scope.row)">{{ scope.row.cname }}</el-link>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="开始时间" min-width="150" align="center" prop="s_time" />
      <el-table-column class-name="status-col" label="发布小组" min-width="120" align="center" prop="groupName" />
      <el-table-column class-name="status-col" label="标签" min-width="100" align="center" prop="labels" />
      <el-table-column align="center" label="创建人" min-width="100" prop="username" />
      <el-table-column align="center" label="创建时间" min-width="150" prop="c_time" />
      <el-table-column class-name="status-col" label="操作" width="220" align="center" fixed="right">
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
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
import { getUserEgroupInfo } from '@/api/userCenter-groupManage'
import { chapetrList, chapetr_del } from '@/api/onlineclass-direct-manage.js'
export default {
  components: { Pagination },
  directives: { elDragDialog },
  data() {
    return {
      total: 0, // 总条数
      listQuery: { // 查询条件
        currentPage: 1, // 当前页
        pageSize: 10, // 当前页请求条数
        cname: '', // 课堂名称
        username: '', // 创建人
        labels: [], // 标签
        teacher: '', // 讲师
        createTimebegin: '', // 开始时间
        createTimeend: '', // 结束时间
        egroup: '' // 所属小组
      },
      time_range: [], // 创建时间
      group_list: [], // 所属小组list
      list: [], // 表格数据
      listLoading: true, // 是否开启表格遮罩
      popoverVisible: false, // 是否开启高级搜索
      setInformationDialogVisible: false, // 是否打开设置资讯弹窗
      noList: [], // 未分配的资讯
      hasList: [], // 已分配的资讯
      checkedDelList: [], // 选择删除的list
      defaultProps: { // 穿梭框节点别名
        key: '_id',
        label: 'newscategory_name'
      },
      setInformationId: '' // 当前设置资讯的id
    }
  },
  created() {
    this.get_list()
    this.getEgroups()
  },
  methods: {
    // 获取初始化数据
    get_list() {
      this.listLoading = true
      this.time_range = this.time_range || []
      this.listQuery.createTimebegin = this.time_range[0]
      this.listQuery.createTimeend = this.time_range[1]
      chapetrList(this.listQuery).then(response => {
        this.listLoading = false
        this.list = response.data.page.list
        this.total = response.data.page.totalCount
      })
    },
    // 获取所有小组
    getEgroups() {
      getUserEgroupInfo({ selectCompanyId: this.companyIds }).then(response => {
        this.group_list = response.data.egroupInfo
      })
    },
    // 搜索
    topSearch() {
      this.get_list()
    },
    // 重置
    reset() {
      this.listQuery.cname = ''
      this.listQuery.createUser = ''
      this.listQuery.teacher = ''
      this.listQuery.egroup = ''
      this.time_range = []
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
      this.$router.push({ path: '/online-class/direct-manage/add' })
    },
    // 详情
    detail(row) {
      this.$router.push({ path: '/online-class/direct-manage/detail', query: { _id: row._id }})
    },
    // 单个删除
    del(row) {
      this.$confirm('确定要删除【' + row.cname + '】吗？', '删除租户', {
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
        this.$message.warning('请选择租户！')
        return false
      }
      this.$confirm('确定要删除选中的租户吗？', '批量删除租户', {
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
      this.$router.push({ path: '/online-class/direct-manage/edit', query: { _id: row._id }})
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
