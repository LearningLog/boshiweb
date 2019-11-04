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
      @selection-change="select_fn"
    >
      <el-table-column
        type="selection"
        width="55"
        :selectable="selectable"
      />
      <el-table-column align="center" label="名称" show-overflow-tooltip>
        <template slot-scope="scope">
          <span class="pointer" @click="detail(scope.row)">{{ scope.row.rolename }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述" min-width="100" align="center" show-overflow-tooltip prop="desc" />
      <el-table-column label="创建人" min-width="100" align="center" show-overflow-tooltip prop="createuser" />
      <el-table-column align="center" label="创建时间" min-width="130" show-overflow-tooltip prop="createtime" />
      <el-table-column align="center" label="所属租户" min-width="140" show-overflow-tooltip prop="nickname" />
      <el-table-column align="center" label="是否默认" min-width="80" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-tag v-if="scope.row.defaultRole === '1'" type="success">是</el-tag>
          <el-tag v-else type="danger">否</el-tag>
        </template>
      </el-table-column>
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
import { getUserList, role_delete, deleteMultiRole } from '@/api/userCenter-userManage'
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
      userStatus: [], // 用户状态
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
    // 获取角色列表
    get_list() {
      this.time_range = this.time_range || []
      this.listQuery.startTime = this.time_range[0]
      this.listQuery.endtTime = this.time_range[1]
      this.listLoading = true
      getUserList(this.listQuery).then(response => {
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
      this.$router.push({ path: '/systemManage/roleManage/detail', query: { id: row._id }})
    },
    // 新增
    add() {
      this.$router.push({ path: '/systemManage/roleManage/add' })
    },
    // 删除单个角色
    delete_fn(row) {
      this.$confirm('确定要删除【' + row.rolename + '】吗？', '删除角色', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        role_delete({ _id: row._id }).then(response => {
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
        this.$message.warning('请选择角色！')
        return false
      }
      this.$confirm('确定要删除选中的角色吗？', '批量删除角色', {
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
    // 修改
    go_edit_fn(row) {
      this.$router.push({ path: '/systemManage/roleManage/edit', query: { id: row._id }})
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
