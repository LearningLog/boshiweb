<template>
  <div class="filePreiew">
    <el-dialog
      v-el-drag-dialog
      :title="title"
      :append-to-body="true"
      :visible.sync="filePreviewVisible"
      @close="cancel"
    >
      <img v-if="fileTypeCode === 3" class="img" :src="fileUrl" alt="">
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
    fileTypeCode: {
      type: Number,
      default: -1
    },
    fileUrl: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: '文件预览'
    }
  },
  data() {
    return {
      filePreviewVisible: false
    }
  },
  watch: {
    fileTypeCode: function(val, val2) {
      if (val !== 0 && val !== 1 && val !== 2 && this.isFilePreview) {
        this.$message.error('该文件不支持预览，请下载查看！')
        this.$emit('closePreview')
        return false
      }
      if (this.isFilePreview) {
        this.filePreviewVisible = true
        var that = this
        if ((val === 1 || val === 2)) {
          setTimeout(function() {
            that.initVideo(that.fileTypeCode, that.fileUrl)
          })
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
