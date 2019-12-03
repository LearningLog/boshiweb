<template>
  <div class="list-box">
    <div id="topSearch">
      <el-input v-model="listQuery1.content" placeholder="请输入技能名称" clearable @keyup.enter.native="topSearch">
        <el-button slot="append" type="primary" icon="el-icon-search" @click="topSearch" />
      </el-input>
      <span id="advancedSearchBtn" slot="reference" @click="popoverVisible = !popoverVisible">高级搜索<i v-show="popoverVisible" class="el-icon-caret-bottom" /><i v-show="!popoverVisible" class="el-icon-caret-top" /></span>
      <transition name="fade-advanced-search">
        <el-row v-show="popoverVisible">
          <el-card id="advancedSearchArea" shadow="never">
            <el-form ref="form" :model="listQuery1" label-width="100px">
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

              <el-form-item v-if="isSystemManage" label="所属租户">
                <el-select
                  v-model="listQuery1.selectCompanyId"
                  placeholder="请选择所属租户"
                  clearable
                  filterable
                >
                  <el-option
                    v-for="item in custom_list"
                    :key="item._id"
                    :label="item.customname"
                    :value="item._id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="技能ID">
                <el-input v-model="listQuery1.skillInc" placeholder="技能ID" clearable @keyup.enter.native="topSearch" />
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
      <el-button v-if="hasThisBtnPermission('skill-add')" type="primary" @click="add"><i class="iconfont iconzengjia" />新增</el-button>
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
      <el-table-column label="技能ID" min-width="100" align="center" show-overflow-tooltip prop="increase_id" />
      <el-table-column align="center" label="技能名称" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-link type="primary" @click="detail(scope.row)">{{ scope.row.skill_name }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="技能描述" min-width="100" align="center" show-overflow-tooltip prop="skill_desc" />
      <el-table-column align="center" label="所属租户" min-width="140" show-overflow-tooltip prop="customname" />
      <el-table-column align="center" label="创建时间" min-width="140" show-overflow-tooltip prop="createtime" />
      <el-table-column class-name="status-col" label="操作" width="160" align="center" fixed="right" show-overflow-tooltip>
        <template slot-scope="scope">
          <div>
            <el-button size="mini" :disabled="!hasThisBtnPermission('skill-edit')" @click="go_edit_fn(scope.row)"><i class="iconfont iconxiugai" />修改</el-button>
            <el-button size="mini" :disabled="!hasThisBtnPermission('skill-delete')" @click="delete_fn(scope.row)"><i class="iconfont iconshanchu" />删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="get_list" />
    <div id="bottomOperation">
      <el-button v-if="hasThisBtnPermission('skill-multioperate')" v-show="total>0" type="danger" plain @click="batch_del_fn"><i class="iconfont iconshanchu" />批量删除</el-button>
    </div>
  </div>
</template>

<script>
import { getCustomManageList } from '@/api/user-center//roleManage'

import { skillManagerList, deleteItem, deleteMulti } from '@/api/user-center/skillManage'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
// import TenantsGroupsRoles from '@/components/TenantsGroupsRoles'
import { isCurrentEgroupManager, hasThisBtnPermission } from '@/utils/permission'

export default {
  components: { Pagination },
  data() {
    return {
      isReset: true, // 租户组件重置
      listLoading: false,
      custom_list: [], // 所属租户下拉列表
      listQuery: {
        currentPage: 1, // 当前页码
        pageSize: 10, // 当前列表请求条数
        content: '', // 技能名称
        selectCompanyId: '', // 企业名称
        // egroup: '', // 分组
        // roleId: '', // 角色
        startTime: '', // 开始时间
        endTime: '', // 结束时间
        skillInc: ''// 技能id
      },
      listQuery1: {
        currentPage: 1, // 当前页码
        pageSize: 10, // 当前列表请求条数
        content: '', // 技能名称
        selectCompanyId: '', // 企业名称
        // egroup: '', // 分组
        // roleId: '', // 角色
        startTime: '', // 开始时间
        endTime: '' // 结束时间
      },
      time_range: [], // 时间范围model
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
  },
  methods: {
    // 按钮权限
    hasThisBtnPermission(code, egroup) {
      return hasThisBtnPermission(code, isCurrentEgroupManager(egroup))
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
      this.isReset = true
      this.listQuery1.content = ''// 技能名
      this.listQuery1.startTime = ''// 开始时间
      this.listQuery1.endTime = ''// 结束时间
      this.listQuery1.selectCompanyId = ''// 企业名称
      // this.listQuery.egroup = ''// 分组
      // this.listQuery.roleId = ''// 角色

      this.time_range = []// 时间范围
      this.listQuery = JSON.parse(JSON.stringify(this.listQuery1))
      this.get_list()
    },
    // 获取技能列表
    get_list() {
      this.time_range = this.time_range || []
      this.listQuery.startTime = this.time_range[0]
      this.listQuery.endTime = this.time_range[1]
      this.listLoading = true
      skillManagerList(this.listQuery).then(response => {
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
      this.$router.push({ path: '/user-center/skill-manager/edit', query: { id: row._id }})
    },
    // 详情
    detail(row) {
      this.$router.push({ path: '/user-center/skill-manager/detail', query: { id: row._id }})
    },
    // 新增
    add() {
      this.$router.push({ path: '/user-center/skill-manager/add' })
    },
    // 删除单个技能
    delete_fn(row) {
      this.$confirm('确定要删除【' + row.skill_name + '】吗？已关联该技能的内容会取消关联该技能', '删除技能', {
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
        this.$message.warning('请选择技能！')
        return false
      }
      this.$confirm('确定要删除选中的技能吗？', '批量删除技能', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = []
        this.delCheckedList.forEach(item => {

          ids.push(item._id)
        })
        deleteMulti({ ids: ids }).then(response => {
          this.$message.success('批量删除成功！')
          if ((this.list.length - this.delCheckedList.length) === 0) { // 如果当前页数据已删完，则去往上一页
            this.listQuery.currentPage -= 1
          }
          this.get_list()
        })
      }).catch(() => {})
    },

    // 授权
    authorize_fn(row) {
      this.$router.push({ path: '/user-center/skill-manager/authorize', query: { id: row._id }})
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
