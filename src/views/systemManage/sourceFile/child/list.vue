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
          <span class="pointer" @click="detail(scope.row.id)">{{ scope.row.customname }}</span>
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
          <el-button size="mini" @click="edit(scope.row.id)"><i class="iconfont iconxiugai" /><i />修改</el-button>
          <el-button size="mini" @click="del(scope.row.id)"><i class="iconfont iconshixiao" />停用</el-button>
          <el-button size="mini" @click="del(scope.row.id)"><i class="iconfont iconshengxiao" />启用</el-button>
          <el-button size="mini" @click="del(scope.row.id)"><i class="iconfont iconshanchu" />删除</el-button>

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
      listLoading: false,
      total: 0,
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
    topSearch(){

    },
    get_list(){

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
