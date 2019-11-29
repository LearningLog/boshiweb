<template>
  <el-container class="container">
    <el-header class="header">
      <div class="clearfix">
        <p class="fl cname">{{ chapter.cname }}</p>
        <div class="fr">
          <div class="pointer share">
            <el-popover
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
              ><i class="iconfont iconfenxiang1" />分享</span>
            </el-popover>
          </div>
          <span class="interval" />
          <user />
        </div>
      </div>
    </el-header>
    <el-main class="main">
      <div class="fl set">
        <div class="topSet">
          <div v-if="chapter.type === 1" v-show="isActiveSet === 1" class="activeSet1">
            <p class="tip">小提示：设置完成，点击开启直播按钮即可</p>
            <div class="selectType">
              <span
                class="type1"
                :class="{ activeSelect: isActiveSelect === 1 }"
                @click="activeSelect(1)"
              >使用电脑直播（OBS）</span>
              <span
                class="type2"
                :class="{ activeSelect: isActiveSelect === 2 }"
                @click="activeSelect(2)"
              >使用手机直播（视界直播）</span>
              <span
                class="type3"
                :class="{ activeSelect: isActiveSelect === 3 }"
                @click="activeSelect(3)"
              >使用其他设备直播</span>
            </div>
            <div>
              <div v-show="isActiveSelect === 1" class="activeSelect1">
                <p>
                  支持OBS在电脑桌面演示直播，下载地址见
                  <a
                    href="https://obsproject.com/download?spm=a2c4g.11186623.2.10.72d76812ZGLeor"
                    class="obs"
                  >OBS官网下载地址</a>
                </p>
                <div
                  v-for="(item, index) in live_info"
                  :key="item._id"
                  class="parkingPosition"
                >
                  <span class="pos fl">机位{{ index + 1 }}：</span>
                  <el-form
                    ref="chapter"
                    class="chapterForm"
                    :model="item"
                    label-width="100px"
                  >
                    <el-form-item label="URL：">
                      <el-input
                        :value="cutOut(item.publishUrl)"
                        disabled
                      /><span
                        class="copy"
                        @click="copy(cutOut(item.publishUrl), $event)"
                      >复制地址</span>
                    </el-form-item>
                    <el-form-item label="流名称/密钥：">
                      <el-input :value="item.streamName" disabled /><span
                        class="copy"
                        @click="copy(item.streamName, $event)"
                      >复制流名</span>
                    </el-form-item>
                  </el-form>
                </div>
              </div>
              <div v-show="isActiveSelect === 2" class="activeSelect2 clearfix">
                <div class="fl app">
                  <p>
                    下载并安装视界直播APP，(如两个机位均为手机直播，请使用两部手机下载安装，分别设置)
                  </p>
                  <p>打开APP，点击设置，将机位对应的接入码输入至验证框中：</p>
                  <div class="parkingPosition">
                    <el-form
                      ref="chapter"
                      class="chapterForm"
                      label-width="130px"
                    >
                      <el-form-item
                        v-for="(item, index) in live_info"
                        :key="item._id"
                        :label="'机位' + (index + 1) + '接入码：'"
                      >
                        <el-input :value="item.auth_appcode" disabled /><span
                          class="copy"
                          @click="copy(item.auth_appcode, $event)"
                        >复制</span>
                      </el-form-item>
                    </el-form>
                  </div>
                  <p>设置完成，点击开启直播按钮即可。</p>
                </div>
                <div class="fl qrCode">
                  <img :src="chapter.QR_CODE_URL" alt="">
                </div>
              </div>
              <div v-show="isActiveSelect === 3" class="activeSelect3">
                <p>直播设备设置请参见其直播设置说明，其中所需推流地址如下：</p>
                <div
                  v-for="(item, index) in live_info"
                  :key="item._id"
                  class="parkingPosition"
                >
                  <span class="pos fl">机位{{ index + 1 }}：</span>
                  <el-form
                    ref="chapter"
                    class="chapterForm"
                    :model="item"
                    label-width="100px"
                  >
                    <el-form-item label="URL：">
                      <el-input
                        :value="cutOut(item.publishUrl)"
                        disabled
                      /><span
                        class="copy"
                        @click="copy(cutOut(item.publishUrl), $event)"
                      >复制地址</span>
                    </el-form-item>
                    <el-form-item label="流名称/密钥：">
                      <el-input :value="item.streamName" disabled /><span
                        class="copy"
                        @click="copy(item.streamName, $event)"
                      >复制流名</span>
                    </el-form-item>
                  </el-form>
                </div>
              </div>
            </div>
          </div>
          <div
            v-if="loginUser === chapter.user_id && chapter.type === 1"
            v-show="isActiveSet === 2"
            class="activeSet2"
          >
            <p class="statistics">
              已上线人数/总人数： {{ online }}/{{ total2 }}
            </p>
            <el-scrollbar wrap-class="scrollbar-wrapper">
              <el-table v-loading="listLoading" :data="userList" fit>
                <el-table-column
                  align="center"
                  label="姓名"
                  min-width="90"
                  prop="userName"
                  show-overflow-tooltip
                />
                <el-table-column
                  align="center"
                  label="小组"
                  min-width="90"
                  prop="groupId"
                  show-overflow-tooltip
                />
                <el-table-column
                  class-name="status-col"
                  label="转态"
                  min-width="150"
                  align="center"
                  show-overflow-tooltip
                >
                  <template slot-scope="scope">
                    <el-tag
                      v-if="scope.row.status === 1"
                      type="success"
                    >已上线</el-tag>
                    <el-tag v-else type="danger">未上线</el-tag>
                  </template>
                </el-table-column>
                <el-table-column
                  align="center"
                  label="上线时间"
                  min-width="140"
                  show-overflow-tooltip
                >
                  <template slot-scope="scope">
                    <span v-if="scope.row.time">{{
                      parseTime(scope.row.time)
                    }}</span>
                    <span v-else>--</span>
                  </template>
                </el-table-column>
                <el-table-column
                  class-name="status-col"
                  label="操作"
                  width="180"
                  align="center"
                  fixed="right"
                >
                  <template slot-scope="scope">
                    <el-button
                      v-if="scope.row.shotOff === 1"
                      :disabled="loginUser === scope.row.userId"
                      size="mini"
                      @click="isRemove(scope.row, 2)"
                    ><i class="iconfont iconzengjia" />加入</el-button>
                    <el-button
                      v-else
                      :disabled="loginUser === scope.row.userId"
                      size="mini"
                      @click="isRemove(scope.row, 1)"
                    ><i class="iconfont iconshanchu" />移出</el-button>
                    <el-button
                      v-if="scope.row.forbid === 1"
                      :disabled="loginUser === scope.row.userId"
                      size="mini"
                      @click="isNoWord(scope.row, 2)"
                    ><i class="iconfont iconspeech" />取消禁言</el-button>
                    <el-button
                      v-else
                      :disabled="loginUser === scope.row.userId"
                      size="mini"
                      @click="isNoWord(scope.row, 1)"
                    ><i class="iconfont iconjinzhiyuyin" />禁言</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <pagination
                v-show="total > 0"
                :total="total"
                :page.sync="listQuery.currentPage"
                :limit.sync="listQuery.pageSize"
                @pagination="getUserList"
              />
            </el-scrollbar>
          </div>
          <div v-show="isActiveSet === 3" class="activeSet3">
            <embed :src="chapter.chapter_file" type="application/pdf">
          </div>
          <div v-show="isActiveSet === 4" class="activeSet4">
            <div class="form-edit">
              <el-form
                ref="chapterForm"
                class="form"
                :model="chapterForm"
                :rules="rules"
                label-width="100px"
                :status-icon="true"
              >
                <el-form-item label="课堂名称" prop="cname">
                  <el-input
                    v-model="chapterForm.cname"
                    placeholder="请输入课堂名称"
                    maxlength="50"
                    clearable
                  />
                </el-form-item>
                <el-form-item v-if="chapter.type === 1" label="主讲老师" prop="teacher">
                  <el-input
                    v-model="chapterForm.teacher"
                    placeholder="请输入主讲老师"
                    maxlength="10"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="课程简介">
                  <el-input
                    v-model="chapterForm.brief"
                    type="textarea"
                    :rows="2"
                    placeholder="请输入课程简介"
                  />
                </el-form-item>
                <el-form-item label="发言控制" prop="can_discuss">
                  <el-radio-group v-model="chapterForm.can_discuss">
                    <el-radio :label="1">允许发言</el-radio>
                    <el-radio :label="2">禁止发言</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-form>
              <div id="btnGroup">
                <el-button
                  v-no-more-click
                  type="primary"
                  @click="updatePartInfo('form')"
                >修改</el-button>
              </div>
            </div>
          </div>
        </div>
        <div class="bottomOperate tc">
          <div
            v-if="chapter.type === 1"
            class="itemOperate pointer"
            :class="{ activeSet: isActiveSet === 1 }"
            @click="active(1)"
          >
            <i
              class="iconfont iconzhiboyuanshehzi
"
            /><span>直播源设置</span>
          </div>
          <div
            v-if="loginUser === chapter.user_id && chapter.type === 1"
            class="itemOperate pointer"
            :class="{ activeSet: isActiveSet === 2 }"
            @click="active(2)"
          >
            <i class="iconfont iconxiaozuguanli1" />
            <span>成员管理</span>
          </div>
          <div v-if="chapter.type === 1" class="itemOperate pointer">
            <el-button
              v-if="chapter.allow_broadcast === 1"
              class="open"
              @click="openLive"
            >开始直播</el-button>
            <el-button
              v-else-if="chapter.allow_broadcast === 2"
              class="end"
              @click="endLive"
            >结束直播</el-button>
            <el-button v-else disabled>已结束</el-button>
          </div>
          <div
            class="itemOperate pointer"
            :class="{ activeSet: isActiveSet === 3 }"
            @click="active(3)"
          >
            <i
              class="iconfont iconwendangguanli
"
            />
            <span>文档管理</span>
          </div>
          <div
            class="itemOperate pointer"
            :class="{ activeSet: isActiveSet === 4 }"
            @click="active(4)"
          >
            <i class="iconfont iconkechengshehzi" />
            <span>课程设置</span>
          </div>
        </div>
      </div>
      <div class="fl comment">
        <div class="video-wapper">
          <div id="livePlay1" class="video-item" />
          <div id="livePlay2" class="video-item" />
        </div>
        <div class="top-text">讨论</div>
        <div v-show="!commentsList.length" class="comment-wapper-nocomment">
          <img :src="nocomment" alt="暂无评论">
        </div>
        <div v-show="commentsList.length" class="comment-wapper">
          <el-scrollbar id="content" ref="comments" wrap-class="scrollbar-wrapper">
            <ul class="comments-list">
              <li v-for="(item, index) in commentsList" :key="index" class="infinite-list-item clearfix">
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
        <div class="comment-send">
          <el-input v-model="comment" class="comment-input" clearable @keyup.enter.native="sendComment" /><el-button class="comment-btn" type="primary" @click="sendComment">发送</el-button>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import User from '@/components/User'
import { createFullUrl } from '@/utils/index'
import clip from '@/utils/clipboard'
import { parseTime } from '@/utils/index'
import Pagination from '@/components/Pagination'
import nocomment from '@/assets/images/nocomment.png'
import defaultAvatar from '@/assets/images/default-avatar.png'
import { mapGetters } from 'vuex'
const $ = window.$
import {
  findDetailInfoById,
  getUserList,
  updateUser,
  updatePartInfo,
  broadcastOperate,
  getComments
} from '@/api/client/teacher-live-demand'

export default {
  components: { Pagination, User },
  data() {
    return {
      nocomment,
      defaultAvatar,
      flag: 0, // 第一次进入滚动到底部
      shareUrl: '', // 分享地址
      isActiveSet: 1, // 底部设置按钮高亮
      isActiveSelect: 1, // 直播源设置中 设备选择按钮高亮
      id: '', // 课程id
      chapter: {
        // 标题
        _id: '',
        cname: '', // 课堂名称
        nickname: '' // 老师名称
      },
      loginUser: '', // 当前登录人
      live_info: [], // 直播信息
      videoSource1: 'noVideo.mp4', // 机位1 Source
      videoSource2: 'noVideo.mp4', // 机位2 Source
      listLoading: false, // 是否开启表格遮罩
      userList: [], // 成员list
      total: 0, // 总条数
      listQuery: {
        // 查询条件
        currentPage: 1, // 当前页
        pageSize: 10, // 当前页请求条数
        chapterId: '' // 课程id
      },
      total3: 0, // 总条数
      listQuery2: {
        // 查询条件
        discussId: '', // 最后一条消息
        cid: '' // 课程id
      },
      total2: 0, // 总人数
      online: 0, // 在线人数
      chapterForm: {
        cname: '', // 课堂名称
        teacher: '', // 主讲老师
        brief: '', // 课程简介
        can_discuss: '', // 发言控制
        _id: '', // 评论控制
        auth_code: ''
      },
      commentsList: [],
      comment: '', // 评论输入的内容
      rules: {
        cname: [
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
        ],
        teacher: [
          {
            required: true,
            message: '请输入主讲老师（长度在 1 到 10 个字符）',
            trigger: 'blur'
          },
          {
            required: true,
            message: '请输入主讲老师（长度在 1 到 10 个字符）',
            trigger: 'change'
          }
        ],
        can_discuss: [
          { required: true, message: '请选择评论控制', trigger: 'change' }
        ]
      }
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

    // 监听 chapter._id 变化, 更新播放器
    'chapter._id': function(curVal, oldVal) {
      $('#livePlay1').dispose({ id: 'myVideo1' })
      this.initVideo1()
    }
  },
  beforeDestroy() {
    // 销毁video实例，避免出现节点不存在 但是flash一直在执行,也避免重新进入页面video未重新声明
    $('#livePlay1').dispose({ id: 'myVideo1' })
    const comments = this.$refs.comments.wrap
    comments.removeEventListener('scroll', this.handleScroll)
  },
  created() {
    this.id = this.$route.query._id
    this.listQuery.chapterId = this.$route.query._id
    this.listQuery2.cid = this.$route.query._id
    this.chapterForm._id = this.$route.query._id
    // const host = location.host
    // if (host.indexOf('localhost:') > -1) {
    //   this.shareUrl =
    //     host +
    //     '#/client/student-live-demand?_id=' +
    //     this.id
    // } else {
    //   this.shareUrl =
    //     process.env.VUE_APP_BASE_API +
    //     '#/client/student-live-demand?_id=' +
    //     this.id
    // }
    const subPath = '#/client/student-live-demand?_id=' + this.id
    this.shareUrl = createFullUrl(subPath)
    this.loginUser = this.$store.state.user.userSystemInfo.userInfo._id
    this.findDetailInfoById()
    this.getComments()
  },
  mounted() {
    this.initVideo1()
    // this.initVideo2() // 机位2
    this.$ws.open(this.id)
    const comments = this.$refs.comments.wrap
    comments.addEventListener('scroll', this.handleScroll)
  },
  methods: {
    // 获取课堂详情
    findDetailInfoById() {
      findDetailInfoById({ id: this.id, isNeedValidateAuthCode: '2' }).then(
        res => {
          this.chapter = res.data.chapter
	        if (this.chapter.type === 2) {
            this.isActiveSet = 3
	        } else {
            this.isActiveSet = 1
            $('.vjs-control-bar .vjs-reStart').hide()
          }
          this.live_info = res.data.live_info || []

          this.chapterForm.cname = res.data.chapter.cname
          this.chapterForm.teacher = res.data.chapter.teacher
          this.chapterForm.brief = res.data.chapter.brief
          this.chapterForm.can_discuss = res.data.chapter.can_discuss * 1
          this.chapterForm.auth_code = res.data.chapter.auth_code
          if (this.chapter.type === 1) {
            this.videoSource1 = this.live_info[0] ? this.live_info[0].cdnUrl : 'noVideo.mp4'
            this.videoSource2 = this.live_info[1] ? this.live_info[1].cdnUrl : 'noVideo.mp4'
          } else {
            this.videoSource1 = this.chapter.video_url || 'noVideo.mp4'
            this.videoSource2 = 'noVideo.mp4'
          }
        }
      )
    },

    // 获取在线成员
    getUserList() {
      this.listLoading = true
      getUserList(this.listQuery).then(res => {
        this.listLoading = false
        this.userList = res.data.page.list
        this.total = res.data.page.totalCount
        this.online = res.data.online
        this.total2 = res.data.total
      })
    },

    // 分享复制
    clipboard(event) {
      clip(this.shareUrl, event)
    },

    // 复制
    copy(url, event) {
      clip(url, event)
    },

    // 切换设置
    active(type) {
      this.isActiveSet = type
      if (type === 2) {
        this.getUserList()
      }
    },

    // 切换 流设备选择
    activeSelect(type) {
      this.isActiveSelect = type
    },

    // 截取流地址
    cutOut(url) {
      url = url || ''
      const index = url.lastIndexOf('/')
      let url1 = ''
      url1 = url.substring(0, index + 1)
      return url1
    },

    // 转换上线时间
    parseTime(time) {
      return parseTime(time)
    },

    // 移出，加入
    isRemove(row, type) {
      var params = {
        chapterId: this.id,
        userId: row.userId,
        shotOff: type
      }
      if (type === 1) {
        this.$confirm('确定要移出【' + row.userName + '】吗？', '移出成员', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            updateUser(params).then(response => {
              this.$message.success('移出成功！')
              this.getUserList()
            })
          })
          .catch(() => {})
      } else {
        updateUser(params).then(response => {
          this.$message.success('加入成功！')
          this.getUserList()
        })
      }
    },

    // 禁言、取消禁言
    isNoWord(row, type) {
      var params = {
        chapterId: this.id,
        userId: row.userId,
        forbid: type
      }
      if (type === 1) {
        this.$confirm('确定要禁言【' + row.userName + '】吗？', '禁言成员', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            updateUser(params).then(response => {
              this.$message.success('禁言成功！')
              this.getUserList()
            })
          })
          .catch(() => {})
      } else {
        updateUser(params).then(response => {
          this.$message.success('取消禁言成功！')
          this.getUserList()
        })
      }
    },

    // 课程设置
    updatePartInfo() {
      this.chapterForm.can_discuss = this.chapterForm.can_discuss + ''
      updatePartInfo(this.chapterForm).then(res => {
        this.$message.success('课程设置成功！')
        this.findDetailInfoById()
      })
    },

    // 开始直播
    openLive() {
      this.$confirm('确定要开始直播吗？', '开始直播', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          broadcastOperate({ _id: this.id, broadcast_mark: 'open' }).then(res => {
            this.$message.success('开启成功！')
            this.findDetailInfoById()
          })
        })
        .catch(() => {})
    },

    // 结束直播
    endLive() {
      this.$confirm('确定要结束直播吗？', '结束直播', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          broadcastOperate({ _id: this.id, broadcast_mark: 'close' }).then(res => {
            this.$message.success('结束成功！')
            this.findDetailInfoById()
          })
        })
        .catch(() => {})
    },

    // 机位1
    initVideo1() {
      var that = this
      $(function() {
        $('#livePlay1').videoPlayer({
          id: 'myVideo1', // 创建video id
          control: true, // 视频支持  音频不支持
          autoPlay: true,
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

    // 头像加载失败的回调
    avatarErrorHandler() {
      return true
    },

    // 获取评论
    getComments() {
      getComments(this.listQuery2).then(res => {
        this.total3 = res.data.page.totalCount
        res.data.page.list = res.data.page.list || []
        this.listQuery2.discussId = res.data.page.list[0] ? res.data.page.list[0]._id : ''
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
      if ((comments.scrollTop === 0) && this.flag !== 1 && this.commentsList.length < this.total3) {
        this.getComments()
      }
      this.flag++
    },

    // 发送评论
    sendComment() {
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
$border_color: #243752;

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
    background: rgba(0,0,0,0.4);
  }

  > .set {
    width: calc(100% - 380px);
    height: calc(100vh - 70px);
    padding: 20px;

    > .bottomOperate {
      position: fixed;
      z-index: 9999;
      bottom: 0;
      left: 0%;
      width: calc(100% - 385px);
      height: 70px;
      line-height: 60px;
      border-top: 1px solid rgba(255, 255, 255, 0.5);
      background-color: $lesson-detail-blue;
    }
  }
  .itemOperate {
    width: 110px;
    display: inline-block;

    > .iconfont {
      display: block;
      height: 20px;
      line-height: 40px;
    }
    > span {
      display: inline-block;
      height: 30px;
      line-height: 40px;
    }
  }

  .bottomOperate .open,
  .bottomOperate .end {
    background-color: red;
    color: #fff;
    border: red;
  }
  .open:hover {
    opacity: 0.9;
  }
  .activeSet {
    color: $themeColor;
  }

  .activeSet1 .tip {
    margin-top: 0;
  }
  .selectType {
    width: 100%;
    height: 50px;
    line-height: 50px;
    text-align: center;
  }
  .selectType > span {
    display: inline-block;
    width: 33%;
    background-color: #515151;
    border-radius: 4px;
    cursor: pointer;
  }
  .activeSelect {
    background-color: #ffffff !important;
    color: $themeColor;
  }
  .obs {
    color: $themeColor;
  }
  .parkingPosition {
    width: 700px;
    border: 1px solid #515151;
    border-radius: 4px;
  }
  .chapterForm {
    width: 70%;
    margin: 0 auto;
    padding-top: 20px;
  }
  .parkingPosition /deep/ .el-input {
    width: calc(100% - 90px);
  }
  .pos {
    display: inline-block;
    padding: 16px;
  }
  .qrCode img {
    width: 200px;
  }
  .activeSelect2 .app {
    margin-right: 100px;
  }
  .activeSelect2 .qrCode {
    margin-top: 20px;
  }
}
.topSet /deep/ .el-form-item__label,
.topSet /deep/ .el-radio__label {
  color: #ffffff !important;
}
.topSet /deep/ .el-input__inner,
.topSet /deep/ .el-textarea__inner {
  background: rgba(0, 0, 0, 0.4);
  color: #fff;
}
.copy {
  display: inline-block;
  padding: 0 10px;
  border: 1px solid;
  border-radius: 4px;
  margin-left: 10px;
  cursor: pointer;
}

#btnGroup {
  padding-left: 100px;
}
/* 表格内背景颜色 */
.activeSet2 /deep/ .el-table th,
.activeSet2 /deep/ .el-table tr,
.activeSet2 /deep/ .el-table td {
  border-right: none !important;
  background-color: $lesson-detail-blue;
  color: #ffffff;
}
.activeSet2 /deep/ .el-table .el-button {
  background-color: $lesson-detail-blue;
  color: #ffffff;
}
.activeSet2 /deep/ .el-table__row.hover-row > td,
.activeSet2 /deep/ .el-table__row.current-row > td {
  color: $themeColor;
  background: #f1f5fd !important;
}

.activeSet2 /deep/ .el-table__row.hover-row > td .el-button,
.activeSet2 /deep/ .el-table__row.current-row > td .el-button {
  color: $themeColor;
  border-color: $themeColor;
  transition: all 0.5s;
  -o-transition: all 0.5s;
  -ms-transition: all 0.5s;
  -moz-transition: all 0.5s;
  -webkit-transition: all 0.5s;
}

.activeSet2 /deep/ .el-table__row:hover {
  color: $themeColor;
  border-color: $themeColor;
  background: #f1f5fd !important;
  transition: all 0.5s;
  -o-transition: all 0.5s;
  -ms-transition: all 0.5s;
  -moz-transition: all 0.5s;
  -webkit-transition: all 0.5s;
}

.activeSet2 /deep/ .el-table__row.hover-row > td .el-button:hover,
.activeSet2 /deep/ .el-table__row.current-row > td .el-button:hover {
  color: #fff;
  border-color: $themeColor;
  background: $themeColor;
  transition: all 0.5s;
  -o-transition: all 0.5s;
  -ms-transition: all 0.5s;
  -moz-transition: all 0.5s;
  -webkit-transition: all 0.5s;
}
.activeSet2 /deep/ .pagination-container {
  background-color: $lesson-detail-blue;
}
.activeSet2 /deep/ .el-pagination .el-pagination__total,
.activeSet2 /deep/ .el-pagination .el-pagination__jump {
  color: #ffffff;
}
embed {
  width: 100%;
  height: calc(100vh - 176px);
}
.activeSet2 /deep/ .el-scrollbar {
  height: calc(100vh - 188px);
}
.statistics {
  margin-top: 0;
}

  .comment {
    > .video-wapper {
      width: 100%;
      height: 120px;
      border-bottom: 5px solid $border_color;

      > .video-item {
        width: 49% !important;
        height: 100% !important;
        display: inline-block!important;

        > /deep/ .vjs-sublime-skin2 {
          min-width: 0px;
        }
      }
      .video-item /deep/ #danmu_send_opt, .video-item /deep/ .vjs-screenshot, .video-item /deep/ .vjs-current-time, .video-item /deep/ .vjs-time-control, .video-item /deep/ .vjs-duration {
        display: none!important;
      }
      .video-item /deep/ .vjs-control-bar .vjs-icon-placeholder:before {
        height: 30px;
        line-height: 30px;
      }
    }

    > .top-text {
      width: 100%;
      height: 40px;
      line-height: 40px;
      text-align: center;
      color: #FFFFFF;
      background-color: $themeColor;
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
</style>
