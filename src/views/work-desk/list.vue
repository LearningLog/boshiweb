<template>
  <div class="app-container">
    <div id="topSearch">
      <el-input v-model="listQuery.fileName" placeholder="请输入文件名" clearable @keyup.enter.native="topSearch">
        <el-button slot="append" type="primary" icon="el-icon-search" @click="topSearch" />
      </el-input>
      <span id="advancedSearchBtn" slot="reference" @click="popoverVisible = !popoverVisible">高级搜索<i v-show="popoverVisible" class="el-icon-caret-bottom" /><i v-show="!popoverVisible" class="el-icon-caret-top" /></span>
      <transition name="fade-advanced-search">
        <el-row v-show="popoverVisible">
          <el-card id="advancedSearchArea" shadow="never">
            <el-form ref="form" :model="listQuery" label-width="100px">
              <el-form-item v-show="showCustom" label="租户">
                <el-select v-model="listQuery.selectCompanyId" placeholder="请选择租户" clearable filterable @change="findUserListByGroupId()">
                  <el-option
                    v-for="item in custom_list"
                    :key="item._id"
                    :label="item.customname"
                    :value="item._id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="创建人">
                <el-select v-model="listQuery.selectUserId" placeholder="请选择创建人" clearable filterable>
                  <el-option
                    v-for="item in user_list"
                    :key="item._id"
                    :label="item.nickname"
                    :value="item._id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="文件来源">
                <el-select v-model="sourceSystem" placeholder="请选择文件来源" clearable filterable>
                  <el-option
                    v-for="item in fileSource_list"
                    :key="item.value"
                    :value="item.value"
                  />
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
              <el-form-item label="状态">
                <el-select v-model="fileStatus" placeholder="请选择状态" clearable filterable>
                  <el-option
                    v-for="(value,key) in file_status"
                    :key="key"
                    :label="value"
                    :value="key"
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
    <div id="topBtn">
      <el-button v-if="hasThisBtnPermission('workdesk-upload')" type="primary" @click="showUpload()"><i class="iconfont iconshangchuan" />上传资料</el-button>
    </div>
    <el-table
      :data="list"
      element-loading-text="Loading"
      border
      highlight-current-row
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="50"
        fixed
      />
      <el-table-column align="center" label="序号" width="60" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.$index + (listQuery.currentPage - 1) * listQuery.pageSize + 1 }} </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="信息" min-width="300" show-overflow-tooltip>
        <template slot-scope="scope">
          <div class="tab-message-box clearfix">
            <div class="pointer message-img" @click="preview(scope.row)">
              <el-image
                class="thumbnail"
                :src="getPic(scope.row) || file_knowledge"
                fit="contain"
              />
            </div>
            <div class="pointer fileDetail" @click="detail(scope.row)">
              <p class="fileDetailItem">{{ scope.row.fileName }}</p>
              <p class="fileDetailItem"><span>文件大小：</span>{{ getFileShowSize(scope.row.fileSize) }}</p>
              <p class="fileDetailItem"><span>文件格式：</span>{{ scope.row.fileFormat }}</p>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="来源" min-width="90" show-overflow-tooltip prop="fileSourceName" />
      <el-table-column align="center" label="创建人" min-width="90" show-overflow-tooltip>
        <template slot-scope="scope">{{ getFileListData(scope.row.mainFileId).nickName }} </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" min-width="140" show-overflow-tooltip>
        <template slot-scope="scope">{{ parseTime(scope.row.createTimestamp) }} </template>
      </el-table-column>
      <el-table-column align="center" label="文档状态" min-width="80" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-tag v-if="getFileListData(scope.row.mainFileId).file_status === 3" type="danger">{{ getFileStatusDesc(getFileListData(scope.row.mainFileId).file_status) }}</el-tag>
          <el-tag v-else-if="getFileListData(scope.row.mainFileId).file_status === 4" type="success">{{ getFileStatusDesc(getFileListData(scope.row.mainFileId).file_status) }}</el-tag>
          <el-tag v-else type="warning">{{ getFileStatusDesc(getFileListData(scope.row.mainFileId).file_status) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="操作" width="220" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" :disabled="!hasThisBtnPermission('workdesk-download')" @click="download(scope.row)"><i class="iconfont iconxiazai" />下载</el-button>
          <el-button size="mini" :disabled="getFileListData(scope.row.mainFileId).file_status !== 4 || !hasThisBtnPermission('workdesk-push')" @click="pushToKnowledge(scope.row)"><i class="iconfont iconfabu" />推送</el-button>
          <el-button size="mini" :disabled="!hasThisBtnPermission('workdesk-delete')" @click="del(scope.row)"><i class="iconfont iconshanchu" />删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="get_list" />
    <div id="bottomOperation">
      <el-button v-if="hasThisBtnPermission('workdesk-delete')" v-show="total>0" type="primary" plain @click="batchPush"><i class="iconfont iconfabu" />批量推送</el-button>
      <el-button v-if="hasThisBtnPermission('workdesk-push')" v-show="total>0" type="danger" plain @click="batchDel"><i class="iconfont iconshanchu" />批量删除</el-button>
      <el-button v-if="hasThisBtnPermission('workdesk-download')" v-show="total>0" type="primary" plain @click="batchDownload"><i class="iconfont iconxiazai" />批量下载</el-button>
    </div>
    <el-dialog
      v-el-drag-dialog
      title="推送"
      :visible.sync="menu_tree_flag"
      width="38%"
      height="60vh"
    >
      <div class="menu_tree_box">
        <el-scrollbar wrap-class="scrollbar-wrapper">
          <el-tree
            ref="tree"
            :data="treeData"
            :props="defaultProps"
            show-checkbox
            node-key="id"
            :check-strictly="true"
            :expand-on-click-node="false"
            :check-on-click-node="true"
            default-expand-all
            highlight-current
            @check-change="menu_tree_check_fn"
          />
        </el-scrollbar>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="save_menu">确认</el-button>
        <el-button type="primary" plain @click="cancel_push">取消</el-button>
      </span>
    </el-dialog>
    <FilePreview :is-file-preview="isFilePreview" :file-format="fileFormat" :file-type-code="fileTypeCode" :file-url="fileUrl" :title="fileName" @closePreview="closePreview" />
  </div>
</template>

<script>
import store from '@/store'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { getFileList, getFileListManage, findUserListByGroupId, del, getDownloadToken, pushToKnowledge } from '@/api/work-desk'
import { getCustomManageList } from '@/api/systemManage-roleManage'
import { getUserEgroupInfo } from '@/api/userCenter-groupManage'
import { getFileShowSize, parseTime } from '@/utils/index'
import elDragDialog from '@/directive/el-drag-dialog'
import FilePreview from '@/components/FilePreview'
import file_knowledge from '@/assets/images/file_knowledge.png'
import { isCurrentEgroupManager, hasThisBtnPermission } from '@/utils/permission'

export default {
  directives: { elDragDialog },
  components: { Pagination, FilePreview },
  data() {
    return {
      file_knowledge,
      isFilePreview: false, // 是否打开预览
      fileFormat: '', // 文件格式
      fileTypeCode: -1, // 文件类型
      fileUrl: '', // 文件地址
      fileName: '', // 文件名称（弹窗title）
      popoverVisible: false, // 高级搜索是否显示
      total: 0, // 总条数
      fileStatus: '', // 文件状态
      sourceSystem: '', // 来源系统
      listQuery: { // 查询条件
        currentPage: 1, // 当前页
        pageSize: 10, // 当前页请求条数
        fileName: null, // 消息内容
        selectCompanyId: null, // 租户id
        selectUserId: null, // 选择的创建人
        sourceSystemList: [], // 来源系统
        startTime: null, // 开始时间
        endTime: null, // 结束时间
        fileStatusList: []// 文件上传状态
      },

      file_status: {
        0: '已提交',
        1: '编码中',
        3: '编码失败',
        4: '编码成功'
      },
      file_encoding: [], // 编码中的文件
      manageType: 0, // 权限标识
      checkedDelList: [], // 选择删除的list
      list: [], // 表格数据
      fileList: [], // 文件列表数据
      custom_list: [], // 租户列表
      user_list: [], // 用户列表
      time_range: [], // 时间范围
      fileSource_list: [{ value: 'file_upload', name: '个人上传' }, { value: 'live_record', name: '直播收录' }, { value: 'company_knowledge_lib', name: '企业知识库收藏' },
        { value: 'group_knowledge_lib', name: '小组知识库收藏' }, { value: 'courseware_upload', name: '课件上传' }],
      isDisabled: false, // 推送按钮是否可用
      menu_tree_flag: false, // 是否显示树
      treeData: [], // 推送的知识库菜单
      fileIdList: [], // 文件id数组
      defaultProps: {
        label: 'label',
        children: 'children'
      },
      selectNodes: [], // 选择的树的节点
      fileId: '', // 当前文件id
      showCustom: true, // 租户查询是否显示
      timer: null// 定时任务
    }
  },
  beforeDestroy() {
    if (this.timer != null) {
      clearInterval(this.timer)
    }
  },
  created() {
    this.manageType = this.$store.state.user.userPermission.manageType

    this.get_list()
    this.isNeedRefrssh()

    if (this.manageType !== 1) {
      this.showCustom = false
      this.listQuery.selectCompanyId = this.$store.state.user.userPermission.groupId
    } else {
      this.getCustomManageList()
      this.showCustom = true
    }
    this.findUserListByGroupId()
    store.dispatch('fileUpload/belongs', { data_type: 3 })
  },
  methods: {
    // 按钮权限
    hasThisBtnPermission(code, egroup) {
      return hasThisBtnPermission(code, isCurrentEgroupManager(egroup))
    },
    // 启动上传
    showUpload() {
      store.dispatch('fileUpload/isVisibility', 1)
    },
    // 图片预览
    preview(row) {
      this.fileUrl = row.fileUrl
      this.fileTypeCode = row.fileTypeCode
      this.fileFormat = row.fileFormat
      this.fileName = row.fileName
      this.isFilePreview = true
    },
    // 监听预览
    closePreview() {
      this.isFilePreview = false
      this.fileUrl = ''
      this.fileTypeCode = -1
      this.title = ''
    },
    // 获取列表数据
    get_list() {
      if (this.fileStatus !== '') {
        this.listQuery.fileStatusList.push(this.fileStatus)
      }
      if (this.sourceSystem !== '') {
        this.listQuery.sourceSystemList.push(this.sourceSystem)
      }
      if (this.manageType === 3) {
        getFileList(this.listQuery).then(response => {
          this.list = response.data.page.list
          this.fileList = response.data.filePackageIdWorkDeskFile
          this.total = response.data.page.totalCount
          this.have_encoding()
        })
      } else if (this.manageType === 1 || this.manageType === 2) {
        getFileListManage(this.listQuery).then(response => {
          this.list = response.data.page.list
          this.fileList = response.data.filePackageIdWorkDeskFile
          this.total = response.data.page.totalCount
          this.have_encoding()
        })
      } else {
        this.$message.success('无法获取权限信息！')
      }
    },
    // 获取编码中的文件
    have_encoding() {
      this.file_encoding.length = 0
      for (let i = 0; i < this.list.length; i++) {
        if (this.getFileListData(this.list[i].mainFileId).file_status === 1) {
          this.file_encoding.push(this.list[i].mainFileId)
        }
      }
      if (this.timer != null) {
        clearInterval(this.timer)
      }
      if (this.file_encoding.length > 0) {
        this.isNeedRefrssh()
      }
    },
    // 搜索
    topSearch() {
      this.time_range = this.time_range || []
      this.listQuery.startTime = this.time_range[0]
      this.listQuery.endTime = this.time_range[1]
      this.get_list()
    },
    // 判断是否有编码中的数据需要刷新
    isNeedRefrssh() {
      this.timer = setInterval(() => {
        this.get_list()
      }, 5000)
    },
    // 重置
    reset() {
      this.listQuery.fileName = ''
      this.listQuery.sourceSystemList = []
      this.listQuery.selectUserId = ''
      this.listQuery.selectCompanyId = ''
      this.listQuery.startTime = ''
      this.listQuery.endTime = ''
      this.time_range = []
      this.listQuery.fileStatusList = []
      this.fileStatus = ''
      this.sourceSystem = ''
      this.get_list()
    },
    // 获取租户列表
    getCustomManageList() {
      getCustomManageList().then(response => {
        this.custom_list = response.data
      })
    },
    // 根据租户id查询用户列表
    findUserListByGroupId() {
      findUserListByGroupId({ groupId: this.listQuery.selectCompanyId }).then(response => {
        this.user_list = response.data
      })
    },
    // 获取文件属性
    getFileListData(filePackageId) {
      return this.fileList[filePackageId]
    },
    // 换取文件状态
    getFileStatusDesc(fils_status) {
      return this.file_status[fils_status]
    },
    // 批量删除
    batchDel() {
      if (!this.checkedDelList.length) {
        this.$message.warning('请选择文件！')
        return false
      }
      this.$confirm('确定要删除选中的文件吗？', '批量删除文件', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const fileIdList = []
        this.checkedDelList.forEach(item => {
          fileIdList.push(this.getFileListData(item.mainFileId)._id)
        })
        del({ fileIdList: fileIdList }).then(response => {
          this.$message.success('批量删除成功！')
          if ((this.list.length - this.checkedDelList.length) === 0) { // 如果当前页数据已删完，则去往上一页
            this.listQuery.currentPage -= 1
          }
          this.get_list()
        })
      }).catch(() => {})
    },
    // 单个删除
    del(row) {
      this.$confirm('确定要删除【' + row.fileName + '】吗？', '删除文件', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const fileId = this.getFileListData(row.mainFileId)._id
        del({ fileId: fileId }).then(response => {
          this.$message.success('删除成功！')
          if ((this.list.length - 1) === 0) { // 如果当前页数据已删完，则去往上一页
            this.listQuery.currentPage -= 1
          }
          this.get_list()
        })
      }).catch(() => {})
    },
    // 单个下载
    download(row) {
      const fileId = this.getFileListData(row.mainFileId)._id
      const url = process.env.VUE_APP_BASE_API + '/api/workDeskFile/downloadFile?fileId=' + fileId
      const a = document.createElement('a')
      a.download = row.fileName + '\.' + row.fileFormat
      a.href = url
      document.body.appendChild(a)
      a.click()
    },
    // 批量下载
    batchDownload() {
      if (!this.checkedDelList.length) {
        this.$message.warning('请选择文件！')
        return false
      }
      const fileIdList = []
      this.checkedDelList.forEach(item => {
        fileIdList.push(this.getFileListData(item.mainFileId)._id)
      })
      getDownloadToken({ fileIdList: fileIdList }).then(response => {
        const token = response.data.token
        const size = this.getFileShowSize(response.data.size)
        this.$confirm('文件约为' + size + '确定要下载吗？', '批量下载', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const url = process.env.VUE_APP_BASE_API + '/api/workDeskFile/downloadZipFile?token=' + token
          const a = document.createElement('a')
          a.download = '批量下载.zip'
          a.href = url
          document.body.appendChild(a)
          a.click()
        }).catch(() => {})
      })
    },
    // 获取预览图片
    getPic(row) {
      var subFile = row.subFileList
      for (let i = 0; i < subFile.length; i++) {
        if (subFile[i].fileUse === 'preview_pic') {
          return subFile[i].fileUrl
        }
      }
    },
    // 选中数据
    handleSelectionChange(row) {
      this.checkedDelList = row
    },
    // 推送至知识库
    pushToKnowledge(row) {
      this.fileId = row.mainFileId
      const groupId = this.getFileListData(row.mainFileId).groupId
      this.initializeTreeData(groupId)
      this.menu_tree_flag = true
    },
    // 批量推送
    batchPush() {
      if (!this.checkedDelList.length) {
        this.$message.warning('请选择文件！')
        return false
      }
      this.checkedDelList.forEach(item => {
        this.fileIdList.push(this.getFileListData(item.mainFileId)._id)
      })
      this.initializeTreeData(this.selectCompanyId)
      this.menu_tree_flag = true
    },
    // 初始化推送菜单树的数据
    initializeTreeData(val) {
      const companyTree = { label: '企业知识库', id: val, type: 'company' }
      const groupTree = { label: '小组知识库', id: 'allEgroup', type: 'egroup' }
      getUserEgroupInfo({ selectCompanyId: val }).then(response => {
        const groupList = response.data.egroupInfo
        const groupNames = []
        for (let i = 0; i < groupList.length; i++) {
          groupNames.push({ label: groupList[i].groupName, id: groupList[i].inc })
        }
        groupTree.children = groupNames
        this.treeData = [companyTree, groupTree]
      })
    },
    // 选择菜单 单选
    menu_tree_check_fn(data, checked, indeterminate) {
      if (data.type === 'egroup') {
        this.$message.warning('请选择小组！')
        this.$refs.tree.setCheckedKeys([])
        return false
      }
      if (checked === true) {
        this.$refs.tree.setCheckedKeys([data.id])
      }

      this.selectNodes = this.$refs.tree.getCheckedNodes()
    },
    // 取消推送
    cancel_push() {
      this.menu_tree_flag = false
    },
    // 开始推送
    save_menu() {
      if (this.selectNodes.length === 0) {
        this.$message.warning('请选择推送路径！')
        return
      }
      console.log(this.selectNodes)
      const ownerId = this.selectNodes[0].id
      pushToKnowledge({ fileId: this.getFileListData(this.fileId)._id, ownerId: ownerId + '', parentId: ownerId + '', fileIdList: this.fileIdList }).then(() => {
        this.$message.warning('推送成功！')
      })
      this.menu_tree_flag = false
    },
    // 查看详情
    detail(row) {
      this.$router.push({ path: '/work-desk/detail', query: { id: row.mainFileId }})
    },
    parseTime(time, cFormat) {
      return parseTime(time, cFormat)
    },
    getFileShowSize(fileSize) {
      return getFileShowSize(fileSize)
    }
  }
}
</script>
<style lang="scss" scoped>
  .tab-message-box {
    position: relative;
    height: 100px;
  }
  .tab-message-box .pointer {
    position: absolute;
  }
  .tab-message-box .message-img {
    left: 0;
  }
  .tab-message-box .fileDetail {
    left: 100px;
  }
  .fileDetail {
    margin-left: 10px;
  }
  .fileDetail p {
    margin: 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .fileDetailItem {
    text-align: left;
  }
  .fileDetailItem span {
    display: inline-block;
    width: 60px;
    text-align: right;
  }
  .el-table .el-table__row td {
    height: 116px;
  }
  .menu_tree_box {
    width: 60%;
    margin: 0 auto;
  }
  .menu_tree_box /deep/ .el-scrollbar {
    height: calc(60vh - 170px);
  }
</style>
