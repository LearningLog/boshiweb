<template>
  <div class="list-box">
    <div id="topSearch">
      <el-input v-model="listQuery.skill_name" placeholder="请输入技能名称" clearable @keyup.enter.native="topSearch">
        <el-button slot="append" type="primary" icon="el-icon-search" @click="topSearch" />
      </el-input>
      <span id="advancedSearchBtn" slot="reference" @click="popoverVisible = !popoverVisible">高级搜索<i v-show="popoverVisible" class="el-icon-caret-bottom" /><i v-show="!popoverVisible" class="el-icon-caret-top" /></span>
      <transition name="fade-advanced-search">
        <el-row v-show="popoverVisible">
          <el-card id="advancedSearchArea" shadow="never">
            <el-form ref="form" :model="listQuery" label-width="100px">
              <el-form-item label="创建人">
                <el-input v-model="listQuery.creater" placeholder="请输入创建人" clearable @keyup.enter.native="topSearch" />
              </el-form-item>
              <el-form-item label="所属租户">
                <el-input v-model="listQuery.customname" placeholder="请输入所属租户" clearable @keyup.enter.native="topSearch" />
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
          <span class="pointer" @click="detail(scope.row)">{{ scope.row.skill_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="技能描述" min-width="100" align="center" show-overflow-tooltip prop="skill_desc" />
      <el-table-column align="center" label="创建时间" min-width="130" show-overflow-tooltip prop="createtime" />
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="get_list" />
    <div id="bottomOperation">
      <el-button v-show="total>0" type="danger" plain @click="batch_del_fn"><i class="iconfont iconshanchu" />批量删除</el-button>
    </div>
  </div>
</template>

<script>
import { skillManagerList, deleteItem, deleteMultiRole } from '@/api/userCenter-skillManage'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
  components: { Pagination },
  data() {
    return {
      listLoading: false,
      listQuery: {
        currentPage: 1, // 当前页码
        pageSize: 10, // 当前列表请求条数
        skill_name: '', // 技能名称
        creater: '', // 创建人
        startTime: '', // 开始时间
        endtTime: '', // 结束时间
        customname: '' // 所属租户
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
    // 获取技能列表
    get_list() {
      this.time_range = this.time_range || []
      this.skill_name=this.
      this.listQuery.startTime = this.time_range[0]
      this.listQuery.endtTime = this.time_range[1]
      this.listLoading = true
      skillManagerList(this.listQuery).then(response => {
        this.listLoading = false
        this.list = response.data.page.list
        this.total = response.data.page.totalCount
      })
    },
    selectable(row, index) {
      return row.auth
    },
  },
   
}
</script>

<style lang="scss" scoped>

</style>
