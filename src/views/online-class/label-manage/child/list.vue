<template>
  <div class="list-box">
    <div id="topSearch">
      <el-input v-model="listQuery1.lname" placeholder="请输入标签名称" clearable @keyup.enter.native="topSearch">
        <el-button slot="append" type="primary" icon="el-icon-search" @click="topSearch" />
      </el-input>
      <span id="advancedSearchBtn" slot="reference" @click="popoverVisible = !popoverVisible">高级搜索<i v-show="popoverVisible" class="el-icon-caret-bottom" /><i v-show="!popoverVisible" class="el-icon-caret-top" /></span>
      <transition name="fade-advanced-search">
        <el-row v-show="popoverVisible">
          <el-card id="advancedSearchArea" shadow="never">
            <el-form ref="form" :model="listQuery" label-width="100px">
              <el-form-item label="标签ID">
                <el-input v-model="listQuery1.linc" placeholder="请输入标签ID" clearable @keyup.enter.native="topSearch" />
              </el-form-item>
              <tenants-groups-roles :is-render-role="false" :is-reset="isReset" which-group="manageEgroupInfo" @tenantsGroupsRolesVal="tenantsGroupsRolesVal" @resetVal="resetVal" />
              <el-form-item label="创建时间">
                <el-date-picker
                  v-model="time_range"
                  type="daterange"
                  clearable
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
      @selection-change="select_fn"
    >
      <el-table-column
        type="selection"
        width="55"
      />
      <el-table-column label="序号" width="60" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.$index + (listQuery.currentPage - 1) * listQuery.pageSize + 1 }} </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="名称" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-link type="primary" @click="detail(scope.row)">{{ scope.row.lname }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="描述" min-width="120" align="center" show-overflow-tooltip prop="ldesc" />
      <el-table-column align="center" label="小组" min-width="120" show-overflow-tooltip prop="groupName" />
      <el-table-column align="center" label="创建时间" min-width="140" show-overflow-tooltip prop="c_time" />
      <el-table-column class-name="status-col" label="操作" width="160" align="center" fixed="right" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button size="mini" :disabled="!hasThisBtnPermission('classroom-label-edit', scope.row.egroup)" @click="go_edit_fn(scope.row)"><i class="iconfont iconxiugai" />修改</el-button>
          <el-button size="mini" :disabled="!hasThisBtnPermission('classroom-label-delete', scope.row.egroup)" @click="delete_fn(scope.row)"><i class="iconfont iconshanchu" />删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="get_list" />
    <div id="bottomOperation">
      <el-button v-if="hasThisBtnPermission('classroom-label-multioperate')" v-show="total>0" type="danger" plain @click="batch_del_fn"><i class="iconfont iconshanchu" />批量删除</el-button>
    </div>
    <AddSelectGroup :visible-select-group="visibleSelectGroup" :is-render-group="false" title="选择租户" @getSelectGroup="getSelectGroup" />
  </div>
</template>

<script>
import { getLabelList, label_delete } from '@/api/online-class/label-manage.js'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import TenantsGroupsRoles from '@/components/TenantsGroupsRoles'
import AddSelectGroup from '@/components/AddSelectGroup'
import { isCurrentEgroupManager, hasThisBtnPermission } from '@/utils/permission'

export default {
  components: { Pagination, TenantsGroupsRoles, AddSelectGroup },
  data() {
    return {
      isReset: false, // 是否重置三组
      visibleSelectGroup: false, // 是否弹出选择租户、小组
      listLoading: false,
      listQuery1: {
        currentPage: 1, // 当前页码
        pageSize: 10, // 当前列表请求条数
        createTimebegin: '', // 开始时间
        createTimeend: '', // 结束时间
        lname: '', // 标签名称
        linc: '', // 标签ID
        selectCompanyId: '', // 租户名称
        egroup: '' // 所属小组
      },
      listQuery: {
        currentPage: 1, // 当前页码
        pageSize: 10, // 当前列表请求条数
        createTimebegin: '', // 开始时间
        createTimeend: '', // 结束时间
        lname: '', // 标签名称
        linc: '', // 标签ID
        selectCompanyId: '', // 租户名称
        egroup: '' // 所属小组
      },
      group_list: [], // 所属小组list
      custom_list: [], // 所属租户list
      time_range: [],
      delCheckedList: [], // 选中的数据
      list: null, // 列表数据
      total: 0, // 总条数
      popoverVisible: false // 高级搜索是否展开
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

    // 监听三组数据变化
    tenantsGroupsRolesVal(val) {
      this.listQuery1.selectCompanyId = val.companyIds
      this.listQuery1.egroup = val.egroupId
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
      this.listQuery1.lname = ''
      this.listQuery1.linc = ''
      this.listQuery1.selectCompanyId = ''
      this.listQuery1.egroup = ''
      this.time_range = []
      this.listQuery1.createTimebegin = ''
      this.listQuery1.createTimeend = ''
      this.listQuery = JSON.parse(JSON.stringify(this.listQuery1))
      this.get_list()
    },
    // 获取标签列表
    get_list() {
      this.time_range = this.time_range || []
      this.listQuery.createTimebegin = this.time_range[0]
      this.listQuery.createTimeend = this.time_range[1]
      this.listLoading = true
      getLabelList(this.listQuery).then(response => {
        this.listLoading = false
        this.list = response.data.page.list
        this.total = response.data.page.totalCount
      })
    },
    selectable(row, index) {
      return row.auth
    },
    // 详情
    detail(row) {
      this.$router.push({ path: '/online-class/label-manage/detail', query: { id: row._id }})
    },

    // 新增
    add() {
      if (!this.$store.state.user.isSystemManage) {
        if (!this.hasThisBtnPermission('classroom-label-add')) {
          this.$message.warning('您没有该小组管理权限！')
          return false
        } else if (!this.$store.state.user.allEgroup.manageEgroupInfo.length) {
          this.$message.warning('您没有管理小组权限！')
          return false
        }
        this.$router.push({ path: '/online-class/label-manage/add' })
      } else {
        this.visibleSelectGroup = true
      }
    },

    // 监听选择小组返回数据
    getSelectGroup(val) {
      this.visibleSelectGroup = false
      if (val.selectCompanyId) {
        this.$router.push({ path: '/online-class/label-manage/add', query: { selectCompanyId: val.selectCompanyId }})
      }
    },

    // 删除单个角色
    delete_fn(row) {
      this.$confirm('确定要删除【' + row.lname + '】吗？', '删除标签', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        label_delete({ _id: row._id }).then(response => {
          this.$message.success('删除成功！')
          if ((this.list.length - 1) === 0) { // 如果当前页数据已删完，则去往上一页
            this.listQuery.currentPage -= 1
          }
          this.get_list()
        })
      }).catch(() => {})
    },
    // 选中数据
    select_fn(row) {
      this.delCheckedList = row
    },
    // 批量删除
    batch_del_fn() {
      if (!this.delCheckedList.length) {
        this.$message.warning('请选择标签！')
        return false
      }
      for (var i = 0; i < this.delCheckedList.length; i++) {
        var item = this.delCheckedList[i]
        if (!this.hasThisBtnPermission('online-delete', item.egroup)) {
          this.$message.warning(`您没有的【${item.groupName}】的管理权限！`)
          return false
        }
      }
      this.$confirm('确定要删除选中的标签吗？', '批量删除标签', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const _ids = []
        this.delCheckedList.forEach(item => {
          _ids.push(item._id)
        })
        label_delete({ idList: _ids }).then(response => {
          this.$message.success('批量删除成功！')
          if ((this.list.length - this.delCheckedList.length) === 0) { // 如果当前页数据已删完，则去往上一页
            this.listQuery.currentPage -= 1
          }
          this.get_list()
        })
      }).catch(() => {})
    },
    // 修改
    go_edit_fn(row) {
      this.$router.push({ path: '/online-class/label-manage/edit', query: { id: row._id }})
    }

  }
}
</script>

<style lang="scss" scoped>

</style>
