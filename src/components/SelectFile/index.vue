<template>
  <div class="selectFile">
    <el-dialog
      v-el-drag-dialog
      title="选择文件"
      width="46%"
      :visible.sync="selectFilVisible"
      @close="cancel"
    >
      <div class="clearfix searchFile">
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
      <ul class="fileList">
        <li
          v-for="(item, index) in list"
          :key="index"
          class="itemFile"
        >
          <el-radio-group v-model="radio" class="checkbox" @change="checkChange">
            <el-radio :label="item">{{ item.aaa }}</el-radio>
          </el-radio-group>
          <div class="imgCover" :style="{backgroundImage:'url(' + item.fileUrl + ')'}" />
          <span class="name">{{ item.name }}</span>
        </li>
      </ul>
      <div class="clearfix">
        <pagination v-show="total>0" :page-sizes="[10]" :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="getFileList" />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveFile">确定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import elDragDialog from '@/directive/el-drag-dialog'
import { fileList } from '@/api/work-desk'
export default {
  name: 'SelectFile',
  components: { Pagination },
  directives: { elDragDialog },
  props: {
    fileTypeList: {
      type: Array,
      default: null
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      selectFilVisible: false,
      total: null,
      fileName: '', // 文件名称
      listQuery: {
        currentPage: 1,
        pageSize: 10,
        fileName: '',
        fileTypeList: this.fileTypeList || [],
        fileUseList: ['preview_pic', 'preview_file'],
        file_status: 4
      },
      list: [], // 列表
      filePackageIdWorkDeskFile: null, // Map
      checkList: [], // 选中的数据
      radio: ''
    }
  },
  methods: {
    getFileList() {
      fileList(this.listQuery).then(res => {
        this.total = res.data.page.totalCount
        this.list = res.data.page.list
        this.filePackageIdWorkDeskFile = res.data.filePackageIdWorkDeskFile
        this.list.forEach(item => {
          item.name = this.filePackageIdWorkDeskFile[item.mainFileId].name
        })
        this.selectFilVisible = true
      })
    },
    checkChange(val) {
      this.checkList = val
    },
    // 确定
    saveFile() {
      const checkedFile = this.checkList
      this.$emit('checkedFile', checkedFile)
      this.selectFilVisible = false
      this.$emit('visible', { visible: false })
    },
    // 取消
    cancel() {
      this.selectFilVisible = false
      this.$emit('visible', { visible: false })
    }
  },
  watch: {
    visible: function(val, val2) {
      if (val) {
        this.getFileList()
      }
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
		right: 0;
		top: 0;
		z-index: 2;
	}
	.imgCover {
		background-size: cover;
		width: 100%;
		height: 55px;
	}
	.name {
		display: inline-block;
		width: 100%;
		overflow:hidden;
		text-overflow:ellipsis;
		white-space:nowrap;
	}
	.el-scrollbar {
		height: 50vh;
	}
</style>
