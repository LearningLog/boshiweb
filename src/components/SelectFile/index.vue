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
            <el-button type="primary">上传</el-button>
          </el-upload>
        </div>
        <div class="fr">
          <el-input
            v-model="listQuery.fileName"
            class="global-search"
            placeholder="请输入文件名称"
            clearable
            @keyup.enter.native="getFileList"
            @clear="getFileList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getFileList" />
          </el-input>
        </div>
      </div>
      <el-scrollbar wrap-class="scrollbar-wrapper">
        <ul v-infinite-scroll="scrollGetFileList" class="fileList">
          <li
            v-for="(item, index) in list"
            :key="index"
            class="itemFile"
          >
            <el-radio-group v-model="radio" class="checkbox" @change="checkChange">
              <el-radio :label="item">{{ item.aaa }}</el-radio>
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
import { getFileListManage } from '@/api/work-desk'
import { deskAddFile } from '@/api/uploadFile'
import { getToken } from '@/utils/auth'
import file_knowledge from '@/assets/images/file_knowledge.png'

export default {
  name: 'SelectFile',
  directives: { elDragDialog },
  props: {
    fileTypeList: {
      type: Array,
      default: null
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
        fileTypeList: this.fileTypeList || [],
        fileUseList: ['preview_pic', 'preview_file'],
        file_status: 4,
        fileIdList: []
      },
      list: [], // 列表
      queryFileIdList: [], // 需要返回的文件列表
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
        this.listQuery.currentPage = 0
        this.list.length = 0
        this.selectFilVisible = true
        that.timer = setInterval(function() {
          that.getFileList()
        }, 10000)
      }
    }
  },
  methods: {
    // 滚动加载的逻辑
    scrollGetFileList() {
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
        for (var key in res.data.filePackageIdWorkDeskFile) {
          this.filePackageIdWorkDeskFile[key] = res.data.filePackageIdWorkDeskFile[key]
        }
        this.list.forEach(item => {
          item.name = this.filePackageIdWorkDeskFile[item.mainFileId].name
          item.subFileList = item.subFileList || []
          item.subFileList.find(item2 => {
            if (item2.fileUse === 'preview_pic') {
              item.preview_pic = item2.fileUrl
            }
          })
        })
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
      const suffixs = ['.ppt', '.pptx', '.doc', '.docx', '.pdf', '.xls', '.xlsx']
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
		overflow:hidden;
		text-overflow:ellipsis;
		white-space:nowrap;
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
</style>
