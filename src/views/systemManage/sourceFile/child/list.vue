<template>
  <div class="tenant-list-box">
    <div id="topSearch">
      <el-input v-model="searchVal" placeholder="请输入文件名称">
        <el-button slot="append" type="primary" icon="el-icon-search" />
      </el-input>
      <el-popover
        v-model="popoverVisible"
        placement="bottom-start"
        width="500"
        :visible-arrow="false"
        trigger="click"
        popper-class="advancedSearch"
      >
        <el-form ref="form" :model="searchObj" label-width="80px">
          <el-form-item label="创建人">
            <el-input v-model="searchObj.creater" />
          </el-form-item>
          <el-form-item label="创建时间">
            <el-date-picker
              v-model="searchObj.time_range"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item>
          <el-form-item label="状态">
            <el-radio v-model="searchObj.status" label="1">生效</el-radio>
            <el-radio v-model="searchObj.status" label="2">失效</el-radio>
          </el-form-item>
        </el-form>

        <div id="searchPopoverBtn">
          <el-button type="primary" @click="topSearch">搜索</el-button>
          <el-button type="primary" plain @click="searchObj = {}">重置</el-button>
        </div>

        <span id="advancedSearch" slot="reference">高级搜索<i class="el-icon-caret-bottom" /></span>
      </el-popover>
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
          <span class="pointer" @click="detail(scope.row._id)">{{ scope.row.customname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="代码" width="150" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.desc }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="110" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.status }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="创建人" width="200" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.personalise }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" width="200" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.createtime }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="操作" width="280" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button size="mini" @click="go_edit_fn(scope.row._id)"><i class="iconfont iconxiugai" /><i />修改</el-button>
          <el-button size="mini" @click="status_fn(scope.row._id,scope.row.status)"><i class="iconfont iconshixiao" />停用</el-button>
          <el-button size="mini" @click="status_fn(scope.row._id,scope.row.status)"><i class="iconfont iconshengxiao" />启用</el-button>
          <el-button size="mini" @click="delet_fn(scope.row._id)"><i class="iconfont iconshanchu" />删除</el-button>

        </template>
      </el-table-column>
    </el-table>
    <div class="page-piliang" v-show="total>0">
      <el-button type="primary"><i class="iconfont iconshanchu" />批量删除</el-button>
      <pagination   :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="get_list" />
    </div>

  </div>
</template>

<script>
import { source_file_list, source_file_delet, source_file_status } from '@/api/systemManage-sourceFile.js'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
  components: { Pagination },
  data() {
    return {
      searchVal: '',
      searchObj: {
        creater: null,
        start_time: null,
        end_time: null,
        status: null,
        time_range: null
      },
      list: null,
      listLoading: false,
      total: 0,
      page_count: 0,
      listQuery: {
        page: 1,
        limit: 10
      },
      popoverVisible: false
    }
  },
  created() {

  },
  methods: {
    topSearch() {
      this.get_list()
    },
    get_list() {
      const that = this
      // conditionParam: {}
      // currentPage: 1
      // endTime: "2019-10-11"
      // keyTime: "c_time"
      // pageSize: 10
      // regexConditionParam: [{key: "name", value: "课件上传"}]
      // sort: {_id: -1}
      // startTime: "2019-10-10"

      const param = {}
      param.name = that.searchVal ? that.searchVal : ''
      param.creater = that.searchObj.creater ? that.searchObj.creater : ''
      param.startTime = that.searchObj.start_time ? that.searchObj.start_time : ''
      param.endTime = that.searchObj.end_time ? that.searchObj.end_time : ''
      param.status = that.searchObj.status ? that.searchObj.status : ''
      param.page = that.listQuery.page ? that.listQuery.page : 1
      source_file_list(param).then(res => {
        that.list = res.data.page.list
        that.total = res.data.page.total
        that.page_count = res.data.page.pageCount
      }).catch(error => {
        console.log(error)
      })
    },
    delet_fn(in_ids) {
      const that = this
      const param = {}
      param.ids = in_ids
      source_file_delet(param).then(res => {
        that.$message({
          message: res.message,
          type: 'success'
        })
        that.get_list()
      }).catch(error => {
        console.log(error)
      })
    },
    status_fn(in_ids, in_ststus) {
      const that = this
      const param = {}
      param.ids = in_ids
      param.in_ststus = in_ststus
      source_file_status(param).then(res => {
        that.$message({
          message: res.message,
          type: 'success'
        })
        that.get_list()
      }).catch(error => {
        console.log(error)
      })
    },
    go_edit_fn(in_ids) {
      this.$router.push({ path: '/systemManage/sourceFile/edit', query: { ids: in_ids }})
    },
    add() {
      this.$router.push({ path: '/systemManage/sourceFile/add' })
    }
  }
}
</script>

<style lang="scss" scoped>
  .tenant-list-box{
    .page-piliang{
      padding-top: 15px;
    }
  }
</style>
