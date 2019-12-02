<!--文件分片断点续传UI组件-->
<template>
  <transition :name="transitionName">
    <div id="mainFileUpload" :style="visibility">
      <div id="header" class="clearfix">
        <p class="fl title">上传资料</p>
        <div class="fr icons">
          <span
            v-if="!isMinimality"
            @click="minimality"
          ><i
            class="minimality iconfont iconjianhao"
          /></span>
          <span
            v-if="isMinimality"
            @click="open"
          ><i
            class="spread iconfont iconjiahao"
          /></span>
          <span @click="close"><i class="close iconfont iconguanbi" /></span>
        </div>
      </div>
      <div class="content">
        <div id="filePicker">
          <div class="drag-upload">
            <i class="iconfont iconshangchuan" />
            <p>可拖拽文件至此直接上传</p>
          </div>
        </div>
        <div id="file-panel">
          <div id="file-list">
            <el-scrollbar wrap-class="scrollbar-wrapper">
              <ul
                v-for="(file, index) in fileList"
                :key="file.id"
                class="file-item"
                :class="`file-${file.id}`"
              >
                <li class="file-type" :icon="fileCategory(file.ext)">
                  <svg v-if="fileCategory(file.ext) === 'image'" class="icon" aria-hidden="true">
                    <use xlink:href="#icontupian" />
                  </svg>
                  <svg v-else-if="fileCategory(file.ext) === 'video'" class="icon" aria-hidden="true">
                    <use xlink:href="#iconvideo-" />
                  </svg>
                  <svg v-else-if="fileCategory(file.ext) === 'audio'" class="icon" aria-hidden="true">
                    <use xlink:href="#iconaudio" />
                  </svg>
                  <svg v-else-if="fileCategory(file.ext) === 'text'" class="icon" aria-hidden="true">
                    <use xlink:href="#icontext" />
                  </svg>
                  <svg v-else-if="fileCategory(file.ext) === 'excel'" class="icon" aria-hidden="true">
                    <use xlink:href="#iconex" />
                  </svg>
                  <svg v-else-if="fileCategory(file.ext) === 'ppt'" class="icon" aria-hidden="true">
                    <use xlink:href="#iconppt" />
                  </svg>
                  <svg v-else-if="fileCategory(file.ext) === 'pdf'" class="icon" aria-hidden="true">
                    <use xlink:href="#iconpdf1" />
                  </svg>
                  <svg v-else-if="fileCategory(file.ext) === 'compressed'" class="icon" aria-hidden="true">
                    <use xlink:href="#iconyasuobao" />
                  </svg>
                  <svg v-else class="icon" aria-hidden="true">
                    <use xlink:href="#iconyemian" />
                  </svg>
                </li>
                <el-tooltip
                  class="file-name-tip"
                  effect="dark"
                  :content="file.name"
                  placement="top-start"
                >
                  <li class="file-name singleLineOmission">{{ file.name }}</li>
                </el-tooltip>
                <li class="progress">
                  <el-progress :key="index" :percentage="progress[index]" />
                </li>
                <li class="file-size">{{ fileSize(file.size) }}</li>
                <!--<li class="file-status">上传中...</li>-->
                <li class="file-operate">
                  <!--<a title="开始" @click="resume(file)"><i class="iconfont iconkaishi" /></a>-->
                  <!--<a title="暂停" @click="stop(file)"><i class="iconfont iconzanting1" /></a>-->
                  <span
                    class="pointer file-remove"
                    title="移除"
                    @click="remove(file)"
                  ><i
                    class=" iconfont iconguanbi"
                  /></span>
                </li>
              </ul>
              <div v-if="!fileList.length" class="no-file">
                <i class="iconfont icon-empty-file" /> 暂无待上传文件
              </div>
            </el-scrollbar>
          </div>
        </div>
      </div>
      <div class="clearfix btnGroup">
        <div id="btnGroup" class="fr">
          <el-button type="primary" @click="clear()">清空上传</el-button>
        </div>
      </div>
      <vue-webuploader
        ref="uploader"
        upload-button="#filePicker"
        upload-dnd-button="#filePicker"
        multiple
        :form-data="formData"
        :url="url"
        @fileChange="fileChange"
        @progress="onProgress"
        @success="onSuccess"
      />
    </div>
  </transition>
</template>

<script>
import store from '@/store'
import { mapGetters } from 'vuex'
import VueWebuploader from '@/components/VueWebuploader/VueWebuploader.vue'
import { deskAddFile, knowledgeCreateFile } from '@/api/upload-file'
const WebUploader = window.WebUploader
const $ = window.$
export default {
  name: 'FileUploader',
  components: {
    VueWebuploader
  },
  props: {
    customStyle: {
      type: Object,
      default: function() {
        return {
          right: '50px',
          bottom: '0px'
        }
      }
    },
    transitionName: {
      type: String,
      default: 'fade'
    }
  },
  data() {
    return {
      uploadButton: 'filePicker',
      fileList: [], // 上传列表
      url: this.$store.state.user.applicationInfo.uploadUrl, // 租户上传路径
      formData: {
        // 参数
        userId: this.$store.state.user.applicationInfo.userId,
        companyId: this.$store.state.user.applicationInfo.companyId,
        appCode: this.$store.state.user.applicationInfo.appCode
      },
      fileQueued: new Map(), // 上传队列
      customColors: [
        { color: '#f56c6c', percentage: 20 },
        { color: '#e6a23c', percentage: 40 },
        { color: '#5cb87a', percentage: 60 },
        { color: '#1989fa', percentage: 80 },
        { color: '#20c7b3', percentage: 100 }
      ],
      progress: [], // 进度
      uploadIndex: 0 // 当前上传的文件下标
    }
  },
  computed: {
    uploader() {
      return this.$refs.uploader
    },
    ...mapGetters(['visibility', 'isMinimality', 'belongs'])
  },
  watch: {},
  mounted() {
    store.dispatch('fileUpload/isVisibility', 2)
  },
  created() {},
  methods: {
    // 关闭
    close() {
      store.dispatch('fileUpload/isVisibility', 2)
    },
    // 最小化
    minimality() {
      store.dispatch('fileUpload/isVisibility', 3)
    },
    // 展开
    open() {
      store.dispatch('fileUpload/isVisibility', 1)
    },

    // 上传变化
    fileChange(file) {
      if (!file.size) return
      this.fileList.push(file)
      this.progress[this.uploadIndex] = 0
      const sourceUid = file.source.uid // 文件上传文件唯一id
      const belongs = {
        data_type: this.belongs.data_type,
        ownerId: this.belongs.ownerId,
        parentId: this.belongs.parentId,
        selectCompanyId: this.belongs.selectCompanyId
      }
      this.fileQueued.set(sourceUid, belongs)
      console.log('fileChange', file)
    },

    // 上传进度
    onProgress(file, percent) {
      this.progress[this.uploadIndex] = (Math.ceil(percent * 100 * 100) / 100)
      $('.el-progress-bar__inner').eq(this.uploadIndex).width(this.progress[this.uploadIndex] + '%')
      $('.el-progress__text').eq(this.uploadIndex).text(this.progress[this.uploadIndex] + '%')
    },

    // 上传成功
    onSuccess(file, response) {
      console.log('file', file)
      console.log('response', response)
      this.uploadIndex++
      console.log('上传成功', file)
      console.log(this.belongs)
      console.log('file.path', file.path)
      file.path = file.path || ''
      const fileId = file.path.split('ZmlsZUlk=')[1]
      const sourceUid = file.source.uid // 文件上传文件唯一id
      var currentFile = this.fileQueued.get(sourceUid)
      console.log('sourceUid', sourceUid)
      console.log('currentFile', currentFile)
      console.log('this.fileQueued', this.fileQueued)
      console.log('fileId', fileId)
      if (currentFile.data_type === 3) {
        const params = {
          fileFormat: file.ext,
          fileName: file.name,
          fileSize: file.size,
          fileUrl: file.path,
          resourceFileId: fileId
        }
        deskAddFile(params).then(res => {
          console.log(res)
          this.$message.success('上传成功！')
          store.dispatch('fileUpload/deskAddFileSuccess', res.data)
        })
      } else {
        // const currentFile = this.fileQueued.get(sourceUid)
        const params = {
          format: file.ext,
          name: file.name,
          size: file.size,
          url: file.path,
          data_type: currentFile.data_type,
          ownerId: currentFile.ownerId,
          parentId: currentFile.parentId,
          selectCompanyId: currentFile.selectCompanyId,
          fileId: fileId
        }
        knowledgeCreateFile(params).then(res => {
          console.log(res)
          this.$message.success('上传成功！')
          store.dispatch('fileUpload/createFileSuccess', res.data)
        })
      }
    },

    // 开始
    resume(file) {
      this.uploader.upload(file)
    },
    // 暂停
    stop(file) {
      this.uploader.stop(file)
    },

    // 移除
    remove(file) {
      this.$confirm('确定要删除此上传任务吗？', '删除任务', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 取消并中断文件上传
          this.uploader.cancelFile(file)
          // 在队列中移除文件
          this.uploader.removeFile(file, true)

          // 在ui上移除
          const index = this.fileList.findIndex(ele => ele.id === file.id)
          this.fileList.splice(index, 1)
        })
        .catch(() => {})
    },

    // 清空
    clear() {
      var that = this
      if (this.fileList.length) {
        this.$confirm('确定要清空上传任务吗？', '清空上传', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            for (
              var index = 0, len = that.fileList.length;
              index < len;
              index++
            ) {
              var file = that.fileList[index]
              that.uploader.cancelFile(file)
              that.uploader.removeFile(file, true)
              that.fileList.splice(index--, 1)
            }
          })
          .catch(() => {})
      }
    },

    // 文件大小
    fileSize(size) {
      return WebUploader.Base.formatSize(size)
    },

    // 文件类别
    fileCategory(ext) {
      let type = ''

      const typeMap = {
        image: ['gif', 'jpg', 'jpeg', 'png', 'bmp', 'webp'],
        video: ['mp4', 'm3u8', 'rmvb', 'avi', 'swf', '3gp', 'mkv', 'flv'],
        audio: ['mp3', 'wma', 'rm', 'wav', 'midi', 'ape', 'flac'],
        text: [
          'doc',
          'txt',
          'docx',
          'pages',
          'epub'
        ],
        excel: ['numbers', 'csv', 'xls', 'xlsx'],
        ppt: ['keynote', 'ppt', 'pptx'],
        compressed: ['zip', 'rar'],
        pdf: ['pdf']
      }

      Object.keys(typeMap).forEach(_type => {
        const extensions = typeMap[_type]
        if (extensions.indexOf(ext) > -1) {
          type = _type
        }
      })

      return type
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/theme.scss";

#mainFileUpload {
  visibility: hidden;
  width: 38%;
  height: 60vh;
  position: fixed;
  bottom: -522px;
  right: 20px;
  z-index: 100;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  background: #ffffff;
  overflow: hidden;
  transition: bottom 1s;

  > #header {
    height: 40px;
    line-height: 40px;
    padding: 0 20px;
    background-color: $themeColor;

    > .title {
      color: #ffffff;
      margin: 0;
      font-size: 14px;
    }

    > .fr.icons span {
      width: 14px;
      height: 14px;
      background-color: #ffffff;
      color: $themeColor;
      cursor: pointer;
    }

    > .fr.icons span i {
      font-size: 14px;
    }
  }

  > .content {
    padding: 1.5vh 20px;

    > #filePicker {
      width: 100%;
      height: 15vh;
      background-color: #fafafa;
      border-radius: 5px;
    }
  }

  .drag-upload {
    width: 200px;
    margin: 0 auto;
    margin-top: 18px;
    color: #bbbbbb;

    > .iconfont {
      font-size: 50px;
    }
  }

  #file-panel {
    margin-top: 1.5vh;
  }

  #file-panel .el-scrollbar {
    height: 29vh;
  }

  #file-list {
    position: relative;
    overflow-y: auto;
  }

  .file-item {
    position: relative;
    height: 30px;
    line-height: 30px;
    padding: 0 10px;
    margin-bottom: 10px;
    border-bottom: 1px solid #ccc;
    background-color: #fff;
    z-index: 1;
    color: #575757;

    > li {
      display: inline-block;
    }

    > .file-type {
      width: 24px;
      height: 30px;
      vertical-align: top;

      > i {
        display: table-cell;
      }
    }
    > .file-name {
      width: 18%;
      vertical-align: top;
    }
    > .progress {
      width: 70%;

      > /deep/ .el-progress {
        width: 100%;
        height: 30px;
        line-height: 30px;
        display: table;
      }
    }

    > .file-size {
      width: 80px;
      position: absolute;
      left: 0px;
      right: 0px;
      bottom: 0px;
      top: 0px;
      margin: 0 auto;
      font-size: 14px;
      text-align: center;
    }
  }

  .file-remove {
    display: table-cell;
  }

  .no-file {
    text-align: center;
    color: #575757;
    font-size: 14px;
  }
}
.btnGroup {
  margin-right: 20px;
}

.file-item .progress /deep/ .el-progress-bar {
  width: 95%;
}

#filePicker /deep/ .webuploader-pick {
  width: 100% !important;
  height: 100% !important;
  background-color: #fafafa !important;
}

#filePicker /deep/ .webuploader-pick-hover {
  background-color: #fafafa !important;
}
#mainFileUpload > #header > .fr.icons span {
  padding: 0 1px;
}
</style>
