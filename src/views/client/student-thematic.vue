<template>
  <div
    v-loading="shotOffLoading"
    :element-loading-text="'您已被课程发起人移出，请联系课程发起人【' + chapter.nickname + '】'"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <el-container class="container">
      <el-header class="header">
        <div class="clearfix">
          <p class="fl cname">{{ chapter.cname }}</p>
          <div class="fr">
            <div class="pointer share">
              <el-popover
                v-model="shareVisible"
                placement="bottom"
                width="114"
                height="120"
              >
                <div class="tc">
                  <el-link
                    type="info"
                    @click="clipboard($event)"
                  >复制分享地址</el-link>
                  <qriously
                    :value="shareUrl"
                    :size="80"
                    element="img"
                    :background-alpha="1"
                  />
                </div>
                <span
                  slot="reference"
                ><i class="iconfont iconfenxiang" />分享</span>
              </el-popover>
            </div>
            <span class="interval" />
            <span class="pointer" @click="downloadFile"><i class="iconfont iconwechaticon16" />下载课件</span>
            <span class="interval" />
            <span class="pointer" @click="appraise">课程评价</span>
            <span class="interval" />
            <user />
          </div>
        </div>
      </el-header>
      <el-main class="main">
        <div class="fl set">
          <div v-show="lessonStatus.onlive !== 2 && chapter.type === 1" class="noLive">
            <div>
              <img :src="noLiveImg" :alt="noLiveText">
              <p>{{ noLiveText }}</p>
            </div>
          </div>
          <div v-show="lessonStatus.onlive === 2 || chapter.type === 2 || lessonStatus.recordStatus === 1" class="video-wapper">
            <div id="livePlay1" class="video-item" />
            <div id="livePlay2" class="video-item" />
          </div>
        </div>
        <div class="fl comment">
          <div class="lessonOrcommentBtn">
            <div class="catalogueTopBtn" :class="{ lessonOrcommentActive: lessonOrcommentActive === 1 }" @click="lessonOrcommentActiveChange(1)">目录</div>
            <div class="top-text" :class="{ lessonOrcommentActive: lessonOrcommentActive === 2 }" @click="lessonOrcommentActiveChange(2)">讨论</div>
          </div>
          <div class="lessonOrcomment">
            <div v-show="lessonOrcommentActive === 1" class="catalogues">
              <el-scrollbar ref="catalogues" wrap-class="scrollbar-wrapper">
                <ul class="catalogues-list">
                  <li v-for="(item, index) in lessonList" :key="item._id" class="catalogues-item" :class="{ cataloguesItemActive: cataloguesItemActive === index }" @click="cataloguesItemChange(item, index)">
                    <span>课时{{ index + 1 }}</span><span class="circle">○</span><span class="cname1">{{ item.cname }}</span>
                  </li>
                </ul>
              </el-scrollbar>
            </div>
            <div v-show="!commentsList.length && lessonOrcommentActive === 2" class="comment-wapper-nocomment">
              <img :src="nocomment" alt="暂无评论">
            </div>
            <div v-show="commentsList.length && lessonOrcommentActive === 2" class="comment-wapper">
              <el-scrollbar id="content" ref="comments" wrap-class="scrollbar-wrapper">
                <ul class="comments-list">
                  <li v-for="(item, index) in commentsList" :key="index" class="infinite-list-item">
                    <div class="item-top clearfix">
                      <div class="fl">
                        <el-avatar class="header" :src="item.header || defaultAvatar" @error="avatarErrorHandler">
                          <img :src="defaultAvatar">
                        </el-avatar>
                        <span class="uname">{{ item.uname }}</span>
                      </div>
                      <span class="fr c_time">
                        {{ parseTime(item.c_timestamp) }}
                      </span>
                    </div>
                    <div class="msg">{{ item.msg }}</div>
                  </li>
                </ul>
              </el-scrollbar>
            </div>
          </div>
          <div class="comment-send">
            <el-input v-model="comment" class="comment-input" clearable :disabled="lessonStatus.chapterForbid === 2" @keyup.enter.native="sendComment" /><el-button class="comment-btn" type="primary" :disabled="lessonStatus.chapterForbid === 2" @click="sendComment">发送</el-button>
          </div>
        </div>
      </el-main>
    </el-container>
    <el-dialog
      v-el-drag-dialog
      title="学习不易，给个评价吧"
      :visible.sync="appraiseVisible"
      width="700px"
    >
      <div class="appraiseEdit">
        <el-form ref="appraiseForm" :model="appraiseForm" label-width="120px">
          <el-checkbox-group v-model="appraiseForm.appraise_label" class="appraise_label">
            <el-checkbox v-for="item in lableList" :key="item._id" :label="item._id" border>{{ item.label_name }}</el-checkbox>
          </el-checkbox-group>
          <el-form-item label="课程内容">
            <el-rate
              v-model="appraiseForm.appraise_content_level"
              :colors="colors"
            />
          </el-form-item>
          <el-form-item label="上课体验">
            <el-rate
              v-model="appraiseForm.appraise_experience_level"
              :colors="colors"
            />
          </el-form-item>
          <el-form-item label="随便说点什么吧">
            <el-input
              v-model="appraiseForm.appraise_text"
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
            />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveAppraise">确定</el-button>
        <el-button type="primary" plain @click="appraiseVisible = false">狠心拒绝</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import User from '@/components/User'
import clip from '@/utils/clipboard'
import { parseTime } from '@/utils/index'
import elDragDialog from '@/directive/el-drag-dialog'
import noLiveImg from '@/assets/images/noLive.png'
import nocomment from '@/assets/images/nocomment.png'
import defaultAvatar from '@/assets/images/default-avatar.png'
import { mapGetters } from 'vuex'
const $ = window.$
import {
  findDetailInfoById,
  getComments
} from '@/api/client/teacher-live-demand'
import { queryStatus, findLabel, addOneAppraise } from '@/api/client/student-live-demand'
import { findLessonDetailById } from '@/api/client/teacher-thematic'

export default {
  components: {
    User
  },
  directives: { elDragDialog },
  data() {
    return {
      noLiveImg,
      nocomment,
      defaultAvatar,
      flag: 0, // 第一次进入滚动到底部
      shareVisible: false, // 是否显示分享
      shareUrl: '', // 分享地址
      appraiseVisible: false, // 是否弹出评价
      lableList: [], // 评价标签
      colors: ['#99A9BF', '#F7BA2A', '#FF9900'], // 等同于 { 2: '#99A9BF', 4: { value: '#F7BA2A', excluded: true }, 5: '#FF9900' }
      appraiseForm: {
        appraise_label: [], // 评价选择标签
        appraise_content_level: 5, // 课程内容
        appraise_experience_level: 5, // 课程体验
        appraise_text: '', // 课程备注
        lesson_id: '', // 课程 内容
        lesson_type: '' // 课程类型（"online"直播课堂 "video"点播课堂， lesson 专题课堂）
      },
      lessonOrcommentActive: 1, // 右侧目录和讨论切换
      cataloguesItemActive: 0, // 右侧目录切换
      lessonList: [], // 专题课堂数据
      thematicId: '', // 专题课堂id
      id: '', // 课程id
      chapter: {
        // 标题
        _id: '',
        cname: '', // 课堂名称
        nickname: '' // 老师名称
      },
      live_info: [], // 直播信息
      videoSource1: 'noVideo.mp4', // 机位1 Source
      videoSource2: 'noVideo.mp4', // 机位2 Source
      isAutoPlay: false, // 是否自动播放
      total: 0, // 总条数
      listQuery: {
        // 查询条件
        discussId: '', // 最后一条消息
        cid: '' // 课程id
      },
      commentsList: [],
      comment: '', // 讨论输入的内容
      lessonStatus: {
        onlive: '', // 直播是否已开启(未开启:1，直播中:2，已关闭:3)
        forbid: 2, // 用户是否被禁言(禁言:1，发言:2)
        chapterForbid: 2, // 直播间是否允许评论(允许:1，不允许:2)
        shotOff: 2, // 用户是否被移除直播间(移除:1，加入:2)
        chapterFile: null, // 是否有课件(有:1，无:2)
        chapterFileCreate: null, // 课件是否生成(有:1，无:2)
        recordStatus: null // 收录状态（等待收录：-1、执行收录中：0、收录成功：1、收录失败异常：2）
      },
      noLiveText: '直播未开始',
      timer: null, // 计时器
      shotOffLoading: false // 移出遮罩层
    }
  },
  computed: {
    // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters([
      'realTimeMessage'
    ])
  },
  watch: {
    // 监听实时消息变化
    realTimeMessage: {
      handler(val, oldVal) {
        var that = this
        if (val && val.type === 'msg') {
          this.commentsList.push(val)
          const comments = that.$refs.comments.wrap
          this.$nextTick(() => {
            comments.scrollTop = comments.scrollHeight
          })
        }
      },
      deep: true // 深层次监听
    },

    // 监听课程id变化
    id: function(curVal, oldVal) {
      this.commentsList.length = 0
      this.$ws.close()
      this.$ws.open(this.id)
      clearInterval(this.timer)
      this.findDetailInfoById()
      this.getComments()
    },

    // 监听 chapter._id 变化, 更新播放器
    'chapter.type': function(curVal, oldVal) {
      if (curVal === 1) {
        this.isAutoPlay = true
        $('.vjs-control-bar .vjs-reStart').hide()
      } else {
        this.isAutoPlay = false
        $('.vjs-control-bar .vjs-reStart').show()
      }
    },

    // 监听 chapter._id 变化, 更新播放器
    'chapter._id': function(curVal, oldVal) {
      $('#livePlay1').dispose({ id: 'myVideo1' })
      this.initVideo1()
    },

    // 监听课程数据状态
    'lessonStatus.onlive': function(curVal, oldVal) {
      if (this.lessonStatus.shotOff === 2) {
        if (this.chapter.type === 1) {
          switch (curVal) {
            case 1:
              this.noLiveText = '直播未开始'
              break
            case 2:
              $('#livePlay1').dispose({ id: 'myVideo1' })
              this.initVideo1()
              break
            case 3:
              this.noLiveText = '直播已结束'
              break
          }
        } else {
          $('#livePlay1').dispose({ id: 'myVideo1' })
          this.initVideo1()
        }
      }
    },
    // 监听课程数据状态
    'lessonStatus.shotOff': function(curVal, oldVal) {
      if (curVal === 1) {
        $('#livePlay1').dispose({ id: 'myVideo1' })
        this.shotOffLoading = true
        this.$ws.close()
        this.$alert(`您已被课程发起人移出，请联系课程发起人【 ${this.chapter.nickname} 】`, '提示', {
          confirmButtonText: '确定',
          type: 'warning',
          callback: action => {}
        })
      } else {
        this.shotOffLoading = false
        this.initVideo1()
        this.$ws.open(this.id)
      }
    },

    lessonOrcommentActive: function(val, old) {
      this.flag = 0
      this.$nextTick(() => {
        const comments = this.$refs.comments.wrap
        comments.scrollTop = comments.scrollHeight
      })
    }
  },
  beforeDestroy() {
    // 销毁video实例，避免出现节点不存在 但是flash一直在执行,也避免重新进入页面video未重新声明
    $('#livePlay1').dispose({ id: 'myVideo1' })
    const comments = this.$refs.comments.wrap
    comments.removeEventListener('scroll', this.handleScroll)
    clearInterval(this.timer)
  },
  created() {
    this.thematicId = this.$route.query._id
    const host = location.host
    if (host.indexOf('localhost:') > -1) {
      this.shareUrl =
          host +
          '#/client/student-live-demand?_id=' +
          this.thematicId
    } else {
      this.shareUrl =
          process.env.VUE_APP_BASE_API +
          '#/client/student-live-demand?_id=' +
          this.thematicId
    }
    this.findLessonDetailById()
  },
  mounted() {
    this.initVideo1()
    // this.initVideo2() // 机位2
    // this.$ws.open(this.id)
    const comments = this.$refs.comments.wrap
    comments.addEventListener('scroll', this.handleScroll)
  },
  methods: {
    // 获取专题数据
    findLessonDetailById() {
      findLessonDetailById({ id: this.thematicId }).then(res => {
        this.lessonList = res.data.chaptersInfo || []
        this.cataloguesItemActive = this.lessonList.length - 1
        this.id = this.lessonList.length ? this.lessonList[this.lessonList.length - 1]._id : ''
        this.listQuery.cid = this.id
        this.$nextTick(() => {
          const catalogues = this.$refs.catalogues.wrap
          catalogues.scrollTop = catalogues.scrollHeight
        })
      })
    },

    // 获取课堂详情
    findDetailInfoById() {
      findDetailInfoById({ id: this.id, isNeedValidateAuthCode: '2' }).then(
        res => {
          this.chapter = res.data.chapter
          this.live_info.length = 0
          res.data.live_info = res.data.live_info || []
          res.data.live_info.forEach(item => {
            this.live_info.push(item)
          })

          if (this.chapter.type === 1) {
            this.videoSource1 = this.live_info[0] ? this.live_info[0].cdnUrl : 'noVideo.mp4'
            this.videoSource2 = this.live_info[1] ? this.live_info[1].cdnUrl : 'noVideo.mp4'
          } else {
            this.videoSource1 = this.chapter.video_url || 'noVideo.mp4'
            this.videoSource2 = 'noVideo.mp4'
          }
          if (this.chapter.type === 1) {
            this.isAutoPlay = true
            $('.vjs-control-bar .vjs-reStart').hide()
          } else {
            this.isAutoPlay = false
            $('.vjs-control-bar .vjs-reStart').show()
          }
          this.queryStatus()
          var that = this
          this.timer = setInterval(() => {
            that.queryStatus()
          }, 5000)
        }
      )
    },

    // 获取课程数据状态
    queryStatus() {
      queryStatus({ chapterId: this.id }).then(res => {
        this.lessonStatus = res.data
      })
    },

    // 分享复制
    clipboard(event) {
      clip(this.shareUrl, event)
    },

    // 下载课件
    downloadFile() {
      if (this.chapter.chapter_file) {
        window.open(this.chapter.chapter_file, '_blank')
      }
    },

    // 评价， 查询标签
    appraise() {
      if (this.chapter.isAppraise) {
        findLabel().then(res => {
          this.lableList = res.data
          this.appraiseVisible = true
        })
      } else {
        this.$message.warning('该课程已经评价过！')
      }
    },

    // 评价
    saveAppraise() {
      this.appraiseForm.lesson_id = this.id
      this.appraiseForm.lesson_type = this.chapter.type === 1 ? 'online' : 'video'
      addOneAppraise(this.appraiseForm).then(res => {
        this.$message.success('评价成功！')
        this.appraiseVisible = false
        this.chapter.isAppraise = false
      })
    },

    // 转换上线时间
    parseTime(time) {
      return parseTime(time)
    },

    // 机位1
    initVideo1() {
      var that = this
      $(function() {
        $('#livePlay1').videoPlayer({
          id: 'myVideo1', // 创建video id
          control: true, // 视频支持  音频不支持
          autoPlay: that.isAutoPlay,
          width: '100%', // 视频音频的宽 最小宽度500
          height: '100%', // 视频的宽,音频设置无效
          source: that.videoSource1, // 播放源地址
          title: '',
          thumbnailUrl: that.chapter.cover_pic,
          playType: 'video', // 可选值 视频：video 音频：audio
          currentTime: function(val) {
            console.log(val, '当前时间')
          },
          shootingFlag: false,
          screenshotsCallback: function(val) { }
        })
      })
    },

    // 机位2
    initVideo2() {
      var that = this
      $(function() {
        $('#livePlay2').videoPlayer({
          id: 'myVideo2', // 创建video id
          control: true, // 视频支持  音频不支持
          autoPlay: false,
          width: '100%', // 视频音频的宽 最小宽度500
          height: '100%', // 视频的宽,音频设置无效
          source: that.videoSource2, // 播放源地址
          title: '',
          thumbnailUrl: that.chapter.cover_pic,
          playType: 'video', // 可选值 视频：video 音频：audio
          timeFlag: false, // 只有为true时才会触发currentTime函数
          flvAudio: false,
          currentTime: function(val) {
            console.log(val, '当前时间')
          },
          shootingFlag: false,
          shootingCallback: function(val) {
            console.log(val, '打点')
          },
          screenshotsCallback: function(val) { }
        })
      })
    },

    // 切换右侧目录和讨论
    lessonOrcommentActiveChange(type) {
      this.lessonOrcommentActive = type
    },

    // 切换右侧目录
    cataloguesItemChange(item, index) {
      this.id = item._id
      this.listQuery.cid = this.id
      this.listQuery.discussId = ''
      this.cataloguesItemActive = index
    },

    // 头像加载失败的回调
    avatarErrorHandler() {
      return true
    },

    // 获取评论
    getComments() {
      getComments(this.listQuery).then(res => {
        this.total = res.data.page.totalCount
        res.data.page.list = res.data.page.list || []
        this.listQuery.discussId = res.data.page.list[0] ? res.data.page.list[0]._id : ''
        this.commentsList = res.data.page.list.concat(this.commentsList)
        if (this.flag === 0) {
          this.$nextTick(() => {
            const comments = this.$refs.comments.wrap
            comments.scrollTop = comments.scrollHeight
          })
        } else if (this.flag !== 1) {
          var len = res.data.page.list ? res.data.page.list.length : 0
          this.$nextTick(() => {
            var height = 0
            $('.comments-list li').each(function(index, item) {
              if (index < len) {
                height += $(item).height()
              }
            })
            const comments = this.$refs.comments.wrap
            comments.scrollTop = height
          })
        }
        this.flag++
      })
    },

    // 向上滚动刷新
    handleScroll() {
      const comments = this.$refs.comments.wrap
      if ((comments.scrollTop === 0) && this.flag !== 1 && this.commentsList.length < this.total) {
        this.getComments()
      }
      this.flag++
    },

    // 发送评论
    sendComment() {
      if (this.lessonStatus.forbid === 1 || this.lessonStatus.shotOff === 1) {
        this.$message.warning('您已被禁言，不能发起讨论！')
        return false
      }
      this.comment = this.comment.trim()
      if (!this.comment) return false
      const params = {
        uname: this.$store.state.user.userSystemInfo.userInfo.nickname,
        header: this.$store.state.user.userSystemInfo.userInfo.avatarUrl,
        msg: this.comment
      }
      this.$ws.commit(params)
      this.comment = ''
    }
  }
}
</script>

<style lang="scss" scoped>
	@import "~@/styles/theme.scss";
	@import "~@/styles/variables.scss";
	/*$lesson-detail-blue:#1b304a;
	$border_color: #243752;
	$deep_color: rgba(0,0,0,0.4);*/

	.container {
		width: 100%;
		height: 100vh;
		background-color: $lesson-detail-blue;
		color: #ffffff;

		> .header {
			height: 60px;
			line-height: 60px;
		}
		.cname {
			margin: 0;
		}
		.share {
			display: inline-block;
		}
		.interval {
			display: inline-block;
			border: 1px solid;
			height: 14px;
			margin: 0 20px;
		}
	}

	/*分享*/
	.share /deep/ .el-popover {
		min-width: 114px !important;
	}

	.main {
		height: 100%;
		border: 5px solid $border_color;
		padding: 0;

		> .comment {
			width: 380px;
			border-left: 5px solid $border_color;
			height: calc(100vh - 70px);
			background: $deep_color;
		}

		> .set {
			width: calc(100% - 380px);
			height: calc(100vh - 70px);
			padding: 20px;

			.noLive {
				width: 100%;
				height: 100%;
				text-align: center;
				display:flex;/*将其定义为弹性容器*/
				align-items: center;/*垂直居中对齐*/
				justify-content: center;/*水平居中对齐*/
			}
			.video-wapper {
				width: 100%;
				height: 100%;
			}
			/deep/ .vjs-control-bar .vjs-screenshot {
				display: none;
			}
		}
	}

	.comment {
		.top-text {
			display: inline-block;
			width: 49%;
		}

		.lessonOrcommentBtn {
			width: 100%;
			height: 40px;
			line-height: 40px;
			text-align: center;
			color: #FFFFFF;
			background-color: $deep_color;
			cursor: pointer;
		}
		.catalogueTopBtn {
			display: inline-block;
			width: 49%;
		}

		.top-text {
			display: inline-block;
			width: 49%;
		}

		.lessonOrcommentActive {
			background-color: $themeColor;
		}

		.catalogues-item {
			width: 100%;
			height: 34px;
			line-height: 34px;
			cursor: pointer;
			padding: 0 10px;
			overflow-wrap: break-word;
			word-break: break-all;
			font-size: 14px;
		}
		.circle {
			display: inline-block;
			padding: 0 14px;
		}
		.cataloguesItemActive {
			color: $themeColor;
		}

		.comment-wapper-nocomment {
			padding: 20px 20px 0;
			text-align: center;
		}
		.comment-wapper {
			padding: 20px 0 0 20px;

			.comments-list {
				font-size: 12px;
				padding-right: 20px;
			}

			.item-top {
				height: 50px;
				line-height: 50px;
			}

			.header {
				width: 30px;
				height: 30px;
				vertical-align: middle;
			}
			.c_time {
				vertical-align: middle;
			}
			.msg {
				padding: 4px 0 10px 34px;
				overflow-wrap: break-word;
				word-break: break-all;
			}
		}
		.comment-wapper /deep/ .el-scrollbar {
			height: calc(100vh - 200px);
		}
		.lessonOrcomment /deep/ .el-scrollbar {
			height: calc(100vh - 300px);
		}
	}
	.comment-send {
		position: fixed;
		bottom: 0;
		right: 0;
		width: 370px;
		border-bottom: 5px solid $border_color;
	}
	.comment-send .comment-input {
		width: calc(100% - 80px);
		margin-bottom: 14px;
		border-radius: 0;

		> /deep/ .el-input__inner {
			border-radius: 0;
			background: rgba(0, 0, 0, 0.4);
			color: #fff;
		}
	}
	.comment-send .comment-btn {
		padding: 9px 20px;
		border-radius: 0;
	}

	/*课程评价*/
	.appraiseEdit /deep/ .el-form {
		width: 80%;
		margin: 0 auto;

		/deep/ .el-rate {
			display: inline-block;
			vertical-align: middle;
		}
		.appraise_label {
			margin-bottom: 16px;
		}
	}
</style>
