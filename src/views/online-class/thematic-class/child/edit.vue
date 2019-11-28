<template>
  <div class="form-edit">
    <el-steps
      :active="active"
      finish-status="success"
      simple
      style="margin-top: 20px"
    >
      <el-step title="第一步：填写课程信息" />
      <el-step title="第二步：选择发布小组" />
    </el-steps>
    <div class="operator fr">
      <el-button
        v-if="active !== 1"
        type="primary"
        @click="forwardStep"
      ><i class="addIcon iconfont iconzuojiantou" />上一步</el-button>
      <el-button
        v-if="active !== 2"
        type="primary"
        @click="nextStep()"
      ><i class="addIcon iconfont iconyoujiantou" />下一步</el-button>
      <el-button
        v-if="active === 2"
        v-no-more-click
        type="primary"
        @click="publish('form')"
      ><i class="addIcon iconfont iconfabu" />发布</el-button>
    </div>
    <div v-if="active === 1" class="info">
      <div class="step">
        <h5>基本信息：</h5>
      </div>
      <el-form
        ref="form1"
        class="form"
        :model="form"
        :rules="rules"
        label-width="120px"
        :status-icon="true"
      >
        <el-form-item label="专题名称" prop="lesson_name">
          <el-input
            v-model="form.lesson_name"
            placeholder="请输入专题名称"
            maxlength="50"
            clearable
          />
        </el-form-item>
        <el-form-item label="课程封面" class="logoClass">
          <el-upload
            ref="coverPic"
            class="coverPic"
            name="thumbnailfile"
            :action="uploadUrl()"
            :headers="headers"
            accept=".jpg,.png,.gif,.jepg,.jpeg"
            drag
            :data="fileInfo"
            :limit="2"
            :file-list="fileList"
            list-type="picture-card"
            :auto-upload="false"
            :on-change="changeUpload"
            :on-success="handleSuccess"
            :on-error="handleUploadError"
            :on-preview="handlePreview"
            :before-remove="beforeRemove"
            :on-remove="handleRemove"
          >
            <!--<img v-if="deskTopImageUrl" :src="deskTopImageUrl" class="avatar">-->
            <i class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item label="标签" class="addLabel">
          <div v-if="currentLabels.length" class="tag">
            <el-tag
              v-for="(tag, index) in currentLabels"
              :key="tag.linc"
              closable
              size="medium"
              :disable-transitions="false"
              type="success"
              @close="handleLabelDel(index)"
            >
              {{ tag.lname }}
            </el-tag>
          </div>
          <i class="pointer el-icon-circle-plus-outline" @click="addLabels" />
        </el-form-item>
        <el-form-item label="专题简介">
          <el-input
            v-model="form.brief"
            type="textarea"
            :rows="2"
            placeholder="请输入课程简介"
          />
        </el-form-item>
      </el-form>
    </div>

    <div v-if="active === 2" class="info step2">
      <div class="step">
        <h5 class="required">请选择小组：</h5>
      </div>

      <el-form
        ref="form3"
        class="form"
        :model="form"
        :rules="rules"
        :status-icon="true"
        label-width="120px"
      >
        <el-checkbox
          v-model="checkAll"
          :indeterminate="isIndeterminate"
          @change="handleCheckAllChange"
        >全部小组</el-checkbox>
        <el-scrollbar wrap-class="scrollbar-wrapper">
          <el-checkbox-group
            v-model="checkedGroupIds"
            @change="handleCheckedGroupChange"
          >
            <el-checkbox
              v-for="(inc, index) in group_inc_list"
              :key="inc"
              style="margin: 15px 0;display:block"
              :label="inc"
            >{{ group_groupName_list[index] }}</el-checkbox>
          </el-checkbox-group>
        </el-scrollbar>
      </el-form>
    </div>

    <!-- vueCropper 剪裁图片实现-->
    <el-dialog
      v-el-drag-dialog
      title="图片剪裁"
      :visible.sync="cropperDialogVisible"
      append-to-body
      :close-on-click-modal="false"
      @close="closeUpload"
    >
      <div class="cropper-content">
        <div class="cropper" style="text-align:center">
          <vueCropper
            ref="cropper"
            :img="option.img"
            :output-size="option.size"
            :output-type="option.outputType"
            :info="option.info"
            :full="option.full"
            :fixed="option.fixed"
            :fixed-number="option.fixedNumber"
            :can-move="option.canMove"
            :can-move-box="option.canMoveBox"
            :fixed-box="option.fixedBox"
            :original="option.original"
            :auto-crop="option.autoCrop"
            :auto-crop-width="option.autoCropWidth"
            :auto-crop-height="option.autoCropHeight"
            :center-box="option.centerBox"
            :high="option.high"
            @realTime="realTime"
            @imgLoad="imgLoad"
          />
          <!--下载图片的a链接-->
          <a v-show="false" ref="downLoadImg" href="javascript:;" />
        </div>
        <!--预览-->
        <!--<div class="show-preview" :style="{'width': previews.w + 'px', 'height': previews.h + 'px', 'overflow': 'hidden', 'margin': '5px'}">-->
        <div
          class="show-preview"
          :style="{
            width: '240px',
            height: '136px',
            overflow: 'hidden',
            margin: '5px'
          }"
        >
          <div :style="previews.div" class="preview">
            <img :src="previews.url" class="previewImg">
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button
          v-no-more-click
          type="primary"
          @click="finish"
        >确认</el-button>
        <el-button @click="closeUpload">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      v-el-drag-dialog
      title="图片预览"
      width="38%"
      :visible.sync="logoDialogVisible"
    >
      <img width="100%" :src="logoUrl" alt="">
    </el-dialog>

    <AddLessonEvalLabels
      :visible2.sync="visible2"
      :current-labels.sync="currentLabels"
      :select-company-id="form.selectCompanyId"
      :egroup="form.egroup"
      @AddLessonEvalLabels="getLabels"
      @visibleAddLessonEvalLabels="onvisible2"
    />
  </div>
</template>

<script>
import { VueCropper } from 'vue-cropper'
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
import { thematicClassDetail, updateThematicClass } from '@/api/thematic-class'
import { uploadFile } from '@/api/uploadFile'
import { getToken } from '@/utils/auth'
import { getUserEgroupInfo } from '@/api/userCenter-groupManage'
import AddLessonEvalLabels from '@/components/AddLessonEvalLabels'
const $ = window.$

export default {
  components: {
    AddLessonEvalLabels, // 添加标签
    VueCropper // 图片裁剪组件
  },
  directives: { elDragDialog },
  data() {
    return {
      dataIsChange: -2, // 计数器，据此判断表单是否已编辑
      noLeaveprompt: false, // 表单提交后，设置为true，据此判断提交不再弹出离开提示
      active: 1, // 当前step
      form: { // 表单数据
        _id: '', // 直播课堂Id
        // 表单数据
        lesson_name: '', // 课堂名称
        brief: '', // 课程简介
        labels: [], // 课时标签自增id数组
        cover_pic_id: '', // 课程封面 id
        cover_pic: '', // 课程封面 url
        selectCompanyId: '', // 所属租户ID
        groupList: [], // 发布组集合
        is_reviews: 1 // 是否开启点评 1是，2否
      },
      visible2: false, // 弹出选择标签
      currentLabels: [], // 标签obj
      headers: {
        Authorization: getToken() // 图片上传 header
      },
      fileName: '', // 上传文件名称
      fileList: [], // 上传的封面list
      cropperDialogVisible: false, // 是否打开图片裁剪弹窗
      logoDialogVisible: false, // 是否打开logo预览弹窗
      clearFiles: true, // 是否清除当前上传的logo
      logoUrl: '', // 预览的logo url
      deskTopImageUrl: '', // 平台Logo url
      mobileImageUrl: '', // 移动端Logo url
      fileInfo: {}, // 上传数据 似乎没用。。
      // 裁剪组件的基础配置option
      option: {
        img: '', // 裁剪图片的地址
        info: false, // 裁剪框的大小信息
        outputSize: 0.8, // 裁剪生成图片的质量
        outputType: 'png', // 裁剪生成图片的格式 jpeg、png、webp
        canScale: false, // 图片是否允许滚轮缩放
        fixedBox: false, // 固定截图框大小 不允许改变
        fixed: true, // 是否开启截图框宽高固定比例
        fixedNumber: [30, 17], // 截图框的宽高比例
        autoCrop: true, // 是否默认生成截图框
        autoCropWidth: 240, // 默认生成截图框宽度 只有自动截图开启 宽度高度才生效
        autoCropHeight: 136, // 默认生成截图框高度 只有自动截图开启 宽度高度才生效
        full: false, // 是否输出原图比例的截图
        canMoveBox: true, // 截图框能否拖动
        original: false, // 上传图片按照原始比例渲染
        centerBox: true, // 截图框是否被限制在图片里面
        infoTrue: true, // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
        high: true,
        size: 1
      },
      previews: {}, // 剪切实时预览数据

      group_list: [], // 所有小组list
      group_inc_list: [], // 所有小组inc list
      group_groupName_list: [], // 所有小组groupName list
      groupIncs: {}, // 所有小组 inc obj
      checkedGroups: [], // 选择的小组
      checkedGroupIds: [], // 第二步已选中的小组
      isIndeterminate: false, // 状态，是否已半选择
      checkAll: false, // 是否已全选

      rules: {
        lesson_name: [
          {
            required: true,
            message: '请输入课堂名称（长度在 1 到 50 个字符）',
            trigger: 'blur'
          },
          {
            required: true,
            message: '请输入课堂名称（长度在 1 到 50 个字符）',
            trigger: 'change'
          }
        ]
      }
    }
  },
  watch: {
    // 监听表单数据变化
    form: {
      handler(val) {
        if (val) {
          this.dataIsChange++
        }
      },
      deep: true // 深层次监听
    }
  },
  created() {
    this.form._id = this.$route.query._id
    this.getChapterDetail()
  },
  methods: {

    // 获取直播详情
    getChapterDetail() {
      thematicClassDetail({ _id: this.form._id }).then(res => {
        const { data } = res
        this.form._id = data._id
        this.form.lesson_name = data.lesson_name
        this.form.brief = data.brief
        this.form.labels = data.labels
        this.currentLabels = data.labelName || []
        this.form.cover_pic_id = data.cover_pic_id
        this.form.cover_pic = data.cover_pic
        if (this.form.cover_pic) {
          this.fileList = [{ name: '', url: data.cover_pic }]
          $('.coverPic .el-upload--picture-card').hide()
        }
        this.form.selectCompanyId = data.groupId
        this.form.egroup = data.egroup[0] || null
        this.form.groupList = data.egroup || []
        this.checkedGroupIds = data.egroup || []
        this.getEgroups()
      })
    },

    // 下一步
    nextStep() {
      if (this.active === 1) {
        this.$refs.form1.validate(valid => {
          if (valid) {
            if (!this.group_list.length) {
              this.$message.warning(
                '您暂时没有管理小组，请联系企业管理员进行小组管理！'
              )
              return false
            }
            this.active++
          }
        })
      } else if (this.active === 2) {
        if (!this.checkedGroupIds.length) {
          this.$message.warning('请选择小组！')
        } else {
          this.active++
        }
      }
    },

    // 上一步
    forwardStep() {
      this.active--
    },

    // 添加标签
    addLabels() {
      this.visible2 = true
    },
    // 监听选择标签组件返回数据
    getLabels(val) {
      this.currentLabels = val
    },
    // 监听选择标签组件返回数据
    onvisible2(val) {
      this.visible2 = val.visible
    },
    // 删除标签
    handleLabelDel(index) {
      this.currentLabels.splice(index, 1)
    },

    // 上传路径
    uploadUrl() {
      return process.env.VUE_APP_BASE_API + 'system/file/upload/'
    },

    // 上传按钮   限制图片大小
    changeUpload(file, fileList) {
      const suffixs = ['.png', '.jpg', '.gif', '.jepg', '.jpeg']
      const i = file.name.lastIndexOf('.')
      const suffix = file.name.slice(i)
      if (suffixs.indexOf(suffix) === -1) {
        this.$refs.coverPic.clearFiles()
        this.$message.error('文件格式错误！')
        return false
      }
      const isLt5M = file.size / 1024 / 1024 < 5
      if (!isLt5M) {
        this.$refs.coverPic.clearFiles()
        this.$message.error('上传文件大小不能超过 5MB！')
        this.$refs.coverPic.clearFiles()
        return false
      }
      this.fileName = file.name
      // // 上传成功后将图片地址赋值给裁剪框显示图片
      this.$nextTick(() => {
        this.option.img = file.url
        this.cropperDialogVisible = true
      })
    },
    // 上传成功
    handleSuccess(response, file, fileList) {
      console.log(file)
    },
    // 上传失败
    handleUploadError(response, file, fileList) {
      this.$message.error('上传文件失败！')
      this.fileList = []
      this.$refs.coverPic.clearFiles()
    },
    // 课堂封面删除前
    beforeRemove(file, fileList) {
      return this.$confirm('您确定要删除课堂封面吗？', '删除图片', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
    },
    // 处理文件移除
    handleRemove(file, fileList) {
      console.log(file, fileList)
      this.form.cover_pic_id = ''
      this.form.cover_pic = ''
      $('.coverPic .el-upload--picture-card').show()
    },
    // 处理预览
    handlePreview(file) {
      // 图片预览
      this.logoUrl = file.url
      this.logoDialogVisible = true
    },
    // 点击裁剪，这一步是可以拿到处理后的地址
    finish() {
      this.clearFiles = false
      const formData = new FormData()
      this.$refs.cropper.getCropBlob(data => {
        formData.append('thumbnailfile', data, this.fileName)
        uploadFile(formData).then(response => {
          this.$message.success('上传成功！')
          this.deskTopImageUrl = response.data.saveHttpPath
          this.form.cover_pic_id = response.data.saveHttpPath
          this.form.cover_pic = response.data.id
          this.fileList = [
            {
              name: response.data.originalFilename,
              url: response.data.saveHttpPath
            }
          ]
          $('.coverPic .el-upload--picture-card').hide()
          this.fileInfo = {}
          this.cropperDialogVisible = false
        })
      })
    },
    // 关闭上传及裁剪
    closeUpload() {
      if (this.clearFiles) {
        this.$refs['coverPic'].clearFiles()
        this.cropperDialogVisible = false
        this.clearFiles = true
      }
      this.clearFiles = true
    },
    // 实时预览函数
    realTime(realTimeData) {
      this.$refs.cropper.getCropData(data => {
        this.previews = realTimeData
        this.previews.url = data
      })
    },
    // 图片加载情况
    imgLoad(msg) {
      console.log(msg)
    },

    // 获取所有小组
    getEgroups() {
      getUserEgroupInfo({ selectCompanyId: this.selectCompanyId }).then(
        response => {
          this.group_list = response.data.manageEgroupInfo || []
          this.group_inc_list.length = 0
          this.group_groupName_list.length = 0
          for (var key in this.groupIncs) {
            delete this.groupIncs[key]
          }
          this.group_list.forEach(item => {
            this.group_inc_list.push(item.inc)
            this.group_groupName_list.push(item.groupName)
            this.groupIncs[item.inc] = item
          })
          if (this.checkedGroupIds.length === this.group_list.length) {
            this.checkAll = true
          } else if (this.checkedGroupIds.length) {
            this.isIndeterminate = true
          } else {
            this.isIndeterminate = false
          }
        }
      )
    },

    // 全选
    handleCheckAllChange(val) {
      this.checkedGroupIds = val ? this.group_inc_list : []
      this.isIndeterminate = false
    },

    // 单选
    handleCheckedGroupChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.group_list.length
      this.isIndeterminate =
          checkedCount > 0 && checkedCount < this.group_list.length
    },

    // 发布
    publish() {
      if (!this.checkedGroupIds.length) {
        this.$message.warning('请选择发布小组！')
        return false
      }
      this.form.labels.length = 0
      this.currentLabels.forEach(item => {
        this.form.labels.push(item.linc)
      })
      this.form.groupList = this.checkedGroupIds
      updateThematicClass(this.form).then(response => {
        this.$message.success('专题课程修改成功！')
        this.noLeaveprompt = true
        this.$router.push({
          path: '/online-class/thematic-class/list'
        })
      })
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.dataIsChange && !this.noLeaveprompt) {
      // 判断表单数据是否变化，以及提交后不进行此保存提示
      setTimeout(() => {
        // 此处必须要加延迟执行，主要解决浏览器前进后退带来的闪现
        this.$confirm('您的数据尚未保存，是否离开？', '离开页面', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            next()
          })
          .catch(() => {
            next(false)
          })
      }, 200)
    } else {
      next()
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/theme.scss";
  .operator {
    margin-top: 20px;
  }
  .chapterFile /deep/ .el-input {
    width: calc(100% - 80px);
  }

  .addLabel {
    margin-bottom: 20px;
  }
  .tag {
    display: inline;
  }

  /deep/ .el-upload-dragger {
    border: none;
    width: auto;
    height: auto;
  }

  .vueCropper {
    text-align: left;
  }
  // 截图
  .cropper-content {
    .cropper {
      width: calc(100% - 260px);
      height: 340px;
      display: inline-block;
    }
  }
  .show-preview {
    float: right;
    width: 140px;
    display: inline-block;
  }
  .previewImg {
    width: 240px;
    height: 136px;
  }
  .logoClass /deep/ .el-form-item__content {
    line-height: 18px;
  }
  /deep/ .el-upload-list li {
    margin-bottom: 0;
  }
  .step {
    width: 60%;
    height: 60px;
    margin: 15px auto;
    border-bottom: 1px solid #eee;
  }
  .step h5 {
    float: left;
  }

  .checkFile {
    display: inline-block;
    width: 60px;
    height: 32px;
    line-height: 32px;
    cursor: pointer;
    text-align: center;
    margin-left: 6px;
    border-radius: 3px;
    color: #ffffff;
    background-color: $themeColor;
    border-color: $themeColor;
  }
  .checkFile:hover {
    opacity: 0.8;
  }
  .informationType /deep/ .el-select {
    width: 100px;
  }
  .groups3 {
    width: 50%;
  }

  .step2 /deep/ .el-scrollbar {
    height: calc(100vh - 350px);
  }

  /deep/ .el-cascader-menu:last-child {
    border-right: solid 0px #dfe4ed;
  }
  /deep/ .el-cascader-menu {
    width: 50%;
  }
  .examiners .el-cascader-panel {
    width: 379px;
  }
  .examiners .group {
    display: inline-block;
    width: 188px;
    background-color: #f5f7fa;
    padding-left: 20px;
  }
  .examiners .member {
    display: inline-block;
    width: 190px;
    background-color: #f5f7fa;
    padding-left: 20px;
  }
  /deep/ .el-tag {
    margin-right: 10px;
  }

  .logoClass /deep/ .el-upload-list--picture-card .el-upload-list__item {
    width: 240px;
    height: 136px;
  }
</style>
