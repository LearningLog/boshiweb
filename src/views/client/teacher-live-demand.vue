<template>
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
          <span>{{ chapter.nickname }}</span>
        </div>
      </div>
    </el-header>
    <el-main class="main">
      <div class="fl set">
        <div class="topSet">
          <div v-show="isActiveSet === 1" class="activeSet1">
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
                        @click="clipboard(cutOut(item.publishUrl), $event)"
                      >复制地址</span>
                    </el-form-item>
                    <el-form-item label="流名称/密钥：">
                      <el-input :value="item.streamName" disabled /><span
                        class="copy"
                        @click="clipboard(item.streamName, $event)"
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
                          @click="clipboard(item.auth_appcode, $event)"
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
                        @click="clipboard(cutOut(item.publishUrl), $event)"
                      >复制地址</span>
                    </el-form-item>
                    <el-form-item label="流名称/密钥：">
                      <el-input :value="item.streamName" disabled /><span
                        class="copy"
                        @click="clipboard(item.streamName, $event)"
                      >复制流名</span>
                    </el-form-item>
                  </el-form>
                </div>
              </div>
            </div>
          </div>
          <div v-if="loginUser === chapter.user_id" v-show="isActiveSet === 2" class="activeSet2">
            <p class="statistics">
              已上线人数/总人数： {{ online }}/{{ total2 }}
            </p>
            <el-table
              v-loading="listLoading"
              :data="userList"
              element-loading-text="Loading"
              border
              fit
              highlight-current-row
            >
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
                label="课程评价"
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
                width="160"
                align="center"
                fixed="right"
              >
                <template slot-scope="scope">
                  <el-button
                    v-if="scope.row.shotOff === 1"
                    size="mini"
                    @click="isRemove(scope.row, 2)"
                  ><i class="iconfont iconjia" />加入</el-button>
                  <el-button
                    v-else
                    size="mini"
                    @click="isRemove(scope.row, 1)"
                  ><i class="iconfont iconshanchu" />移除</el-button>
                  <el-button
                    v-if="scope.row.forbid === 1"
                    size="mini"
                    @click="isNoWord(scope.row, 2)"
                  ><i class="iconfont iconfayan" />发言</el-button>
                  <el-button
                    v-else
                    size="mini"
                    @click="isNoWord(scope.row, 1)"
                  ><i class="iconfont iconjinzhifayan" />禁言</el-button>
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
          </div>
          <div v-show="isActiveSet === 3" class="activeSet3">
            active3
          </div>
          <div v-show="isActiveSet === 4" class="activeSet4">
            <div class="form-edit">
              <el-form ref="chapterForm" class="form" :model="chapterForm" :rules="rules" label-width="100px" :status-icon="true">
                <el-form-item label="课堂名称" prop="cname">
                  <el-input
                    v-model="chapterForm.cname"
                    placeholder="请输入课堂名称"
                    maxlength="50"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="主讲老师" prop="teacher">
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
                <el-form-item label="评论控制" prop="can_discuss">
                  <el-radio-group v-model="chapterForm.can_discuss">
                    <el-radio :label="1">开启</el-radio>
                    <el-radio :label="2">关闭</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-form>
              <div id="btnGroup">
                <el-button v-no-more-click type="primary" @click="updatePartInfo('form')">提交</el-button>
              </div>
            </div>
          </div>
        </div>
        <div class="bottomOperate tc">
          <div
            class="itemOperate pointer"
            :class="{ activeSet: isActiveSet === 1 }"
            @click="active(1)"
          >
            <i class="iconfont iconxitong" /><span>直播源设置</span>
          </div>
          <div
            class="itemOperate pointer"
            :class="{ activeSet: isActiveSet === 2 }"
            @click="active(2)"
          >
            <i class="iconfont iconxitong" />
            <span>成员管理</span>
          </div>
          <div class="itemOperate pointer">
            <el-button class="open">开始直播</el-button>
          </div>
          <div
            class="itemOperate pointer"
            :class="{ activeSet: isActiveSet === 3 }"
            @click="active(3)"
          >
            <i class="iconfont iconxitong" />
            <span>文档管理</span>
          </div>
          <div
            class="itemOperate pointer"
            :class="{ activeSet: isActiveSet === 4 }"
            @click="active(4)"
          >
            <i class="iconfont iconxitong" />
            <span>课程设置</span>
          </div>
        </div>
      </div>
      <div class="fl comment">
        comment on
      </div>
    </el-main>
  </el-container>
</template>

<script>
import clip from '@/utils/clipboard'
import { parseTime } from '@/utils/index'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import {
  findDetailInfoById,
  getUserList,
  updateUser,
  updatePartInfo
} from '@/api/client/student-live-demand'

export default {
  components: { Pagination },
  data() {
    return {
      shareVisible: false, // 是否显示分享
      shareUrl: '', // 分享地址
      isActiveSet: 1, // 底部设置按钮高亮
      isActiveSelect: 1, // 直播源设置中 设备选择按钮高亮
      id: '', // 课程id
      chapter: {
        // 标题
        cname: '', // 课堂名称
        nickname: '' // 老师名称
      },
      loginUser: '', // 当前登录人
      live_info: [], // 直播信息
      listLoading: true, // 是否开启表格遮罩
      userList: [], // 成员list
      total: 0, // 总条数
      listQuery: {
        // 查询条件
        currentPage: 1, // 当前页
        pageSize: 10, // 当前页请求条数
        chapterId: '' // 课程id
      },
      total2: 0, // 总人数
      online: 0, // 在线人数
      chapterForm: {
        cname: '', // 课堂名称
        teacher: '', // 主讲老师
        brief: '', // 课程简介
        can_discuss: '', // 评论控制
        _id: '', // 评论控制
        auth_code: ''
      },
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
  created() {
    this.id = this.$route.query._id
    this.listQuery.chapterId = this.$route.query._id
    this.chapterForm._id = this.$route.query._id
    this.shareUrl = process.env.VUE_APP_BASE_API + '/client/teacher-live-demand?_id=' + this.id
	  this.loginUser = this.$store.state.user.userSystemInfo.userInfo._id
    this.findDetailInfoById()
  },
  methods: {
    // 获取课堂详情
    findDetailInfoById() {
      findDetailInfoById({ id: this.id, isNeedValidateAuthCode: '2' }).then(
        res => {
          this.chapter = res.data.chapter
          this.live_info = res.data.live_info

          this.chapterForm.cname = res.data.chapter.cname
          this.chapterForm.teacher = res.data.chapter.teacher
          this.chapterForm.brief = res.data.chapter.brief
          this.chapterForm.can_discuss = res.data.chapter.can_discuss * 1
          this.chapterForm.auth_code = res.data.chapter.auth_code
        }
      )
    },

    // 获取在线成员
    getUserList() {
      this.listLoading = true
      getUserList(this.listQuery).then(res => {
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

    // 移除，加入
    isRemove(row, type) {
      var params = {
        chapterId: this.id,
        userId: row.userId,
        shotOff: type
      }
      if (type === 1) {
        this.$confirm('确定要移除【' + row.userName + '】吗？', '移除成员', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            updateUser(params).then(response => {
              this.$message.success('移除成功！')
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

    // 禁言、发言
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
          this.$message.success('设置发言成功！')
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
    width: 320px;
    border-left: 5px solid $border_color;
    height: calc(100vh - 70px);
    padding: 20px;
  }

  > .set {
    width: calc(100% - 320px);
    height: calc(100vh - 70px);
    padding: 20px;

    > .bottomOperate {
      position: fixed;
      bottom: 0;
      left: 0%;
      width: calc(100% - 325px);
      height: 70px;
      line-height: 60px;
      border-top: 1px solid rgba(255, 255, 255, 0.5);
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

  .open {
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
.topSet /deep/ .el-form-item__label, .topSet /deep/ .el-radio__label {
  color: #ffffff !important;
}
.topSet /deep/ .el-input__inner, .topSet /deep/ .el-textarea__inner {
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

#btnGroup{
	padding-left: 100px;
}
</style>
