<template>
  <div class="list-box">
    <div id="topSearch">
      <el-input v-model="listQuery.userName" placeholder="请输入用户名称" clearable @keyup.enter.native="topSearch">
        <el-button slot="append" type="primary" icon="el-icon-search" @click="topSearch" />
      </el-input>
      <span id="advancedSearchBtn" slot="reference" @click="popoverVisible = !popoverVisible">高级搜索<i v-show="popoverVisible" class="el-icon-caret-bottom" /><i v-show="!popoverVisible" class="el-icon-caret-top" /></span>
      <transition name="fade-advanced-search">
        <el-row v-show="popoverVisible">
          <el-card id="advancedSearchArea" shadow="never">
            <el-form ref="form" :model="listQuery" label-width="100px">
              <el-form-item label="用户昵称">
                <el-input v-model="listQuery.nickName" placeholder="请输入用户昵称" clearable @keyup.enter.native="topSearch" />
              </el-form-item>
              <el-form-item label="手机号">
                <el-input v-model="listQuery.phone" placeholder="请输入手机号" clearable @keyup.enter.native="topSearch" />
              </el-form-item>
              <el-form-item label="用户状态">
                <el-select v-model="listQuery.userStatus" placeholder="请选择用户状态" clearable @keyup.enter.native="topSearch">
                  <el-option v-for="item in userStatus" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
              </el-form-item>
              <tenants-groups-roles :is-reset="isReset" @tenantsGroupsRolesVal="tenantsGroupsRolesVal" @resetVal="resetVal" />
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
      <el-button type="primary" @click="add"><i class="iconfont iconzengjia" />新增</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
        fixed
      />
      <el-table-column align="center" label="用户名" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-link type="primary" @click="detail(scope.row)">{{ scope.row.username }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="昵称" min-width="100" align="center" show-overflow-tooltip prop="nickname" />
      <el-table-column label="手机号" min-width="80" align="center" show-overflow-tooltip prop="phone" />
      <el-table-column align="center" label="角色" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.bs_roles }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="组别" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.egroups }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" min-width="60" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-tag v-if="scope.row.userStatus === 1" type="success">生效</el-tag>
          <el-tag v-else type="danger">失效</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="来源" min-width="90" align="center" show-overflow-tooltip prop="dataTypeName" />
      <el-table-column class-name="status-col" label="操作" width="230" align="center" fixed="right" show-overflow-tooltip>
        <template slot-scope="scope">
          <div v-if="scope.row.auth">
            <el-button size="mini" @click="go_edit_fn(scope.row)"><i class="iconfont iconxiugai" />修改</el-button>
            <el-button v-if="scope.row.userStatus === 1" size="mini" @click="enable(scope.row, 2)"><i class="iconfont iconshixiao" />失效</el-button>
            <el-button v-else size="mini" @click="enable(scope.row, 1)"><i class="iconfont iconshengxiao" />生效</el-button>
            <el-button size="mini" @click="del(scope.row)"><i class="iconfont iconshanchu" />删除</el-button>
          </div>
          <div v-else>
            <el-button size="mini" :disabled="true"><i class="iconfont iconxiugai" />修改</el-button>
            <el-button v-if="scope.row.userStatus === 1" size="mini" :disabled="true"><i class="iconfont iconshixiao" />失效</el-button>
            <el-button v-else size="mini" :disabled="true"><i class="iconfont iconshengxiao" />生效</el-button>
            <el-button size="mini" :disabled="true"><i class="iconfont iconshanchu" />删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="get_list" />
    <div id="bottomOperation">
      <a href="basicUser/img/import_user_ttemplates.xlsx" download="企业员工导入模版.xlsx">
        <el-button v-show="total>0" type="primary" plain><i class="iconfont iconxiazai" />模板下载</el-button>
      </a>
      <el-upload
        class="upload-demo"
        :action="uploadUrl()"
        :headers="headers"
        accept=".xlsx,.xls"
        :show-file-list="false"
        :on-success="handleUploadSuccess"
      >
        <el-button v-show="total>0" type="primary" plain><i class="iconfont iconziyuan" />模板导入</el-button>
      </el-upload>
      <el-button v-show="total>0" type="primary" plain @click="assignRole"><i class="iconfont iconfenpeijuese" />分配角色</el-button>
      <el-button v-show="total>0" type="primary" plain @click="groupsManage"><i class="iconfont iconzengjia" />小组管理</el-button>
    </div>
    <el-dialog v-el-drag-dialog class="setRolesDialog" width="650px" title="分配角色" :visible.sync="setRolesDialogVisible">
      <el-transfer v-model="roleIdList" :data="noList" :titles="['未分配角色', '已分配角色']" :props="defaultProps" @change="handleTransferChange" />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="setRoles">确定</el-button>
        <el-button @click="setRolesDialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog v-el-drag-dialog class="setRolesDialog" width="650px" title="分配小组" :visible.sync="setEgroupsDialogVisible">
      <el-transfer v-model="einc" class="setEgroups" :data="noList2" :titles="['未分配小组', '已分配小组']" :props="defaultProps2" @change="handleTransferChange2" />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="setEgroups">确定</el-button>
        <el-button @click="setEgroupsDialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      v-el-drag-dialog
      title="错误原因"
      :visible.sync="dialogVisible"
    >
      <el-table
        :data="errorList"
        style="width: 100%"
      >
        <el-table-column
          prop="name"
          label="姓名"
          align="center"
          show-overflow-tooltip
          min-width="120"
        />
        <el-table-column
          prop="phone"
          label="手机号"
          align="center"
          show-overflow-tooltip
          min-width="80"
        />
        <el-table-column
          prop="egroup"
          label="部门"
          align="center"
          show-overflow-tooltip
          min-width="100"
        />
        <el-table-column
          prop="role"
          label="角色"
          align="center"
          show-overflow-tooltip
          min-width="100"
        />
        <el-table-column
          prop="error_log"
          label="失败原因"
          align="center"
          min-width="100"
        />
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { getUserList, deleteUser, updateUserStatus, leadingIn, batchAssignRole, batchGroupsManage } from '@/api/userCenter-userManage'
import { getAllRole } from '@/api/systemManage-roleManage'
import { getAllEmployeeGroup } from '@/api/userCenter-groupManage'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import TenantsGroupsRoles from '@/components/TenantsGroupsRoles'
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
import { getToken } from '@/utils/auth'
export default {
  components: { Pagination, TenantsGroupsRoles },
  directives: { elDragDialog },
  data() {
    return {
      isReset: false, // 是否重置三组联动数据
      listLoading: false,
      setRolesDialogVisible: false,
      setEgroupsDialogVisible: false,
      dialogVisible: false,
      noList: [], // 未分配的角色
      roleIdList: [], // 已分配的角色
      noList2: [], // 未分配的小组
      einc: [], // 已分配的小组
      chargemanList: [], // 已分配的小组
      defaultProps: { // 穿梭框节点别名
        key: '_id',
        label: 'rolename'
      },
      defaultProps2: { // 穿梭框节点别名
        key: 'inc',
        label: 'groupName'
      },
      headers: {
        Authorization: getToken() // 图片上传 header
      },
      errorList: [], // 导入错误列表
      listQuery: {
        currentPage: 1, // 当前页码
        pageSize: 10, // 当前列表请求条数
        userName: '', // 用户名称
        selectCompanyId: '', // 企业名称
        nickName: '', // 用户昵称,
        phone: '', // 手机号,
        roleId: '', // 角色
        egroup: '', // 分组
        userStatus: null // 用户状态
      },
      userStatus: [{ id: 1, name: '生效' }, { id: 2, name: '失效' }], // 用户状态
      checkedList: [], // 选中的数据
      list: null, // 列表数据
      total: 0, // 总条数
      popoverVisible: false // 高级搜索是否展开
    }
  },
  created() {
    this.get_list()
  },
  methods: {
    // 上传路径
    uploadUrl() {
      return process.env.VUE_APP_BASE_API + 'system/file/upload/'
    },
    // 搜索
    topSearch() {
      this.get_list()
    },
    // 重置
    reset() {
      this.isReset = true
      this.listQuery.userName = ''
      this.listQuery.selectCompanyId = ''
      this.listQuery.nickName = ''
      this.listQuery.phone = ''
      this.listQuery.roleId = ''
      this.listQuery.egroup = ''
      this.listQuery.userStatus = null
      this.get_list()
    },
    // 获取用户列表
    get_list() {
      this.listLoading = true
      getUserList(this.listQuery).then(response => {
        this.listLoading = false
        this.list = response.data.page.list
        this.total = response.data.page.totalCount
      })
    },
    // 监听三组数据变化
    tenantsGroupsRolesVal(val) {
      this.listQuery.selectCompanyId = val.companyIds
      this.listQuery.egroup = val.egroupId
      this.listQuery.roleId = val.roleId
    },
    // 监听三组数据变化
    resetVal() {
      this.isReset = false
    },
    // 是否可选择
    selectable(row, index) {
      return row.auth
    },
    // 导入成功
    handleUploadSuccess(data) {
      leadingIn({ fileId: data.data.fileId, url: data.data.saveHttpPath }).then(res => {
        if (res.data.importStatus) {
          this.$message.success('模板导入成功！')
          this.get_list()
        } else {
          this.$message.error('模板导入失败！')
          this.errorList = res.data.data
          this.dialogVisible = true
        }
      })
    },
    // 详情
    detail(row) {
      this.$router.push({ path: '/user-center/user-manage/detail', query: { id: row._id }})
    },
    // 新增
    add() {
      this.$router.push({ path: '/user-center/user-manage/add' })
    },
    // 生效/失效
    enable(row, type) {
      if (type === 2) {
        this.$confirm('失效用户将不能进行所有本系统内的操作，请问是否对该用户失效？', '失效用户', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          updateUserStatus({ _id: row._id, userStatus: type }).then(response => {
            this.$message.success('失效用户成功！')
            this.get_list()
          })
        }).catch(() => {})
      } else {
        updateUserStatus({ _id: row._id, userStatus: type }).then(response => {
          this.$message.success('生效用户成功！')
          this.get_list()
        })
      }
    },
    // 删除单个角色
    del(row) {
      this.$confirm('确定要删除【' + row.username + '】吗？', '删除用户', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUser({ _id: row._id }).then(response => {
          this.$message.success('删除成功！')
          if ((this.list.length - 1) === 0) { // 如果当前页数据已删完，则去往上一页
            this.listQuery.currentPage -= 1
          }
          this.get_list()
        })
      }).catch(() => {})
    },
    // 修改
    go_edit_fn(row) {
      this.$router.push({ path: '/user-center/user-manage/edit', query: { id: row._id }})
    },
    // 选中数据
    handleSelectionChange(row) {
      this.checkedList = row
    },
    // 获取全部角色
    assignRole() {
      if (!this.checkedList.length) {
        this.$message.warning('请选择用户！')
        return false
      }
      let companyIds = []
      this.checkedList.forEach(item => {
        companyIds.push(item.groupId)
      })
      companyIds = [...new Set(companyIds)]
      getAllRole({ companyIds }).then(response => {
        this.noList = response.data.allRoleList
        this.setRolesDialogVisible = true
      })
    },
    handleTransferChange(value, direction, movedKeys) {
      this.roleIdList = value
    },
    handleTransferChange2(value, direction, movedKeys) {
      this.einc = value
    },
    // 设置角色
    setRoles() {
      const _ids = []
      this.checkedList.forEach(item => {
        _ids.push(item._id)
      })
      batchAssignRole({ roleIdList: this.roleIdList, _ids }).then(res => {
        this.$message.success('批量分配角色成功！')
        this.setRolesDialogVisible = false
      })
    },

    // 获取所有小组
    groupsManage() {
      if (!this.checkedList.length) {
        this.$message.warning('请选择用户！')
        return false
      }
      let companyIds = []
      this.checkedList.forEach(item => {
        companyIds.push(item.groupId)
      })
      companyIds = [...new Set(companyIds)]
      getAllEmployeeGroup({}).then(response => {
        this.noList2 = response.data.allEmployeeGroupList
        this.setEgroupsDialogVisible = true
      })
    },
    // 设置小组
    setEgroups() {
      const _ids = []
      this.checkedList.forEach(item => {
        _ids.push(item._id)
      })
      batchGroupsManage({ einc: this.einc, _ids }).then(res => {
        this.$message.success('批量分配小组成功！')
        this.setEgroupsDialogVisible = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.upload-demo {
  display: inline-block;
}
.setRolesDialog /deep/ .el-transfer {
  margin: 0 auto;
  text-align: center;
}
.setRolesDialog /deep/ .el-transfer-panel {
  text-align: left;
}
</style>
