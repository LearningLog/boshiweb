<template>
  <div class="app-container">
    <div class="content">
      <el-radio-group
        v-model="type"
        class="tab"
        size="medium"
        @change="handleChangeTab"
      >
        <el-radio-button :label="1">全部</el-radio-button>
        <el-radio-button :label="2">视频</el-radio-button>
        <el-radio-button :label="3">文件</el-radio-button>
        <el-radio-button :label="4">小测试</el-radio-button>
      </el-radio-group>
      <div v-show="treeList1.floorList.length" id="topSearch">
        <span id="advancedSearchBtn" slot="reference" class="classifyTree" @click="classifyTreeVisible = !classifyTreeVisible">知识分类<i v-show="classifyTreeVisible" class="el-icon-caret-top" /><i v-show="!classifyTreeVisible" class="el-icon-caret-bottom" /></span>
        <transition name="fade-advanced-search">
          <div v-show="classifyTreeVisible" class="treeList">
            <div class="treeList1">
              <p class="treeName pointer" :class="{ activeClassify: isActiveClassify(treeList1)}" @click="checkClassify(treeList1)">{{ treeList1.treeName }}</p>
              <ul v-if="treeList1.floorList.length" class="">
                <li v-for="(item, index) in treeList1.floorList" :key="treeList1.treeId + index" class="treeItem">
                  <span v-for="item2 in item" :key="item2.nodeIdList.join()" class="classifyItem pointer" :class="{ activeClassify: isActiveClassify(item2) }" @click="checkClassify(item2)">{{ item2.nodeName }}</span>
                </li>
              </ul>
            </div>
            <div v-if="treeList2.floorList.length" class="treeList2">
              <p class="treeName pointer" :class="{ activeClassify: isActiveClassify(treeList2)}" @click="checkClassify(treeList2)">{{ treeList2.treeName }}</p>
              <ul v-if="treeList2.floorList.length" class="">
                <li v-for="(item, index) in treeList2.floorList" :key="treeList2.treeId + index" class="treeItem">
                  <span v-for="item2 in item" :key="item2.nodeIdList.join()" class="classifyItem pointer" :class="{ activeClassify: isActiveClassify(item2) }" @click="checkClassify(item2)">{{ item2.nodeName }}</span>
                </li>
              </ul>
            </div>
          </div>
        </transition>
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
      <el-scrollbar v-if="total" class="fileList" wrap-class="scrollbar-wrapper">
        <div v-if="type !== 4">
          <ul
            v-infinite-scroll="getKnowledgeSearchList2"
            :infinite-scroll-immediate="false"
          >
            <li v-for="(item, index) in list" :key="item.docId + type + index" class="itemFile">
              <el-image
                class="imgCover pointer"
                :src="(item.thumbnails && item.thumbnails[0]) || file_knowledge"
                fit="contain"
                @click.native="preview(item)"
              />
              <div class="fileInfo">
                <h4 class="fileName">{{ item.docTitle }}</h4>
                <span
                  v-if="item.fileDesc || item.autoDesc"
                >文件描述：{{ item.fileDesc || item.autoDesc }}</span>
                <span>创建时间：{{ item.createTime }}</span>
                <span
                  class="fileSize"
                >文件大小：{{
                  getFileShowSize(item.fileList && item.fileList[0].fileSize)
                }}</span>
              </div>
            </li>
          </ul>
        </div>
        <div v-else class="exams">
          <ul
            v-infinite-scroll="getExams2"
            :infinite-scroll-immediate="false"
          >
            <li v-for="(item, index) in examsList" :key="item._id + type + index" class="itemExam">
              <div class="outer">
                <div class="cover">
                  <el-image
                    class="imgCover"
                    :src="quiz"
                    fit="contain"
                  />
                </div>
              </div>
              <div class="fileInfo">
                <h4 class="fileName">{{ item.exam_name }}</h4>
                <div>
                  <span class="nickname">{{ item.nickname }}</span>
                  <span v-for="(item2, index2) in item.publish_group" :key="item2._id + type + index" class="groupName">
                    <span v-if="index2 === 0">{{ item2.groupName }}</span>
                    <span v-else>，{{ item2.groupName }}</span>
                  </span>
                </div>
                <div v-if="item.answer_status === 1">
                  <span>答题状态：未答题</span>
                </div>
                <div v-else>
                  <span>答题成绩：{{ item.answer_score }}</span>
                </div>
                <div>
                  <span>截止时间：{{ item.end_time }}</span>
                </div>
                <div>
                  <span>{{ item.examstatus }}</span>
                </div>
              </div>
              <el-button v-if="item.examstatusCode === 2 && item.answer_status === 1 && !item.haveTempTopic" type="primary" plain @click="toExam(item)">进入考试</el-button>
              <el-button v-else-if="item.examstatusCode === 2 && item.answer_status === 1 && item.haveTempTopic" type="primary" plain @click="toExam(item)">继续考试</el-button>
              <el-button v-else-if="item.examstatusCode === 3 || item.answer_status === 2" type="primary" plain @click="detail(item)">查看结果</el-button>
            </li>
          </ul>
        </div>
        <p v-if="loading" class="loading">加载中...</p>
        <p v-if="noMore" class="noMore">没有更多了</p>
      </el-scrollbar>
      <div v-if="(type !== 4 && !total) || (type === 4 && !total2)" class="noData">
        <img class="nodataimg" :src="nodataimg" alt="暂无数据">
        <p class="sorry">很抱歉，没有找到相关结果</p>
        <p class="changeKey">请修改或尝试其他搜索词</p>
      </div>
    </div>
    <FilePreview
      :is-file-preview="isFilePreview"
      :file-type="fileType"
      :file-url="fileUrl"
      :title="fileName"
      @closePreview="closePreview"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import FilePreview from '@/components/FilePreview'
import file_knowledge from '@/assets/images/file_knowledge.png'
import nodataimg from '@/assets/images/nodataimg.png'
import quiz from '@/assets/images/quiz.png'
import { getFileShowSize } from '@/utils/index'
import { knowledgeSearch, getCompanyAllTreeFloorByName, getExams } from '@/api/door/index'

export default {
  components: { FilePreview },
  data() {
    return {
      file_knowledge,
      nodataimg,
      quiz,
      classifyTreeVisible: false, // 是否展开知识分类
      listLoading: true, // 是否开启遮罩
      total: 0, // 总条数
      listQuery: {
        // 查询条件
        currentPage: 1, // 当前页
        pageSize: 10, // 当前页请求条数
        keyword: '', // 搜索关键字
        fileTypes: [], // ["video"]
        notFileTypes: [], // ["video"] 不展示的文件类型
        classifyNodeIds: [] // 分类id列表
      },
      list: [],
      type: 1, // 类型 1，全部；2，视频；3，文件；4，小测试
      isFilePreview: false, // 是否打开预览
      fileType: '', // 文件类型
      fileUrl: '', // 文件地址
      fileName: '', // 文件名称（弹窗title）
      loading: false,
      level: null, // 创建的主题级别 1，一级主题；2，子级主题
      // 知识树列表
      treeList1: {
        floorList: []
      },
      treeList2: {
        floorList: []
      },
      checkedClassifys: [], // 选中的分类
      examsList: [], // 试卷数组
      total2: 0, // 总条数
      listQuery2: {
        // 查询条件
        currentPage: 1, // 当前页
        pageSize: 10, // 当前页请求条数
        keyword: '', // 搜索关键字
        _id: ''
      }
    }
  },
  computed: {
    ...mapGetters(['keyword']),
    noMore() {
      return this.list.length && this.list.length >= this.total
    },
    disabled() {
      return this.loading || this.noMore
    }
  },
  watch: {
    keyword: function(val) {
      if (this.type !== 4) {
        this.list.length = 0
        this.listQuery.keyword = val
        this.getKnowledgeSearchList()
      } else {
        this.examsList.length = 0
        this.listQuery2.keyword = val
        this.getExams()
      }
    }
  },
  methods: {
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

    // 获取门户文件列表
    getKnowledgeSearchList() {
      this.listLoading = true
      this.loading = true
      knowledgeSearch(this.listQuery).then(res => {
        this.listLoading = false
        this.loading = false
        res.data.page.list = res.data.page.list || []
        res.data.page.list.forEach(item => {
          this.list.push(item)
        })
        this.total = res.data.page.totalCount
      })
    },

    // 获取试题
    getExams() {
      this.listLoading = true
      this.loading = true
      getExams(this.listQuery2).then(res => {
        this.listLoading = false
        this.loading = false
        res.data.page.list = res.data.page.list || []
        res.data.page.list.forEach(item => {
          this.examsList.push(item)
        })
        this.total2 = res.data.page.totalCount
      })
    },

    // 滚动加载考试
    getExams2() {
      if (this.examsList.length >= this.total2) {
        return false
      }
      this.listQuery2.currentPage++
      this.getExams()
    },

    // 滚动加载文件
    getKnowledgeSearchList2() {
      if (this.list.length >= this.total) {
        return false
      }
      this.listQuery.currentPage++
      this.getKnowledgeSearchList()
    },

    // 切换tab
    handleChangeTab(val) {
      switch (val) {
        case 1:
          this.listQuery.fileTypes = []
          this.listQuery.notFileTypes = []
          break
        case 2:
          this.listQuery.fileTypes = ['video']
          this.listQuery.notFileTypes = []
          break
        case 3:
          this.listQuery.fileTypes = []
          this.listQuery.notFileTypes = ['video']
          break
        case 4:
          this.examsList.length = 0
          this.getExams()
          break
        default:
          this.listQuery.fileTypes = []
          this.listQuery.notFileTypes = []
      }
      if (val !== 4) {
        this.list.length = 0
        this.listQuery.currentPage = 0
        this.getKnowledgeSearchList()
      }
    },

    // 转换文件大小
    getFileShowSize(fileSize) {
      return getFileShowSize(fileSize)
    },

    // 文件预览
    preview(item) {
      this.fileUrl = item.fileList[0].previewFileUrl
      this.fileType = item.fileList[0].fileType
      this.fileName = item.docTitle
      this.isFilePreview = true
    },
    // 监听预览
    closePreview() {
      this.isFilePreview = false
      this.fileUrl = ''
      this.fileType = ''
      this.title = ''
    },

    // 选择分类
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

    // 过滤分类ids，进行搜索
    classifyNodeIds() {
      this.listQuery.classifyNodeIds.length = 0
      this.checkedClassifys.forEach(item => {
        this.listQuery.classifyNodeIds.push(item.nodeIdList)
      })
      this.list.length = 0
      this.total = 0
      this.listQuery.currentPage = 0
      this.getKnowledgeSearchList()
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

    // 删除标签
    handlePaperLabelDel(index) {
      this.checkedClassifys.splice(index, 1)
      this.classifyNodeIds()
    },

    // 前往考试
    toExam(item) {
      this.$router.push({ path: '/exam', query: { id: item._id }})
    },

    // 查看考试结果
    detail(item) {
      this.$router.push({ path: '/exam-detail', query: { id: item._id }})
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/theme.scss";
.content {
  width: 1100px;
  margin: 0 auto;
  position: relative;

  .fileList.el-scrollbar {
    height: calc(100vh - 192px);
  }
  .itemFile {
    padding: 20px 0;
    border-bottom: 1px solid #ebebeb;

    .imgCover {
      width: 297px;
      height: 168px;
      display: inline-block;
      vertical-align: middle;
      border: 1px solid #ebebeb;
    }

    .fileInfo {
      display: inline-block;
      vertical-align: middle;
      margin-left: 20px;

      .fileSize {
        display: inline-block;
        margin-left: 20px;
      }
    }
  }
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
}
</style>
