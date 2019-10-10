<template>
  <div class="list-box">
    <div id="topSearch">
      <el-input v-model="searchVal" placeholder="请输入权限名称">
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
          <el-form-item label="模块">
            <el-input v-model="searchObj.module" />
          </el-form-item>
          <el-form-item label="菜单">
            <el-input v-model="searchObj.menu" />
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
          <span class="pointer" @click="go_detail(scope.row._id)">{{ scope.row.permissionname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="模块" width="150" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.modulename }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标识" width="150" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.permissionmark }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="code" width="150" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.permissioncode }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="描述" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.permissiondesc }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="菜单" width="200" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.permissionmenu }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" width="150" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.createtime }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="操作" width="180" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button size="mini" @click="go_edit_fn(scope.row._id)"><i class="iconfont iconxiugai" /><i />修改</el-button>
          <el-button size="mini" @click="delet_fn(scope.row._id)"><i class="iconfont iconshanchu" />删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page-piliang">
      <!--<el-button type="primary"><i class="iconfont iconshanchu" />批量删除</el-button>-->
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="get_list" />
    </div>

  </div>
</template>

<script>
import { permission_list, permission_delet } from '@/api/systemManage-permissionManage.js'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
  components: { Pagination },
  data() {
    return {
      searchVal: '',
      searchObj: {
        module: null,
        menu: '',
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
    this.get_list()
  },
  methods: {
    topSearch() {
      this.get_list()
    },
    get_list() {
      const that = this
      const param = {}
      param.name = that.searchVal ? that.searchVal : ''
      param.startTime = that.searchObj.start_time ? that.searchObj.start_time : ''
      param.endTime = that.searchObj.end_time ? that.searchObj.end_time : ''
      param.page = that.listQuery.page ? that.listQuery.page : 1
      permission_list(param).then(res => {
        that.list = res.data.page.list
        that.total = res.data.page.totalCount
        that.page_count = res.data.page.pageCount
      }).catch(error => {
        console.log(error)
      })
    },
    delet_fn(in_ids) {
      const that = this
      const param = {}
      param.ids = in_ids
      permission_delet(param).then(res => {
        that.$message({
          message: res.message,
          type: 'success'
        })
        that.get_list()
      }).catch(error => {
        console.log(error)
      })
    },
    go_detail(in_ids) {
      this.$router.push({ path: '/systemManage/permissionManage/detail', query: { ids: in_ids }})
    },
    go_edit_fn(in_ids) {
      this.$router.push({ path: '/systemManage/permissionManage/edit', query: { ids: in_ids }})
    },
    add() {
      this.$router.push({ path: '/systemManage/permissionManage/add' })
    }
  }
}
</script>

<style lang="scss" scoped>
  .list-box{
    p{
      margin: 0 0 0 5px !important;
    }
    .page-piliang{
      padding-top: 15px;
    }
  }
</style>
