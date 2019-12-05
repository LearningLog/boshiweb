<template>
  <div class="selectFile">
    <el-dialog
      v-el-drag-dialog
      title="选择技能"
      :visible.sync="selectSkillsVisible"
      width="1080px"
      @close="cancel"
    >
      <div id="topSearch">
        <el-form ref="form" :model="listQuery" label-width="100px">
          <el-form-item label="技能名称">
            <el-input
              v-model="listQuery.content"
              placeholder="请输入技能名称"
              clearable
              @keyup.enter.native="search"
            />
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
          <el-button type="primary" @click="search">搜索</el-button>
          <el-button type="primary" @click="save">保存</el-button>
        </div>
      </div>
      <el-table
        ref="multipleTable"
        v-loading="listLoading"
        :data="list"
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
        <el-table-column align="center" label="技能名称" show-overflow-tooltip prop="skill_name" />
        <el-table-column label="技能描述" min-width="100" align="center" show-overflow-tooltip prop="skill_desc" />
        <el-table-column align="center" label="创建时间" min-width="130" show-overflow-tooltip prop="createtime" />
      </el-table>
      <div class="clearfix">
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="listQuery.currentPage"
          :limit.sync="listQuery.pageSize"
          @pagination="get_list"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { skillManagerList } from '@/api/user-center/skillManage'
import Pagination from '@/components/Pagination'
import elDragDialog from '@/directive/el-drag-dialog'
export default {
  name: 'AddEvalSkills',
  components: { Pagination },
  directives: { elDragDialog },
  props: {
    visible3: {
      type: Boolean,
      default: false
    },
    currentSkills: {
      type: Array,
      default: null
    },
    selectCompanyId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      selectSkillsVisible: false,
      listLoading: false,
      listQuery: {
        currentPage: 1, // 当前页码
        pageSize: 10, // 当前列表请求条数
        content: '', // 技能名称
        startTime: '', // 开始时间
        endTime: '', // 结束时间
        selectCompanyId: '' // 所属租户
      },
      group_list: [], // 所属小组list
      custom_list: [], // 所属租户list
      time_range: [], // 时间
      checkedList: [], // 选中的数据
      list: [], // 列表数据
      total: 0 // 总条数
    }
  },
  watch: {
    visible3: function(val, val2) {
      if (val) {
        this.get_list()
      }
    }
  },
  methods: {
    // 获取技能列表
    get_list() {
      this.time_range = this.time_range || []
      this.listQuery.startTime = this.time_range[0]
      this.listQuery.endTime = this.time_range[1]
      this.listQuery.selectCompanyId = this.selectCompanyId
      this.listLoading = true
      skillManagerList(this.listQuery).then(res => {
        this.listLoading = false
        this.list = res.data.page.list || []
        this.total = res.data.page.totalCount
        this.selectSkillsVisible = true
        this.$nextTick(() => {
          this.currentSkills = this.currentSkills || []
          for (var i = 0, len = this.currentSkills.length; i < len; i++) {
            var item1 = this.currentSkills[i]
            for (var j = 0, len2 = this.list.length; j < len2; j++) {
              var item2 = this.list[j]
              if ((item1._id === item2._id || item1.increase_id === item2.increase_id) && this.visible3) {
                this.$refs.multipleTable.toggleRowSelection(this.list[j], true)
                break
              }
            }
          }
        })
      }).catch(error => {
        console.log(error)
      })
    },

    // 搜索
    search() {
      this.time_range = this.time_range || []
      this.listQuery.currentPage = 1
      this.get_list()
    },

    // 选中数据
    select_fn(row) {
      this.checkedList = row
    },
    // 确定
    save() {
      const checkList = this.checkedList
      this.$emit('addSkills', checkList)
      this.selectSkillsVisible = false
      this.$emit('visible3', { visible: false })
    },
    // 取消
    cancel() {
      this.selectSkillsVisible = false
      this.$emit('visible3', { visible: false })
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
  #topSearch .el-date-editor.el-range-editor.el-input__inner {
    width: 350px!important;
  }
</style>
