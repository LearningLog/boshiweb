<template>
  <div class="list-box">
    <div id="topSearch">
      <el-input v-model="listQuery1.content" placeholder="请输入技能名称" clearable @keyup.enter.native="topSearch">
        <el-button slot="append" type="primary" icon="el-icon-search" @click="topSearch" />
      </el-input>
      <span id="advancedSearchBtn" slot="reference" @click="popoverVisible = !popoverVisible">高级搜索<i v-show="popoverVisible" class="advancedSearchIcon iconfont iconshousuoshangjiantou" /><i v-show="!popoverVisible" class="advancedSearchIcon iconfont iconshousuoxiajiantou" /></span>
      <transition name="fade-advanced-search">
        <el-row v-show="popoverVisible">
          <el-card id="advancedSearchArea" shadow="never">
            <el-form ref="form" :model="listQuery1" label-width="100px">
              <el-form-item label="技能ID">
                <el-input v-model="listQuery1.skillInc" placeholder="请输入技能ID" clearable @keyup.enter.native="topSearch" />
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
    >
      <el-table-column label="技能ID" min-width="100" align="center" show-overflow-tooltip prop="increase_id" />
      <el-table-column align="center" label="技能名称" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.skill_name }}
          <!--<el-link type="primary" @click="detail(scope.row)">{{ scope.row.skill_name }}</el-link>-->
        </template>
      </el-table-column>
      <el-table-column label="技能描述" min-width="100" align="center" show-overflow-tooltip prop="skill_desc" />
      <el-table-column align="center" label="创建时间" min-width="140" show-overflow-tooltip prop="createtime" />
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="get_list" />
  </div>
</template>

<script>
import { skillManagerList } from '@/api/user-center/skillManage'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
  components: { Pagination },
  data() {
    return {
      listLoading: false,
      listQuery: {
        currentPage: 1, // 当前页码
        pageSize: 10, // 当前列表请求条数
        content: '', // 技能名称
        skillInc: '', // 技能ID
        startTime: '', // 开始时间
        endTime: '' // 结束时间
      },
      listQuery1: {
        currentPage: 1, // 当前页码
        pageSize: 10, // 当前列表请求条数
        content: '', // 技能名称
        skillInc: '', // 技能ID
        startTime: '', // 开始时间
        endTime: '' // 结束时间
      },
      time_range: [],
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
      this.listQuery = JSON.parse(JSON.stringify(this.listQuery1))
      this.get_list()
    },
    // 重置
    reset() {
      this.listQuery1.skillInc = ''
      this.listQuery1.content = ''
      this.listQuery1.startTime = ''
      this.listQuery1.endTime = ''
      this.time_range = []
      this.listQuery = JSON.parse(JSON.stringify(this.listQuery1))
      this.get_list()
    },
    // 获取技能列表
    get_list() {
      this.time_range = this.time_range || []
      this.listQuery.startTime = this.time_range[0]
      this.listQuery.endTime = this.time_range[1]
      this.listLoading = true
      skillManagerList(this.listQuery).then(res => {
        this.listLoading = false
        this.list = res.data.page.list
        this.total = res.data.page.totalCount
      }).catch(error => {
        console.log(error)
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
