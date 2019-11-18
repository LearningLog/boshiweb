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
                  <el-option :value="1" label="直播课堂" />
                  <el-option :value="2" label="点播课堂" />
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
      <el-button type="primary" @click="save"><i class="iconfont iconbaocun" />保存</el-button>
    </div>
    <el-table
      ref="chapterList"
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      @select-all="selectAll"
      @select="handleselectRow"
    >
      <el-table-column
        type="selection"
        width="50"
        fixed
      />
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
      <el-table-column class-name="status-col" label="标签" min-width="100" align="center" prop="labelNames" />
      <el-table-column class-name="status-col" label="课堂数" min-width="64" align="center" prop="chapter_count" />
      <!--<el-table-column class-name="status-col" label="开始时间" min-width="130" align="center" prop="s_time" />-->
      <el-table-column class-name="status-col" label="专题评价" min-width="150" align="center">
        <template slot-scope="scope">
          <span>
            <el-rate
              v-if="scope.row.general_level"
              v-model="scope.row.general_level"
              disabled
              show-score
              text-color="#ff9900"
            />
          </span>
          <span v-if="!scope.row.general_level && scope.row.general_level !== 0">--</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="小组" min-width="120" align="center" prop="groupName" />
      <el-table-column align="center" label="创建时间" min-width="130" prop="c_time" />
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="get_list" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { chapetrList } from '@/api/live-telecast-manage'
import { selectChaptersToLesson } from '@/api/thematic-class'
export default {
  components: { Pagination },
  data() {
    return {
      total: 0, // 总条数
      listQuery: { // 查询条件
        currentPage: 1, // 当前页
        pageSize: 10, // 当前页请求条数
        type: null, // 课堂类型
        cname: '', // 课堂名称
        startTime: '', // 开始时间
        endTime: '', // 开始时间
        selectCompanyId: '' // 租户
      },
      lesson_id: '', // 专题id
      time_range: [], // 创建时间
      list: [], // 表格数据
      listLoading: true, // 是否开启表格遮罩
      popoverVisible: false, // 是否开启高级搜索
      selectObj: {} // 选中行数据
    }
  },
  created() {
    this.lesson_id = this.$route.query.lesson_id
    this.listQuery.selectCompanyId = this.$route.query.selectCompanyId
    this.get_list()
  },
  methods: {
    // 获取初始化数据
    get_list() {
      this.listLoading = true
      this.time_range = this.time_range || []
      this.listQuery.startTime = this.time_range[0]
      this.listQuery.endTime = this.time_range[1]
      chapetrList(this.listQuery).then(response => {
        this.listLoading = false
        this.list = response.data.page.list
        this.total = response.data.page.totalCount

        this.$nextTick(() => {
          var chapterList = []
          for (var key in this.selectObj) {
            chapterList.push(this.selectObj[key])
          }
          for (var i = 0, len = chapterList.length; i < len; i++) {
            var item1 = chapterList[i]
            for (var j = 0, len2 = this.list.length; j < len2; j++) {
              var item2 = this.list[j]
              if (item1._id === item2._id) {
                this.$refs.chapterList.toggleRowSelection(this.list[j], true)
                break
              }
            }
          }
        })
      })
    },

    // 搜索
    topSearch() {
      this.get_list()
    },

    // 重置
    reset() {
      this.listQuery.cname = ''
      this.listQuery.selectCompanyId = ''
      this.time_range = []
      this.listQuery.startTime = ''
      this.listQuery.endTime = ''
      this.get_list()
    },

    // 表格全选事件
    selectAll(selection) {
      if (selection.length > 1) {
        this.addRows(selection)
      } else {
        this.removeRows(this.list)
      }
    },

    // 行选中函数  若有删除，若无添加
    handleselectRow(selection, row) {
      if (this.selectObj[row._id]) {
        delete this.selectObj[row._id]
      } else {
        this.selectObj[row._id] = row
      }
    },

    // 添加选中行
    addRows(selection) {
      selection.forEach(row => {
        this.selectObj[row._id] = row
      })
    },

    // 取消选中行
    removeRows(selection) {
      selection.forEach(row => {
        if (this.selectObj[row._id]) {
          delete this.selectObj[row._id]
        }
      })
    },

    // 保存
    save() {
      var chapter_ids = []
      for (var key in this.selectObj) {
        chapter_ids.push(key)
      }
      selectChaptersToLesson({ chapter_ids: chapter_ids, lesson_id: this.lesson_id }).then(res => {
        this.$message.success('保存成功！')
        this.$router.push({ path: '/online-class/thematic-class/thematic-manage', query: { _id: this.lesson_id, selectCompanyId: this.listQuery.selectCompanyId }})
      })
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
