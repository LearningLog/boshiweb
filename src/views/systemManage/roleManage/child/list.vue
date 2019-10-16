<template>
  <div class="list-box">
    <div id="topSearch">
      <el-input v-model="listQuery.rolename" placeholder="请输入角色名称" clearable @keyup.enter.native="topSearch">
        <el-button slot="append" type="primary" icon="el-icon-search" @click="topSearch" />
      </el-input>
      <span id="advancedSearchBtn" slot="reference" @click="popoverVisible = !popoverVisible">高级搜索<i v-show="popoverVisible" class="el-icon-caret-bottom" /><i v-show="!popoverVisible" class="el-icon-caret-top" /></span>
      <transition name="fade-advanced-search">
        <el-row v-show="popoverVisible">
          <el-card id="advancedSearchArea" shadow="never">
            <el-form ref="form" :model="listQuery" label-width="100px">
              <el-form-item label="创建人">
                <el-input v-model="listQuery.creater" placeholder="请输入创建人" clearable />
              </el-form-item>
              <el-form-item label="归属企业">
                <el-input v-model="listQuery.groupId" placeholder="请输入归属企业" clearable />
              </el-form-item>
              <el-form-item label="创建时间">
                <el-date-picker
                  v-model="time_range"
                  type="daterange"
                  clearable
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
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
      @selection-change="select_fn"
    >
      <el-table-column
        type="selection"
        width="55"
      />
      <el-table-column align="center" label="名称" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.rolename }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述" min-width="100" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.desc }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建人" min-width="100" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.createuser }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" min-width="130" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.createtime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="所属企业" min-width="140" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.roleGroupName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否默认" min-width="60" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.defaultRole === 1">是</el-tag>
          <el-tag type="danger" v-else>否</el-tag>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="操作" width="230" align="center" fixed="right" show-overflow-tooltip>
        <template slot-scope="scope">
          <div v-if="scope.row.auth">
            <el-button size="mini" :disabled="true"><i class="iconfont iconxiugai" />修改</el-button>
            <el-button size="mini" :disabled="true"><i class="iconfont iconshanchu" />删除</el-button>
            <el-button size="mini" :disabled="true"><i class="iconfont iconshanchu" />授权</el-button>
          </div>
          <div v-else>
            <el-button size="mini" @click="go_edit_fn(scope.row)"><i class="iconfont iconxiugai" />修改</el-button>
            <el-button size="mini" @click="delete_fn(scope.row)"><i class="iconfont iconshanchu" />删除</el-button>
            <el-button size="mini" @click="authorize_fn(scope.row)"><i class="iconfont iconshanchu" />授权</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="get_list" />
    <div id="bottomOperation">
      <el-button v-show="total>0" type="primary" @click="batch_del_fn"><i class="iconfont iconshanchu" />批量删除</el-button>
    </div>
  </div>
</template>

<script>
import { role_list, role_delete, deleteMultiRole } from '@/api/systemManage-roleManage.js'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
  components: { Pagination },
  data() {
    return {
      listQuery: {
        listLoading: false,
        currentPage: 1, // 当前页码
        pageSize: 10, // 当前列表请求条数
        rolename: '', // 角色名称
        creater: '', // 创建人
        startTime: '', // 开始时间
        endtTime: '', // 结束时间
        roleGroupName: '' // 归属企业
      },
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
    // 搜索
    topSearch() {
      this.get_list()
    },
    // 重置
    reset() {
      this.listQuery.rolename = ''
      this.listQuery.creater = ''
      this.listQuery.startTime = ''
      this.listQuery.endtTime = ''
      this.listQuery.time_range = []
      this.listQuery.roleGroupName = ''
      this.get_list()
    },
    // 获取角色列表
    get_list() {
      this.time_range = this.time_range || []
      this.listQuery.startTime = this.time_range[0]
      this.listQuery.endtTime = this.time_range[1]
      this.listLoading = true
      role_list(this.listQuery).then(response => {
        this.listLoading = false
        this.list = response.data.page.list
        this.total = response.data.page.totalCount
      })
    },
    // 新增
    add() {
      this.$router.push({ path: '/systemManage/roleManage/add' })
    },
    // 删除单个角色
    delete_fn(row) {
      this.$confirm('确定要删除【' + row.name + '】吗？', '删除角色', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const param = {}
        param.ids = []
        param.ids.push(row._id)
        role_delete(param).then(response => {
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
      this.$router.push({ path: '/systemManage/roleManage/edit', query: { id: row.id }})
    },
    // 授权
    authorize_fn() {
      this.$router.push({ path: '/systemManage/roleManage/authorize' })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
