<template>
  <div class="form-edit">
    <el-steps :active="1" finish-status="success" simple style="margin-top: 20px">
      <el-step title="步骤 1" />
      <el-step title="步骤 2" />
      <el-step title="步骤 3" />
    </el-steps>
    <div v-if="active==1" class="info">
      <div class="step">
        <h5>基本信息：</h5>
        <el-button style="margin-top: 12px;float:right" @click="next">下一步</el-button>
      </div>
      <el-form ref="form" class="form" :model="form" :rules="rules" label-width="120px" :status-icon="true">
        <el-form-item label="课堂名称">
          <el-input v-model="form.cname" placeholder="请输入课堂名称" maxlength="64" clearable />
        </el-form-item>
        <el-form-item label="主讲老师">
          <el-input v-model="form.teacher" placeholder="请输入主讲老师" maxlength="100" clearable />
        </el-form-item>
        <el-form-item label="上课时段">
          <el-date-picker
            v-model="form.s_time"
            type="date"
            placeholder="选择课程开始时间"
          />
        </el-form-item>
      </el-form>
      <div class="step">
        <h5>播放设置：</h5>
      </div>
      <el-form ref="form" class="form" :model="form" :rules="rules" label-width="120px" :status-icon="true">
        <el-form-item label="直播源">
          <el-radio-group v-model="live_count">
            <el-radio :label="1">两路视频直播</el-radio>
            <el-radio :label="0">一路视频直播</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="评论控制">
          <el-radio-group v-model="can_discuss">
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="0">关闭</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="课程封面" class="logoClass">
          <el-upload
            ref="uploadDeskTopLogo"
            class="uploadDeskTopLogo"
            name="thumbnailfile"
            :action="uploadUrl()"
            :headers="headers"
            accept=".jpg,.png,.gif,.jepg,.jpeg"
            drag
            :data="fileInfo"
            :limit="2"
            :file-list="fileList1"
            list-type="picture-card"
            :auto-upload="false"
            :on-change="changeUpload"
            :on-success="handleSuccess"
            :on-error="handleUploadError"
            :on-preview="handlePreview"
            :before-remove="beforeRemove"
            :on-remove="handleRemove"
            @click.native="logoTypes(1)"
          >
            <!--<img v-if="deskTopImageUrl" :src="deskTopImageUrl" class="avatar">-->
            <i class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item label="课程简介">
          <el-input
            v-model="form.brief"
            type="textarea"

            :rows="2"
          />
        </el-form-item>
      </el-form>
    </div>

    <div v-if="active==2" class="info">

      <div class="step">
        <h5>请选择小组：</h5>
        <el-button style="margin-top: 12px;float:right" @click="next">下一步</el-button>
        <el-button style="margin-top: 12px;float:right;margin-right:20px" @click="pre">上一步</el-button>
      </div>
      <el-form ref="form" class="form" :model="form" :rules="rules" label-width="120px" :status-icon="true">
        <el-form-item label="租户状态" prop="customStatus">
          <el-radio-group v-model="form.customStatus">
            <el-radio :label="1">生效</el-radio>
            <el-radio :label="0">失效</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>
    <div v-if="active==3" class="info">
      <div class="step">
        <h5>课程通知：</h5>
        <el-button style="margin-top: 12px;float:right">发布</el-button>
        <el-button style="margin-top: 12px;float:right;margin-right:20px" @click="pre">上一步</el-button>
      </div>
      <el-form ref="form" class="form" :model="form" :rules="rules" label-width="120px" :status-icon="true">
        <el-form-item label="课程通知" prop="Status">
          <el-radio-group v-model="form.Status">
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="0">关闭</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>

    <!-- vueCropper 剪裁图片实现-->
    <el-dialog v-el-drag-dialog title="图片剪裁" :visible.sync="cropperDialogVisible" append-to-body :close-on-click-modal="false" @close="closeUpload">
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
        <div class="show-preview" :style="{'width':'180px', 'height':'180px', 'overflow': 'hidden', 'margin': '5px'}">
          <div :style="previews.div" class="preview">
            <img :src="previews.url" class="previewImg">
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button v-no-more-click type="primary" @click="finish">确认</el-button>
        <el-button @click="closeUpload">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog v-el-drag-dialog title="图片预览" width="38%" :visible.sync="logoDialogVisible">
      <img width="100%" :src="logoUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import { validIntNum, regUName, regPwd } from '@/utils/validate'
import { VueCropper } from 'vue-cropper'
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
import { getOneChapter, chapetr_edit } from '@/api/live-telecast-manage'
import { uploadFile } from '@/api/uploadFile'
import { getToken } from '@/utils/auth'
const $ = window.$

export default {
  components: {
    VueCropper // 图片裁剪组件
  },
  directives: { elDragDialog },
  data() {
    // 校验租户管理员
    var validateUName = (rule, value, callback) => {
      if (!value && value !== 0) {
        callback(new Error('请输入租户管理员（长度在 2 到 64 个字符）'))
      } else if (!regUName(value)) {
        callback(new Error('2 到 64 位字母和数字的组合，不能连续11位数字'))
      } else {
        callback()
      }
    }
    // 校验管理员密码
    var validatePass = (rule, value, callback) => {
      if (!value && value !== 0) {
        callback(new Error('请输入管理员密码'))
      } else if (!regPwd(value)) {
        callback(new Error('6 到 50 位字母和数字的组合'))
      } else {
        callback()
      }
    }
    return {
      active: 1,
      id: '', // 查询id
      dataIsChange: 0, // 计数器，据此判断表单是否已编辑
      noLeaveprompt: false, // 表单提交后，设置为true，据此判断提交不再弹出离开提示
      form: { // 表单数据
        cname: '', // 课堂名称
        teacher: '', // 主讲老师
        desc: '', // 描述
        userCount: '', // 最大用户数量
        live_count: 1, // 直播源
        can_discuss: 1, // 评论控制
        Status: '', // 课程控制
        cover_pic_id: '', // 课程封面 id
        cover_pic: '', // 课程封面 url
        s_time: '', // 开始时间
        brief: ''// 课程简介
      },
      live_count: 1, // 直播源
      can_discuss: 1, // 评论控制
      loading: false, // 防止重复提交
      headers: {
        Authorization: getToken() // 图片上传 header
      },
      logoType: '', // 上传logo类型
      fileName: '', // 上传文件名称
      fileList1: [], // 平台Logo list
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
        fixedNumber: [1, 1], // 截图框的宽高比例
        autoCrop: true, // 是否默认生成截图框
        autoCropWidth: 180, // 默认生成截图框宽度 只有自动截图开启 宽度高度才生效
        autoCropHeight: 180, // 默认生成截图框高度 只有自动截图开启 宽度高度才生效
        full: false, // 是否输出原图比例的截图
        canMoveBox: true, // 截图框能否拖动
        original: false, // 上传图片按照原始比例渲染
        centerBox: true, // 截图框是否被限制在图片里面
        infoTrue: true, // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
        high: true,
        size: 1
      },
      previews: {}, // 剪切实时预览数据
      rules: {
        customname: [
          { required: true, message: '请输入租户名称（长度在 1 到 64 个字符）', trigger: 'blur' },
          { required: true, message: '请输入租户名称（长度在 1 到 64 个字符）', trigger: 'change' },
          { min: 1, max: 64, message: '长度在 1 到 64 个字符', trigger: 'blur' },
          { min: 1, max: 64, message: '长度在 1 到 64 个字符', trigger: 'change' }
        ],
        desc: [
          { required: true, message: '请输入租户描述（长度在 1 到 100 个字符）', trigger: 'blur' },
          { required: true, message: '请输入租户描述（长度在 1 到 100 个字符）', trigger: 'change' },
          { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' },
          { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'change' }
        ],
        userCount: [
          { required: true, message: '请输入最大用户数（长度在 1 到 120 个字符）', trigger: 'blur' },
          { required: true, message: '请输入最大用户数（长度在 1 到 120 个字符）', trigger: 'change' }
        ],
        customStatus: [
          { required: true, message: '请选择租户状态', trigger: 'change' }
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
    this.id = this.$route.query._id
    this.getInitData()
  },
  methods: {
    // 获取初始数据
    getInitData() {
      getOneChapter({ _id: this.id }).then(response => {
        this.form = response.data
        this.dataIsChange = -1
      })
    },
    // 下一步
    next() {
      if (this.active++ > 3) this.active = 1
    },
    // 上一步
    pre() {
      if (this.active-- < 2) this.active = 1
    },
    // 提交
    onSubmit(formName) {
      console.log(process.env.VUE_APP_BASE_API)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.form.live_count = this.live_count
          this.form.can_discuss = this.can_discuss
          chapetr_edit(this.form).then(response => {
            this.$message.success('新增课程成功！')
            this.noLeaveprompt = true
            this.$router.push({ path: '/online-class/live-telecast-manage/list' })
          })
        }
      })
    },
    // 上传路径
    uploadUrl() {
      return process.env.VUE_APP_BASE_API + 'system/file/upload/'
    },
    logoTypes(type) {
      this.logoType = type
    },
    // 上传按钮   限制图片大小
    changeUpload(file, fileList) {
      const suffixs = ['.png', '.jpg', '.gif', '.jepg', '.jpeg']
      const i = file.name.lastIndexOf('.')
      const suffix = file.name.slice(i)
      if (suffixs.indexOf(suffix) === -1) {
        this.$message.error('文件格式错误！')
        if (this.logoType === 1) {
          this.fileList1 = []
        }
        return false
      }
      const isLt5M = file.size / 1024 / 1024 < 5
      if (!isLt5M) {
        this.$message.error('上传文件大小不能超过 5MB！')
        if (this.logoType === 1) {
          this.fileList1 = []
        }
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
      if (this.logoType === 1) {
        this.fileList1 = []
      }
    },
    // logo删除前
    beforeRemove(file, fileList) {
      return this.$confirm('您确定要删除logo吗？', '删除图片', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
    },
    // 处理文件移除
    handleRemove(file, fileList) {
      console.log(file, fileList)
      if (this.logoType === 1) {
        this.form.cover_pic_id = ''
        this.form.cover_pic = ''
        $('.uploadDeskTopLogo .el-upload--picture-card').show()
      }
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
      this.$refs.cropper.getCropBlob((data) => {
        formData.append('thumbnailfile', data, this.fileName)
        uploadFile(formData).then(response => {
          this.$message.success('上传成功！')
          if (this.logoType === 1) {
            this.deskTopImageUrl = response.data.saveHttpPath
            this.form.cover_pic_id = response.data.saveHttpPath
            this.form.cover_pic = response.data.id
            this.fileList1 = [{ name: response.data.originalFilename, url: response.data.saveHttpPath }]
            $('.uploadDeskTopLogo .el-upload--picture-card').hide()
          }
          this.fileInfo = {}
          this.cropperDialogVisible = false
        })
      })
    },
    // 关闭上传及裁剪
    closeUpload() {
      if (this.clearFiles) {
        if (this.logoType === 1) {
          this.$refs['uploadDeskTopLogo'].clearFiles()
        } else {
          this.$refs['uploadMobileLogo'].clearFiles()
        }
        this.cropperDialogVisible = false
        this.clearFiles = true
      }
      this.clearFiles = true
    },
    // 实时预览函数
    realTime(realTimeData) {
      this.$refs.cropper.getCropData((data) => {
        this.previews = realTimeData
        this.previews.url = data
      })
    },
    // 图片加载情况
    imgLoad(msg) {
      console.log(msg)
    },
    // 校验最大用户数为正整数
    intNum(val) {
      this.form.userCount = validIntNum(val)
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.dataIsChange && !this.noLeaveprompt) { // 判断表单数据是否变化，以及提交后不进行此保存提示
      setTimeout(() => { // 此处必须要加延迟执行，主要解决浏览器前进后退带来的闪现
        this.$confirm('您的数据尚未保存，是否离开？', '离开页面', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          next()
        }).catch(() => {
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
  #btnGroup{
    padding-left: 120px;
  }
  /deep/ .el-upload-dragger {
     border: none;
     width: auto;
     height: auto;
  }
  [class^="el-icon-"], [class*=" el-icon-"]{
    line-height: 60px!important;
  }
  .vueCropper {
    text-align: left;
  }
  // 截图
  .cropper-content {
    .cropper {
      width: calc(100% - 200px);
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
    width: 180px;
    height: 180px;
  }
  .logoClass /deep/ .el-form-item__content {
    line-height: 18px;
  }
  /deep/ .el-upload-list li {
    margin-bottom: 0;
  }
  .step{
    width: 100%;
    height: 60px;
    margin: 15px auto;
    border-bottom: 2px solid #eee;
  }
  .step h5{
    float: left;
  }
</style>
