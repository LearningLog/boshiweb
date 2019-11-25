<template>
  <div class="app-container">
    <div class="content">
      <el-radio-group v-model="type" class="tab" size="medium" @change="handleChangeTab">
        <el-radio-button :label="1">全部</el-radio-button>
        <el-radio-button :label="2">视频</el-radio-button>
        <el-radio-button :label="3">文件</el-radio-button>
        <el-radio-button :label="4">小测试</el-radio-button>
      </el-radio-group>
      <el-scrollbar class="fileList" wrap-class="scrollbar-wrapper">
        <div v-if="type !== 4">
          <ul v-infinite-scroll="getKnowledgeSearchList2" :infinite-scroll-immediate="false">
            <li
                v-for="item in list"
                :key="item.docId"
                class="itemFile"
            >
              <el-image
                  class="imgCover pointer"
                  :src="(item.thumbnails && item.thumbnails[0]) || file_knowledge"
                  fit="contain"
                  @click.native="preview(item)"
              />
              <div class="fileInfo">
                <h4 class="fileName">{{ item.docTitle }}</h4>
                <span v-if="item.fileDesc || item.autoDesc">文件描述：{{ item.fileDesc || item.autoDesc }}</span>
                <span>创建时间：{{ item.createTime }}</span>
                <span class="fileSize">文件大小：{{ getFileShowSize(item.fileList && item.fileList[0].fileSize) }}</span>
              </div>
            </li>
          </ul>
          <p class="loading" v-if="loading">加载中...</p>
          <p class="noMore" v-if="noMore">没有更多了</p>
        </div>
        <div class="exams" v-else>
          exams
        </div>
      </el-scrollbar>
    </div>
    <FilePreview :is-file-preview="isFilePreview" :file-type="fileType" :file-url="fileUrl" :title="fileName" @closePreview="closePreview" />
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
import FilePreview from '@/components/FilePreview'
import file_knowledge from '@/assets/images/file_knowledge.png'
import { getFileShowSize } from '@/utils/index'
import { knowledgeSearch, getExams } from '@/api/door/index'

export default {
  components: { FilePreview },
  data() {
    return {
      file_knowledge,
      listLoading: true, // 是否开启遮罩
      total: 0, // 总条数
      listQuery: { // 查询条件
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
      loading: false
    }
  },
  watch: {
    keyword: function(val) {
      this.list.length = 0
      this.listQuery.keyword = val
      this.getKnowledgeSearchList()
    }
  },
  created() {
    this.getKnowledgeSearchList()
  },
  computed: {
    ...mapGetters([
      'keyword'
    ]),
    noMore() {
      return this.list.length >= this.total
    },
    disabled() {
      return this.loading || this.noMore
    }
  },
  methods: {
    // 获取门户文件列表
    getKnowledgeSearchList() {
      this.listLoading = true
      this.loading = true
      knowledgeSearch(this.listQuery).then(res => {
        this.listLoading = false
        this.loading = false
        res.data.page.list.forEach(item => {
          this.list.push(item)
        })
        this.total = res.data.page.totalCount
      })
    },

    // 滚动加载
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

          break
        default:
          this.listQuery.fileTypes = []
          this.listQuery.notFileTypes = []
      }
      if (val !== 4) {
        this.list.length = 0
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
    }
  }
}
</script>

<style lang="scss" scoped>
  .content {
    width: 1100px;
    margin: 0 auto;

    .fileList.el-scrollbar {
      height: calc(100vh - 130px);
    }
    .itemFile {
      padding: 20px 0;
      border-bottom: 1px solid #EBEBEB;

      .imgCover {
        width: 297px;
        height: 168px;
        display: inline-block;
        vertical-align: middle;
        border: 1px solid #EBEBEB;
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
    .loading, .noMore {
      text-align: center;
    }
    .scrollbar-wrapper {
      overflow-x: hidden;
    }
  }
</style>
