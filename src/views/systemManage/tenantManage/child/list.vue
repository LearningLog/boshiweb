<template>
  <div class="tenant-list-box">
    <div id="topSearch">
      <el-input v-model="searchVal" placeholder="请输入租户名称">
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
      <el-table-column
        type="selection"
        width="55"
      />
      <el-table-column align="center" label="ID" width="60">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="名称" show-overflow-tooltip>
        <template slot-scope="scope">
          <span class="pointer" @click="detail(scope.row.id)">{{ scope.row.customname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述" width="150" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.desc }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Logo" width="110" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.logo }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="个性化系统名称" width="200" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.personalise }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建人" width="200" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.createuser }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" width="200" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.createtime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" width="200" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.status }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="操作" width="280" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button size="mini" @click="edit(scope.row.id)"><i class="iconfont iconxiugai" /><i />修改</el-button>
          <el-button size="mini" @click="del(scope.row.id)"><i class="iconfont iconshixiao" />失效</el-button>
          <el-button size="mini" @click="del(scope.row.id)"><i class="iconfont iconshengxiao" />生效</el-button>
          <el-dropdown>
            <el-button size="mini">
              <i class="iconfont icongengduo" />更多
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item><i class="iconfont iconzixun" />资讯</el-dropdown-item>
              <el-dropdown-item><i class="iconfont iconshanchu" />删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <div class="page-piliang">
      <el-button type="primary"><i class="iconfont iconshanchu" />批量删除</el-button>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="get_list" />
    </div>

  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      searchVal: '',
      searchObj: {
        creater: null,
        creat_time: null,
        end_time: null,
        status: null,
        time_range: null
      },
      list: null,
      listLoading: true,
      total: 0,
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
    get_list() {
      this.listLoading = false
    },
    topSearch() {
      this.searchObj = {}
      this.popoverVisible = false
    },
    add() {
      this.$router.push({ path: '/systemManage/tenantManage/add' })
    },
    detail(id) {
      console.log(id)
    },
    del(id) {
      console.log(id)
    },
    edit(id) {
      console.log(id)
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
