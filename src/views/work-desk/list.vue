<template>
  <div class="app-container">
    <div id="topSearch">
      <el-input v-model="listQuery1.fileName" placeholder="请输入文件名" clearable @keyup.enter.native="topSearch">
        <el-button slot="append" type="primary" icon="el-icon-search" @click="topSearch" />
      </el-input>
      <span id="advancedSearchBtn" slot="reference" @click="popoverVisible = !popoverVisible">高级搜索<i v-show="popoverVisible" class="advancedSearchIcon iconfont iconshousuoshangjiantou" /><i v-show="!popoverVisible" class="advancedSearchIcon iconfont iconshousuoxiajiantou" /></span>
      <transition name="fade-advanced-search">
        <el-row v-show="popoverVisible">
          <el-card id="advancedSearchArea" shadow="never">
            <el-form ref="form" :model="listQuery1" label-width="100px">
              <el-form-item v-show="showCustom" label="租户">
                <el-select v-model="listQuery1.selectCompanyId" placeholder="请选择租户" clearable filterable @change="findUserListByGroupId()">
                  <el-option
                    v-for="item in custom_list"
                    :key="item._id"
                    :label="item.customname"
                    :value="item._id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item v-show="showUser" label="创建人">
                <el-select v-model="listQuery1.selectUserId" placeholder="请选择创建人" clearable filterable>
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
                    :label="item.name"
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
          <span>{{ scope.$index + ((listQuery.currentPage || 1) - 1) * listQuery.pageSize + 1 }} </span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="left" label="信息" min-width="240" show-overflow-tooltip>
        <template slot-scope="scope">
          <div class="tab-message-box">
            <div class="pointer message-img" @click="preview(scope.row)">
              <el-image
                class="thumbnail"
                style="width: 100px; height: 100px; vertical-align: middle;"
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
      <el-table-column align="center" label="来源" min-width="80" show-overflow-tooltip prop="fileSourceName" />
      <el-table-column align="center" label="创建人" min-width="80" show-overflow-tooltip>
        <template slot-scope="scope">{{ getFileListData(scope.row.mainFileId).nickName }} </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" min-width="140" show-overflow-tooltip>
        <template slot-scope="scope">{{ parseTime(scope.row.createTimestamp) }} </template>
      </el-table-column>
      <el-table-column align="center" label="文档状态" min-width="90" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-tag v-if="getFileListData(scope.row.mainFileId).file_status === 3" type="danger">{{ getFileStatusDesc(getFileListData(scope.row.mainFileId).file_status) }}</el-tag>
          <el-tag v-else-if="getFileListData(scope.row.mainFileId).file_status === 4" type="success">{{ getFileStatusDesc(getFileListData(scope.row.mainFileId).file_status) }}</el-tag>
          <el-tag v-else type="warning">{{ getFileStatusDesc(getFileListData(scope.row.mainFileId).file_status) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="已推送至" min-width="140" show-overflow-tooltip>
        <template slot-scope="scope">
          <span :class="{ stopPushState: !getFilePushRecord(getFileListData(scope.row.mainFileId)) }">{{ getFilePushRecord(getFileListData(scope.row.mainFileId)) || '暂未推送' }}</span>
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
            v-if="menu_tree_flag"
            ref="tree"
            :props="defaultProps"
            :load="loadPushTreeSubNode"
            show-checkbox
            lazy
            node-key="id"
            :check-strictly="true"
            :expand-on-click-node="false"
            :check-on-click-node="true"
            highlight-current
            @node-click="pushTreeNodeClick"
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
import { getFileList, getFileListManage, findUserListByGroupId, del, getDownloadToken, pushToMultiKnowledge, knowledgeFileList } from '@/api/work-desk/work-desk'
import { getCustomManageList } from '@/api/user-center//roleManage'
import { getUserEgroupInfo } from '@/api/user-center/groupManage'
import { getFileShowSize, parseTime } from '@/utils/index'
import elDragDialog from '@/directive/el-drag-dialog'
import FilePreview from '@/components/FilePreview'
import file_knowledge from '@/assets/images/file_knowledge.png'
import { isCurrentEgroupManager, hasThisBtnPermission } from '@/utils/permission'
import { mapGetters } from 'vuex'

export default {
  directives: { elDragDialog },
  components: { Pagination, FilePreview },
  data() {
    return {
      file_knowledge,
      knowledgeFilePageSize: 30, // 推送时加载知识库文件夹页大小
      userCompanyId: '',
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
      listQuery1: { // 查询条件
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
        1: '处理中',
        3: '处理失败',
        4: '处理成功'
      },
      file_encoding: [], // 编码中的文件
      manageType: 0, // 权限标识
      checkedDelList: [], // 选择删除的list
      list: [], // 表格数据
      list2: [], // 用于比较的数据
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
      fileNameList: [], // 选中的文件名数组
      defaultProps: {
        label: 'label',
        children: 'children',
        isLeaf: 'leaf'
      },
      selectNodes: [], // 选择的树的节点
      fileId: '', // 当前文件id
      showCustom: true, // 租户查询是否显示
      showUser: true, // 是否显示用户
      timer: null, // 定时任务
      listQuery2: { // 加载推送菜单
        currentPage: 1, // 当前页
        pageSize: 30 // 当前页请求条
      }
    }
  },
  beforeDestroy() {
    if (this.timer != null) {
      clearInterval(this.timer)
    }
  },
  computed: {
    ...mapGetters(['deskAddFileSuccessData'])
  },
  watch: {
    deskAddFileSuccessData(val) {
      this.get_list()
    }
  },
  created() {
    this.manageType = this.$store.state.user.userPermission.manageType
    this.userCompanyId = this.$store.state.user.userPermission.groupId
    this.get_list()
    this.isNeedRefrssh()

    if (this.manageType === 1) {
      this.showCustom = true
      this.showUser = true
      this.getCustomManageList()
    } else if (this.manageType === 2) {
      this.showCustom = false
      this.showUser = true
      this.listQuery.selectCompanyId = this.$store.state.user.userPermission.groupId
      this.listQuery1.selectCompanyId = this.$store.state.user.userPermission.groupId
    } else {
      this.showCustom = false
      this.showUser = false
      this.listQuery.selectCompanyId = this.$store.state.user.userPermission.groupId
      this.listQuery1.selectCompanyId = this.$store.state.user.userPermission.groupId
    }
    this.findUserListByGroupId()
    store.dispatch('fileUpload/belongs', { data_type: 3 })
  },
  methods: {
    // 按钮权限
    hasThisBtnPermission(code, egroup, rowUserId) {
      return hasThisBtnPermission(code, isCurrentEgroupManager(egroup), rowUserId)
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
        this.listQuery1.fileStatusList.push(this.fileStatus)
      }
      if (this.sourceSystem !== '') {
        this.listQuery.sourceSystemList.push(this.sourceSystem)
        this.listQuery1.sourceSystemList.push(this.sourceSystem)
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
    // 获取列表数据
    get_list2() {
      if (this.fileStatus !== '') {
        this.listQuery.fileStatusList.push(this.fileStatus)
        this.listQuery1.fileStatusList.push(this.fileStatus)
      }
      if (this.sourceSystem !== '') {
        this.listQuery.sourceSystemList.push(this.sourceSystem)
        this.listQuery1.sourceSystemList.push(this.sourceSystem)
      }
      getFileListManage(this.listQuery).then(response => {
        this.list2 = response.data.page.list
        const fileList2 = response.data.filePackageIdWorkDeskFile
        // 判断是否有处理中的数据
        var has_ecoding = false
        for (let i = 0; i < this.list2.length; i++) {
          const file_status = fileList2[this.list2[i].mainFileId].file_status
          if (file_status === 1) {
            has_ecoding = true
          }
        }
        if (!has_ecoding) {
          clearInterval(this.timer)
          this.list = response.data.page.list
          this.fileList = response.data.filePackageIdWorkDeskFile
          this.total = response.data.page.totalCount
        }
      })
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
      this.listQuery1.startTime = this.time_range[0]
      this.listQuery1.endTime = this.time_range[1]
      this.listQuery = JSON.parse(JSON.stringify(this.listQuery1))
      this.get_list()
    },
    // 判断是否有编码中的数据需要刷新
    isNeedRefrssh() {
      this.timer = setInterval(() => {
        this.get_list2()
      }, 5000)
    },
    // 重置
    reset() {
      this.listQuery1.fileName = ''
      this.listQuery1.sourceSystemList = []
      this.listQuery1.selectUserId = ''
      this.listQuery1.selectCompanyId = ''
      this.listQuery1.startTime = ''
      this.listQuery1.endTime = ''
      this.time_range = []
      this.listQuery1.fileStatusList = []
      this.fileStatus = ''
      this.sourceSystem = ''
      this.listQuery = JSON.parse(JSON.stringify(this.listQuery1))
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
      findUserListByGroupId({ groupId: this.listQuery1.selectCompanyId }).then(response => {
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
    // 获取推送记录
    getFilePushRecord(workDeskFile) {
      var defaultDesc = ''
      if (!(workDeskFile)) {
        return defaultDesc
      }

      var pushRecord = workDeskFile.push_record
      if (!(pushRecord && pushRecord.length > 0)) {
        return defaultDesc
      }

      var groupArr = []
      var companyArr = []
      pushRecord.forEach((v, k, arr) => {
        if (v.type === 'enterprise_knowledge_lib') {
          companyArr.push('企业知识库')
        } else if (v.type === 'group_knowledge_lib') {
          groupArr.push(v.title)
        }
      })

      var titles = []
      if (companyArr.length > 0) {
        titles.push('企业知识库')
      }
      if (groupArr.length > 0) {
        titles.push('小组知识库（' + groupArr.join('、') + '）')
      }

      var title = titles.join('，')
      return title
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
      const elemIF = document.createElement('iframe')
      elemIF.src = url
      elemIF.style.display = 'none'
      document.body.appendChild(elemIF)
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
          const elemIF = document.createElement('iframe')
          elemIF.src = url
          elemIF.style.display = 'none'
          document.body.appendChild(elemIF)
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
      this.fileIdList = []
      this.fileId = row.mainFileId
      this.fileName = row.fileName
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
      this.fileId = ''
      this.fileIdList = []
      this.fileNameList = []
      this.checkedDelList.forEach(item => {
        this.fileIdList.push(this.getFileListData(item.mainFileId)._id)
        this.fileNameList.push(item.fileName)
      })
      this.initializeTreeData(this.selectCompanyId)
      this.menu_tree_flag = true
    },
    // 初始化推送菜单树的数据
    initializeTreeData(val) {
      const companyTree = { label: '企业知识库', id: val, type: 'company', ownerId: val, parentId: val, path: '企业知识库' }
      const groupTree = { label: '小组知识库', id: 'allEgroup', type: 'egroup', companyId: val }
      this.treeData = [companyTree, groupTree]
      /* getUserEgroupInfo({ selectCompanyId: val }).then(response => {
        const groupList = response.data.egroupInfo
        const groupNames = []
        for (let i = 0; i < groupList.length; i++) {
          var groupName = groupList[i].groupName
          var groupInc = groupList[i].inc

          groupNames.push({ label: groupName, id: groupInc,ownerId:groupInc,parentId:groupInc,path:groupName })
        }
        groupTree.children = groupNames
        this.treeData = [companyTree, groupTree]
      })*/
    },

    // 加载节点子节点
    loadPushTreeSubNode(node, resolve) {
      if (node.level === 0) {
        // 加载根节点
        var companyId = this.userCompanyId
        const companyTree = { label: '企业知识库', id: companyId, type: 'company', ownerId: companyId, parentId: companyId, path: '企业知识库' }
        const groupTree = { label: '小组知识库', id: 'allEgroup', type: 'egroup', companyId: companyId, disabled: true }
        return resolve([companyTree, groupTree])
      }
      var that = this
      var nodeData = node.data
      if (nodeData.type === 'egroup') {
        // 如果是小组知识库节点
        setTimeout(function() {
          that.appendGroupToTree(node, nodeData.companyId)
        })
        return resolve([])
      }

      var currentPage = 1
      var pageSize = this.knowledgeFilePageSize || 10
      var ownerId = nodeData.ownerId
      var parentId = nodeData.id

      var requestData = { 'ownerId': ownerId, 'parentId': parentId, 'pageSize': pageSize, 'currentPage': currentPage, 'fileType': 'dir' }

      setTimeout(function() {
        knowledgeFileList(requestData).then(response => {
          var page = response.data.page
          var fileList = page.list
          var currentPage = page.currentPage
          var totalPage = page.pageCount

          var loadMoreData = { label: '点击加载更多', id: parentId + '_more', type: 'dir', ownerId: ownerId, parentId: parentId, currentPage: 2, pageSize: pageSize, leaf: true, loadMore: true, disabled: true }

          that.appendDirectoryToTree(node, fileList)
          if (currentPage < totalPage) {
            that.appendLoadMoreNodeToTree(node, loadMoreData)
          }
        })
      })
      return resolve([])
    },

    // 节点被点击后触发方法
    pushTreeNodeClick(nodeData, node, tree) {
      if (!('loadMore' in nodeData)) {
        // 不是加载更多节点被点击则直接返回
        return
      }

      var currentPage = nodeData.currentPage || 1
      var pageSize = this.knowledgeFilePageSize || 10
      var ownerId = nodeData.ownerId
      var parentId = nodeData.parentId

      var requestData = { 'ownerId': ownerId, 'parentId': parentId, 'pageSize': pageSize, 'currentPage': currentPage, 'fileType': 'dir' }
      var that = this
      knowledgeFileList(requestData).then(response => {
        var page = response.data.page
        var fileList = page.list
        var currentPage = page.currentPage
        var totalPage = page.pageCount

        var loadMoreData = node.data
        var parentNode = node.parent
        // 删除加载更多节点
        that.$refs.tree.remove(node)

        that.appendDirectoryToTree(parentNode, fileList)
        if (currentPage < totalPage) {
          loadMoreData.currentPage = loadMoreData.currentPage + 1
          that.appendLoadMoreNodeToTree(parentNode, loadMoreData)
        }
      })
    },

    // 加载小组到树
    appendGroupToTree(parentNode, selectCompanyId) {
      var that = this
      getUserEgroupInfo({ selectCompanyId: selectCompanyId }).then(response => {
        const groupList = response.data.egroupInfo

        for (let i = 0; i < groupList.length; i++) {
          var groupName = groupList[i].groupName
          var groupInc = groupList[i].inc + ''

          var groupNodeData = { label: groupName, id: groupInc, ownerId: groupInc, path: groupName }
          that.$refs.tree.append(groupNodeData, parentNode)
        }
      })
    },
    // 添加文件夹到树，parentNode是要添加子节点的父节点
    appendDirectoryToTree(parentNode, dirList) {
      if (!(dirList && dirList.length > 0)) {
        return
      }

      var parentNodeData = parentNode.data
      var parentPath = parentNodeData.path

      for (let i = 0; i < dirList.length; i++) {
        var dir = dirList[i]
        var fileName = dir.fileName
        var filePath = parentPath + '/' + fileName
        var ownerId = dir.ownerId
        var id = dir.fileId

        var subNodeData = { label: fileName, id: id, type: 'dir', ownerId: ownerId, path: filePath }
        this.$refs.tree.append(subNodeData, parentNode)
      }
    },

    // 添加加载更多节点到树
    appendLoadMoreNodeToTree(parentNode, nodeData) {
      this.$refs.tree.append(nodeData, parentNode)
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
      var selectNodes = this.$refs.tree.getCheckedNodes()
      if (selectNodes.length === 0) {
        this.$message.warning('请选择推送路径！')
        return
      }

      var knowledgeLibFileList = []
      var pathArray = []
      for (let i = 0; i < selectNodes.length; i++) {
        var selectNode = selectNodes[i]

        var ownerId = selectNode.ownerId
        var parentId = selectNode.id
        pathArray.push(selectNode.path)
        knowledgeLibFileList.push({ ownerId: ownerId, parentId: parentId })
      }

      var fileId = null
      var fileIdList = this.fileIdList
      var fileName = ''
      if (!(fileIdList && fileIdList.length > 0) && this.fileId) {
        fileId = this.getFileListData(this.fileId)._id
        fileName = '【' + this.fileName + '】'
      } else {
        fileName = '【' + this.fileNameList[0] + '】 等' + this.fileIdList.length + '个文件'
      }
      var path = ''
      if (pathArray.length > 0) {
        path = '【' + pathArray[0] + '】等' + pathArray.length + '个路径'
      } else {
        path = '【' + pathArray[0] + '】'
      }
      this.$confirm('确定要推送文件' + fileName + '到' + path + '吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        pushToMultiKnowledge({
          fileId: fileId,
          knowledgeLibFileList: knowledgeLibFileList,
          fileIdList: fileIdList
        }).then(() => {
          this.$message.success('推送成功！')
          this.menu_tree_flag = false
          this.get_list()
        })
      })
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
  @import "~@/styles/variables.scss";
  .tab-message-box {
    text-align: left;
  }
  .message-img {
    display: inline-block;
  }
  .fileDetail {
    margin-left: 10px;
    display: inline-block;
    vertical-align: middle;;
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
  .stopPushState {
    color: $yellow2;
  }
</style>
