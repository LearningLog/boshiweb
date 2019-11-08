<template>
  <div class="app-container">
    <div id="topSearch">
      <el-input v-model="listQuery.content" placeholder="请输入操作日志信息" clearable @keyup.enter.native="topSearch">
        <el-button slot="append" type="primary" icon="el-icon-search" @click="topSearch" />
      </el-input>
      <span id="advancedSearchBtn" slot="reference" @click="popoverVisible = !popoverVisible">高级搜索<i v-show="popoverVisible" class="el-icon-caret-bottom" /><i v-show="!popoverVisible" class="el-icon-caret-top" /></span>
      <transition name="fade-advanced-search">
        <el-row v-show="popoverVisible">
          <el-card id="advancedSearchArea" shadow="never">
            <el-form ref="form" :model="listQuery" label-width="100px">
              <tenants-groups-roles :is-render-role="false" :isReset="isReset" @tenantsGroupsRolesVal="tenantsGroupsRolesVal" />
              <el-form-item label="模块名称">
                <el-select v-model="listQuery.egroup" placeholder="请选择模块" clearable filterable>
                  <el-option
                    v-for="item in moduleList"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                  />
                </el-select>
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
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="消息内容" min-width="250" show-overflow-tooltip prop="content" />
      <el-table-column label="操作类型" min-width="90" align="center" show-overflow-tooltip prop="noticeTypeDesc" />
      <el-table-column class-name="status-col" label="操作模块" min-width="60" align="center" show-overflow-tooltip prop="moduleName" />
      <el-table-column align="center" label="操作人" min-width="70" show-overflow-tooltip prop="userNickName" />
      <el-table-column align="center" label="小组" min-width="100" show-overflow-tooltip prop="groupNameDesc" />
      <el-table-column align="center" label="操作时间" min-width="130" show-overflow-tooltip prop="createTime" />
      <el-table-column align="center" label="发送人数" min-width="50" show-overflow-tooltip prop="successCount">
        <template slot-scope="scope">
          <!--<span class="pointer underline" @click="operateDetail(scope.row)">{{ scope.row.successCount }}</span>-->
          <el-link type="warning" @click="operateDetail(scope.row)">{{ scope.row.successCount }}</el-link>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="get_list" />
    <el-dialog v-el-drag-dialog title="操作人详情" :visible.sync="dialogTableVisible" @close="closeDetail">
      <div id="topSearch2">
        <el-form ref="form" :model="listQuery2" label-width="100px">
          <el-form-item label="状态">
            <el-select v-model="listQuery2.smsStatus" placeholder="请选择状态" clearable filterable @change="operateDetail">
              <el-option
                v-for="item in smsStatusList"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <el-table
        v-loading="listLoading"
        :data="list2"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
      >
        <el-table-column prop="userNickName" label="接收人" min-width="90" />
        <el-table-column prop="groupNameDesc" label="小组" min-width="120" />
        <el-table-column prop="smsStatusDesc" label="短信发送状态" min-width="50" />
      </el-table>
      <div class="clearfix">
        <pagination
          v-show="total2 > 0"
          :total="total2"
          :page.sync="listQuery2.currentPage"
          :limit.sync="listQuery2.pageSize"
          @pagination="operateDetail"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { getNoticeList, getNoticeDetail } from '@/api/operate-log'
import elDragDialog from '@/directive/el-drag-dialog'
import TenantsGroupsRoles from '@/components/TenantsGroupsRoles'

export default {
  directives: { elDragDialog },
  components: { Pagination, TenantsGroupsRoles },
  data() {
    return {
      isReset: false, // 是否重置三组联动数据
      popoverVisible: false, // 高级搜索是否显示
      total: 0, // 总条数
      listQuery: { // 查询条件
        currentPage: 1, // 当前页
        pageSize: 10, // 当前页请求条数
        content: null, // 消息内容
        noticeType: null, // 操作模块
        selectCompanyId: null, // 租户id
        module: null, // 模块标识
        egroup: [] // 小组id
      },
      total2: 0,
      listQuery2: { // 查询条件
        currentPage: 1, // 当前页
        pageSize: 10, // 当前页请求条数
        noticeId: null, // 短信id
        smsStatus: null// 短息发送状态
      },
      list: [], // 表格数据
      list2: [], // 操作人详情数据
      custom_list: [], // 租户列表
      group_list: [], // 小组列表
      smsStatusList: [{ value: 0, name: '未发送' }, { value: 1, name: '发送中' }, { value: 4, name: '成功' }, { value: 3, name: '失败' }], // 短信状态列表
      moduleList: [{ value: 'examination_exam', name: '考试管理' }, { value: 'stream_train_classroom', name: '直播课堂' }], // 模块名称列表
      listLoading: true, // 表格是否开启遮罩
      dialogTableVisible: false
    }
  },
  created() {
    this.get_list()
  },
  methods: {
    // 获取列表数据
    get_list() {
      this.listLoading = true
      getNoticeList(this.listQuery).then(response => {
        this.list = response.data.page.list
        this.total = response.data.page.totalCount
        this.listLoading = false
      })
    },
    // 搜索
    topSearch() {
      this.get_list()
    },
    // 重置
    reset() {
      this.isReset = true
      this.listQuery.content = ''
      this.listQuery.noticeType = ''
      this.listQuery.egroup = ''
      this.selectCompanyId = ''
      this.get_list()
    },
    // 操作人详情
    operateDetail(data) {
      this.listLoading = true
      this.listQuery2.noticeId = data.noticeId
      getNoticeDetail(this.listQuery2).then(response => {
        this.list2 = response.data.page.list
        this.total2 = response.data.page.totalCount
        this.listLoading = false
        this.dialogTableVisible = true
      })
    },
    // 监听三组数据变化
    tenantsGroupsRolesVal(val) {
      this.listQuery.selectGroupId = val.companyIds
      this.listQuery.egroup = val.egroupId
    },
    closeDetail() {
      this.listQuery2.smsStatus = ''
    }
  }
}
</script>
<style>
  #topSearch2 /deep/ .el-form {
    width: calc(100% - 128px);
    float: left;
    margin-right: 6px;
  }
</style>
