<template>
  <div class="selectFile">
    <el-dialog
      v-el-drag-dialog
      title="选择标签"
      :visible.sync="selectLabelsVisible"
      width="1080px"
      @close="cancel"
    >
      <div id="topSearch">
        <el-form ref="form" :model="listQuery" label-width="100px">
          <el-form-item label="标签名称">
            <el-input
              v-model="listQuery.content"
              placeholder="请输入标签名称"
              clearable
              @keyup.enter.native="get_list"
            />
          </el-form-item>
          <el-form-item label="创建时间" class="time_range">
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
          <el-button type="primary" @click="get_list">搜索</el-button>
          <el-button type="primary" @click="save">保存</el-button>
        </div>
      </div>
      <el-table
        ref="multipleTable"
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
        @selection-change="select_fn"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column label="序号" min-width="55" align="center">
          <template slot-scope="scope">
            <span>{{
              scope.$index +
                (listQuery.currentPage - 1) * listQuery.pageSize +
                1
            }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="标签名称"
          show-overflow-tooltip
          prop="lname"
        />
        <el-table-column
          align="center"
          label="小组"
          min-width="100"
          show-overflow-tooltip
          prop="groupName"
        />
        <el-table-column
          label="描述"
          min-width="100"
          align="center"
          show-overflow-tooltip
          prop="ldesc"
        />
        <el-table-column
          align="center"
          label="创建时间"
          min-width="130"
          show-overflow-tooltip
          prop="c_time"
        />
      </el-table>
      <div class="clearfix">
        <pagination
          v-show="total > 0"
          :total="total"
          :page-sizes="[]"
          :page.sync="listQuery.currentPage"
          :limit.sync="listQuery.pageSize"
          @pagination="get_list"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getLabelList } from '@/api/evaluatingManage-labelManage.js'
import Pagination from '@/components/Pagination'
import elDragDialog from '@/directive/el-drag-dialog'
export default {
  name: 'AddEvalLabels',
  components: { Pagination },
  directives: { elDragDialog },
  props: {
	  visible2: {
      type: Boolean,
      default: false
    },
    currentLabels: {
      type: Array,
      default: null
    },
    selectCompanyId: {
      type: String,
      default: ''
    },
    egroup: {
      type: [Number, String],
      default: 0
    }
  },
  data() {
    return {
      selectLabelsVisible: false,
      listLoading: false,
      listQuery: {
        currentPage: 1, // 当前页码
        pageSize: 10, // 当前列表请求条数
        startTime: '', // 开始时间
        endtTime: '', // 结束时间
        content: '', // 标签名称
        selectCompanyId: this.selectCompanyId, // 所属租户
        egroup: this.egroup * 1 // 所属小组
      },
      group_list: [], // 所属小组list
      custom_list: [], // 所属租户list
      time_range: [],
      checkedList: [], // 选中的数据
      list: [], // 列表数据
      total: 0 // 总条数
    }
  },
  watch: {
    visible2: function(val, val2) {
      if (val) {
        this.get_list()
      }
    }
  },
  methods: {
    // 监听三组数据变化
    tenantsGroupsRolesVal(val) {
      this.listQuery.selectGroupId = val.companyIds
      this.listQuery.egroup = val.egroupId
      this.listQuery.roleId = val.roleId
      this.group = val.group
    },
    // 获取标签列表
    get_list() {
      this.time_range = this.time_range || []
      this.listQuery.startTime = this.time_range[0]
      this.listQuery.endtTime = this.time_range[1]
      this.listLoading = true
      getLabelList(this.listQuery).then(response => {
        this.listLoading = false
        this.list = response.data.page.list
        this.total = response.data.page.totalCount
        this.selectLabelsVisible = true
        this.$nextTick(() => {
          this.currentLabels = this.currentLabels || []
          for (var i = 0, len = this.currentLabels.length; i < len; i++) {
            var item1 = this.currentLabels[i]
            for (var j = 0, len2 = this.list.length; j < len2; j++) {
              var item2 = this.list[j]
              if (item1._id === item2._id && this.visible2) {
                this.$refs.multipleTable.toggleRowSelection(this.list[j], true)
                break
              }
            }
          }
        })
      })
    },
    // 选中数据
    select_fn(row) {
      this.checkedList = row
    },
    // 确定
    save() {
      const checkList = this.checkedList
      this.$emit('addLabels', checkList)
      this.selectLabelsVisible = false
      this.$emit('visible2', { visible: false })
    },
    // 取消
    cancel() {
      this.selectLabelsVisible = false
      this.$emit('visible2', { visible: false })
    }
  }
}
</script>

<style scoped>
  /deep/ .el-dialog__wrapper .el-dialog__body {
    padding: 10px 20px 0 20px;
  }
#topSearch /deep/ .el-form {
  width: calc(100% - 128px);
  float: left;
  margin-right: 6px;
}
</style>
