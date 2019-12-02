<template>
  <div class="selectFile">
    <el-dialog
      v-el-drag-dialog
      title="选择文件"
      width="592px"
      :visible.sync="selectFilVisible"
      @close="cancel"
    >
      <div class="clearfix searchFile">
        <div class="fl">
          <el-upload
            v-if="isUpload"
            ref="uploadFile"
            class="uploadFile"
            name="thumbnailfile"
            :action="uploadUrl()"
            :headers="headers"
            accept=".ppt,.pptx,.doc,.docx,.pdf,.xls,.xlsx"
            :data="fileInfo"
            :limit="2"
            :show-file-list="false"
            :on-change="changeUpload"
            :on-success="handleSuccess"
            :on-error="handleUploadError"
          >
            <el-button
              type="primary"
            ><i class="iconfont iconshangchuan" />上传</el-button>
          </el-upload>
        </div>
        <div class="fr">
          <el-input
            v-model="listQuery.fileName"
            class="global-search"
            placeholder="请输入文件名称"
            clearable
            @keyup.enter.native="getFileList2"
            @clear="getFileList2"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getFileList2"
            />
          </el-input>
        </div>
      </div>
      <el-scrollbar wrap-class="scrollbar-wrapper">
        <ul v-infinite-scroll="scrollGetFileList" class="fileList">
          <li
            v-for="(item, index) in list"
            :key="item.c_timestamp + index"
            class="itemFile"
            :class="{
              forbid: item.file_status === 0 || item.file_status === 1
            }"
          >
            <div
              v-if="item.file_status === 0 || item.file_status === 1"
              class="tc forbidCover"
            >
              <span class="text">文件处理中...</span>
            </div>
            <el-radio-group
              v-if="item.file_status === 4"
              v-model="radio"
              class="checkbox"
              @change="checkChange"
            >
              <el-radio
                :label="item"
                :disabled="item.file_status === 0 || item.file_status === 1"
              >{{ item.aaa }}</el-radio>
            </el-radio-group>
            <el-image
              class="imgCover"
              :src="item.preview_pic || file_knowledge"
              fit="contain"
            />
            <!--<el-tooltip effect="dark" :content="item.name" placement="top">-->
            <span class="name">{{ item.name }}</span>
            <!--</el-tooltip>-->
          </li>
        </ul>
      </el-scrollbar>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveFile">确定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import elDragDialog from '@/directive/el-drag-dialog'
import { getFileListManage } from '@/api/work-desk/work-desk'
import { deskAddFile } from '@/api/upload-file'
import { getToken } from '@/utils/auth'
import file_knowledge from '@/assets/images/file_knowledge.png'

export default {
  name: 'SelectFile',
  directives: { elDragDialog },
  props: {
    fileTypeList: {
      type: Array,
      default() {
        return []
      }
    },
    visible: {
      type: Boolean,
      default: false
    },
    isUpload: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      file_knowledge,
      selectFilVisible: false,
      total: null,
      listQuery: {
        currentPage: 1,
        pageSize: 15,
        fileName: '',
        fileTypeList: [],
        fileUseList: ['preview_pic', 'preview_file'],
        fileStatusList: [0, 1, 4],
        fileIdList: []
      },
      list: [], // 列表
      queryFileIdList: [], // 未完成编码的文件id
      filePackageIdWorkDeskFile: {}, // Map
      checkList: [], // 选中的数据
      radio: '',
      headers: {
        Authorization: getToken() // 图片上传 header
      },
      fileInfo: {}, // 上传数据 似乎没用。。
      fileName: '', // 上传的文件名
      timer: -1
    }
  },
  watch: {
    visible: function(val, val2) {
      if (val) {
        var that = this
        this.listQuery.fileTypeList = this.fileTypeList
        this.listQuery.currentPage = 0
        this.list.length = 0
        this.selectFilVisible = true
        that.getFileList()
        that.timer = setInterval(function() {
          that.intervalGetFileList()
        }, 10000)
      }
    }
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    // 滚动加载的逻辑
    scrollGetFileList() {
      if (this.list.length >= this.total) {
        return false
      }
      this.listQuery.currentPage++
      this.getFileList()
    },

    // 获取文件列表
    getFileList() {
      getFileListManage(this.listQuery).then(res => {
        this.total = res.data.page.totalCount
        res.data.page.list.forEach(item => {
          this.list.push(item)
        })
        const { filePackageIdWorkDeskFile } = res.data
        for (var key in filePackageIdWorkDeskFile) {
          this.filePackageIdWorkDeskFile[key] = filePackageIdWorkDeskFile[key]
          if (filePackageIdWorkDeskFile[key].file_status === 4) {
            var _id = filePackageIdWorkDeskFile[key]._id
            var _idnex = this.queryFileIdList.indexOf(_id)
            this.queryFileIdList.splice(_idnex, 1)
          }
        }
        this.list.forEach(item => {
          item.name = this.filePackageIdWorkDeskFile[item.mainFileId].name
          item.c_timestamp = this.filePackageIdWorkDeskFile[
            item.mainFileId
          ].c_timestamp
          item.file_status = this.filePackageIdWorkDeskFile[
            item.mainFileId
          ].file_status
          item.subFileList = item.subFileList || []
          item.subFileList.find(item2 => {
            if (item2.fileUse === 'preview_pic') {
              item.preview_pic = item2.fileUrl
            }
          })
        })
      })
    },

    // 搜索
    getFileList2() {
      if (!this.listQuery.fileName && this.list.length) return false
      this.list = []
      this.getFileList()
    },

    // 定时获取未编码完成的文件
    intervalGetFileList() {
      if (!this.queryFileIdList.length) return false
      getFileListManage({ fileIdList: this.queryFileIdList }).then(res => {
        const { filePackageIdWorkDeskFile } = res.data
        const { list } = res.data.page
        for (var key in filePackageIdWorkDeskFile) {
          if (filePackageIdWorkDeskFile[key].file_status === 4) {
            var _id = filePackageIdWorkDeskFile[key]._id
            var _idnex = this.queryFileIdList.indexOf(_id)
            this.queryFileIdList.splice(_idnex, 1)
          }
          for (var i = 0, len = list.length; i < len; i++) {
            var item = list[i]
            if (filePackageIdWorkDeskFile[item.mainFileId].file_status === 4) {
              const file = item
              file.name = filePackageIdWorkDeskFile[item.mainFileId].name
              file.c_timestamp =
                filePackageIdWorkDeskFile[item.mainFileId].c_timestamp
              file.file_status =
                filePackageIdWorkDeskFile[item.mainFileId].file_status
              file.subFileList = item.subFileList || []
              file.subFileList.find(item2 => {
                if (item2.fileUse === 'preview_pic') {
                  file.preview_pic = item2.fileUrl
                }
              })
              filePackageIdWorkDeskFile[item.mainFileId].file = file
              continue
            }
          }
        }
        for (var j = 0, len2 = this.list.length; j < len2; j++) {
          var item2 = this.list[j]
          if (
            filePackageIdWorkDeskFile[item2.mainFileId] &&
            filePackageIdWorkDeskFile[item2.mainFileId].file_status === 4
          ) {
            const file = JSON.parse(JSON.stringify(filePackageIdWorkDeskFile[item2.mainFileId].file))
            item2.name = file.name
            item2.c_timestamp = file.c_timestamp
            item2.file_status = file.file_status
            item2.subFileList = file.subFileList
            item2.fileFormat = file.fileFormat
            item2.fileName = file.fileName
            item2.fileType = file.fileType
            item2.fileTypeCode = file.fileTypeCode
            item2.fileUrl = file.fileUrl
            item2.mainFileId = file.mainFileId
            continue
          }
        }
      })
    },

    // 选择文件
    checkChange(val) {
      this.checkList = val
    },

    // 上传路径
    uploadUrl() {
      return process.env.VUE_APP_BASE_API + 'system/file/upload/'
    },

    // 上传按钮   限制图片大小
    changeUpload(file, fileList) {
      const suffixs = [
        '.ppt',
        '.pptx',
        '.doc',
        '.docx',
        '.pdf',
        '.xls',
        '.xlsx'
      ]
      const i = file.name.lastIndexOf('.')
      const suffix = file.name.slice(i)
      if (suffixs.indexOf(suffix) === -1) {
        this.$refs.uploadFile.abort()
        this.$message.error('文件格式错误！')
        return false
      }
      const isLt5M = file.size / 1024 / 1024 < 50
      if (!isLt5M) {
        this.$refs.uploadFile.abort()
        this.$message.error('上传文件大小不能超过 50MB！')
        return false
      }
      this.fileName = file.name
    },
    // 上传成功
    handleSuccess(res, file, fileList) {
      const i = file.name.lastIndexOf('.')
      const suffix = file.name.slice(i)
      const params = {
        fileFormat: suffix,
        fileName: file.name,
        fileSize: file.size,
        fileUrl: res.data.saveHttpPath,
        resourceFileId: res.data.fileId
      }
      deskAddFile(params).then(res => {
        const { file } = res.data
        this.queryFileIdList.push(file._id)
        file.file_status = file.status
        file.mainFileId = file.file_package_id
        this.list.unshift(file)
        this.$message.success('上传成功，文件正在处理中，请稍后！')
      })
    },
    // 上传失败
    handleUploadError(response, file, fileList) {
      this.$message.error('文件上传失败！')
    },

    // 确定
    saveFile() {
      this.$emit('checkedFile', this.checkList)
      this.selectFilVisible = false
    },
    // 取消
    cancel() {
      clearInterval(this.timer)
      this.listQuery.fileName = ''
      this.selectFilVisible = false
      this.$emit('checkedFile', this.checkList)
    }
  }
}
</script>

<style lang="scss" scoped>
.searchFile {
  margin-bottom: 16px;
}
.selectFile {
  display: inline-block;
}
/deep/ .el-dialog__wrapper .el-dialog__body {
  padding: 10px 20px;
}
.itemFile {
  display: inline-block;
  position: relative;
  width: 100px;
  margin: 0 10px 10px 0;
  text-align: center;
  font-size: 12px;
  text-align: center;
}
.checkbox {
  position: absolute;
  right: 4px;
  top: 4px;
  z-index: 2;
}
.checkbox /deep/ .el-radio__label {
  display: none;
}
.imgCover {
  width: 100%;
  height: 70px;
  border: 1px solid #e8e8e8;
}
.name {
  display: inline-block;
  margin-top: 4px;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.scrollbar-wrapper {
  overflow-x: hidden;
}
.el-scrollbar {
  height: 300px;
}
.global-search {
  width: 200px;
}
.forbid {
  cursor: not-allowed;
}
.forbidCover {
  background-color: #cccccc;
  opacity: 0.8;
  width: 100%;
  height: 70px;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  margin: 0 auto;
  z-index: 1;

  .text {
    position: absolute;
    width: 100%;
    height: 70px;
    top: 33px;
    left: 0;
    bottom: 0;
  }
}
</style>
