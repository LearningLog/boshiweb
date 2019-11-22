<template>
  <div class="tenant-list-box">
    <div id="topSearch">
      <el-input v-model="listQuery.customname" placeholder="请输入租户名称" clearable @keyup.enter.native="topSearch">
        <el-button slot="append" type="primary" icon="el-icon-search" @click="topSearch" />
      </el-input>
      <span id="advancedSearchBtn" slot="reference" @click="popoverVisible = !popoverVisible">高级搜索<i v-show="popoverVisible" class="el-icon-caret-bottom" /><i v-show="!popoverVisible" class="el-icon-caret-top" /></span>
      <transition name="fade-advanced-search">
        <el-row v-show="popoverVisible">
          <el-card id="advancedSearchArea" shadow="never">
            <el-form ref="form" :model="listQuery" label-width="100px">
              <el-form-item label="创建人">
                <el-input v-model="listQuery.createUser" placeholder="请输入创建人" clearable @keyup.enter.native="topSearch" />
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
              <el-form-item label="状态">
                <el-radio v-model="listQuery.customStatus" label="1">生效</el-radio>
                <el-radio v-model="listQuery.customStatus" label="0">失效</el-radio>
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
      :data="list1"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="50"
        fixed
      />
      <el-table-column align="center" label="文件信息" min-width="150">
        <template slot-scope="scope">
          <div class="picBox">
            <img :src="scope.row.fileType=='pic'?scope.row.fileUrl:require('../../assets/images/logo.png')" alt="" width="78px">
          </div>
          <div class="objBox">
            <p class="pointer" @click="detail(scope.row)">{{ scope.row.fileName }}</p>
            <p>文件大小：{{ scope.row.fileSize }}</p>
            <p>文件格式：{{scope.row.fileType}}</p>
          </div>

        </template>
      </el-table-column>
      <el-table-column label="文件来源" min-width="90" align="center">
        <template slot-scope="scope">
          <!-- <img v-if="scope.row.pcLogoFileUrl" class="logoImg" :src="scope.row.pcLogoFileUrl" alt=""> -->
          {{ scope.row.fileSourceName }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="租户" min-width="150" align="center" prop="customSystemName">
        <template slot-scope="scope">
          <p>{{ scope.row&&scope.row.typeA?scope.row.typeA.grouName:'' }}</p>
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户" min-width="100" prop="createuser">
        <template slot-scope="scope">
          <p>{{ scope.row&&scope.row.typeA?scope.row.typeA.nickName:'' }}</p>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" min-width="120" prop="createtime">
        <template slot-scope="scope">
          <p>{{ scope.row.createTimestamp | formateTime }}---{{ listQuery.pageSize }}--{{ total }}</p>
        </template>

      </el-table-column>
      <el-table-column align="center" label="文件状态" min-width="70">
        <template slot-scope="scope">
          <p v-if="scope.row&&scope.row.typeA&&scope.row.typeA.file_status === 0" type="success">初始状态</p>
          <p v-if="scope.row&&scope.row.typeA&&scope.row.typeA.file_status === 1" type="success">正在执行</p>
          <p v-if="scope.row&&scope.row.typeA&&scope.row.typeA.file_status === 2" type="success">等待关联任务完成</p>
          <p v-if="scope.row&&scope.row.typeA&&scope.row.typeA.file_status === 3" type="success">失败</p>
          <p v-if="scope.row&&scope.row.typeA&&scope.row.typeA.file_status === 4" type="success">成功</p>

        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="操作" width="230" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" @click="edit(scope.row)"><i class="iconfont iconxiugai" />修改</el-button>
          <el-button v-if="scope.row.customStatus === 1" size="mini" @click="enable(scope.row, 0)"><i class="iconfont iconshixiao" />失效</el-button>
          <el-button v-else size="mini" @click="enable(scope.row, 1)"><i class="iconfont iconshengxiao" />生效</el-button>
          <el-dropdown trigger="click">
            <el-button size="mini">
              <i class="iconfont icongengduo" />更多
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="getInformation(scope.row)"><i class="iconfont iconzixun" />资讯</el-dropdown-item>
              <el-dropdown-item @click.native="del(scope.row)"><i class="iconfont iconshanchu" />删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="get_list" />
    <div id="bottomOperation">
      <el-button v-show="total>0" type="danger" plain @click="batchDel"><i class="iconfont iconshanchu" />批量删除</el-button>
    </div>
    <el-dialog v-el-drag-dialog class="setInformationDialog" width="650px" title="资讯管理" :visible.sync="setInformationDialogVisible">
      <el-transfer v-model="hasList" :data="noList" :titles="['未分配类别', '已分配类别']" :props="defaultProps" @change="handleTransferChange" />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="setInformation">确定</el-button>
        <el-button @click="setInformationDialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
import { getAllTenantList, delTenant, batchDelTenant, getInformationList, setInformation, setCustomStatus } from '@/api/systemManage-tenantManage'
import { fileListManage } from '@/api/work-desk'
export default {
  components: { Pagination },
  directives: { elDragDialog },
  // computed:{

  // },
  filters: {
    formateFile(val) {
      // var arr = val.split('.')
      // return arr[arr.length-1]
    },
    formateTime(val) {
      const date = new Date(val)
      const y = date.getFullYear()
      const m = date.getMonth()
      const d = date.getDay()
      const h = date.getHours()
      const n = date.getMinutes()
      const s = date.getSeconds()
      return `${y}-${m}-${d} ${h}:${n}:${s}`
    }
  },
  data() {
    return {
      form: {
        user: '',
        region: ''
      },
      total: 0, // 总条数
      listQuery: { // 查询条件
        currentPage: 1, // 当前页
        pageSize: 10, // 当前页请求条数
        customname: '', // 租户名称
        createUser: null, // 创建人
        startTime: null, // 创建开始时间
        endTime: null, // 创建结束时间
        customStatus: null // 状态
      },
      time_range: [], // 创建时间
      list: [], // 表格数据
      listLoading: true, // 是否开启表格遮罩
      popoverVisible: false, // 是否开启高级搜索
      setInformationDialogVisible: false, // 是否打开设置资讯弹窗
      noList: [], // 未分配的资讯
      hasList: [], // 已分配的资讯
      checkedDelList: [], // 选择删除的list
      defaultProps: { // 穿梭框节点别名
        key: '_id',
        label: 'newscategory_name'
      },
      setInformationId: '', // 当前设置资讯的id
      obj: {
        headers: {
          'Content-type': 'application/json'
        },
        fileName: '',
        fileStatusList: '',
        fileTypeList: '',
        pageSize: '',
        fileUseList: '',
        currentPage: '',
        startTime: '',
        endTime: '',
        selectCompanyId: '',
        selectUserId: '',
        sourceSystemList: ''
      },
      list1: [],
      sourceObj: {},
      typeA1: ''
    }
  },
  created() {
    this.get_list()

    this.getData()
  },
  methods: {
    // 获取数据
    getData() {
      fileListManage(this.obj).then(res => {
        this.list1 = res.data.page.list
        this.sourceObj = res.data.filePackageIdWorkDeskFile
        if (res && res.data && res.data.page && res.data.filePackageIdWorkDeskFile && res.data.page.list)
        // 处理数据
        {
          this.list1.forEach(item => {
            this.$set(item, 'tt', this.sourceObj[item.mainFileId])
            const obj = {
              grouName: this.sourceObj[item.mainFileId].grouName,
              nickName: this.sourceObj[item.mainFileId].nickName,
              file_status: this.sourceObj[item.mainFileId].file_status
            }
            this.$set(item, 'typeA', obj)
          })
        }
      })
    },
    // 获取初始化数据
    get_list() {
      this.listLoading = true
      fileListManage(this.listQuery).then(response => {
        this.listLoading = false
        this.list = response.data.page.list
        this.total = response.data.page.totalCount
      })
    },
    // 搜索
    topSearch() {
      this.time_range = this.time_range || []
      this.listQuery.startTime = this.time_range[0]
      this.listQuery.endTime = this.time_range[1]
      this.get_list()
    },
    // 重置
    reset() {
      this.listQuery.customname = ''
      this.listQuery.createUser = ''
      this.time_range = []
      this.listQuery.startTime = ''
      this.listQuery.endTime = ''
      this.listQuery.customStatus = ''
      this.get_list()
    },
    // 选中数据
    handleSelectionChange(row) {
      this.checkedDelList = row
    },
    // 新增
    add() {
      this.$router.push({ path: '/systemManage/tenantManage/add' })
    },
    // 详情
    detail(row) {
      this.$router.push({ path: '/systemManage/tenantManage/detail', query: { _id: row._id }})
    },
    // 单个删除
    del(row) {
      this.$confirm('确定要删除【' + row.customname + '】吗？', '删除租户', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delTenant({ _id: row._id }).then(response => {
          this.$message.success('删除成功！')
          if ((this.list.length - 1) === 0) { // 如果当前页数据已删完，则去往上一页
            this.listQuery.currentPage -= 1
          }
          this.get_list()
        })
      }).catch(() => {})
    },
    // 批量删除
    batchDel() {
      if (!this.checkedDelList.length) {
        this.$message.warning('请选择租户！')
        return false
      }
      this.$confirm('确定要删除选中的租户吗？', '批量删除租户', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const _ids = []
        this.checkedDelList.forEach(item => {
          _ids.push(item._id)
        })
        batchDelTenant({ _ids: _ids }).then(response => {
          this.$message.success('批量删除成功！')
          if ((this.list.length - this.checkedDelList.length) === 0) { // 如果当前页数据已删完，则去往上一页
            this.listQuery.currentPage -= 1
          }
          this.get_list()
        })
      }).catch(() => {})
    },
    // 编辑
    edit(row) {
      this.$router.push({ path: '/systemManage/tenantManage/edit', query: { _id: row._id }})
    },
    // 生效/失效
    enable(row, type) {
      if (type === 0) {
        this.$confirm('失效用户将不能进行所有本系统内的操作，请问是否对该用户失效？', '失效租户', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          setCustomStatus({ _id: row._id, customStatus: type }).then(response => {
            this.$message.success('失效用户成功！')
            this.get_list()
          })
        }).catch(() => {})
      } else {
        setCustomStatus({ _id: row._id, customStatus: type }).then(response => {
          this.$message.success('生效用户成功！')
          this.get_list()
        })
      }
    },
    // 获取资讯数据
    getInformation(row) {
      this.setInformationId = row._id
      getInformationList({ groupId: row._id }).then(response => {
        this.noList = []
        this.hasList = []
        this.noList = response.data.noList.concat(response.data.hasList)
        response.data.hasList.forEach((item, index) => {
          this.hasList.push(item._id)
        })
      })
      this.setInformationDialogVisible = true
    },
    handleTransferChange(value, direction, movedKeys) {
      this.hasList = value
    },
    // 设置资讯
    setInformation() {
      const data = { _id: this.setInformationId, categoryinfo: this.hasList.join() }
      setInformation(data).then(response => {
        this.setInformationDialogVisible = false
        this.noList = []
        this.hasList = []
        this.$message.success('设置资讯成功！')
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
  img.logoImg {
    width: 70px;
    height: 70px;
    vertical-align: middle;
  }
  .el-table /deep/ .el-table__body tr {
    height: 90px!important;
  }
  .picBox{
    width: 80px;
    height: 70px;
    border: 1px solid #ccc;
  }
  .el-table /deep/ .cell{
    display: flex;
    align-items: center;
    justify-content: space-between;
    text-align: left;
    line-height: 18px;
  }
  .objBox p{
    width: 110px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
</style>
