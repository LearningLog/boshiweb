<template>
  <div class="filePreiew">
    <el-dialog
      v-el-drag-dialog
      :title="title"
      :append-to-body="true"
      :visible.sync="filePreviewVisible"
      height="60vh"
      @close="cancel"
    >
      <div v-if="fileTypeCode === 3" class="previewImg" :style="previewImg" />
      <div class="vadioPlay">
        <!--<video id="video_1" src="" class="video video-js vjs-big-play-centered" controls preload="auto" v-if="fileTypeCode === 1"></video>-->
        <!--<audio id="audio_1" src="" class="video video-js vjs-big-play-centered" controls preload="auto" v-if="fileTypeCode === 2"></audio>-->
      </div>
    </el-dialog>
  </div>
</template>

<script>
import elDragDialog from '@/directive/el-drag-dialog'
const $ = window.$
const videojs = window.videojs

export default {
  name: 'FilePreview',
  directives: { elDragDialog },
  props: {
    isFilePreview: {
      type: Boolean,
      default: false
    },
    fileFormat: {
      type: String, // mp3、mp4、pdf
      default: ''
    },
    fileTypeCode: {
      type: Number, // 1，视频；2，音频；3，图片；7，PDF；
      default: -1
    },
    fileUrl: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: '文件预览'
    },
    iWidth: {
      type: Number,
      default: 800
    },
    iHeight: {
      type: Number,
      default: 600
    }
  },
  data() {
    return {
      filePreviewVisible: false,
      previewImg: {}
    }
  },
  watch: {
    fileTypeCode: function(val, val2) {
      if (val !== 3 && val !== 1 && val !== 2 && val !== 7 && this.isFilePreview) {
        this.$message.error('该文件不支持预览，请下载查看！')
        this.$emit('closePreview')
        return false
      }
      if (val === 1 && this.fileFormat !== 'mp4') {
        this.$message.error('该文件不支持预览，请下载查看！')
        this.$emit('closePreview')
        return false
      }
      if (val === 2 && this.fileFormat !== 'mp3') {
        this.$message.error('该文件不支持预览，请下载查看！')
        this.$emit('closePreview')
        return false
      }
      if (val === 7 && this.fileFormat !== 'pdf') {
        this.$message.error('该文件不支持预览，请下载查看！')
        this.$emit('closePreview')
        return false
      }
      if ((val === 3 || val === 1 || val === 2) && this.isFilePreview) {
        this.filePreviewVisible = true
      }
      if (this.isFilePreview) {
        var that = this
        if ((val === 1 || val === 2)) {
          setTimeout(function() {
            that.initVideo(that.fileTypeCode, that.fileUrl)
          })
        }
        if (val === 3) {
          this.previewImg = {
            backgroundImage: 'url(' + that.fileUrl + ')'
          }
        }
        if (val === 7) {
          that.openSmallWindowOnScreenMiddle(that.fileUrl, '', that.iWidth || 800, that.iHeight || 600)
          this.$emit('closePreview')
        }
      }
    }
  },
  methods: {
    // 初始化视频
    initVideo(fileTypeCode, fileUrl) {
      var myPlayer = null
      if (fileTypeCode === 1 && fileUrl) {
        $('.vadioPlay').html('<video id="video_1" src="' + fileUrl + '" class="video video-js vjs-big-play-centered" controls></video>')
        myPlayer = videojs('video_1')
      }
      if (fileTypeCode === 2 && fileUrl) {
        $('.vadioPlay').html('<audio id="audio_1" src="' + fileUrl + '" class="video video-js vjs-big-play-centered" controls></audio>')
        myPlayer = videojs('audio_1')
      }
      myPlayer.src(fileUrl)
      myPlayer.play()
    },

    /**
     * 弹出小窗口打开页面并在屏幕中间显示
     * @param fileType 如 ppt、pdf、xls、word、video
     */
    openSmallWindowOnScreenMiddle(url, name, iWidth, iHeight) {
		  var url // 转向网页的地址;
		  var name // 网页名称，可为空;
		  var iWidth // 弹出窗口的宽度;
		  var iHeight // 弹出窗口的高度;
		  // window.screen.height获得屏幕的高，window.screen.width获得屏幕的宽
		  var iTop = (window.screen.height - 30 - iHeight) / 2 // 获得窗口的垂直位置;
		  var iLeft = (window.screen.width - 10 - iWidth) / 2 // 获得窗口的水平位置;
		  window.open(url, name, 'height=' + iHeight + ',innerHeight=' + iHeight + ',width=' + iWidth + ',innerWidth=' + iWidth + ',top=' + iTop + ',left=' + iLeft + ',toolbar=no,menubar=no,scrollbars=auto,resizeable=no,location=no,status=no')
    },

    // 关闭弹窗
    cancel() {
      this.filePreviewVisible = false
      if (this.fileTypeCode === 1) {
        setTimeout(function() {
          var myPlayer = videojs('video_1')
          myPlayer.dispose()
          $('.vadioPlay').html('')
        })
      }
      if (this.fileTypeCode === 2) {
        setTimeout(function() {
          var myPlayer = videojs('audio_1')
          myPlayer.dispose()
          $('.vadioPlay').html('')
        })
      }
      this.$emit('closePreview')
    }
  }
}
</script>

<style scoped>
  .previewImg {
    width: 100%;
    height: 50vh;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }
.img {
  width: 100%;
}
  .vadioPlay {
    width: 100%;

    > /deep/ .video-dimensions {
      width: 100%;
      height: 50vh;
    }
  }
</style>
