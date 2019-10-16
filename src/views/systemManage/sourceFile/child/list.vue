<template>
  <div class="list-box">
    <div id="topSearch">
      <el-input v-model="listQuery.name" placeholder="请输入文件名称" clearable @keyup.enter.native="topSearch">
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
              <el-form-item label="创建时间">
                <el-date-picker
                  v-model="listQuery.time_range"
                  type="daterange"
                  clearable
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </el-form-item>
              <el-form-item label="状态">
                <el-radio-group v-model="listQuery.enable_status" clearable>
                  <el-radio :label="1">生效</el-radio>
                  <el-radio :label="2">失效</el-radio>
                </el-radio-group>
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
    >
      <!--<el-table-column-->
      <!--type="selection"-->
      <!--width="55"-->
      <!--/>-->
      <el-table-column align="center" label="名称" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="代码" min-width="120" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" min-width="80" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.enable_status === 1">{{ scope.row.status_txt }}</el-tag>
          <el-tag type="danger" v-else>{{ scope.row.status_txt }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="创建人" min-width="100" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.personalise }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" min-width="130" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.c_time }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="操作" width="230" align="center" fixed="right" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button size="mini" @click="go_edit_fn(scope.row)"><i class="iconfont iconxiugai" />修改</el-button>
          <el-button v-if="scope.row.status_txt==='启用'" size="mini" @click="status_fn(scope.row._id,2)"><i class="iconfont iconshixiao" />停用</el-button>
          <el-button v-if="scope.row.status_txt==='停用'" size="mini" @click="status_fn(scope.row._id,1)"><i class="iconfont iconshengxiao" />启用</el-button>
          <el-button size="mini" @click="delet_fn(scope.row)"><i class="iconfont iconshanchu" />删除</el-button>

        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="get_list" />
  </div>
</template>

<script>
import { source_file_list, source_file_delet, source_file_status } from '@/api/systemManage-sourceFile.js'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
  components: { Pagination },
  data() {
    return {
      listQuery: {
        currentPage: 1,
        pageSize: 10,
        name: '',
        creater: '',
        time_range: null,
        enable_status: ''
      },
      list: null,
      listLoading: false,
      total: 0,
      page_count: 0,
      status_map: { 1: '启用', 2: '停用' },
      popoverVisible: false
    }
  },
  created() {
    this.get_list()
  },
  methods: {
    // 高级搜索
    topSearch() {
      this.get_list()
    },
    // 重置搜索条件
    reset() {
      this.listQuery.name = ''
      this.listQuery.creater = ''
      this.listQuery.time_range = null
      this.listQuery.enable_status = ''
      this.get_list()
    },
    // 获取列表
    get_list() {
      const that = this
      const status_map = that.status_map
      let stime = ''
      let edtime = ''
      if (that.listQuery.time_range && that.listQuery.time_range[0]) {
        stime = that.listQuery.time_range[0]
      }
      if (that.listQuery.time_range && that.listQuery.time_range[1]) {
        edtime = that.listQuery.time_range[1]
      }
      const param = {}
      param.name = that.listQuery.name ? that.listQuery.name : ''
      param.creater = that.listQuery.creater ? that.listQuery.creater : ''
      param.startTime = stime
      param.endTime = edtime
      param.status = that.listQuery.enable_status ? that.listQuery.enable_status : ''
      param.currentPage = that.listQuery.currentPage ? that.listQuery.currentPage : 1
      param.pageSize = that.listQuery.pageSize ? that.listQuery.pageSize : 10
      this.listLoading = true
      source_file_list(param).then(res => {
        this.listLoading = false
        const dt = res.data.page.list
        dt.forEach(item => {
          item.status_txt = status_map[item.enable_status]
        })
        that.list = res.data.page.list
        that.total = res.data.page.totalCount
        that.page_count = res.data.page.pageCount
      }).catch(error => {
        console.log(error)
      })
    },
    // 删除文件来源
    delet_fn(row) {
      this.$confirm('确定要删除【' + row.name + '】吗？', '删除文件来源', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const param = {}
        param.ids = []
        param.ids.push(row._id)
        source_file_delet(param).then(response => {
          this.$message.success('删除成功')
          if ((this.list.length - 1) === 0) { // 如果当前页数据已删完，则去往上一页
            this.listQuery.currentPage -= 1
          }
          this.get_list()
        })
      }).catch(() => {})
    },
    // 更改状态
    status_fn(in_ids, in_ststus) {
      const that = this
      const param = {}
      param.ids = []
      param.ids.push(in_ids)
      param.enable_status = in_ststus
      source_file_status(param).then(res => {
        that.$message({
          message: '修改成功',
          type: 'success'
        })
        that.get_list()
      }).catch(error => {
        console.log(error)
      })
    },
    // go编辑
    go_edit_fn(data) {
      const dt = data
      this.$router.push({ path: '/systemManage/sourceFile/edit', query: { queryDt: dt }})
    },
    // go添加
    add() {
      this.$router.push({ path: '/systemManage/sourceFile/add' })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
