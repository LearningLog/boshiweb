<template>
  <div class="list-box">
    <div id="topSearch">

      <el-input v-model="listQuery.keyword" placeholder="请输入文件名称" clearable @keyup.enter.native="topSearch">
        <el-button slot="append" type="primary" icon="el-icon-search" @click="topSearch" />
      </el-input>
      <span id="advancedSearchBtn" slot="reference" @click="classifyButtonFn()">按知识分类搜索<i v-show="!popoverVisible" class="el-icon-caret-bottom" /><i v-show="popoverVisible" class="el-icon-caret-top" /></span>
      <span id="advancedSearchBtn" slot="reference" @click="advancedButtonFn()">高级搜索<i v-show="!advancedVisible" class="el-icon-caret-bottom" /><i v-show="advancedVisible" class="el-icon-caret-top" /></span>
      <transition name="fade-advanced-search">
        <el-row v-show="popoverVisible">
          <el-card id="advancedSearchArea" shadow="never">
            <div class="treeList">
              <div class="treeList1">
                <!-- <p class="treeName pointer" :class="{ activeClassify: isActiveClassify(treeList1)}" @click="checkClassify(treeList1)">{{ treeList1.treeName }}</p> -->
                <ul v-if="treeList1.floorList.length" class="">
                  <li v-for="(item, index) in treeList1.floorList" :key="treeList1.treeId + index" class="treeItem">
                    <span v-for="item2 in item" :key="item2.nodeIdList.join()" class="classifyItem pointer" :class="{ activeClassify: isActiveClassify(item2) }" @click="checkClassify(item2)">{{ item2.nodeName }}</span>
                  </li>
                </ul>
              </div>
              <div v-if="treeList2.floorList.length" class="treeList2">
                <!-- <p class="treeName pointer" :class="{ activeClassify: isActiveClassify(treeList2)}" @click="checkClassify(treeList2)">{{ treeList2.treeName }}</p> -->
                <ul v-if="treeList2.floorList.length" class="">
                  <li v-for="(item, index) in treeList2.floorList" :key="treeList2.treeId + index" class="treeItem">
                    <span v-for="item2 in item" :key="item2.nodeIdList.join()" class="classifyItem pointer" :class="{ activeClassify: isActiveClassify(item2) }" @click="checkClassify(item2)">{{ item2.nodeName }}</span>
                  </li>
                </ul>
              </div>
            </div>

          </el-card>
        </el-row>
      </transition>

      <transition name="fade-advanced-search">
        <el-row v-show="advancedVisible">
          <el-card id="advancedSearchArea" shadow="never">
            <el-form ref="form" :model="listQuery" label-width="100px">
              <el-form-item label="所属租户">
                <el-select
                  v-if="isSystemManage"
                  v-model="listQuery.selectCompanyId"
                  placeholder="请选择所属租户"
                  clearable
                  filterable
                  @change="companyChange($event)"
                >
                  <el-option
                    v-for="item in custom_list"
                    :key="item._id"
                    :label="item.customname"
                    :value="item._id"
                  />
                </el-select>
              </el-form-item>

              <el-form-item label="创建人">
                <el-select v-model="listQuery.userId" placeholder="请选择创建人" clearable filterable>
                  <el-option v-for="item in alluserList" :key="item._id" :label="item.nickname" :value="item._id" />
                </el-select>
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
      <el-dropdown trigger="click">
        <el-button type="primary">
          批量操作<i class="el-icon-arrow-down el-icon--right" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="deleteDirFileSelected"><i class="iconfont iconshanchu" />批量删除</el-dropdown-item>
          <!-- <el-dropdown-item @click.native="moveFileSelected"><i class="iconfont iconshangyi1" />批量移动</el-dropdown-item> -->
          <el-dropdown-item @click.native="downloadFileSelected"><i class="iconfont iconxiazai" />批量下载</el-dropdown-item>
          <el-dropdown-item @click.native="shareFileToWorkDeskSlected"><i class="iconfont iconfenxiang1" />批量收藏</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button type="primary" @click="createFolder"><i class="iconfont iconzengjia" />创建文件夹</el-button>
      <el-button type="primary" @click="classifySelected"><i class="iconfont iconzengjia" />加入知识分类</el-button>
      <el-button type="primary" @click="showUpload"><i class="iconfont iconzengjia" />上传资料</el-button>
    </div>

    <div class="pathNav">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item v-if="pathNavData.length > 0" @click.native="goback()">返回上一级</el-breadcrumb-item>
        <el-breadcrumb-item @click.native="pathNavClick('all')">{{ navselctedCompanyName }}</el-breadcrumb-item>
        <el-breadcrumb-item v-for="(item,index) in pathNavData" :key="index" @click.native="pathNavClick(item,index)">{{ item.name }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="classifyTags">
      <el-tag
        v-for="(item, index) in checkedClassifys"
        :key="item.nodeIdList.join()"
        closable
        size="medium"
        :disable-transitions="false"
        type="success"
        @close="handlePaperLabelDel(index)"
      >
        {{ item.nodeName }}
      </el-tag>
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
      <el-table-column  label="文件名" show-overflow-tooltip min-width="200">
        <!-- <template slot-scope="scope">
          <el-link type="primary" @click="detail(scope.row)">{{ scope.row.fileName }}</el-link>
        </template> -->
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.fileName" class="edit-input" size="mini" @input="modifyFileNameChange(row,$event)" />
            <el-button
              class="cancel-btn"
              size="mini"
              icon="el-icon-refresh"
              @click="cancelEdit(row)"
            >
              取消
            </el-button>
          </template>
          <div style="text-align:left;" v-else @click="enterFolder(row)">

            <svg class="icon" aria-hidden="true" style="font-size:18px;">
              <use :xlink:href="parseTypeOfFile(row)" />
            </svg>
            <!-- <i v-if="row.fileAttributeDesc==='dir'" class="iconfont iconwenjianjia" /> -->
          <span  @click="preview(row)" v-if="row.fileAttributeDesc!=='dir'"> {{ row.fileName }} </span>   
          <span  v-if="row.fileAttributeDesc==='dir'"> {{ row.fileName }} </span>   
          </div>
        </template>

      </el-table-column>
      <el-table-column label="文件大小" min-width="100" align="center" show-overflow-tooltip prop="skill_desc">
        <template slot-scope="{row}">
          <div>
            {{ parseFileSize(row) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="文件属性" min-width="140" show-overflow-tooltip prop="fileAttributeDesc">
        <template slot-scope="{row}">
          <div>
            {{ parseFileType(row) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建人" show-overflow-tooltip prop="customname">
        <template slot-scope="{row}">
          <div>
            {{ parseCreateUser(row) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" min-width="140" show-overflow-tooltip prop="createTimeStr" />
      <el-table-column class-name="status-col" label="操作" width="260px" align="center" fixed="right">
        <template slot-scope="scope">
          <!-- <el-button size="mini" @click="edit(scope.row)" ><i class="iconfont iconxiugai" />重命名</el-button> -->
          <el-button
            v-if="scope.row.edit"
            size="mini"
            icon="el-icon-circle-check-outline"
            @click="confirmEdit(scope.row)"
          >
            确定
          </el-button>
          <el-button
            v-else
            size="mini"
            icon="iconfont iconxiugai"
            @click="scope.row.edit=!scope.row.edit"
          >
            重命名
          </el-button>

          <el-button size="mini" @click="download(scope.row)"><i class="iconfont iconxiazai" />下载</el-button>
          <el-dropdown trigger="click">
            <el-button size="mini">
              <i class="iconfont icongengduo" />更多
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <!-- <el-dropdown-item @click.native="moveFile(scope.row)"><i class="iconfont " />移动</el-dropdown-item> -->
              <el-dropdown-item @click.native="deleteDirFile(scope.row)"><i class="iconfont iconshanchu" />删除</el-dropdown-item>
              <el-dropdown-item @click.native="shareFileToWorkDesk(scope.row)"><i class="iconfont iconfenxiang1" />收藏</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>

    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="getDirList" />
    <el-dialog v-el-drag-dialog class="setInformationDialog" width="650px" height="650px" title="加入知识分类" :visible.sync="treeDialogVisible">
      <el-tree
        ref="classifyTree"
        :data="dataForTree"
        node-key="id"
        default-expand-all
        show-checkbox
        :check-strictly="true"
        :props="treeProps"
      />
      <el-button type="primary" @click="classifySelectedConfirm">确定</el-button>
      <el-button @click="treeDialogVisible = false">取 消</el-button>
    </el-dialog>
    <el-dialog v-el-drag-dialog class="createFolders" width="650px" title="创建文件夹" :visible.sync="crateFolderDialogVisible">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="目录名称" prop="name">
          <el-input v-model="ruleForm.name" />
        </el-form-item>
        <el-form-item label="目录描述" prop="desc">
          <el-input v-model="ruleForm.desc" type="textarea" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="createFolderConfirm('ruleForm')">确定</el-button>
          <el-button @click="crateFolderDialogVisible=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <FilePreview :is-file-preview="isFilePreview" :file-format="fileFormat" :file-type-code="fileTypeCode" :file-url="fileUrl" :title="fileName" @closePreview="closePreview" />
  </div>
</template>

<script>
import store from '@/store'
import { mapGetters } from 'vuex'
import { findUserListByGroupId, getCustomManageList, listDirFile, getCompanyAllTree, classifyFiles, updateDir, deleteDirFile, createDirFile, shareFileToWorkDesk, getDownloadToken, getCompanyAllTreeFloorByName } from '@/api/knowledge-base/company-base'
import { getFileShowSize } from '@/utils/index'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
import FilePreview from '@/components/FilePreview'
import file_knowledge from '@/assets/images/file_knowledge.png'
const $ = window.$
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
      alluserList: [],
      // 分类树
      // 知识树列表
      treeList1: {
        floorList: []
      },
      treeList2: {
        floorList: []
      },
      checkedClassifys: [], // 选中的分类
      userInfoForList: {}, //  存储用户列表里面的信息用于列表里面的创建人
      // tree--start
      treeProps: {
        children: 'children',
        label: 'title'
      },
      // tree--end
      pathQueryString: '',
      pathNavData: [],
      // 文件夹路径导航
      treeDialogVisible: false,
      crateFolderDialogVisible: false,
      isReset: true, // 租户组件重置
      listLoading: false,
      custom_list: [], // 所属租户下拉列表
      navselctedCompanyName: '全部',
      listQuery: {
        classifyNodeIds: [], // 分类节点id数组列表，二维数组
        classifyTreeIds: [], // 分类节点树id数组列表
        conditionParam: {},
        currentPage: 1,
        data_type: 1, // 数据类型 1企业知识库 2小组知识库
        keyword: '', // 搜索关键词
        ownerId: '', // 归属小组或租户id

        pageSize: 10,
        parentId: '',
        regexConditionParam: [],
        selectCompanyId: '', // 企业/租户id
        sortColumn: '',
        sortOrder: ''
      },
      time_range: [], // 时间范围model
      selectedRow: [], // 选中的数据
      list: null, // 列表数据
      total: 0, // 总条数
      popoverVisible: false, // 目录知识分类搜索是否展开
      advancedVisible: false, // 高级搜索
      ruleForm: {
        name: '',
        desc: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入文件夹名称', trigger: 'blur' },
          { min: 1, max: 12, message: '长度在 1 到 12 个字符', trigger: 'blur' }
        ],
        desc: [
          { min: 2, max: 64, message: '长度在 2 到 64 个字符', trigger: 'blur' }
        ]
      },
      currentFileId: '',
      fileUploadPara: {
        data_type: 1,
        ownerId: '',
        parentId: '',
        selectCompanyId: ''
      },
      dataForTree: [{
        id: 1,
        label: '一级 1',
        children: [{
          id: 4,
          label: '二级 1-1',
          children: [{
            id: 9,
            label: '三级 1-1-1'
          }, {
            id: 10,
            label: '三级 1-1-2'
          }]
        }]
      }, {
        id: 2,
        label: '一级 2',
        children: [{
          id: 5,
          label: '二级 2-1'
        }, {
          id: 6,
          label: '二级 2-2'
        }]
      }, {
        id: 3,
        label: '一级 3',
        children: [{
          id: 7,
          label: '二级 3-1'
        }, {
          id: 8,
          label: '二级 3-2',
          children: [{
            id: 11,
            label: '三级 3-2-1'
          }, {
            id: 12,
            label: '三级 3-2-2'
          }, {
            id: 13,
            label: '三级 3-2-3'
          }]
        }]
      }]
    }
  },
  computed: {
    ...mapGetters(['createFileSuccessData']),
    isSystemManage() {
      return this.$store.state.user.isSystemManage
    }
    // uploadSuccess() {
	  // 	return this.$store.state.user.isSystemManage
	  // }
  },
  watch: {
    createFileSuccessData(val) {
      this.enterFloderByQueryPath()
    },
    $route() {
      this.enterFloderByQueryPath()
    },
    pathNavData() {
      this.currentFileId = this.pathNavData.length > 0 ? this.pathNavData[this.pathNavData.length - 1].id : this.listQuery.selectCompanyId
    },
    fileUploadPara: {
      handler(newName, oldName) {
        store.dispatch('fileUpload/belongs', this.fileUploadPara)
      },
      immediate: true,
      deep: true
    }

  },
  created() {
    this.listQuery.selectCompanyId = this.$route.query.selectCompanyId

    if (!this.$store.state.user.isSystemManage) {
      // 不是系统管理员进来之后
      this.listQuery.parentId = this.$store.state.user.userPermission.groupId
      this.listQuery.selectCompanyId = this.$store.state.user.userPermission.groupId
    }

    this.getCustomManageList()// 租户
    this.enterFloderByQueryPath()
    this.getCompanyAllTree()// 知识分类树

    this.getCompanyAllTreeFloorByName()// 知识分类啊啊

    this.getAlluserList()// 创建人
  },
  methods: {
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
    // ----------知识分类-----start------
    classifyButtonFn() {
      this.popoverVisible = !this.popoverVisible
      this.advancedVisible = false
    },
    advancedButtonFn() {
      this.popoverVisible = false
      this.advancedVisible = !this.advancedVisible
    },
    // 点击选择分类
    checkClassify(classify) {
      if (classify.treeId) {
        classify.nodeIdList = [classify.treeId]
        classify.nodeName = classify.treeName
      }
      var index = this.checkedClassifys.findIndex(function(item) {
        return item.nodeIdList.join() === classify.nodeIdList.join()
      })
      if (index > -1) {
        this.checkedClassifys.splice(index, 1)
      } else {
        this.checkedClassifys.push(classify)
      }
      this.classifyNodeIds()
    },
    // 删除标签
    handlePaperLabelDel(index) {
      this.checkedClassifys.splice(index, 1)
      this.classifyNodeIds()
    },
    // 过滤分类ids，进行搜索
    classifyNodeIds() {
      this.listQuery.classifyNodeIds.length = 0
      this.checkedClassifys.forEach(item => {
        this.listQuery.classifyNodeIds.push(item.nodeIdList)
      })
      this.list.length = 0
      this.total = 0
      this.listQuery.currentPage = 0

      this.$router.push({ path: '/knowledge-base/company-base/list', query: { path: '', selectCompanyId: this.listQuery.selectCompanyId }})
      this.enterFloderByQueryPath()
      // this.getKnowledgeSearchList()
    },
    // 根据 idList返回是否active
    isActiveClassify(classify) {
      if (classify.treeId) {
        classify.nodeIdList = [classify.treeId]
        classify.nodeName = classify.treeName
      }
      var index = this.checkedClassifys.findIndex(function(item) {
        return item.nodeIdList.join() === classify.nodeIdList.join()
      })
      if (index > -1) {
        return true
      } else {
        return false
      }
    },
    // ----------知识分类------end-----
    // 知识树获取租户所有树
    getCompanyAllTreeFloorByName() {
      this.treeList1.length = 0
      this.treeList2.length = 0
      getCompanyAllTreeFloorByName().then(res => {
        res.data.treeList = res.data.treeList || []
        var arr = JSON.parse(JSON.stringify(res.data.treeList))
        if (arr[0]) {
          this.treeList1 = arr[0]
        }
        if (arr[1]) {
          this.treeList2 = arr[1]
        }
      })
    },
    getFileShowSize(fileSize) {
      return getFileShowSize(fileSize)
    },
    parseFileType(row) {
      const fileTypeName = row.fileAttributeDesc === 'dir' ? '文件夹' : '文件'
      return fileTypeName
    },
    parseFileSize(row) {
      if (!row.fileSize) {
        return
      }
      var bytes = row.fileSize
      if (bytes === 0) return '0 B'
      const k = 1024
      const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i]
    },
    parseCreateUser(row) {
      return this.userInfoForList[row.userId].nickname
    },
    parseTypeOfFile(row) {
      if (row.fileAttributeDesc === 'dir') {
        return '#iconwenjianjia'
      } else {
        if (row.fileType === 1) {
          return '#iconvideo-'
        } else if (row.fileType === 2) {
          return '#iconaudio'
        } else if (row.fileType === 3) {
          return '#icontupian'
        } else if (row.fileType === 4) {
          return '#icontext'
        } else if (row.fileType === 5) {
          return '#iconppt'
        } else if (row.fileType === 6) {
          return '#icondoc'
        } else if (row.fileType === 7) {
          return '#iconpdf1'
        } else if (row.fileType === 8) {
          return '#iconwendangguanli'
        } else if (row.fileType === 9) {
          return '#iconwendangguanli'
        } else if (row.fileType === 10) {
          return '#iconex'
        } else if (row.fileType === 11) {
          return '#iconyasuobao'
        }
      }
      //  文件类型代码 VIDEO(1,"video"),AUDIO(2,"audio"),PIC(3,"pic"),TEXT(4,"text"),PPT(5,"ppt"),WORD(6,"word"),PDF(7,"pdf"),OTHER(8,"other"),UNKNOW(9,"unknow"),XLS(10,"xls"),ZIP(11,"zip")
      //  row.fileAttributeDesc==='dir' ? '#iconwenjianjia':''

      // return getFileShowSize(fileSize)
    },
    // 文件路径path--start
    goback() {
      this.pathNavData = this.pathNavData.slice(0, this.pathNavData.length - 1)
      let str = ''
      this.pathNavData.forEach((v, k, arr) => {
        str += str ? '/' + v.id + '|' + v.name : v.id + '|' + v.name
      })
      this.$router.push({ path: '/knowledge-base/company-base/list', query: { path: str, selectCompanyId: this.listQuery.selectCompanyId }})
    },
    pathNavClick(item, index) {
      if (item !== 'all') {
        this.pathNavData = this.pathNavData.slice(0, index + 1)
        let str = ''
        this.pathNavData.forEach((v, k, arr) => {
          str += str ? '/' + v.id + '|' + v.name : v.id + '|' + v.name
        })
        this.$router.push({ path: '/knowledge-base/company-base/list', query: { path: str, selectCompanyId: this.listQuery.selectCompanyId }})
      } else {
        this.pathNavData = []
        this.$router.push({ path: '/knowledge-base/company-base/list', query: { path: '', selectCompanyId: this.listQuery.selectCompanyId }})
      }
    },

    enterFolder(row) {
      if (row.fileAttributeDesc === 'dir') {
        // 进文件夹的检索和文件别的input检索不共存
        this.listQuery.currentPage = 1
        this.listQuery.keyword = ''
        this.pathQueryString += this.pathQueryString ? '/' + row.fileId + '|' + row.fileName : row.fileId + '|' + row.fileName
        this.$router.push({ path: '/knowledge-base/company-base/list', query: { path: this.pathQueryString, selectCompanyId: this.listQuery.selectCompanyId }})
      }
    },
    enterFloderByQueryPath() {
      if (this.$route.query.path) {
        this.pathQueryString = this.$route.query.path
        const pathArray = this.$route.query.path.split('/')
        this.pathNavData = []
        pathArray.forEach((v, k, arr) => {
          const obj = {
            id: v.split('|')[0],
            name: v.split('|')[1]
          }
          this.pathNavData.push(obj)
        })
        if (this.pathNavData.length > 0) {
          this.listQuery.parentId = this.pathNavData[this.pathNavData.length - 1].id
        } else {
          this.listQuery.parentId = ''
        }
      } else {
        this.pathNavData = []
        this.pathQueryString = ''
        this.listQuery.parentId = ''
      }

      this.fileUploadPara.ownerId = this.listQuery.selectCompanyId
      this.fileUploadPara.parentId = this.pathNavData.length > 0 ? this.pathNavData[this.pathNavData.length - 1].id : this.listQuery.selectCompanyId
      this.fileUploadPara.selectCompanyId = this.listQuery.selectCompanyId
      this.getDirList()
    },

    // 文件路径path--end
    modifyFileNameChange(row, val) {
      const reg = new RegExp('[\\\\/:*?\"<>|]')
      if (reg.test(val)) {
        row.fileName = row.originalTitle
        row.edit = false
        this.$message({
          message: '文件名不能包含【\\\/:*?\"<>|】这些非法字符,请重新命名!',
          type: 'warning'
        })
        return
      }
    },
    getCompanyAllTree() {
      getCompanyAllTree().then((res) => {
        const dataForTree = res.data.treeList.map((v, k, arr) => {
          return v.node
        })
        this.dataForTree = dataForTree
      })
    },
    // 获取所属租户list
    getCustomManageList() {
      getCustomManageList().then(res => {
        const allSelect = {
          customname: '全部',
          _id: ''
        }
        this.custom_list = [allSelect, ...res.data]
        if (this.$route.query.selectCompanyId) {
          // 只执行一次，为租户下拉还有文件夹到航的全部那里赋值
          const selctedCompany = this.custom_list.filter((v, k, arr) => {
            if (v._id === this.$route.query.selectCompanyId) {
              return v
            }
          })
          this.navselctedCompanyName = selctedCompany[0].customname
        }
      })
    },
    companyChange(val) {
      this.getAlluserList() // 创建人联动

      const selctedCompany = this.custom_list.filter((v, k, arr) => {
        if (v._id === val) {
          return v
        }
      })
      this.navselctedCompanyName = selctedCompany[0].customname
      this.pathQueryString = ''
      this.pathNavData = []
      this.$router.push({ path: '/knowledge-base/company-base/list', query: { path: this.pathQueryString, selectCompanyId: this.listQuery.selectCompanyId }})
      this.enterFloderByQueryPath()
    },

    // 获取所有用户
    getAlluserList() {
      const data = {
        groupId: this.listQuery.selectCompanyId
      }
      findUserListByGroupId(data).then(res => {
        this.alluserList = res.data
        console.log('this.alluserList ', this.alluserList)
      })
    },
    // 搜索
    topSearch() {
      this.enterFloderByQueryPath()
    },
    // 重置
    reset() {
      // this.isReset = true
      // this.listQuery.content = ''// 技能名
      // this.listQuery.startTime = ''// 开始时间
      // this.listQuery.endTime = ''// 结束时间
      // this.listQuery.selectCompanyId = ''// 企业名称
      // // this.listQuery.egroup = ''// 分组
      // // this.listQuery.roleId = ''// 角色

      // this.time_range = []// 时间范围
      // this.getDirList()

    },
    // 知识库列表
    async  getDirList() {
      this.time_range = this.time_range || []
      this.listQuery.startTime = this.time_range[0]
      this.listQuery.endTime = this.time_range[1]

      this.listLoading = true
      const { data } = await listDirFile(this.listQuery)
      this.listLoading = false
      this.userInfoForList = data.userInfo
      this.list = data.page.list.map(v => {
        this.$set(v, 'edit', false) // https://vuejs.org/v2/guide/reactivity.html
        v.originalTitle = v.fileName //  will be used when user click the cancel botton
        return v
      })
      this.total = data.page.totalCount
    },

    selectable(row, index) {
      return true
      // return row.auth
    },

    // ////////////////////////////////////知识库////////////////////////////////////

    // 选中数据
    select_fn(rows) {
      this.selectedRow = rows
    },

    // 批量加入知识分类
    classifySelected() {
      if (!this.selectedRow.length) {
        this.$message.warning('请勾选文件')
        return false
      } else {
        this.treeDialogVisible = true
      }
    },
    classifySelectedConfirm() {
      this.$confirm('确定要加入知识分类吗？', '加入知识分类', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const fileIds = this.selectedRow.map((v, k, arr) => {
          return v.fileId
        })
        const nodeIds = this.$refs.classifyTree.getCheckedNodes().map((v, k, arr) => {
          return v.id
        })
        const postData = {
          fileIds,
          nodeIds
        }
        classifyFiles(postData).then(() => {
          this.$message.success('加入知识分类成功')
          this.treeDialogVisible = false
        })
      }).catch(() => {})
    },

    // 授权
    authorize_fn(row) {
      this.$router.push({ path: '/user-center/skill-manager/authorize', query: { id: row._id }})
    },

    cancelEdit(row) {
      row.fileName = row.originalTitle
      row.edit = false
      this.$message({
        message: '文件夹名称恢复到原来的名称',
        type: 'warning'
      })
    },
    confirmEdit(row) {
      const postId = { 'fileId': row.fileId, name: row.fileName }
      updateDir(postId).then(() => {
        row.edit = false
        row.originalTitle = row.fileName
        this.$message({
          message: '文件夹重命名成功',
          type: 'success'
        })
      })
    },
    // 删除文件
    deleteDirFile(row) {
      this.$confirm('确定要删除该文件吗？', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const postId = { 'fileId': row.fileId }
        deleteDirFile(postId).then(() => {
          this.$message({
            message: '删除文件成功',
            type: 'success'
          })
        })
        this.enterFloderByQueryPath()
      }).catch(() => {})
    },
    deleteDirFileSelected(row) {
      this.$confirm('确定要批量删除该文件吗？', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const fileIdList = this.selectedRow.map((v, k, arr) => {
          return v.fileId
        })
        const postId = { fileIdList }
        deleteDirFile(postId).then(() => {
          this.$message({
            message: '删除文件成功',
            type: 'success'
          })
        })
        this.enterFloderByQueryPath()
      }).catch(() => {})
    },
    // 创建文件夹
    createFolder() {
      if (!this.listQuery.selectCompanyId) {
        this.$message({
          message: '请先勾选租户',
          type: 'warning'
        })
        return false
      }
      this.crateFolderDialogVisible = true
    },
    // 创建文件夹确认
    createFolderConfirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // ruleForm: {
          //   name: '',
          //   desc: ''
          // },
          const postData = {
            data_type: 1,
            enable_status: '1',
            desc: this.ruleForm.desc,
            name: this.ruleForm.name,
            ownerId: this.listQuery.selectCompanyId,
            selectCompanyId: this.listQuery.selectCompanyId,
            parentId: this.currentFileId
          }

          createDirFile(postData).then((res) => {
            if (res.code === 0) {
              this.$message({
                message: '文件夹创建成功',
                type: 'success'
              })
              this.enterFloderByQueryPath()
              this.crateFolderDialogVisible = false
              this.ruleForm = {
                name: '',
                desc: ''
              }
            }
          })
          //           data_type: 1
          // desc: "fff"
          // enable_status: "1"
          // name: "fff"
          // ownerId: "5db82db59a301f2f0a77221a"
          // parentId: "5db82db59a301f2f0a77221a"
          // selectCompanyId: "5db82db59a301f2f0a77221a
        } else {
          return false
        }
      })
    },
    // 下载
    //   downloadKnowledgeLibFile(row) {
    //     const fileId = row.fileId
    //     this.downloadFile('api/knowledgeDirFile/downloadFile?fileId=' + fileId)
    //   },
    // downloadFile(fileUrl) {
    //   $('#common_download_a').remove()
    //   var elemIF = document.createElement('iframe')
    //   elemIF.id = 'common_download_a'
    //   elemIF.src = fileUrl
    //   elemIF.style.display = 'none'
    //   elemIF.load = function() { $('#common_download_a').remove() }
    //   document.body.appendChild(elemIF)
    // },
    // downloadFileSelected(fileUrl) {
    //   $('#common_download_a').remove()
    //   var elemIF = document.createElement('iframe')
    //   elemIF.id = 'common_download_a'
    //   elemIF.src = fileUrl
    //   elemIF.style.display = 'none'
    //   elemIF.load = function() { $('#common_download_a').remove() }
    //   document.body.appendChild(elemIF)
    // },
    // 单个下载
    download(row) {
      const fileId = row.fileId
      const url = process.env.VUE_APP_BASE_API + 'api/knowledgeDirFile/downloadFile?fileId=' + fileId
      const a = document.createElement('a')
      a.id = 'common_download_a'
      a.download = row.fileName + '\.' + row.fileFormat
      a.href = url
      document.body.appendChild(a)
      a.click()
      $('#common_download_a').remove()
    },
    // 批量下载
    downloadFileSelected() {
      if (!this.selectedRow.length) {
        this.$message.warning('请选择文件！')
        return false
      }
      const fileIdList = []
      this.selectedRow.forEach(item => {
        fileIdList.push(item.fileId)
      })
      getDownloadToken({
        fileIdList,
        ownerId: this.listQuery.selectCompanyId
      }).then(response => {
        const token = response.data.token
        const size = this.getFileShowSize(response.data.size)
        this.$confirm('文件约为' + size + '确定要下载吗', '批量下载', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const url = process.env.VUE_APP_BASE_API + '/api/knowledgeDirFile/downloadZipFile?token=' + token
          const a = document.createElement('a')
          a.download = '批量下载.zip'
          a.href = url
          document.body.appendChild(a)
          a.click()
        }).catch(() => {})
      })
    },
    // 收藏
    shareFileToWorkDesk(row) {
      if(row.fileAttributeDesc==='dir'){
        this.$message({
          message: '只有文件才可以收藏',
          type: 'warning'
        })
        return 
      }
      this.$confirm('确定要收藏到工作台吗？', '收藏到工作台', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const postData = {
          fileId: row.fileId,
          fileIdList: [],
          fromCompany: false
        }
        shareFileToWorkDesk(postData).then(() => {
          this.$message({
            message: '收藏到工作台成功',
            type: 'success'
          })
        })
      }).catch(() => {})
    },
    shareFileToWorkDeskSlected() {
      if (!this.selectedRow.length) {
        this.$message.warning('请勾选文件')
        return false
      }
      this.$confirm('确定要将选中的文件收藏到工作台吗？', '收藏到工作台', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const fileIdList = this.selectedRow.map((v, k, arr) => {
          return v.fileId
        })
        const postData = {
          fileIdList,
          fromCompany: false
        }
        shareFileToWorkDesk(postData).then(() => {
          this.$message({
            message: '收藏到工作台成功',
            type: 'success'
          })
        })
      }).catch(() => {})
    },
    // 启动上传
    showUpload() {
      if (!this.listQuery.selectCompanyId) {
        this.$message({
          message: '请先勾选租户',
          type: 'warning'
        })
        return false
      }

      store.dispatch('fileUpload/isVisibility', 1)
    },
    // 移动
    moveFileSelected() {
      if (!this.selectedRow.length) {
        this.$message.warning('请选择文件！')
        return false
      }
      this.$message.warning('待开发')
    },
    moveFile() {
      this.$message.warning('待开发')
    }
  }
}
</script>

<style lang="scss" scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}

.pathNav{
  margin:15px 0;
}

.el-breadcrumb .el-breadcrumb__item{
  cursor: pointer;
}

// 知识分类树

 @import "~@/styles/theme.scss";

  .loading,
  .noMore {
    text-align: center;
    color: #606266;
  }
  .scrollbar-wrapper {
    overflow-x: hidden;
  }
  .knowledgeTree {
    display: inline-block;
    width: 49%;
  }
  .classifyTree {
    position: absolute;
    right: 0;
    top: 0;
  }
  .treeList {
    margin: 16px 0;
    padding: 16px;
    border: 1px solid #ebebeb;
    font-size: 14px;

    .treeName {
      font-size: 16px;
      margin-top: 0;
    }

    .treeList1, .treeList2 {
      display: inline-block;
      width: 49%;
      vertical-align: top;
    }
    .treeList2 {
      padding-left: 20px;
    }
    .classifyItem {
      margin-right: 20px;
    }

    .treeItem {
      padding: 10px 0;
      border-bottom: 1px solid #e8e8e8e8;
    }
    .activeClassify {
      color: $themeColor;
    }
  }

  .classifyTags{
    margin-bottom:20px;
  }
  .classifyTags /deep/ .el-tag {
    display: inline-block;
    margin-right: 10px;
  }
  .noData {
    text-align: center;
    /*display:flex;!*将其定义为弹性容器*!*/
    /*align-items: center;!*垂直居中对齐*!*/
    /*justify-content: center;!*水平居中对齐*!*/

    .changeKey {
      font-size: 12px;
      color: #838282;
    }
  }

  .itemExam {
    padding-top: 20px;
    border-bottom: 1px solid #e8e8e8;

    .outer {
      display: inline-block;
    }
    .cover {
      width: 150px;
      height: 150px;
      vertical-align: middle;
      text-align: center;
      display:flex;/*将其定义为弹性容器*/
      align-items: center;/*垂直居中对齐*/
      justify-content: center;/*水平居中对齐*/

      .imgCover {
        width: auto;
      }
    }

    .fileInfo {
      display: inline-block;
      vertical-align: top;
      font-size: 14px;

      .fileName {
        margin: 10px 0;
        font-size: 16px;
      }

      .nickname {
        display: inline-block;
        margin-right: 20px;
      }
      .groupName {
        display: inline-block;
      }
      span {
        display: inline-block;
        height: 20px;
        line-height: 20px;
      }
    }

    /deep/ .el-button {
      float: right;
      margin-right: 30px;
    }
}
</style>
