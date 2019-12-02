<template>
  <div class="vueCropper">
    <!-- element 上传图片按钮 -->
    <el-upload
      class="upload-demo"
      action=""
      drag
      :auto-upload="false"
      :show-file-list="false"
      :on-change="changeUpload"
    >
      <i class="el-icon-upload" />
      <div class="el-upload__text">点击上传</div>
      <div class="el-upload__tip">
        支持绝大多数图片格式，单张图片最大支持5MB
      </div>
    </el-upload>
    <!-- vueCropper 剪裁图片实现-->
    <el-dialog v-el-drag-dialog title="图片剪裁" :visible.sync="dialogVisible" append-to-body>
      <div class="cropper-content">
        <div class="cropper" style="text-align:center">
          <vueCropper
            ref="cropper"
            :img="option.img"
            :output-size="option.size"
            :output-type="option.outputType"
            :info="true"
            :full="option.full"
            :can-move="option.canMove"
            :can-move-box="option.canMoveBox"
            :original="option.original"
            :auto-crop="option.autoCrop"
            :fixed="option.fixed"
            :fixed-number="option.fixedNumber"
            :center-box="option.centerBox"
            :info-true="option.infoTrue"
            :fixed-box="option.fixedBox"
            @realTime="realTime"
            @imgLoad="imgLoad"
          />
          <!--下载图片的a链接-->
          <a v-show="false" ref="downLoadImg" href="javascript:;" />
        </div>
        <!--预览-->
        <div class="show-preview" :style="{'width': previews.w + 'px', 'height': previews.h + 'px', 'overflow': 'hidden', 'margin': '5px'}">
          <div :style="previews.div" class="preview">
            <img :src="previews.url" :style="previews.img">
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="startCrop()">start</el-button>
        <el-button type="primary" @click="stopCrop()">stop</el-button>
        <el-button type="primary" @click="clearCrop()">clear</el-button>
        <el-button type="primary" @click="refreshCrop()">refresh</el-button>
        <el-button type="primary" @click="changeScale(1)">+</el-button>
        <el-button type="primary" @click="changeScale(-1)">-</el-button>
        <el-button type="primary" @click="rotateLeft">向左旋转90°</el-button>
        <el-button type="primary" @click="rotateRight">向右旋转90°</el-button>
        <el-button type="primary" @click="down('base64')">download(base64)</el-button>
        <el-button type="primary" @click="down('blob')">download(blob)</el-button>
        <el-button type="primary" @click="finish('base64')">preview(base64)</el-button>
        <el-button type="primary" @click="finish('blob')">preview(blob)</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="loading" @click="finish">确认</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="model">
      <img width="100%" :src="modelSrc" alt="">
    </el-dialog>
  </div>
</template>

<script>
import { VueCropper } from 'vue-cropper'
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
export default {
  components: {
    VueCropper
  },
  directives: { elDragDialog },
  data() {
    return {
      dialogVisible: true,
      model: false,
      // 裁剪组件的基础配置option
      option: {
        img: 'https://fengyuanchen.github.io/cropperjs/images/picture.jpg', // 裁剪图片的地址
        info: true, // 裁剪框的大小信息
        outputSize: 0.8, // 裁剪生成图片的质量
        outputType: 'jpeg', // 裁剪生成图片的格式 jpeg、png、webp
        canScale: false, // 图片是否允许滚轮缩放
        autoCrop: true, // 是否默认生成截图框
        // autoCropWidth: 300, // 默认生成截图框宽度
        // autoCropHeight: 200, // 默认生成截图框高度
        fixedBox: false, // 固定截图框大小 不允许改变
        fixed: false, // 是否开启截图框宽高固定比例
        fixedNumber: [7, 5], // 截图框的宽高比例
        full: true, // 是否输出原图比例的截图
        canMoveBox: true, // 截图框能否拖动
        original: false, // 上传图片按照原始比例渲染
        centerBox: false, // 截图框是否被限制在图片里面
        infoTrue: true // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
      },
      previews: {}, // 预览
      modelSrc: '', // 预览地址
      picsList: [], // 页面显示的数组
      loading: false, // 防止重复提交
      downImg: '' // 下载的图片地址
    }
  },
  methods: {
    // 开始截图
    startCrop() {
      this.$refs.cropper.startCrop()
    },
    // 停止截图
    stopCrop() {
      this.$refs.cropper.startCrop()
    },
    // 清除截图
    clearCrop() {
      this.$refs.cropper.clearCrop()
    },
    // 重置
    refreshCrop() {
      this.$refs.cropper.refresh()
    },
    // 手动缩放
    changeScale(num) {
      num = num || 100
      this.$refs.cropper.changeScale(num)
    },
    // 向左旋转90°
    rotateLeft() {
      this.$refs.cropper.rotateLeft()
    },
    // 向右旋转90°
    rotateRight() {
      this.$refs.cropper.rotateRight()
    },
    // 上传按钮   限制图片大小
    changeUpload(file, fileList) {
      const isLt5M = file.size / 1024 / 1024 < 5
      if (!isLt5M) {
        this.$message.error('上传文件大小不能超过 5MB!')
        return false
      }
      this.fileinfo = file
      // 上传成功后将图片地址赋值给裁剪框显示图片
      this.$nextTick(() => {
        // this.option.img = file.url
        this.option.img = 'https://fengyuanchen.github.io/cropperjs/images/picture.jpg'
        this.dialogVisible = true
      })
    },
    // 下载图片
    down(type) {
      this.$refs.downLoadImg.download = 'author-img'
      if (type === 'blob') {
        this.$refs.cropper.getCropBlob((data) => {
          this.downImg = window.URL.createObjectURL(data)
          this.$refs.downLoadImg.href = window.URL.createObjectURL(data)
          this.$refs.downLoadImg.click()
        })
      } else {
        this.$refs.cropper.getCropData((data) => {
          this.downImg = data
          this.$refs.downLoadImg.href = data
          this.$refs.downLoadImg.click()
        })
      }
      this.dialogVisible = true
    },
    // 点击裁剪，这一步是可以拿到处理后的地址
    finish(type) {
      // let _this = this
      const formData = new FormData()
      // 输出
      if (type === 'blob') {
        this.$refs.cropper.getCropBlob((data) => {
          const img = window.URL.createObjectURL(data)
          this.modelSrc = img
          this.model = true
          formData.append('file', data, this.fileName)
          // this.$http.post(Api.uploadSysHeadImg.url, formData, {contentType: false, processData: false, headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
          //   .then((response) => {
          //     var res = response.data
          //     if (res.success == 1) {
          //       $('#btn1').val('')
          //       _this.imgFile = ''
          //       _this.headImg = res.realPathList[0] // 完整路径
          //       _this.uploadImgRelaPath = res.relaPathList[0] // 非完整路径
          //       _this.$message({// element-ui的消息Message消息提示组件
          //         type: 'success',
          //         message: '上传成功'
          //       })
          //     }
          //   })
        })
      } else {
        this.$refs.cropper.getCropData((data) => {
          this.modelSrc = data
          this.model = true
        })
      }
    },
    // 实时预览函数
    realTime(data) {
      this.previews = data
    },
    // 图片加载情况
    imgLoad(msg) {}
  }
}
</script>

<style lang="scss" scoped>
  .vueCropper {
		text-align: center;
  }
  // 截图
  .cropper-content {
    .cropper {
      width: auto;
      height: 300px;
    }
  }
  .el-button {
    margin-top: 10px;
  }
</style>
