<template>
  <div class="tenant-list-box">
    <div id="topSearch">
      <el-input v-model="listQuery1.cname" placeholder="请输入课程名称" clearable @keyup.enter.native="topSearch">
        <el-button slot="append" type="primary" icon="el-icon-search" @click="topSearch" />
      </el-input>
      <span id="advancedSearchBtn" slot="reference" @click="popoverVisible = !popoverVisible">高级搜索<i v-show="popoverVisible" class="advancedSearchIcon iconfont iconshousuoshangjiantou" /><i v-show="!popoverVisible" class="advancedSearchIcon iconfont iconshousuoxiajiantou" /></span>
      <transition name="fade-advanced-search">
        <el-row v-show="popoverVisible">
          <el-card id="advancedSearchArea" shadow="never">
            <el-form ref="form" :model="listQuery1" label-width="100px">
              <tenants-groups-roles :is-render-role="false" :is-reset="isReset" which-group="manageEgroupInfo" @tenantsGroupsRolesVal="tenantsGroupsRolesVal" @resetVal="resetVal" />
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
              <el-form-item label="标签名称">
                <el-select
                  v-model="labels"
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
                  v-model="listQuery1.createUser"
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
      <el-table-column align="center" label="课堂封面" width="166">
        <template slot-scope="scope">
          <el-image
            class="thumbnail-online-class"
            style="width: 120px; height: 69px;"
            :src="scope.row.cover_pic"
            fit="contain"
          />
        </template>
      </el-table-column>
      <el-table-column align="center" label="课堂名称" min-width="147" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-link type="primary" @click="detail(scope.row)">{{ scope.row.cname }}</el-link>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="标签" min-width="120" align="center" prop="labelName" show-overflow-tooltip />
      <!--<el-table-column class-name="status-col" label="开始时间" min-width="140" align="center" prop="s_time" />-->
      <el-table-column class-name="status-col" label="课程评价" width="160" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span class="starboxs" @click="rateDetail(scope.row)">
            <el-rate
              v-if="scope.row.general_level"
              v-model="scope.row.general_level"
              disabled
              show-score
              text-color="#ff9900"
            />
          </span>
          <span v-if="!scope.row.general_level && scope.row.general_level !== 0">--</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="小组" min-width="120" align="center" prop="groupName" show-overflow-tooltip />
      <el-table-column align="center" label="创建人" min-width="90" prop="userNickName" show-overflow-tooltip />
      <el-table-column align="center" label="创建时间" width="140" prop="c_time" show-overflow-tooltip />
      <el-table-column class-name="status-col" label="操作" width="230" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" :disabled="!hasThisBtnPermission('video-edit', scope.row.egroup, scope.row.user_id)" @click="edit(scope.row)"><i class="iconfont iconxiugai" />修改</el-button>
          <el-button size="mini" :disabled="!hasThisBtnPermission('video-delete', scope.row.egroup, scope.row.user_id)" @click="del(scope.row)"><i class="iconfont iconshanchu" />删除</el-button>
          <el-dropdown trigger="click">
            <el-button size="mini">
              <i class="iconfont icongengduo" />更多
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :disabled="!hasThisBtnPermission('video-share', scope.row.egroup)" @click.native="share(scope.row, $event)"><i class="iconfont iconfenxiang1" />分享</el-dropdown-item>
              <el-dropdown-item :disabled="!hasThisBtnPermission('video-detail', scope.row.egroup)" @click.native="detail(scope.row)"><i class="iconfont iconxiangqing" />详情</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="get_list" />
    <div id="bottomOperation">
      <el-button v-if="hasThisBtnPermission('video-multioperate')" v-show="total>0" type="danger" plain @click="batchDel"><i class="iconfont iconshanchu" />批量删除</el-button>
    </div>
    <AddSelectGroup :visible-select-group="visibleSelectGroup" :is-render-group="false" title="选择租户" @getSelectGroup="getSelectGroup" />
  </div>
</template>

<script>
import clip from '@/utils/clipboard'
import { createFullUrl } from '@/utils/index'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import TenantsGroupsRoles from '@/components/TenantsGroupsRoles'
import AddSelectGroup from '@/components/AddSelectGroup'
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
import { chapetrList, chapetr_del } from '@/api/online-class/live-telecast-manage'
import { findUserListByGroupId } from '@/api/work-desk/work-desk'
import { getLabelListNoPagination } from '@/api/online-class/label-manage'
import { isCurrentEgroupManager, hasThisBtnPermission } from '@/utils/permission'

export default {
  components: { Pagination, TenantsGroupsRoles, AddSelectGroup },
  directives: { elDragDialog },
  data() {
    return {
      isReset: false, // 是否重置三组
      visibleSelectGroup: false, // 是否弹出选择租户、小组
      total: 0, // 总条数
      listQuery: { // 查询条件
        currentPage: 1, // 当前页
        pageSize: 10, // 当前页请求条数
        cname: '', // 课堂名称
        createUser: '', // 创建人
        selectCompanyId: '', // 租户
        egroup: '', // 小组
        labels: [], // 标签
        startTime: '', // 开始时间
        endTime: '', // 开始时间
        createTimebegin: '', // 创建开始时间
        createTimeend: '', // 创建结束时间
        type: 2 // 1，直播课堂；2，点播课堂
      },
      listQuery1: { // 查询条件
        currentPage: 1, // 当前页
        pageSize: 10, // 当前页请求条数
        cname: '', // 课堂名称
        createUser: '', // 创建人
        selectCompanyId: '', // 租户
        egroup: '', // 小组
        labels: [], // 标签
        startTime: '', // 开始时间
        endTime: '', // 开始时间
        createTimebegin: '', // 创建开始时间
        createTimeend: '', // 创建结束时间
        type: 2 // 1，直播课堂；2，点播课堂
      },
      labels: null, // 标签
      start_time_range: [], // 开始时间
      time_range: [], // 创建时间
      list: [], // 表格数据
      createrList: [], // 创建人list
      lablesList: [], // 标签list
      listLoading: true, // 是否开启表格遮罩
      popoverVisible: false, // 是否开启高级搜索
      checkedDelList: [], // 选择的list
      userId: '', // 当前登录用户id
      userGroupId: '', // 当前登录用户 租户id
      isSystemManage: '' // 当前登录用户是否为租户管理员
    }
  },
  created() {
    this.userId = this.$store.state.user.userSystemInfo.userInfo._id
    this.userGroupId = this.$store.state.user.userSystemInfo.userInfo.groupId
    this.isSystemManage = this.$store.state.user.isSystemManage
    this.get_list()
    this.getCreater()
    this.getLablesList()
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
      this.listQuery.startTime = this.start_time_range[0]
      this.listQuery.endTime = this.start_time_range[1]
      this.listQuery.createTimebegin = this.time_range[0]
      this.listQuery.createTimeend = this.time_range[1]
      this.listQuery.labels = this.labels ? [this.labels] : null
      chapetrList(this.listQuery).then(response => {
        this.listLoading = false
        this.list = response.data.page.list
        this.total = response.data.page.totalCount
      })
    },

    // 获取创建人（实际就是用户）
    getCreater() {
      findUserListByGroupId({ groupId: this.listQuery1.selectCompanyId || this.$store.state.user.userPermission.groupId }).then(res => {
        this.createrList = res.data
        var that = this
        var has = this.createrList.find(function(item) {
          return item._id === that.listQuery1.createUser
        })
        if (!has) {
          this.listQuery1.createUser = ''
        }
      })
    },

    // 获取标签list
    getLablesList() {
      getLabelListNoPagination({ selectCompanyId: this.listQuery1.selectCompanyId, egroup: this.listQuery1.egroup }).then(res => {
        this.lablesList = res.data
      })
    },

    // 监听三组数据变化
    tenantsGroupsRolesVal(val) {
      this.listQuery1.selectCompanyId = val.companyIds
      this.listQuery1.egroup = val.egroupId
      this.getCreater()
      this.getLablesList()
    },
    // 重置监听三组数据变化
    resetVal(val) {
      this.isReset = false
    },

    // 搜索
    topSearch() {
      this.listQuery = JSON.parse(JSON.stringify(this.listQuery1))
      this.get_list()
    },

    // 重置
    reset() {
      this.isReset = true
      this.listQuery1.cname = ''
      this.listQuery1.createUser = ''
      this.listQuery1.labels = ''
      this.labels = null
      this.listQuery1.createUser = ''
      this.listQuery1.selectCompanyId = ''
      this.listQuery1.egroup = ''
      this.start_time_range = []
      this.time_range = []
      this.listQuery1.startTime = ''
      this.listQuery1.endTime = ''
      this.listQuery1.createTimebegin = ''
      this.listQuery1.createTimeend = ''
      this.listQuery = JSON.parse(JSON.stringify(this.listQuery1))
      this.get_list()
    },

    // 选中数据
    handleSelectionChange(row) {
      this.checkedDelList = row
    },

    // 新增
    add() {
      if (!this.$store.state.user.isSystemManage) {
        if (!this.hasThisBtnPermission('video-add')) {
          this.$message.warning('您没有管理权限！')
          return false
        } else if (!this.$store.state.user.allEgroup.manageEgroupInfo.length) {
          this.$message.warning('您没有管理小组权限！')
          return false
        }
        this.$router.push({ path: '/online-class/on-demand/add' })
      } else {
        this.visibleSelectGroup = true
      }
    },

    // 监听选择小组返回数据
    getSelectGroup(val) {
      this.visibleSelectGroup = false
      if (val.selectCompanyId) {
        this.$router.push({ path: '/online-class/on-demand/add', query: { selectCompanyId: val.selectCompanyId }})
      }
    },

    // 分享
    share(row, event) {
      // const host = location.host
      // if (host.indexOf('localhost:') > -1) {
      //   this.shareUrl =
      //     host +
      //     '#/client/student-live-demand?_id=' +
      //     row._id
      // } else {
      //   this.shareUrl =
      //     process.env.VUE_APP_BASE_API +
      //     '#/client/student-live-demand?_id=' +
      //     row._id
      // }
      const subPath = '#/client/student-live-demand?_id=' + row._id
      this.shareUrl = createFullUrl(subPath)
      clip(this.shareUrl, event)
    },

    // 详情
    detail(row) {
      const { href } = this.$router.resolve({
        path: '/client/teacher-live-demand',
        query: { _id: row._id }
      })
      window.open(href, '_blank')
    },

    // 评分详情
    rateDetail(row) {
      if (row.general_level) {
        this.$router.push({ path: '/online-class/on-demand/evaluate', query: { cname: row.cname, _id: row._id, type: this.listQuery.type }})
      }
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
      for (var i = 0; i < this.checkedDelList.length; i++) {
        var item = this.checkedDelList[i]
        if (!this.hasThisBtnPermission('video-delete', item.egroup)) {
          this.$message.warning(`您没有的【${item.cname}】的管理权限！`)
          return false
        }
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
      this.$router.push({ path: '/online-class/on-demand/edit', query: { _id: row._id }})
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
  .starboxs /deep/ .el-rate__icon {
    cursor: pointer!important;
  }
</style>
