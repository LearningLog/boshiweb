<template>
  <div class="form-edit">
    <el-form ref="form" class="form" :model="form" :rules="rules" label-width="140px" :status-icon="true">
      <el-form-item label="租户名称" prop="customname">
        <el-input v-model="form.customname" placeholder="请输入租户名称" maxlength="64" clearable />
      </el-form-item>
      <el-form-item label="租户描述" prop="desc">
        <el-input v-model="form.desc" placeholder="请输入租户描述" maxlength="100" clearable />
      </el-form-item>
      <el-form-item label="最大用户数" prop="userCount">
        <el-input v-model="form.userCount" placeholder="请输入最大用户数" clearable @keyup.native="intNum(form.userCount)" />
      </el-form-item>
      <el-form-item label="租户状态" prop="customStatus">
        <el-radio-group v-model="form.customStatus">
          <el-radio :label="1">生效</el-radio>
          <el-radio :label="0">失效</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="开通智能搜索" prop="text_extraction">
        <el-radio-group v-model="form.text_extraction">
          <el-radio :label="1">开启</el-radio>
          <el-radio :label="0">关闭</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="更新租户管理员信息">
        <el-radio-group v-model="isChangeTuser">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <div v-if="isChangeTuser === 1">
        <el-form-item label="租户管理员" prop="uName">
          <el-input v-model="form.uName" :disabled="true" placeholder="请输入租户管理员" maxlength="64" clearable />
        </el-form-item>
        <el-form-item label="管理员昵称" prop="uNickname">
          <el-input v-model="form.uNickname" placeholder="请输入管理员昵称" maxlength="20" clearable />
        </el-form-item>
        <el-form-item label="管理员密码" prop="uPwd">
          <el-input v-model="form.uPwd" placeholder="请输入管理员密码" type="password" autocomplete="off" maxlength="50" clearable />
        </el-form-item>
      </div>
      <el-form-item label="平台Logo" class="logoClass">
        <el-upload
          class="uploadDeskTopLogo"
          ref="uploadDeskTopLogo"
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
      <el-form-item label="移动端Logo" class="logoClass">
        <el-upload
          class="uploadMobileLogo"
          ref="uploadMobileLogo"
          name="thumbnailfile"
          :action="uploadUrl()"
          :headers="headers"
          accept=".jpg,.png,.gif,.jepg,.jpeg"
          drag
          :data="fileInfo"
          :limit="2"
          :file-list="fileList2"
          list-type="picture-card"
          :auto-upload="false"
          :on-change="changeUpload"
          :on-success="handleSuccess"
          :on-error="handleUploadError"
          :on-preview="handlePreview"
          :before-remove="beforeRemove"
          :on-remove="handleRemove"
          @click.native="logoTypes(2)"
        >
          <!--<img v-if="mobileImageUrl" :src="mobileImageUrl" class="avatar">-->
          <i class="el-icon-plus avatar-uploader-icon" />
        </el-upload>
      </el-form-item>
      <el-form-item label="个性化系统名称">
        <el-input v-model="form.customSystemName" maxlength="64" placeholder="请输入系统名称" clearable />
      </el-form-item>
    </el-form>
    <div id="btnGroup">
      <el-button type="primary" v-no-more-click @click="onSubmit('form')">确定</el-button>
      <el-button type="primary" plain @click="cancel('form')">取消</el-button>
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
        <el-button type="primary" v-no-more-click @click="finish">确认</el-button>
        <el-button @click="closeUpload">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog v-el-drag-dialog title="图片预览" width="38%" :visible.sync="logoDialogVisible">
      <img width="100%" :src="logoUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import { validIntNum } from '@/utils/validate'
import { VueCropper } from 'vue-cropper'
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
import { getOneTenant, editTenant } from '@/api/systemManage-tenantManage'
import { uploadFile } from '@/api/uploadFile'
import { getToken } from '@/utils/auth'
const $ = window.$

export default {
  components: {
    VueCropper
  },
  directives: { elDragDialog },
  data() {
    return {
      dataIsChange: 0, // 计数器，据此判断表单是否已编辑
      noLeaveprompt: false, // 表单提交后，设置为true，据此判断提交不再弹出离开提示
      id: '', // 查询id
      form: {}, // 表单数据
      isChangeTuser: 0, // 是否修改租户管理员
      headers: {
        Authorization: getToken() // 图片上传 header
      },
      logoType: '', // 上传logo类型
      fileName: '', // 上传文件名称
      fileList1: [], // 平台Logo list
      fileList2: [], // 移动端Logo list
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
        ],
        text_extraction: [
          { required: true, message: '请选择是否开通智能搜索', trigger: 'change' }
        ],
        uName: [
          { required: true, message: '请输入租户管理员（长度在 2 到 64 个字符）', trigger: 'blur' },
          { required: true, message: '请输入租户管理员（长度在 2 到 64 个字符）', trigger: 'change' },
          { min: 2, max: 64, message: '长度在 2 到 64 个字符', trigger: 'blur' },
          { min: 2, max: 64, message: '长度在 2 到 64 个字符', trigger: 'change' }
        ],
        uNickname: [
          { required: true, message: '请输入管理员昵称（长度在 2 到 20 个字符）', trigger: 'blur' },
          { required: true, message: '请输入管理员昵称（长度在 2 到 20 个字符）', trigger: 'change' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'change' }
        ],
        uPwd: [
          { required: true, message: '请输入管理员密码（长度在 6 到 50 个字符）', trigger: 'blur' },
          { required: true, message: '请输入管理员密码（长度在 6 到 50 个字符）', trigger: 'change' },
          { min: 6, max: 50, message: '长度在 6 到 50 个字符', trigger: 'blur' },
          { min: 6, max: 50, message: '长度在 6 到 50 个字符', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.id = this.$route.query._id
    this.getTenant()
  },
  methods: {
    // 获取初始数据
    getTenant() {
      getOneTenant({ _id: this.id }).then(response => {
        const obj = {
          uUserId: response.data.user._id,
          _id: response.data.custom._id,
          customname: response.data.custom.customname,
          desc: response.data.custom.desc,
          userCount: response.data.custom.userCount,
          customStatus: response.data.custom.customStatus,
          text_extraction: response.data.custom.text_extraction,
          uName: response.data.user.username,
          uNickname: response.data.user.nickname,
          uPwd: '',
          pcLogoFileId: response.data.custom.pcLogoFileId,
          pcLogoFileUrl: response.data.custom.pcLogoFileUrl,
          mobileLogoFileId: response.data.custom.mobileLogoFileId,
          mobileLogoFileUrl: response.data.custom.mobileLogoFileUrl,
          customSystemName: response.data.custom.customSystemName
        }
        if (response.data.custom.pcLogoFileUrl) {
          this.fileList1 = [{ name: '', url: response.data.custom.pcLogoFileUrl }]
          $('.uploadDeskTopLogo .el-upload--picture-card').hide()
        }
        if (response.data.custom.mobileLogoFileUrl) {
          this.fileList2 = [{ name: '', url: response.data.custom.mobileLogoFileUrl }]
          $('.uploadMobileLogo .el-upload--picture-card').hide()
        }
        this.form = obj
        this.dataIsChange = -1
      })
    },
    // 提交
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          switch (this.isChangeTuser) {
            case 0:
              this.form.isChangeTuser = 'n'
              break
            case 1:
              this.form.isChangeTuser = 'y'
              break
          }
          editTenant(this.form).then(response => {
            this.$message.success('修改租户成功！')
            this.noLeaveprompt = true
            this.$router.push({ path: '/systemManage/tenantManage/detail', query: { _id: this.id }})
          })
        }
      })
    },
    // 取消
    cancel(formName) {
      this.$router.push({ path: '/systemManage/tenantManage/list' })
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
      const isLt5M = file.size / 1024 / 1024 < 5
      if (!isLt5M) {
        this.$message.error('上传文件大小不能超过 5MB！')
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
      } else {
        this.fileList2 = []
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
        this.form.pcLogoFileId = ''
        this.form.pcLogoFileUrl = ''
        $('.uploadDeskTopLogo .el-upload--picture-card').show()
      } else {
        this.form.mobileLogoFileId = ''
        this.form.mobileLogoFileUrl = ''
        $('.uploadMobileLogo .el-upload--picture-card').show()
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
          if (this.logoType === 1) {
            this.deskTopImageUrl = response.data.saveHttpPath
            this.form.pcLogoFileUrl = response.data.saveHttpPath
            this.form.pcLogoFileId = response.data.id
            this.fileList1 = [{ name: response.data.originalFilename, url: response.data.saveHttpPath }]
            $('.uploadDeskTopLogo .el-upload--picture-card').hide()
          } else {
            this.mobileImageUrl = response.data.saveHttpPath
            this.form.mobileLogoFileUrl = response.data.saveHttpPath
            this.form.mobileLogoFileId = response.data.id
            this.fileList2 = [{ name: response.data.originalFilename, url: response.data.saveHttpPath }]
            $('.uploadMobileLogo .el-upload--picture-card').hide()
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
  #btnGroup {
    padding-left: 140px;
  }
  /deep/ .el-upload-dragger {
    border: none;
    width: auto;
    height: auto;
  }
  [class^="el-icon-"], [class*=" el-icon-"] {
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
</style>
