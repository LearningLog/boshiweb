<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <qriously :value="value" :size="size" :element="element" :background-alpha="backgroundAlpha" />
    <el-button type="success" plain @click="handleCopy(inputData,$event)">copy1</el-button>
    <el-button v-clipboard:copy="inputData" v-clipboard:success="clipboardSuccess" type="success" plain>copy2</el-button>
    <br><br>
    <div>{{ token }}</div>
    <el-button type="primary" plain @click="add()">addCookie</el-button>
    <el-button type="primary" plain @click="get()">getCookie</el-button>
    <el-button type="primary" plain @click="del()">delCookie</el-button>

    <el-button type="primary" @click="showUpload">showUpload</el-button>
    <el-button type="primary" @click="closeUpload">showUpload</el-button>


    <FilePreview :isFilePreview="isFilePreview" :fileFormat="fileFormat" :fileTypeCode="fileTypeCode" :fileUrl="fileUrl" :title="title" @closePreview="closePreview"></FilePreview>
    <el-button type="primary" plain  @click="pic_1">pic_1</el-button>
    <el-button type="primary" plain  @click="video_1">video_1</el-button>
    <el-button type="primary" plain  @click="audio_1">audio_1</el-button>
    <el-button type="primary" plain  @click="pdf_1">pdf_1</el-button>

    <br><br>
    <!--引入组件-->
    <tinymce :id="content" v-model="content" class="tinymce" :height="300" :width="900" :value="content" />
    <!--显示输入的文字-->
    <div class="editor-content vjs-16-9" v-html="content" />
    <div id="video" />
    <div id="video2" />
    <iframe src="//vjs.zencdn.net/v/oceans.mp4" frameborder="0" />
    <Footer />
  </div>
</template>

<script>
import store from '@/store'
// 直接使用
import clip from '@/utils/clipboard'
// 指令形式使用
import clipboard from '@/directive/clipboard/index.js'
import Tinymce from '@/components/Tinymce'
import Footer from '@/components/Footer'
import FilePreview from '@/components/FilePreview' // secondary package based on el-pagination
const $ = window.$
export default {
  name: 'HelloWorld',
  components: { Tinymce, Footer, FilePreview },
  directives: {
    clipboard
  },
  data() {
    return {
      isFilePreview: false, // 是否打开预览
      fileFormat: '', // 文件格式
      fileTypeCode: -1, // 文件类型
      fileUrl: '', // 文件地址
      title: '', // 文件名称（弹窗title）
      msg: 'Welcome to Your Vue.js App',
      token: null,
      // 可以自定义，必填项。
      value: 'http://lxchuan12.github.io/',
      // 二维码大小 默认 100
      size: 80,
      element: 'img',
      // 背景透明度，默认透明 0
      backgroundAlpha: 1,
      inputData: 'copy123456',
      content: 'Tinymce'
      // toolbar: ['searchreplace bold italic underline strikethrough alignleft aligncenter alignright outdent indent  blockquote undo redo removeformat subscript superscript code codesample', 'hr bullist numlist link charmap preview anchor pagebreak insertdatetime table emoticons forecolor backcolor fullscreen fontsizeselect fontselect'],
      // plugins: ['advlist anchor autolink autosave code codesample colorpicker colorpicker contextmenu directionality emoticons fullscreen hr imagetools insertdatetime link lists nonbreaking noneditable pagebreak paste preview print save searchreplace spellchecker tabfocus table template textcolor textpattern visualblocks visualchars wordcount'],
      // customizable button style, show/hide critical point, return position
    }
  },
  created() {},
  beforeDestroy() {
    // 销毁video实例，避免出现节点不存在 但是flash一直在执行,也避免重新进入页面video未重新声明
    $('#video').dispose({ id: 'myVideo' })
    $('#video2').dispose({ id: 'myVideo2' })
  },
  mounted() {
    this.initVideo()
    this.initVideo2()
  },
  methods: {
    // 启动上传
    showUpload() {
      store.dispatch('fileUpload/isVisibility', 1)
    },
    // 关闭上传
    closeUpload() {
      store.dispatch('fileUpload/isVisibility', 2)
    },
    // 预览图片
    pic_1() {
      this.fileUrl = 'https://cdnproduce.yunshicloud.com/5ce7f5106282c91ba828e991/BOSHI/5cf739b36282c9787bfca80e/936F835FF46D453088032E03D70F84FC.jpg'
      this.fileTypeCode = 3
      this.fileFormat = 'jpg'
      this.title = '图片'
      this.isFilePreview = true
    },
    // 预览MP4
    video_1() {
      this.fileUrl = 'https://cdnproduce.yunshicloud.com/5bfe7318ec5fb16489a4948c/BOSHI/5d5678ee6282c96fa7cc0ef1/ee8f7494bb412ffc051a9d22d99dc7f4.mp4?ZmlsZUlk=5d89dcd027b2b40015803e29'
      this.fileTypeCode = 1
      this.fileFormat = 'mp4'
      this.title = '视频'
      this.isFilePreview = true
    },
    // 预览MP3
    audio_1() {
      this.fileUrl = 'https://cdnproduce.yunshicloud.com/5ce7f5106282c91ba828e991/BOSHI/5cf216c36282c907f331d905/29730452da4ef817800526cbc2266aef.mp3?ZmlsZUlk=5dccbc783bb766001513a410'
      this.fileTypeCode = 2
      this.fileFormat = 'mp3'
      this.title = '音频'
      this.isFilePreview = true
    },
    // 预览PDF
    pdf_1() {
      this.fileUrl = 'https://cdnproduce.yunshicloud.com/5ce7f5106282c91ba828e991/BOSHI/5cf216c36282c907f331d905/daafaadbc3f02dd0cb42a8a7baca44e1.pdf?ZmlsZUlk=5dc7cbf13bb76600150a618c'
      this.fileTypeCode = 7
      this.fileFormat = 'pdf'
      this.title = 'PDF'
      this.isFilePreview = true
    },
    // 监听预览
    closePreview() {
      this.isFilePreview = false
      this.fileUrl = ''
      this.fileTypeCode = -1
      this.title = ''
    },
    handleCopy(text, event) {
      clip(text, event)
    },
    clipboardSuccess() {
      this.$message({
        message: '复制成功2',
        type: 'success',
        duration: 1500
      })
    },
    add() {
      // this.token = this.$Cookies.set('token', '1111', { expires: 1 })
      const a = 1
      console.log(a)
    },
    del() {
      // this.token = this.$Cookies.remove('token')
    },
    get() {
      // this.token = this.$Cookies.get('token')
    },
    initVideo() {
      $(function() {
        $('#video').videoPlayer({
          id: 'myVideo', // 创建video id
          control: true, // 视频支持  音频不支持
          autoPlay: false,
          width: 600, // 视频音频的宽 最小宽度500
          height: 350, // 视频的宽,音频设置无效
          source: 'http://oss.huayun.cdvcloud.com/WJSL/WJSL/54c6f9582a80fc1e70ff5575/dd1f5b0f031e424a86daa58e699fd570_13.flv', // 播放源地址
          // source: '//vjs.zencdn.net/v/oceans.mp4', // 播放源地址
          // source: 'http://playertest.longtailvideo.com/adaptive/bipbop/gear4/prog_index.m3u8', // 播放源地址
          title: '这里是标题',
          // thumbnailUrl: 'https://matrimony001.100msh.net.cn/public/code/material/mp-7261-1554175849.jpg',
          playType: 'video', // 可选值 视频：video 音频：audio
          flvAudio: false,
          shootingFlag: false
          // clarityArr: [1, 2, 3]// 清晰度切换
        })
      })
    },
    initVideo2() {
      $(function() {
        $('#video2').videoPlayer({
          id: 'myVideo2', // 创建video id
          control: true, // 视频支持  音频不支持
          autoPlay: false,
          width: 600, // 视频音频的宽 最小宽度500
          height: 350, // 视频的宽,音频设置无效
          source: 'http://oss.huayun.cdvcloud.com/WJSL/WJSL/54c6f9582a80fc1e70ff5575/dd1f5b0f031e424a86daa58e699fd570_13.flv', // 播放源地址
          // source: 'http://playertest.longtailvideo.com/adaptive/bipbop/gear4/prog_index.m3u8', // 播放源地址
          title: '这里是标题',
          // thumbnailUrl: 'https://matrimony001.100msh.net.cn/public/code/material/mp-7261-1554175849.jpg',
          playType: 'video', // 可选值 视频：video 音频：audio
          flvAudio: false,
          shootingFlag: false
          // clarityArr: [1, 2, 3]// 清晰度切换
        })
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1, h2 {
    font-weight: normal;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    display: inline-block;
    margin: 0 10px;
  }
  a {
    color: #42b983;
  }
  .tinymce, #video {
    margin-left: 100px;
  }
  .hello {
    text-align: center;
  }
  .placeholder-container div {
    margin: 10px;
  }
</style>
