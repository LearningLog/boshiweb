<template>
  <div class="list-box">
    <div id="topSearch">
      <el-input v-model="listQuery.groupName" placeholder="请输入分组名称" clearable @keyup.enter.native="topSearch">
        <el-button slot="append" type="primary" icon="el-icon-search" @click="topSearch" />
      </el-input>
      <span id="advancedSearchBtn" slot="reference" @click="popoverVisible = !popoverVisible">高级搜索<i v-show="popoverVisible" class="el-icon-caret-bottom" /><i v-show="!popoverVisible" class="el-icon-caret-top" /></span>
      <transition name="fade-advanced-search">
        <el-row v-show="popoverVisible">
          <el-card id="advancedSearchArea" shadow="never">
            <el-form ref="form" :model="listQuery" label-width="100px">
              <el-form-item label="创建人">
                <el-input v-model="listQuery.creater" placeholder="请输入创建人" clearable @keyup.enter.native="topSearch" />
              </el-form-item>
              <el-form-item label="所属租户">
                <el-input v-model="listQuery.customname" placeholder="请输入所属租户" clearable @keyup.enter.native="topSearch" />
              </el-form-item>
              <el-form-item label="创建时间">
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
      @selection-change="select_fn"
    >
      <el-table-column
        type="selection"
        width="55"
        :selectable="selectable"
      />
      <el-table-column align="center" label="名称" show-overflow-tooltip>
        <template slot-scope="scope">
          <span class="pointer" @click="detail(scope.row)">{{ scope.row.groupName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述" min-width="100" align="center" show-overflow-tooltip prop="desc" />
      <el-table-column align="center" label="创建时间" min-width="130" show-overflow-tooltip prop="createtime" />
      <el-table-column align="center" label="所属企业" min-width="140" show-overflow-tooltip prop="customname" />
      <el-table-column align="center" label="管理员" min-width="140" show-overflow-tooltip prop="customname" />
      <el-table-column align="center" label="来源" min-width="140" show-overflow-tooltip prop="dataTypeName" />
      <el-table-column align="center" label="成员人数" min-width="140" show-overflow-tooltip prop="usercount" />
      <el-table-column class-name="status-col" label="操作" width="250" align="center" fixed="right" show-overflow-tooltip>
        <template slot-scope="scope">
          <div>
            <el-button size="mini" @click="go_edit_fn(scope.row)"><i class="iconfont iconxiugai" />修改</el-button>
            <el-button size="mini" @click="delete_fn(scope.row)"><i class="iconfont iconshanchu" />删除</el-button>
            <el-button size="mini" @click.native="getInformation(scope.row)"><i class="iconfont iconshouquan" />分配技能</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="get_list" />
    <div id="bottomOperation">
      <el-button v-show="total>0" type="danger" plain @click="batch_del_fn"><i class="iconfont iconshanchu" />批量删除</el-button>
    </div>

    <el-dialog v-el-drag-dialog class="setInformationDialog" width="650px" title="分配技能" :visible.sync="transforBoxVisible">
      <el-transfer v-model="hasList" :data="noList" :titles="['未分配类别', '已分配类别']" :props="defaultProps" @change="handleTransferChange" />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="setInformation">确定</el-button>
        <el-button @click="transforBoxVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { findEmployeeGroupList, deleteItem, deleteMultiRole, egroupskill, saveGroupSkill } from '@/api/userCenter-groupManage'
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
  components: { Pagination },
  directives: { elDragDialog },
  data() {
    return {
      listLoading: false,
      transforBoxVisible: false, // 穿梭框显示隐藏
      noList: [], // 穿梭框未分配
      hasList: [], // 穿梭框已分配
      setInformationId: '',
      defaultProps: { // 穿梭框节点别名
        key: 'increase_id',
        label: 'skill_name'
      },
      listQuery: {
        currentPage: 1, // 当前页码
        pageSize: 10, // 当前列表请求条数
        groupName: '', // 分组名称
        creater: '', // 创建人
        startTime: '', // 开始时间
        endtTime: '', // 结束时间
        customname: '' // 所属租户
      },
      time_range: [],
      delCheckedList: [], // 选中的数据
      list: null, // 列表数据
      total: 0, // 总条数
      popoverVisible: false // 高级搜索是否展开
    }
  },
  created() {
    this.get_list()
  },
  methods: {
    // 搜索
    topSearch() {
      this.get_list()
    },
    // 重置
    reset() {
      this.listQuery.groupName = ''
      this.listQuery.creater = ''
      this.listQuery.startTime = ''
      this.listQuery.endtTime = ''
      this.time_range = []
      this.listQuery.customname = ''
      this.get_list()
    },
    // 获取分组列表
    get_list() {
      this.time_range = this.time_range || []
      this.listQuery.startTime = this.time_range[0]
      this.listQuery.endtTime = this.time_range[1]
      this.listLoading = true
      findEmployeeGroupList(this.listQuery).then(response => {
        this.listLoading = false
        this.list = response.data.page.list
        this.total = response.data.page.totalCount
      })
    },
    selectable(row, index) {
      return row.auth
    },
    // 修改
    go_edit_fn(row) {
      this.$router.push({ path: '/user-center/group-manage/edit', query: { id: row._id }})
    },
    // 详情
    detail(row) {
      this.$router.push({ path: '/user-center/group-manage/detail', query: { id: row._id }})
    },
    // 新增
    add() {
      this.$router.push({ path: '/user-center/group-manage/add' })
    },
    // 删除单个分组
    delete_fn(row) {
      this.$confirm('确定要删除【' + row.groupName + '】吗？', '删除分组', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteItem({ _id: row._id }).then(response => {
          this.$message.success('删除成功！')
          if ((this.list.length - 1) === 0) { // 如果当前页数据已删完，则去往上一页
            this.listQuery.currentPage -= 1
          }
          this.get_list()
        })
      }).catch(() => {})
    },
    // 选中数据
    select_fn(row) {
      this.delCheckedList = row
    },
    // 批量删除
    batch_del_fn() {
      if (!this.delCheckedList.length) {
        this.$message.warning('请选择分组！')
        return false
      }
      this.$confirm('确定要删除选中的分组吗？', '批量删除分组', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const _ids = []
        this.delCheckedList.forEach(item => {
          _ids.push(item._id)
        })
        deleteMultiRole({ _ids: _ids }).then(response => {
          this.$message.success('批量删除成功！')
          if ((this.list.length - this.delCheckedList.length) === 0) { // 如果当前页数据已删完，则去往上一页
            this.listQuery.currentPage -= 1
          }
          this.get_list()
        })
      }).catch(() => {})
    },

    // 授权
    // 穿梭框
    getInformation(row) {
      this.setInformationId = row._id
      egroupskill({ _id: row._id }).then(response => {
        console.log(response)
        this.noList = response.data.noList.concat(response.data.hasList)
        response.data.hasList.forEach((item, index) => {
          this.hasList.push(item.increase_id)
        })
      })
      this.transforBoxVisible = true
    },
    handleTransferChange(value, direction, movedKeys) {
      this.hasList = value
    },
    // 设置资讯
    setInformation() {
      const data = { _id: this.setInformationId, skillinfo: this.hasList.join() }
      saveGroupSkill(data).then(response => {
        this.transforBoxVisible = false
        this.noList = []
        this.hasList = []
        this.$message.success('设置技能成功！')
        this.get_list()
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
</style>
