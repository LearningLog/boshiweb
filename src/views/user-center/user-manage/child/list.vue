<template>
  <div class="list-box">
    <div id="topSearch">
      <el-input v-model="listQuery.username" placeholder="请输入用户名称" clearable @keyup.enter.native="topSearch">
        <el-button slot="append" type="primary" icon="el-icon-search" @click="topSearch" />
      </el-input>
      <span id="advancedSearchBtn" slot="reference" @click="popoverVisible = !popoverVisible">高级搜索<i v-show="popoverVisible" class="el-icon-caret-bottom" /><i v-show="!popoverVisible" class="el-icon-caret-top" /></span>
      <transition name="fade-advanced-search">
        <el-row v-show="popoverVisible">
          <el-card id="advancedSearchArea" shadow="never">
            <el-form ref="form" :model="listQuery" label-width="100px">
              <el-form-item label="企业">
                <el-input v-model="listQuery.customname" placeholder="请输入企业名称" clearable @keyup.enter.native="topSearch" />
              </el-form-item>
              <el-form-item label="用户昵称">
                <el-input v-model="listQuery.nickname" placeholder="请输入用户昵称" clearable @keyup.enter.native="topSearch" />
              </el-form-item>
              <el-form-item label="手机号">
                <el-input v-model="listQuery.phone" placeholder="请输入手机号" clearable @keyup.enter.native="topSearch" />
              </el-form-item>
              <el-form-item label="角色">
                <el-input v-model="listQuery.rolename" placeholder="请输入角色" clearable @keyup.enter.native="topSearch" />
              </el-form-item>
              <el-form-item label="组别">
                <el-input v-model="listQuery.groupName" placeholder="请输入组别" clearable @keyup.enter.native="topSearch" />
              </el-form-item>
              <el-form-item label="用户状态">
                <el-select v-model="listQuery.userStatus" placeholder="请选择用户状态" clearable @keyup.enter.native="topSearch">
                  <el-option v-for="item in userStatus" :key="item.id" :label="item.name" :value="item.id" />
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
        width="55"
        fixed
      />
      <el-table-column align="center" label="用户名" show-overflow-tooltip>
        <template slot-scope="scope">
          <span class="pointer" @click="detail(scope.row)">{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="昵称" min-width="100" align="center" show-overflow-tooltip prop="nickname" />
      <el-table-column label="手机号" min-width="100" align="center" show-overflow-tooltip prop="phone" />
      <el-table-column align="center" label="角色" min-width="130" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.bs_roles && scope.row.bs_roles.join() }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="组别" min-width="140" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.egroups && scope.row.egroups.join() }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" min-width="80" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 1" type="success">生效</el-tag>
          <el-tag v-else type="danger">失效</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="来源" min-width="100" align="center" show-overflow-tooltip prop="dataTypeName" />
      <el-table-column class-name="status-col" label="操作" width="230" align="center" fixed="right" show-overflow-tooltip>
        <template slot-scope="scope">
          <div v-if="scope.row.auth">
            <el-button size="mini" @click="go_edit_fn(scope.row)"><i class="iconfont iconxiugai" />修改</el-button>
            <el-button size="mini" @click="delete_fn(scope.row)"><i class="iconfont iconshanchu" />删除</el-button>
            <el-button size="mini" @click="authorize_fn(scope.row)"><i class="iconfont iconshouquan" />授权</el-button>
          </div>
          <div v-else>
            <el-button size="mini" :disabled="true"><i class="iconfont iconxiugai" />修改</el-button>
            <el-button size="mini" :disabled="true"><i class="iconfont iconshanchu" />删除</el-button>
            <el-button size="mini" :disabled="true"><i class="iconfont iconshouquan" />授权</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="get_list" />
    <div id="bottomOperation">
      <el-button v-show="total>0" type="danger" plain @click="batch_del_fn"><i class="iconfont iconshanchu" />批量删除</el-button>
    </div>
  </div>
</template>

<script>
import { getUserList, deleteUser, deleteMultiRole } from '@/api/userCenter-userManage'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
  components: { Pagination },
  data() {
    return {
      listLoading: false,
      listQuery: {
        currentPage: 1, // 当前页码
        pageSize: 10, // 当前列表请求条数
        username: '', // 用户名称
        customname: '', // 企业名称
        nickname: '', // 用户昵称,
        phone: '', // 手机号,
        rolename: '', // 角色名称
        groupName: '', // 分组
        userStatus: null // 用户状态
      },
      userStatus: [{ id: 1, name: '生效' }, { id: 2, name: '失效' }], // 用户状态
      checkedList: [], // 选中的数据
      list: null, // 列表数据
      total: 0, // 总条数
      popoverVisible: false // 高级搜索是否展开
    }
  },
  created() {
    this.get_list()
  },
  methods: {
    // 搜索
    topSearch() {
      this.get_list()
    },
    // 重置
    reset() {
      this.listQuery.username = ''
      this.listQuery.customname = ''
      this.listQuery.nickname = ''
      this.listQuery.phone = ''
      this.listQuery.rolename = ''
      this.listQuery.groupName = ''
      this.listQuery.userStatus = null
      this.get_list()
    },
    // 获取用户列表
    get_list() {
      this.listLoading = true
      getUserList(this.listQuery).then(response => {
        this.listLoading = false
        this.list = response.data.page.list
        this.total = response.data.page.totalCount
      })
    },
    // 详情
    detail(row) {
      this.$router.push({ path: '/user-center/user-manage/detail', query: { id: row._id }})
    },
    // 新增
    add() {
      this.$router.push({ path: '/user-center/user-manage/add' })
    },
    // 删除单个角色
    delete_fn(row) {
      debugger
      this.$confirm('确定要删除【' + row.username + '】吗？', '删除用户', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUser({ _id: row._id }).then(response => {
          this.$message.success('删除成功！')
          if ((this.list.length - 1) === 0) { // 如果当前页数据已删完，则去往上一页
            this.listQuery.currentPage -= 1
          }
          this.get_list()
        })
      }).catch(() => {})
    },
    // 选中数据
    handleSelectionChange(row) {
      this.checkedList = row
    },
    // 批量删除
    batch_del_fn() {
      if (!this.checkedList.length) {
        this.$message.warning('请选择用户！')
        return false
      }
      this.$confirm('确定要删除选中的用户吗？', '批量删除用户', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const _ids = []
        this.checkedList.forEach(item => {
          _ids.push(item._id)
        })
        deleteMultiRole({ _ids: _ids }).then(response => {
          this.$message.success('批量删除成功！')
          if ((this.list.length - this.checkedList.length) === 0) { // 如果当前页数据已删完，则去往上一页
            this.listQuery.currentPage -= 1
          }
          this.get_list()
        })
      }).catch(() => {})
    },
    // 修改
    go_edit_fn(row) {
      this.$router.push({ path: '/user-center/user-manage/edit', query: { id: row._id }})
    },
    // 授权
    authorize_fn(row) {
      this.$router.push({ path: '/systemManage/roleManage/authorize', query: { id: row._id }})
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
