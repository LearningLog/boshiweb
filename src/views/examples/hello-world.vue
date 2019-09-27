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
    <br><br>
    <!--引入组件-->
    <tinymce :id="content" v-model="content" class="tinymce" :height="300" :width="900" :value="content" />
    <!--显示输入的文字-->
    <div class="editor-content vjs-16-9" v-html="content" />
    <div id="video" />
    <div id="video2" />
    <About />
    <div class="placeholder-container">
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
    </div>
    <el-tooltip placement="top" content="tooltip">
      <back-to-top :custom-style="myBackToTopStyle" :visibility-height="300" :back-position="0" transition-name="fade" />
    </el-tooltip>
    <iframe src="//vjs.zencdn.net/v/oceans.mp4" frameborder="0"></iframe>
    <Footer />
  </div>
</template>

<script>
// 直接使用
import clip from '@/utils/clipboard'
// 指令形式使用
import clipboard from '@/directive/clipboard/index.js'
import Tinymce from '@/components/Tinymce'
import Footer from '@/components/Footer'
import About from '@/components/About'
import BackToTop from '@/components/BackToTop'
const $ = window.$
export default {
  name: 'HelloWorld',
  components: { Tinymce, Footer, About, BackToTop },
  directives: {
    clipboard
  },
  data() {
    return {
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
      content: 'Tinymce',
      // toolbar: ['searchreplace bold italic underline strikethrough alignleft aligncenter alignright outdent indent  blockquote undo redo removeformat subscript superscript code codesample', 'hr bullist numlist link charmap preview anchor pagebreak insertdatetime table emoticons forecolor backcolor fullscreen fontsizeselect fontselect'],
      // plugins: ['advlist anchor autolink autosave code codesample colorpicker colorpicker contextmenu directionality emoticons fullscreen hr imagetools insertdatetime link lists nonbreaking noneditable pagebreak paste preview print save searchreplace spellchecker tabfocus table template textcolor textpattern visualblocks visualchars wordcount'],
      // customizable button style, show/hide critical point, return position
      myBackToTopStyle: {
        right: '50px',
        bottom: '50px',
        width: '40px',
        height: '40px',
        'border-radius': '4px',
        'line-height': '45px', // 请保持与高度一致以垂直居中 Please keep consistent with height to center vertically
        background: '#e7eaf1'// 按钮的背景颜色 The background color of the button
      }
    }
  },
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
      this.token = this.$Cookies.set('token', '1111', { expires: 1 })
      const a = 1
      console.log(a)
    },
    del() {
      this.token = this.$Cookies.remove('token')
    },
    get() {
      this.token = this.$Cookies.get('token')
    },
    initVideo() {
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
    },
    initVideo2() {
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
