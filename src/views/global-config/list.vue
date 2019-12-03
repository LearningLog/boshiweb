<template>
  <div class="app-container">
    <div id="topSearch">
      <el-input v-model="listQuery1.key" placeholder="请输入key" clearable @keyup.enter.native="topSearch" @change="topSearch">
        <el-button slot="append" type="primary" icon="el-icon-search" @click="topSearch" />
      </el-input>
      <span id="advancedSearchBtn" />
    </div>
    <div id="topBtn">
      <el-button type="primary" @click="add"><i class="iconfont iconzengjia" />新增</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="key" min-width="140" show-overflow-tooltip prop="key" />
      <el-table-column label="数据类型" min-width="100" align="center" show-overflow-tooltip prop="type" />
      <el-table-column class-name="status-col" label="值" min-width="200" align="center" show-overflow-tooltip prop="value" />
      <el-table-column class-name="status-col" label="操作" width="160" align="center" fixed="right" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button size="mini" @click="edit(scope.row)"><i class="iconfont iconxiugai" />修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="get_list" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { findTheUseConfig } from '@/api/global-config'

export default {
  components: { Pagination },
  data() {
    return {
      popoverVisible: false, // 高级搜索是否显示
      total: 0, // 总条数
      listQuery: { // 查询条件
        currentPage: 1, // 当前页
        pageSize: 10, // 当前页请求条数
        key: '' // key
      },
      listQuery1: { // 查询条件
        currentPage: 1, // 当前页
        pageSize: 10, // 当前页请求条数
        key: '' // key
      },
      list: [], // 表格数据
      listLoading: true // 表格是否开启遮罩
    }
  },
  created() {
    this.get_list()
  },
  methods: {
    // 获取列表数据
    get_list() {
      this.listLoading = true
      findTheUseConfig(this.listQuery).then(res => {
        this.list = []
        this.type = 'string'
        for (var key in res.data) {
          this.type = this.getJsonObjType(res.data[key], key)
          this.list.push({ key: key, value: JSON.stringify(res.data[key]), type: this.type })
        }
        this.listLoading = false
      })
    },
    /**
     * 从json对象的值判断对象是什么类型的, key可以不传值, 仅用于打印日志查看信息
     */
    getJsonObjType(oneValue, key) {
      var type = 'object'
      if (oneValue instanceof Number || typeof (oneValue) === 'number') {
        type = 'number'
      } else if (oneValue instanceof String || typeof (oneValue) === 'string') {
        type = 'string'
      } else if (oneValue instanceof Boolean || typeof (oneValue) === 'boolean') {
        type = 'boolean'
      } else if (oneValue instanceof Array) {
        type = 'array'
      } else if (oneValue instanceof Object) {
        type = 'object'
      } else {
        // console.log(key + ' -- noType :' + oneValue + ', typeof: ' + typeof (oneValue))
      }
      return type
    },
    // 搜索
    topSearch() {
      this.listQuery = JSON.parse(JSON.stringify(this.listQuery1))
      if (this.listQuery.key) {
        var arr = []
        this.list.forEach(item => {
          if (item.key.indexOf(this.listQuery.key) > -1) {
            arr.push(item)
          }
        })
        this.list.length = 0
        this.list = arr
      } else {
        this.get_list()
      }
    },
    // 新增
    add() {
      this.$router.push({ path: '/global-config/add' })
    },
    // 编辑
    edit(row) {
      this.$router.push({ path: '/global-config/edit', query: { key: row.key, value: row.value, type: row.type }})
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
