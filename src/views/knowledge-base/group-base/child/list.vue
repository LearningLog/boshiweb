<template>
  <div class="list-box">
    <div id="topSearch">
      <el-input
        v-model="listQuery.keyword"
        placeholder="请输入文件名称"
        clearable
        @keyup.enter.native="topSearch"
      >
        <el-button slot="append" type="primary" icon="el-icon-search" @click="topSearch" />
      </el-input>
      <span id="advancedSearchBtn" slot="reference" @click="classifyButtonFn()">
        按知识分类搜索
        <i v-show="!popoverVisible" class="el-icon-caret-bottom" />
        <i v-show="popoverVisible" class="el-icon-caret-top" />
      </span>
      <span id="advancedSearchBtn" slot="reference" @click="advancedButtonFn()">
        高级搜索
        <i v-show="!advancedVisible" class="el-icon-caret-bottom" />
        <i v-show="advancedVisible" class="el-icon-caret-top" />
      </span>
      <transition name="fade-advanced-search">
        <el-row v-show="popoverVisible">
          <el-card id="advancedSearchArea" shadow="never">
            <div class="treeList">
              <div class="treeList1">
                <ul v-if="treeList1.floorList.length" class>
                  <li
                    v-for="(item, index) in treeList1.floorList"
                    :key="treeList1.treeId + index"
                    class="treeItem"
                  >
                    <span
                      v-for="item2 in item"
                      :key="item2.nodeIdList.join()"
                      class="classifyItem pointer"
                      :class="{ activeClassify: isActiveClassify(item2) }"
                      @click="checkClassify(item2)"
                    >{{ item2.nodeName }}</span>
                  </li>
                </ul>
              </div>
              <div v-if="treeList2.floorList.length" class="treeList2">
                <ul v-if="treeList2.floorList.length" class>
                  <li
                    v-for="(item, index) in treeList2.floorList"
                    :key="treeList2.treeId + index"
                    class="treeItem"
                  >
                    <span
                      v-for="item2 in item"
                      :key="item2.nodeIdList.join()"
                      class="classifyItem pointer"
                      :class="{ activeClassify: isActiveClassify(item2) }"
                      @click="checkClassify(item2)"
                    >{{ item2.nodeName }}</span>
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
              <el-form-item v-if="isSystemManage" label="所属租户">
                <el-select
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

              <el-form-item label="所属小组">
                <el-select
                  v-model="listQuery.ownerId"
                  placeholder="请选择所属小组"
                  clearable
                  filterable
                  @change="groupChange($event)"
                >
                  <el-option
                    v-for="item in group_list"
                    :key="item.inc"
                    :label="item.groupName"
                    :value="item.inc"
                  />
                </el-select>
              </el-form-item>

              <el-form-item label="创建人">
                <el-select v-model="listQuery.userId" placeholder="请选择创建人" clearable filterable>
                  <el-option
                    v-for="item in alluserList"
                    :key="item._id"
                    :label="item.nickname"
                    :value="item._id"
                  />
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
      <el-button type="primary" @click="createFolder">
        <i class="iconfont iconzengjia" />创建文件夹
      </el-button>
      <el-button type="primary" @click="classifySelected">
        <i class="iconfont iconzengjia" />加入知识分类
      </el-button>
      <el-button type="primary" @click="showUpload">
        <i class="iconfont iconzengjia" />上传资料
      </el-button>
    </div>
    <div class="pathNav">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item v-if="pathNavData.length > 0" @click.native="goback()">返回上一级</el-breadcrumb-item>
        <el-breadcrumb-item @click.native="pathNavClick('all')">{{ navselctedCompanyName }}</el-breadcrumb-item>
        <el-breadcrumb-item
          v-for="(item,index) in pathNavData"
          :key="index"
          @click.native="pathNavClick(item,index)"
        >{{ item.name }}</el-breadcrumb-item>
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
      >{{ item.nodeName }}</el-tag>
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
      <el-table-column type="selection" width="55" :selectable="selectable" />
      <el-table-column label="文件名" show-overflow-tooltip min-width="200">
        <!-- <template slot-scope="scope">
          <el-link type="primary" @click="detail(scope.row)">{{ scope.row.fileName }}</el-link>
        </template>-->
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input
              v-model="row.fileName"
              class="edit-input"
              size="mini"
              @input="modifyFileNameChange(row,$event)"
            />
            <el-button
              class="cancel-btn"
              size="mini"
              icon="iconfont iconzhongzhi"
              @click="cancelEdit(row)"
            >取消</el-button>
          </template>
          <div v-else style="text-align:left;cursor:pointer;" @click="enterFolder(row)">
            <span v-if="row.fileAttributeDesc!=='dir'" @click="preview(row)">
              <svg class="icon" aria-hidden="true" style="font-size:18px;">
                <use :xlink:href="parseTypeOfFile(row)" />
              </svg>
            </span>
            <span v-if="row.fileAttributeDesc==='dir'">
              <svg class="icon" aria-hidden="true" style="font-size:18px;">
                <use :xlink:href="parseTypeOfFile(row)" />
              </svg>
            </span>
            <!-- <i v-if="row.fileAttributeDesc==='dir'" class="iconfont iconwenjianjia" /> -->
            <span v-if="row.fileAttributeDesc!=='dir'" @click="preview(row)">{{ row.fileName }}</span>
            <span v-if="row.fileAttributeDesc==='dir'">{{ row.fileName }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="文件大小"
        min-width="100"
        align="center"
        show-overflow-tooltip
        prop="skill_desc"
      >
        <template slot-scope="{row}">
          <div>{{ parseFileSize(row) }}</div>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="文件属性"
        min-width="140"
        show-overflow-tooltip
        prop="fileAttributeDesc"
      >
        <template slot-scope="{row}">
          <div>{{ parseFileType(row) }}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建人" show-overflow-tooltip prop="groupName">
        <template slot-scope="{row}">
          <div>{{ parseCreateUser(row) }}</div>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="创建时间"
        min-width="140"
        show-overflow-tooltip
        prop="createTimeStr"
      />
      <el-table-column
        class-name="status-col"
        label="操作"
        width="260px"
        align="center"
        fixed="right"
      >
        <template slot-scope="scope">
          <!-- <el-button size="mini" @click="edit(scope.row)" ><i class="iconfont iconxiugai" />重命名</el-button> -->
          <el-button
            v-if="scope.row.edit"
            size="mini"
            icon="el-icon-circle-check-outline"
            @click="confirmEdit(scope.row)"
          >确定</el-button>
          <el-button
            v-else
            size="mini"
            icon="iconfont iconxiugai"
            @click="scope.row.edit=!scope.row.edit"
          >重命名</el-button>

          <el-button size="mini" @click="download(scope.row)">
            <i class="iconfont iconxiazai" />下载
          </el-button>
          <el-dropdown trigger="click">
            <el-button size="mini">
              <i class="iconfont icongengduo" />更多
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="moveFile(scope.row)"><i class="iconfont " />移动</el-dropdown-item>
              <el-dropdown-item @click.native="deleteDirFile(scope.row)">
                <i class="iconfont iconshanchu" />删除
              </el-dropdown-item>
              <el-dropdown-item @click.native="shareFileToWorkDesk(scope.row)">
                <i class="iconfont iconshoucang" />收藏
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.currentPage"
      :limit.sync="listQuery.pageSize"
      @pagination="getDirList"
    />
    <div id="bottomOperation">
      <el-button v-show="total>0" type="danger" plain @click="deleteDirFileSelected">
        <i class="iconfont iconshanchu" />批量删除
      </el-button>
      <el-button v-show="total>0" type="primary" plain @click="moveFileSelected"><i class="iconfont iconfenpeijineng" />批量移动</el-button>
      <el-button v-show="total>0" type="primary" plain @click="downloadFileSelected">
        <i class="iconfont iconxiazai" />批量下载
      </el-button>
      <el-button v-show="total>0" type="primary" plain @click="shareFileToWorkDeskSlected">
        <i class="iconfont iconshoucang" />批量收藏
      </el-button>
    </div>
    <el-dialog
      v-el-drag-dialog
      class="setInformationDialog"
      width="650px"
      height="650px"
      title="加入知识分类"
      :visible.sync="treeDialogVisible"
    >
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
    <el-dialog
      v-el-drag-dialog
      class="createFolders"
      width="650px"
      title="创建文件夹"
      :visible.sync="crateFolderDialogVisible"
    >
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item v-if="isSystemManage" v-show="!listQuery.ownerId" label="所属租户">
          <el-select
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
        <el-form-item v-show="!listQuery.ownerId" label="所属小组">
          <el-select
            v-model="listQuery.ownerId"
            placeholder="请选择所属小组"
            clearable
            filterable
            @change="groupChange($event)"
          >
            <el-option
              v-for="item in group_list"
              :key="item.inc"
              :label="item.groupName"
              :value="item.inc"
            />
          </el-select>
        </el-form-item>

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

<el-dialog
      v-el-drag-dialog
      title="移动"
      :visible.sync="menu_tree_flag"
      width="650px"
    >
      <div class="menu_tree_box">
        <el-scrollbar wrap-class="">
          <el-tree
            v-if="menu_tree_flag"
            ref="tree"
            :props="defaultProps"
            :load="loadPushTreeSubNode"
            lazy
            node-key="id"
            :check-strictly="true"
            :expand-on-click-node="false"
            :check-on-click-node="true"
            highlight-current
            @node-click="moveTreeNodeClick"
          />
        </el-scrollbar>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="moveTreeConfirm">确认</el-button>
        <el-button type="primary" plain @click="menu_tree_flag=false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import store from '@/store'
import { mapGetters } from 'vuex'
import {
  findUserListByGroupId,
  getCustomManageList,
  getUserEgroupInfo,
  listDirFile,
  getCompanyAllTree,
  classifyFiles,
  updateDir,
  deleteDirFile,
  createDirFile,
  shareFileToWorkDesk,
  getDownloadToken,
  getCompanyAllTreeFloorByName
} from '@/api/knowledge-base/group-base'
import { getFileShowSize, parseTime } from '@/utils/index'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
import file_knowledge from '@/assets/images/file_knowledge.png'

const $ = window.$
export default {
  directives: { elDragDialog },
  components: { Pagination },
  data() {
    return {
      menu_tree_flag: false, // 是否显示收藏弹窗和树
      defaultProps: {
        // 收藏弹窗和树的默认事件
        label: 'label',
        children: 'children',
        isLeaf: 'leaf'
      },
      fileidListToMove:[],
      filePackage: {}, // 存储后台返回url
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
      userInfoForList: {}, // 存储用户列表里面的信息用于列表里面的创建人
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
      custom_list: [], // 所属租户下拉
      group_list: [], // 所属小组下拉列表
      navselctedCompanyName: '全部',
      listQuery: {
        classifyNodeIds: [], // 分类节点id数组列表，二维数组
        classifyTreeIds: [], // 分类节点树id数组列表
        conditionParam: {},
        currentPage: 1,
        data_type: 2, // 数据类型 1企业知识库 2小组知识库
        keyword: '', // 搜索关键词
        ownerId: '', // 归属小组或租户id

        pageSize: 10,
        parentId: '',
        regexConditionParam: [],
        selectCompanyId: '', // 所属租户, // 企业/租户id
        sortColumn: '',
        sortOrder: ''
      },
      time_range: [], // 时间范围model
      selectedRow: [], // 选中的数据
      list: null, // 列表数据
      total: 0, // 总条数
      popoverVisible: false, // 高级搜索是否展开
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
        data_type: 2,
        ownerId: '',
        parentId: ''
        // ownerId: ''
      },
      dataForTree: [
        {
          id: 1,
          label: '一级 1',
          children: [
            {
              id: 4,
              label: '二级 1-1',
              children: [
                {
                  id: 9,
                  label: '三级 1-1-1'
                },
                {
                  id: 10,
                  label: '三级 1-1-2'
                }
              ]
            }
          ]
        },
        {
          id: 2,
          label: '一级 2',
          children: [
            {
              id: 5,
              label: '二级 2-1'
            },
            {
              id: 6,
              label: '二级 2-2'
            }
          ]
        },
        {
          id: 3,
          label: '一级 3',
          children: [
            {
              id: 7,
              label: '二级 3-1'
            },
            {
              id: 8,
              label: '二级 3-2',
              children: [
                {
                  id: 11,
                  label: '三级 3-2-1'
                },
                {
                  id: 12,
                  label: '三级 3-2-2'
                },
                {
                  id: 13,
                  label: '三级 3-2-3'
                }
              ]
            }
          ]
        }
      ]
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
      this.currentFileId =
        this.pathNavData.length > 0
          ? this.pathNavData[this.pathNavData.length - 1].id
          : this.listQuery.ownerId
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
    this.listQuery.ownerId = this.$route.query.ownerId
    this.getUserEgroupInfo() // 小组
    this.getCustomManageList()
    this.enterFloderByQueryPath()
    this.getCompanyAllTree() // 知识分类树
    this.getCompanyAllTreeFloorByName() // 知识分类啊啊

    this.getAlluserList() // 创建人联动
  },
  methods: {
    // 图片预览
    preview(row) {
      console.log(row)
      // this.filePackage[row.fileId].fileUrl
      let previewData = ''
      this.fileUrl = this.filePackage[row.filePackageId].subFileList.forEach(
        (v, k, arr) => {
          if (v.fileUse && v.fileUse === 'preview_file') {
            previewData = v
          }
        }
      )
      if (previewData === '') {
        this.$message({
          message: '该文件不能预览',
          type: 'warning'
        })
        return
      }
      this.fileUrl = previewData.fileUrl
      this.fileTypeCode = previewData.fileTypeCode
      this.fileFormat = previewData.fileFormat
      this.fileName = previewData.fileName
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

    // 获取所属租户list
    getCustomManageList() {
      getCustomManageList().then(res => {
        const allSelect = {
          customname: '全部',
          _id: ''
        }
        this.custom_list = [allSelect, ...res.data]
        // if (this.$route.query.selectCompanyId) {
        //   // 只执行一次，为租户下拉还有文件夹到航的全部那里赋值
        //   const selctedCompany = this.group_list.filter((v, k, arr) => {
        //     if (v._id === this.$route.query.selectCompanyId) {
        //       return v
        //     }
        //   })
        //   this.navselctedCompanyName = selctedCompany[0].customname
        // }
      })
    },

    // companyChange(val) {
    //   this.getAlluserList() // 创建人联动

    //   const selctedCompany = this.custom_list.filter((v, k, arr) => {
    //     if (v._id === val) {
    //       return v
    //     }
    //   })
    //   this.navselctedCompanyName = selctedCompany[0].customname
    //   this.pathQueryString = ''
    //   this.pathNavData = []
    //   this.$router.push({ path: '/knowledge-base/company-base/list', query: { path: this.pathQueryString, selectCompanyId: this.listQuery.selectCompanyId }})
    //   this.enterFloderByQueryPath()
    // },
    companyChange(event) {
      const postData = { selectCompanyId: event }
      getUserEgroupInfo(postData).then(res => {
        const allSelect = {
          groupName: '全部',
          inc: ''
        }
        res.data.egroupInfo.forEach((v, k, arr) => {
          v.inc = v.inc + ''
        })
        this.group_list = [allSelect, ...res.data.egroupInfo]
      })
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
    // ----------知识分类-----start------
    // 点击选择分类
    checkClassify(classify) {
      // 选择分类1.清空高级搜索2.清空进入文件夹搜索
      this.listQuery.currentPage = 1
      this.listQuery.keyword = '' // 关键字
      this.listQuery.userId = '' // 用户id
      this.time_range = [] // 创建时间

      // 清空文件夹点击今入搜索
      this.pathQueryString = ''
      this.$router.push({
        path: '/knowledge-base/group-base/list',
        query: { path: this.pathQueryString, ownerId: this.listQuery.ownerId }
      })

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

      this.$router.push({
        path: '/knowledge-base/group-base/list',
        query: { path: '', ownerId: this.listQuery.ownerId }
      })
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
    getFileShowSize(fileSize) {
      return getFileShowSize(fileSize)
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
      this.$router.push({
        path: '/knowledge-base/group-base/list',
        query: { path: str, ownerId: this.listQuery.ownerId }
      })
    },
    pathNavClick(item, index) {
      if (item !== 'all') {
        this.pathNavData = this.pathNavData.slice(0, index + 1)
        let str = ''
        this.pathNavData.forEach((v, k, arr) => {
          str += str ? '/' + v.id + '|' + v.name : v.id + '|' + v.name
        })
        this.$router.push({
          path: '/knowledge-base/group-base/list',
          query: { path: str, ownerId: this.listQuery.ownerId }
        })
      } else {
        this.pathNavData = []
        this.$router.push({
          path: '/knowledge-base/group-base/list',
          query: { path: '', ownerId: this.listQuery.ownerId }
        })
      }
    },

    enterFolder(row) {
      if (row.fileAttributeDesc === 'dir') {
        // 1.进文件夹的检索和文件别的input检索不共存
        // 2.进文件夹的检索与知识分类搜索不共存
        this.listQuery.currentPage = 1
        this.listQuery.keyword = '' // 关键字
        this.listQuery.userId = '' // 用户id
        this.time_range = [] // 创建时间

        this.checkedClassifys = [] // 选中的分类展示数据
        this.listQuery.classifyNodeIds = [] // 给后台发送的选择分类id数据

        this.pathQueryString += this.pathQueryString
          ? '/' + row.fileId + '|' + row.fileName
          : row.fileId + '|' + row.fileName
        this.$router.push({
          path: '/knowledge-base/group-base/list',
          query: { path: this.pathQueryString, ownerId: this.listQuery.ownerId }
        })
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
          this.listQuery.parentId = this.pathNavData[
            this.pathNavData.length - 1
          ].id
        } else {
          this.listQuery.parentId = this.listQuery.ownerId
        }
      } else {
        this.pathNavData = []
        this.pathQueryString = ''
        this.listQuery.parentId = this.listQuery.ownerId
      }

      this.fileUploadPara.ownerId = this.listQuery.ownerId
      this.fileUploadPara.parentId =
        this.pathNavData.length > 0
          ? this.pathNavData[this.pathNavData.length - 1].id
          : this.listQuery.ownerId
      this.fileUploadPara.ownerId = this.listQuery.ownerId
      this.getDirList()
    },

    // 文件路径path--end
    modifyFileNameChange(row, val) {
      const reg = new RegExp('[\\\\/:*?"<>|]')
      if (reg.test(val)) {
        row.fileName = row.originalTitle
        row.edit = false
        this.$message({
          message: '文件名不能包含【\\/:*?"<>|】这些非法字符,请重新命名!',
          type: 'warning'
        })
        return
      }
    },
    getCompanyAllTree() {
      getCompanyAllTree().then(res => {
        const dataForTree = res.data.treeList.map((v, k, arr) => {
          return v.node
        })
        this.dataForTree = dataForTree
      })
    },
    // 获取所属租户list
    getUserEgroupInfo() {
      getUserEgroupInfo().then(res => {
        const allSelect = {
          groupName: '全部',
          inc: ''
        }
        res.data.egroupInfo.forEach((v, k, arr) => {
          v.inc = v.inc + ''
        })
        this.group_list = [allSelect, ...res.data.egroupInfo]
        if (this.$route.query.ownerId) {
          // 只执行一次，为租户下拉还有文件夹到航的全部那里赋值
          const selctedCompany = this.group_list.filter((v, k, arr) => {
            if (v.inc === this.$route.query.ownerId) {
              return v
            }
          })
          this.navselctedCompanyName = selctedCompany[0].groupName
        }
      })
    },

    groupChange(val) {
      const selctedCompany = this.group_list.filter((v, k, arr) => {
        if (v.inc === val) {
          return v
        }
      })
      this.navselctedCompanyName = selctedCompany[0].groupName
      this.pathQueryString = ''
      this.pathNavData = []
      this.$router.push({
        path: '/knowledge-base/group-base/list',
        query: { path: this.pathQueryString, ownerId: this.listQuery.ownerId }
      })
      this.enterFloderByQueryPath()
    },
    // 搜索
    topSearch() {
      // 1.高级搜索在根目录下搜索 --清空点击进入文件夹搜索
      // 2.高级搜索分类搜索置空
      this.pathQueryString = ''
      this.$router.push({
        path: '/knowledge-base/group-base/list',
        query: { path: this.pathQueryString, ownerId: this.listQuery.ownerId }
      })

      this.checkedClassifys = [] // 选中的分类
      this.listQuery.classifyNodeIds = [] // 给后台

      this.enterFloderByQueryPath()
    },
    // 重置
    reset() {
      // this.isReset = true
      // this.listQuery.content = ''// 技能名
      // this.listQuery.startTime = ''// 开始时间
      // this.listQuery.endTime = ''// 结束时间
      // this.listQuery.ownerId = ''// 企业名称
      // // this.listQuery.egroup = ''// 分组
      // // this.listQuery.roleId = ''// 角色
      // this.time_range = []// 时间范围
      // this.getDirList()
    },
    // 知识库列表
    async getDirList() {
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
      })
        .then(() => {
          const fileIds = this.selectedRow.map((v, k, arr) => {
            return v.fileId
          })
          const nodeIds = this.$refs.classifyTree
            .getCheckedNodes()
            .map((v, k, arr) => {
              return v.id
            })
          const postData = {
            fileIds,
            nodeIds
          }
          classifyFiles(postData).then(() => {
            this.$message.success('加入知识分类成功！')
            this.treeDialogVisible = false
          })
        })
        .catch(() => {})
    },

    // 授权
    authorize_fn(row) {
      this.$router.push({
        path: '/user-center/skill-manager/authorize',
        query: { id: row.inc }
      })
    },

    cancelEdit(row) {
      row.fileName = row.originalTitle
      row.edit = false
      this.$message({
        message: '文件夹名称恢复到原来的名称！',
        type: 'warning'
      })
    },
    confirmEdit(row) {
      const postId = { fileId: row.fileId, name: row.fileName }
      updateDir(postId).then(() => {
        row.edit = false
        row.originalTitle = row.fileName
        this.$message({
          message: '文件夹重命名成功！',
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
      })
        .then(() => {
          const postId = { fileId: row.fileId }
          deleteDirFile(postId).then(() => {
            this.$message({
              message: '删除文件成功！',
              type: 'success'
            })
            this.enterFloderByQueryPath()
          })
        })
        .catch(() => {})
    },
    deleteDirFileSelected(row) {
      this.$confirm('确定要批量删除该文件吗？', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const fileIdList = this.selectedRow.map((v, k, arr) => {
            return v.fileId
          })
          const postId = { fileIdList }
          deleteDirFile(postId).then(() => {
            this.$message({
              message: '删除文件成功！',
              type: 'success'
            })
            if (this.list.length - this.selectedRow.length === 0) {
              // 如果当前页数据已删完，则去往上一页
              this.listQuery.currentPage -= 1
            }
            this.enterFloderByQueryPath()
          })
        })
        .catch(() => {})
    },
    // 创建文件夹
    createFolder() {
      this.crateFolderDialogVisible = true
    },
    // 创建文件夹确认
    createFolderConfirm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // ruleForm: {
          //   name: '',
          //   desc: ''
          // },
          const postData = {
            data_type: 2,
            enable_status: '1',
            desc: this.ruleForm.desc,
            name: this.ruleForm.name,
            ownerId: this.listQuery.ownerId,
            parentId: this.currentFileId
          }

          createDirFile(postData).then(res => {
            if (res.code === 0) {
              this.$message({
                message: '文件夹创建成功！',
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
          //           data_type: 2
          // desc: "fff"
          // enable_status: "1"
          // name: "fff"
          // ownerId: "5db82db59a301f2f0a77221a"
          // parentId: "5db82db59a301f2f0a77221a"
          // ownerId: "5db82db59a301f2f0a77221a
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
      const url =
        process.env.VUE_APP_BASE_API +
        'api/knowledgeDirFile/downloadFile?fileId=' +
        fileId
      const a = document.createElement('a')
      a.id = 'common_download_a'
      a.download = row.fileName + '.' + row.fileFormat
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
        ownerId: this.listQuery.ownerId
      }).then(response => {
        const token = response.data.token
        const size = this.getFileShowSize(response.data.size)
        this.$confirm('文件约为' + size + '确定要下载吗', '批量下载', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            const url =
              process.env.VUE_APP_BASE_API +
              '/api/knowledgeDirFile/downloadZipFile?token=' +
              token
            const a = document.createElement('a')
            a.download = '批量下载.zip'
            a.href = url
            document.body.appendChild(a)
            a.click()
          })
          .catch(() => {})
      })
    },
    // 收藏
    shareFileToWorkDesk(row) {
      if (row.fileAttributeDesc === 'dir') {
        this.$message({
          message: '只有文件才可以收藏！',
          type: 'warning'
        })
        return
      }
      this.$confirm('确定要收藏到工作台吗？', '收藏到工作台', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const postData = {
            fileId: row.fileId,
            fileIdList: [],
            fromCompany: false
          }
          shareFileToWorkDesk(postData).then(() => {
            this.$message({
              message: '收藏到工作台成功！',
              type: 'success'
            })
          })
        })
        .catch(() => {})
    },
    shareFileToWorkDeskSlected() {
      if (!this.selectedRow.length) {
        this.$message.warning('请勾选文件！')
        return false
      }
      this.$confirm('确定要将选中的文件收藏到工作台吗？', '收藏到工作台', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const fileIdList = this.selectedRow.map((v, k, arr) => {
            return v.fileId
          })
          const postData = {
            fileIdList,
            fromCompany: false
          }
          shareFileToWorkDesk(postData).then(() => {
            this.$message({
              message: '收藏到工作台成功！',
              type: 'success'
            })
          })
        })
        .catch(() => {})
    },
    // 启动上传
    showUpload() {
      if (!this.listQuery.ownerId) {
        this.$message({
          message: '请先勾选小组！',
          type: 'warning'
        })
        return false
      }
      store.dispatch('fileUpload/isVisibility', 1)
    },
 // ============================================移动===start=======================================
    // 移动
    moveFileSelected() {
      if (!this.selectedRow.length) {
        this.$message.warning('请选择文件！')
        return false
      }
      this.fileidListToMove = []
      console.log(this.selectedRow)
      this.selectedRow.forEach( (v,k,arr)=>{
        this.fileidListToMove.push(v.fileId)
      })
      this.menu_tree_flag = true
    },
    moveFile(row) {
      this.fileidListToMove = []
      this.fileidListToMove = [row.fileId]
      this.menu_tree_flag = true
    },
    moveTreeConfirm(){
      var selectNodes = this.$refs.tree.getCheckedNodes()
        console.log(selectNodes)
      if (selectNodes.length === 0) {
        this.$message.warning('请选择移动到的文件夹！')
        return
      }
      let parmData={
        fileIdList:  this.fileidListToMove,
        parentId: selectNodes[0].id
      }
      moveDirFile(parmData).then((res)=>{
          this.$message.warning('移动文件夹成功！')
          this.enterFloderByQueryPath()
          this.menu_tree_flag=false;
      })
    },
    // 移动到树
    // 加载节点子节点
    loadPushTreeSubNode(node, resolve) {
      console.log(node)
      if (node.level === 0) {
        // 加载根节点
        var companyId = this.listQuery.selectCompanyId
        const companyTree = { label: '企业知识库', id: companyId, type: 'company', ownerId: companyId, parentId: companyId, path: '企业知识库' }
        const groupTree = { label: '小组知识库', id: 'allEgroup', type: 'egroup', companyId: companyId, disabled: true }
        return resolve([companyTree])
      }
      var that = this
      var nodeData = node.data
      if (this.fileidListToMove.indexOf(nodeData.id)>-1) {
        this.$message({
          message: '不能移动文件到该文件或者文件的子文件下面',
          type: 'warning'
        })
        return resolve([])
      }

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
        listDirFile(requestData).then(response => {
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
    moveTreeNodeClick(nodeData, node, tree) {
      if (!('loadMore' in nodeData)&&this.fileidListToMove.indexOf(nodeData.id)>-1) {
        this.$message({
          message: '不能移动文件到该文件或者文件的子文件下面',
          type: 'warning'
        })
        return
      }

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
      listDirFile(requestData).then(response => {
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
    }
    // ============================================移动=end=========================================
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

.pathNav {
  margin: 15px 0;
}

.el-breadcrumb .el-breadcrumb__item {
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

  .treeList1,
  .treeList2 {
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

.classifyTags {
  margin-bottom: 20px;
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
    display: flex; /*将其定义为弹性容器*/
    align-items: center; /*垂直居中对齐*/
    justify-content: center; /*水平居中对齐*/

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

      .menu_tree_box {
      width: 60%;
      margin: 0 auto;
    }
  .menu_tree_box /deep/ .el-scrollbar {
    height: calc(60vh - 170px);
  }
}
</style>
