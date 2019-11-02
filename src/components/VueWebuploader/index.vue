<template>
  <div class="page">
    <div id="filePicker">选择文件</div>

    <div class="file-panel">
      <h2>文件列表</h2>
      <div class="file-list">
        <ul v-for="file in fileList" :key="file.id" class="file-item" :class="`file-${file.id}`">
          <li class="file-type" :icon="fileCategory(file.ext)" />
          <li class="file-name">{{ file.name }}</li>
          <li class="file-size">{{ fileSize(file.size) }}</li>
          <li class="file-status">上传中...</li>
          <li class="file-operate">
            <a title="开始" @click="resume(file)"><i class="iconfont iconkaishi" /></a>
            <a title="暂停" @click="stop(file)"><i class="iconfont iconzanting1" /></a>
            <a title="移除" @click="remove(file)"><i class="iconfont iconquxiao1" /></a>
          </li>
          <li class="progress" />
        </ul>
        <div v-if="!fileList.length" class="no-file"><i class="iconfont icon-empty-file" /> 暂无待上传文件</div>
      </div>
    </div>

    <vue-webuploader
      ref="uploader"
      upload-button="#filePicker"
      multiple
      :form-data="formData"
      :url="url"
      @fileChange="fileChange"
      @progress="onProgress"
      @success="onSuccess"
    />
  </div>
</template>

<script>
import VueWebuploader from '@/components/VueWebuploader/VueWebuploader.vue'
import { deskAddFile, knowledgeCreateFile } from '@/api/uploadFile'
const $ = window.$

export default {
  name: 'FileUploader',
  components: {
    VueWebuploader
  },
  props: {
    // 上传最大数量 默认为100个
    belongs: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      fileList: [],
      url: this.$store.state.user.applicationInfo.uploadUrl,
      formData: {
        userId: this.$store.state.user.applicationInfo.userId,
        companyId: this.$store.state.user.applicationInfo.companyId,
        appCode: this.$store.state.user.applicationInfo.appCode
      },
      fileQueued: new Map()
    }
  },
  computed: {
    uploader() {
      return this.$refs.uploader
    }
  },
  watch: {},
  mounted() {},
  created() {},
  methods: {
    fileChange(file) {
      if (!file.size) return
      this.fileList.push(file)
      console.log(file)
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
      $(`.file-${file.id} .progress`).css('width', percent * 100 + '%')
      $(`.file-${file.id} .file-status`).html((percent * 100).toFixed(2) + '%')
    },

    // 上传成功
    onSuccess(file, response) {
      console.log('上传成功', file)
      console.log(this.belongs)
      console.log('file.path', file.path)
      file.path = file.path || ''
      const fileId = file.path.split('ZmlsZUlk=')[1]
      const sourceUid = file.source.uid // 文件上传文件唯一id
      if (this.belongs.data_type === 3) {
        const params = {
          fileFormat: file.ext,
          fileName: file.name,
          fileSize: file.size,
          fileUrl: file.path,
          resourceFileId: fileId
        }
        deskAddFile(params).then(res => {
          console.log(res)
          this.$message.success('工作台文件上传成功')
        })
      } else {
        const currentFile = this.fileQueued.get(sourceUid)
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
          if (currentFile.data_type === 1) {
            this.$message.success('企业知识库文件上传成功')
          } else {
            this.$message.success('小组知识库文件上传成功')
          }
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
      // 取消并中断文件上传
      this.uploader.cancelFile(file)
      // 在队列中移除文件
      this.uploader.removeFile(file, true)

      // 在ui上移除
      const index = this.fileList.findIndex(ele => ele.id === file.id)
      this.fileList.splice(index, 1)
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
        text: ['doc', 'txt', 'docx', 'pages', 'epub', 'pdf', 'numbers', 'csv', 'xls', 'xlsx', 'keynote', 'ppt', 'pptx']
      }

      Object.keys(typeMap).forEach((_type) => {
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

  $h-row: 50px;

  .file-panel {
    width: 840px;
    margin-top: 10px;
    box-shadow: 0 2px 12px 1px rgba(0, 0, 0, 0.1);

    > h2 {
      height: 40px;
      line-height: 40px;
      padding: 0 10px;
      border-radius: 4px 4px 0 0;
      border-bottom: 1px solid #ccc;
      background-color: #fff;
    }

    .file-list {
      position: relative;
      height: 360px;
      overflow-y: auto;
      background-color: rgb(250, 250, 250);
    }

    .file-item {
      position: relative;
      height: $h-row;
      line-height: $h-row;
      padding: 0 10px;
      border-bottom: 1px solid #ccc;
      background-color: #fff;
      z-index: 1;

      > li {
        display: inline-block;
      }
    }
    .file-type {
      width: 24px;
      height: 24px;
      vertical-align: -5px;
    }
    .file-name {
      width: 40%;
      margin-left: 10px;
    }
    .file-size {
      width: 20%;
    }
    .file-status {
      width: 20%;
    }
    .file-operate {
      width: 10%;

      > a {
        padding: 10px 4px;
        cursor: pointer;
        color: #666;

        &:hover {
          color: #ff4081;
        }
      }
    }

    /*.file-type[icon=text] {*/
    /*background: url(../../assets/images/icon/text-icon.png);*/
    /*}*/
    /*.file-type[icon=video] {*/
    /*background: url(../../assets/images/icon/video-icon.png);*/
    /*}*/
    /*.file-type[icon=image] {*/
    /*background: url(../../assets/images/icon/image-icon.png);*/
    /*}*/

    .progress {
      position: absolute;
      top: 0;
      left: 0;
      height: $h-row - 1;
      width: 0;
      background-color: #E2EDFE;
      z-index: -1;
    }

    .no-file {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 16px;
    }
  }
</style>
