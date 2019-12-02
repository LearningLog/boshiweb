<template>
  <div class="app-container">
    <div class="detailForm">
      <div class="detailFormContent clearfix">
        <div class="fl pic">
          <el-image
            class="thumbnailPic"
            :src="getPic(form) || file_knowledge"
            fit="contain"
          />
        </div>
        <div class="fl file-info m0a">
          <el-form ref="form" :model="form" class="formDetail" label-width="100px">
            <el-form-item label="">
              <h1 class="tc fileName" style="font-size: 30px;">{{ form.fileName }}</h1>
            </el-form-item>
            <el-form-item label="文件ID：">
              <span>{{ form.mainFileId }}</span>
            </el-form-item>
            <el-form-item label="文件大小：">
              <span>{{ getFileShowSize(form.fileSize) }}</span>
            </el-form-item>
            <el-form-item label="创建时间：">
              <span>{{ parseTime(form.createTimestamp) }}</span>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <div class="detailTable">
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
      >
        <el-table-column align="center" label="文件名" min-width="100" show-overflow-tooltip prop="fileName" />
        <el-table-column align="center" label="格式" min-width="60" show-overflow-tooltip prop="fileFormat" />
        <el-table-column align="center" label="文件地址" min-width="200" show-overflow-tooltip prop="fileUrl" />
        <el-table-column align="center" label="文件大小" min-width="90" show-overflow-tooltip>
          <template slot-scope="scope">{{ getFileShowSize(scope.row.fileSize) }} </template>
        </el-table-column>
        <el-table-column class-name="status-col" label="操作" width="160" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleCopy(scope.row,$event)"><i class="iconfont iconxiangqing" />一键复制链接</el-button>
          </template>
        </el-table-column>

      </el-table>
    </div>

  </div>
</template>

<script>
// 直接使用
import clip from '@/utils/clipboard'
import { getFileShowSize, parseTime } from '@/utils/index'
import file_knowledge from '@/assets/images/file_knowledge.png'
import { findFileById } from '@/api/work-desk/work-desk'

export default {
  data() {
    return {
      file_knowledge,
      listLoading: false,
      mainFileId: '', // 查询ID
      list: [],
      form: []
    }
  },
  created() {
    this.mainFileId = this.$route.query.id
    this.getDetail()
  },
  methods: {
    getDetail() {
      findFileById({ mainFileId: this.mainFileId }).then(res => {
        this.form = res.data
        this.list = res.data.subFileList
      })
    },

    // 复制链接
    handleCopy(row, event) {
      clip(row.fileUrl, event)
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
  @import "~@/styles/theme.scss";
  @import "~@/styles/variables.scss";
  .thumbnailPic{
    width: 300px;
    height:300px;
    border: 1px solid #e8e8e8;
    vertical-align: middle;
  }
  .file-info {
    width: calc(100% - 320px);
  }
  .formDetail {
    width: 50%;
    margin: 0 auto;
  }
  .fileName {
    word-break: break-all;
    word-wrap: break-word;
  }
  .detailForm {
    border: 1px solid #f2f2f2;
    margin-bottom: 20px;

    > .detailFormTop {
      color: #666666;
      font-size: 14px;
      width: 100%;
      height: 40px;
      line-height: 40px;
      padding-left: 22px;
      background-color: #f2f2f2;
    }
  }
  .detailFormContent .form /deep/ .el-form-item {
    margin-bottom: 18px;
    width: 49%;
    display: inline-block;
  }
  .detailFormContent .form {
    width: 70%;
    height:40%;
    margin: 0 auto;
    padding-top: 18px;
  }
  .detailTable {
    margin-top: 18px;
  }
  .el-scrollbar {
    height: 50vh;
  }
  .topicItem {
    padding: 20px;
    padding-top: 10px;
    background-color: #f8f8f8;
    margin-bottom: 20px;
  }
  .topics {
    width: 100%;
    border: 1px solid #f2f2f2;
    padding: 20px;
  }
  .topicItemTop {
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #eaeaea;
  }
  .topicType {
    color: $themeColor;
  }
  .operation /deep/ .el-link {
    margin-left: 20px;
  }
  .item-topic {
    background-color: #fff;
    padding: 10px;
    margin-bottom: 10px;
  }
  .answerInfodialog /deep/ .el-dialog__body {
    padding-top: 0;
  }
  .rightOption {
    color: $red;
  }
  .item-topic /deep/ .el-checkbox__label {
    word-break: break-all;
    word-wrap: break-word;
    white-space: pre-wrap;
    vertical-align: top;
    padding-right: 10px;
  }
  .userTopDetail {
    width: 100%;
    height: 30px;
    line-height: 30px;

    > span {
      display: inline-block;
      width: 33%;
      padding-left: 20px;
    }

    > .answerScore {
      color: $red;
    }
  }
  .expand-table /deep/ .el-progress {
    -ms-text-align-last: left;
    text-align-last: left;
  }
</style>
