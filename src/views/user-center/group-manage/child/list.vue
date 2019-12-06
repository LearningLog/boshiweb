<template>
  <div class="list-box">
    <div id="topSearch">
      <el-input v-model="listQuery1.content" placeholder="请输入分组名称" clearable @keyup.enter.native="topSearch">
        <el-button slot="append" type="primary" icon="el-icon-search" @click="topSearch" />
      </el-input>
      <span id="advancedSearchBtn" slot="reference" @click="popoverVisible = !popoverVisible">高级搜索<i v-show="popoverVisible" class="advancedSearchIcon iconfont iconshousuoshangjiantou" /><i v-show="!popoverVisible" class="advancedSearchIcon iconfont iconshousuoxiajiantou" /></span>
      <transition name="fade-advanced-search">
        <el-row v-show="popoverVisible">
          <el-card id="advancedSearchArea" shadow="never">
            <el-form ref="form" :model="listQuery1" label-width="100px">
              <el-form-item v-if="isSystemManage" label="所属租户">
                <el-select v-model="listQuery1.selectCompanyId" placeholder="请选择所属租户" clearable filterable @change="companyidChange">
                  <el-option
                    v-for="item in custom_list"
                    :key="item._id"
                    :label="item.customname"
                    :value="item._id"
                  />
                </el-select>
              </el-form-item>

              <el-form-item label="创建人">
                <el-select v-model="listQuery1.userId" placeholder="请选择创建人" clearable filterable>
                  <el-option v-for="item in alluserList" :key="item._id" :label="item.nickname" :value="item._id" />
                </el-select>
              </el-form-item>
              <el-form-item label="负责人">
                <el-select v-model="listQuery1.manage_user_id" placeholder="请选择负责人" clearable filterable>
                  <el-option v-for="item in alluserList" :key="item._id" :label="item.nickname" :value="item._id" />
                </el-select>
              </el-form-item>

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
      <el-button v-if="hasThisBtnPermission('egroup-add')" type="primary" @click="add"><i class="iconfont iconzengjia" />新增</el-button>
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
      <!-- <el-table-column
        type="selection"
        width="55"
        :selectable="selectable"
      /> -->
      <el-table-column align="center" min-width="120" label="名称" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-link type="primary" @click="detail(scope.row)">{{ scope.row.groupName }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="描述" min-width="120" align="center" show-overflow-tooltip prop="desc" />
      <el-table-column label="创建人" min-width="120" align="center" show-overflow-tooltip prop="createuser" />
      <el-table-column align="center" label="创建时间" min-width="140" show-overflow-tooltip prop="createtime" />
      <el-table-column align="center" label="所属企业" min-width="140" show-overflow-tooltip prop="customname" />
      <el-table-column align="center" label="管理员" show-overflow-tooltip min-width="240">
        <template slot-scope="scope">
          {{ parseMinc(scope.row.mincNameList) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="来源" min-width="80" show-overflow-tooltip prop="dataTypeName" />
      <el-table-column align="center" label="成员人数" min-width="88" show-overflow-tooltip prop="usercount" />
      <el-table-column class-name="status-col" label="操作" width="250" align="center" fixed="right" show-overflow-tooltip>
        <template slot-scope="scope">
          <div>
            <el-button size="mini" :disabled="!hasThisBtnPermission('egroup-edit')" @click="go_edit_fn(scope.row)"><i class="iconfont iconxiugai" />修改</el-button>
            <el-button size="mini" :disabled="!hasThisBtnPermission('egroup-delete')" @click="delete_fn(scope.row)"><i class="iconfont iconshanchu" />删除</el-button>
            <el-button size="mini" :disabled="!hasThisBtnPermission('egroup-skill')" @click="getTranstorInformation(scope.row)"><i class="iconfont iconfenpeijineng" />分配技能</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="get_list" />
    <el-dialog v-el-drag-dialog class="setInformationDialog" width="650px" title="分配技能" :visible.sync="transforBoxVisible">
      <el-transfer v-model="hasList" :data="noList" :titles="['未分配类别', '已分配类别']" :props="defaultProps" @change="handleTransferChange" />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="setTranstorInformation">提交</el-button>
        <el-button @click="transforBoxVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { findUserListByGroupId, findEmployeeGroupList, getCustomManageList, deleteItem, deleteMultiRole, egroupskill, saveGroupSkill } from '@/api/user-center/groupManage'
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { isCurrentEgroupManager, hasThisBtnPermission } from '@/utils/permission'

export default {
  components: { Pagination },
  directives: { elDragDialog },
  data() {
    return {
      listLoading: false,
      alluserList: [], // 所有用户下拉
      custom_list: [], // 所属租户下拉列表
      transforBoxVisible: false, // 穿梭框显示隐藏
      noList: [], // 穿梭框未分配
      hasList: [], // 穿梭框已分配
      setInformationId: '',
      defaultProps: { // 穿梭框节点别名
        key: 'increase_id',
        label: 'skill_name'
      },
      listQuery: {
        currentPage: 1, // 当前页码
        pageSize: 10, // 当前列表请求条数
        content: '', // 分组名称
        manage_user_id: '', // 负责人
        userId: '', // 创建人
        startTime: '', // 开始时间
        endTime: '', // 结束时间

        // selectCompanyId: this.$store.state.user.userSystemInfo.userInfo.groupId // 所属租户
        selectCompanyId: '' // 所属租户
      },
      listQuery1: {
        currentPage: 1, // 当前页码
        pageSize: 10, // 当前列表请求条数
        content: '', // 分组名称
        manage_user_id: '', // 负责人
        userId: '', // 创建人
        startTime: '', // 开始时间
        endTime: '', // 结束时间

        selectCompanyId: '' // 所属租户
      },
      time_range: [],
      delCheckedList: [], // 选中的数据
      list: null, // 列表数据
      total: 0, // 总条数
      popoverVisible: false // 高级搜索是否展开
    }
  },
  computed: {
    isSystemManage() {
      return this.$store.state.user.isSystemManage
    }
  },
  created() {
    this.get_list()
    this.getCustomManageList()
    this.getAlluserList()
  },
  methods: {
    // 按钮权限
    hasThisBtnPermission(code, egroup, rowUserId) {
      return hasThisBtnPermission(code, isCurrentEgroupManager(egroup), rowUserId)
    },
    // 格式化负责人
    parseMinc(data) {
      return data.join('、')
    },
    // 获取所有用户
    getAlluserList() {
      const data = {
        groupId: this.listQuery1.selectCompanyId
      }
      findUserListByGroupId(data).then(res => {
        this.alluserList = res.data
      })
    },
    companyidChange() {
      this.getAlluserList()
    },
    // 获取所属租户list
    getCustomManageList() {
      getCustomManageList().then(res => {
        this.custom_list = res.data
      })
    },
    // 搜索
    topSearch() {
      this.listQuery = JSON.parse(JSON.stringify(this.listQuery1))
      this.get_list()
    },
    // 重置
    reset() {
      this.listQuery1.content = ''
      this.listQuery1.manage_user_id = ''
      this.listQuery1.userId = ''
      this.listQuery1.startTime = ''
      this.listQuery1.endTime = ''
      this.time_range = []
      this.listQuery1.selectCompanyId = this.$store.state.user.userSystemInfo.userInfo.groupId
      this.listQuery = JSON.parse(JSON.stringify(this.listQuery1))
      this.get_list()
    },
    // 获取分组列表
    get_list() {
      this.time_range = this.time_range || []
      this.listQuery.startTime = this.time_range[0]
      this.listQuery.endTime = this.time_range[1]
      this.listLoading = true
      findEmployeeGroupList(this.listQuery).then(response => {
        this.listLoading = false
        this.list = response.data.page.list
        this.total = response.data.page.totalCount
      })
    },
    selectable(row, index) {
      return true
      // return row.auth
    },
    // 修改
    go_edit_fn(row) {
      this.$router.push({ path: '/user-center/group-manage/edit', query: { id: row._id }})
    },
    // 详情
    detail(row) {
      this.$router.push({ path: '/user-center/group-manage/detail', query: { id: row._id }})
    },
    // 新增
    add() {
      this.$router.push({ path: '/user-center/group-manage/add' })
    },
    // 删除单个分组
    delete_fn(row) {
      this.$confirm('确定要删除【' + row.groupName + '】吗？若该分组已关联分组成员/知识库/课程/考试也会被删除', '删除分组', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteItem({ _id: row._id }).then(response => {
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
        this.$message.warning('请选择分组！')
        return false
      }
      this.$confirm('确定要删除选中的分组吗？', '批量删除分组', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const _ids = []
        this.delCheckedList.forEach(item => {
          _ids.push(item._id)
        })
        deleteMultiRole({ _ids: _ids }).then(response => {
          this.$message.success('批量删除成功！')
          if ((this.list.length - this.delCheckedList.length) === 0) { // 如果当前页数据已删完，则去往上一页
            this.listQuery.currentPage -= 1
          }
          this.get_list()
        })
      }).catch(() => {})
    },

    // 授权
    // 穿梭框
    getTranstorInformation(row) {
      this.setInformationId = row._id
      egroupskill({ _id: row._id }).then(response => {
        this.noList = response.data.noList.concat(response.data.hasList)
        this.hasList = []
        response.data.hasList.forEach((item, index) => {
          this.hasList.push(item.increase_id)
        })
      })
      this.transforBoxVisible = true
    },
    handleTransferChange(value, direction, movedKeys) {
      this.hasList = value
    },
    // 保存穿梭框-技能信息
    setTranstorInformation() {
      const data = { _id: this.setInformationId, skillinfo: this.hasList.join() }
      saveGroupSkill(data).then(response => {
        this.transforBoxVisible = false
        this.noList = []
        this.hasList = []
        this.$message.success('设置技能成功！')
        this.get_list()
      })
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
</style>
