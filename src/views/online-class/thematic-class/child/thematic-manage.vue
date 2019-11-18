<template>
  <div class="tenant-list-box">
    <div id="topSearch">
      <el-input v-model="listQuery.cname" placeholder="请输入课程名称" clearable @keyup.enter.native="topSearch">
        <el-button slot="append" type="primary" icon="el-icon-search" @click="topSearch" />
      </el-input>
      <span id="advancedSearchBtn" slot="reference" @click="popoverVisible = !popoverVisible">高级搜索<i v-show="popoverVisible" class="el-icon-caret-bottom" /><i v-show="!popoverVisible" class="el-icon-caret-top" /></span>
      <transition name="fade-advanced-search">
        <el-row v-show="popoverVisible">
          <el-card id="advancedSearchArea" shadow="never">
            <el-form ref="form" :model="listQuery" label-width="100px">
              <el-form-item label="课程类型">
                <el-select
                  v-model="listQuery.type"
                  placeholder="请选择课程类型"
                  clearable
                  filterable
                >
                  <el-option :value="1">直播课堂</el-option>
                  <el-option :value="2">点播课堂</el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="创建时间">
                <el-date-picker
                  v-model="time_range"
                  type="daterange"
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
    <div id="topBtn">
      <el-button type="primary" @click="add"><i class="iconfont iconjia" />新增</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="课堂封面" min-width="166">
        <template slot-scope="scope">
          <el-image
            class="thumbnail-online-class"
            :src="scope.row.cover_pic"
            fit="contain"
          />
        </template>
      </el-table-column>
      <el-table-column align="center" label="课堂名称" min-width="120">
        <template slot-scope="scope">
          <el-link type="primary" @click="detail(scope.row)">{{ scope.row.lesson_name }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="课堂类型" min-width="80" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.type === 1 ? '直播课堂' : '点播课堂' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建人" min-width="100" prop="userNickName" />
      <el-table-column class-name="status-col" label="操作" width="230" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" @click="edit(scope.row)"><i class="iconfont iconxiugai" />修改</el-button>
          <el-button size="mini" @click="del(scope.row)"><i class="iconfont iconshanchu" />删除</el-button>
          <el-button size="mini" @click="remove(scope.row)"><i class="iconfont iconshanchu" />移除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="get_list" />
    <AddSelectGroup :visible-select-group="visibleSelectGroup" :is-render-group="false" title="选择租户" @getSelectGroup="getSelectGroup" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import AddSelectGroup from '@/components/AddSelectGroup'
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
import { findChapterListForLesson, removeOneChapterInLesson } from '@/api/thematic-class'
import { chapetr_del } from '@/api/live-telecast-manage'
export default {
  components: { Pagination, AddSelectGroup },
  directives: { elDragDialog },
  data() {
    return {
      visibleSelectGroup: false, // 是否弹出选择租户、小组
      total: 0, // 总条数
      listQuery: { // 查询条件
        currentPage: 1, // 当前页
        pageSize: 10, // 当前页请求条数
        lesson_id: '', // 专题id
        type: null, // 课堂类型
        cname: '', // 课堂名称
        startTime: '', // 开始时间
        endTime: '' // 开始时间
      },
      time_range: [], // 创建时间
      list: [], // 表格数据
      listLoading: true, // 是否开启表格遮罩
      popoverVisible: false // 是否开启高级搜索
    }
  },
  created() {
    this.listQuery.lesson_id = this.$route.query._id
    this.get_list()
  },
  methods: {
    // 获取初始化数据
    get_list() {
      this.listLoading = true
      this.time_range = this.time_range || []
      this.listQuery.startTime = this.time_range[0]
      this.listQuery.endTime = this.time_range[1]
      findChapterListForLesson(this.listQuery).then(response => {
        this.listLoading = false
        this.list = response.data.page.list
        this.total = response.data.page.totalCount
      })
    },

    // 搜索
    topSearch() {
      this.get_list()
    },

    // 重置
    reset() {
      this.listQuery.cname = ''
      this.listQuery.type = ''
      this.time_range.length = 0
      this.listQuery.startTime = ''
      this.listQuery.endTime = ''
      this.get_list()
    },

    // 新增
    add() {
      if (!this.$store.state.user.isSystemManage) {
        this.$router.push({ path: '/online-class/thematic-class/add' })
      } else {
        this.visibleSelectGroup = true
      }
    },

    // 监听选择小组返回数据
    getSelectGroup(val) {
      this.visibleSelectGroup = false
      if (this.egroup) {
        this.$router.push({ path: '/online-class/thematic-class/add', query: { selectCompanyId: val.selectCompanyId }})
      }
    },

    // 修改
    edit(row) {
      this.$router.push({ path: '/online-class/thematic-class/edit', query: { _id: row._id }})
    },

    // 删除
    del(row) {
      this.$confirm('确定要删除【' + row.cname + '】吗？', '删除课程', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        chapetr_del({ _id: row._id }).then(response => {
          this.$message.success('删除成功！')
          if ((this.list.length - 1) === 0) { // 如果当前页数据已删完，则去往上一页
            this.listQuery.currentPage -= 1
          }
          this.get_list()
        })
      }).catch(() => {})
    },

	  // 移除
    remove(row) {
      this.$confirm('确定要移除【' + row.cname + '】吗？', '移除课程', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        removeOneChapterInLesson({ _id: row._id }).then(response => {
          this.$message.success('移除成功！')
          if ((this.list.length - 1) === 0) { // 如果当前页数据已删完，则去往上一页
            this.listQuery.currentPage -= 1
          }
          this.get_list()
        })
      }).catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
	.setInformationDialog /deep/ .el-transfer {
		margin: 0 auto;
		text-align: center;
	}
	.setInformationDialog /deep/ .el-transfer-panel {
		text-align: left;
	}
	img.logoImg {
		width: 120px;
		height: auto;
	}
	.el-table /deep/ .el-table__body tr {
		height: 90px!important;
	}

</style>
