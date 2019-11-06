<template>
  <div id="addTopicVue" class="form-edit">
    <div class="fr submit">
      <p>（小提示：保存的试题记得保存至题库哦）</p>
      <el-button class="addTopic" type="primary" @click="addTopics"><i class="iconfont iconhao" />保存至题库</el-button>
    </div>

    <el-tabs v-model="addType" :before-leave="beforeLeaveTabs1" class="addType" @tab-click="handleTabsClick1">
      <el-tab-pane class="hand" label="手动添加" name="hand">
        <div class="fl edit">
          <el-tabs v-model="topic_type" class="topicType" type="card" :before-leave="beforeLeaveTabs2" @tab-click="handleTabsClick2">
            <el-tab-pane label="单选题" name="1">
              <div class="edit-hand-topic1">
                <el-form ref="form" label-width="100px">
                  <el-form-item class="required content" label="题目内容">
                    <el-input v-model="topic1.topic_content" class="topicName" placeholder="请输入题目" clearable />
                    <div v-show="topic1.topic_resource" class="img-group">
                      <div class="imgCover" :style="{backgroundImage:'url(' + topic1.topic_resource + ')'}"> <i class="close iconfont iconfalse-circle" @click="delTopicImg" /></div>
                    </div>
                    <div class="selectPic" @click="topicImg">添加图片</div>
                  </el-form-item>
                  <el-form-item class="required" label="题目选项">
                    <el-table
                      class="topicOption"
                      :data="topic1.topic_option"
                      border
                      style="width: 100%"
                    >
                      <el-table-column
                        prop="option_content"
                        align="center"
                        label="选项内容"
                      >
                        <template slot-scope="scope">
                          <el-input v-model="scope.row.option_content" size="small" class="option_content" placeholder="请输入选项内容，字数不超过100个字" maxlength="100" />
                        </template>
                      </el-table-column>
                      <el-table-column
                        prop="option_img"
                        label="图片"
                        align="center"
                        width="60"
                      >
                        <template slot-scope="scope">
                          <el-upload
                            ref="upload"
                            class="avatar-uploader"
                            :action="uploadUrl()"
                            :headers="headers"
                            accept=".jpg,.png,.gif,.jepg,.jpeg"
                            :show-file-list="false"
                            :on-success="handleImgSuccess"
                            :before-upload="beforeImgUpload"
                          >
                            <img v-if="scope.row.option_img" :src="scope.row.option_img" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon" @click="optionConcentIndex(scope.$index)" />
                          </el-upload>
                          <i v-if="scope.row.option_img" class="closeOptionImg iconfont iconfalse-circle" @click="delOptionImg" />
                        </template>
                      </el-table-column>
                      <el-table-column
                        prop="correct_option"
                        label="正确选项"
                        align="center"
                        width="90"
                      >
                        <template slot-scope="scope">
                          <el-radio v-model="radio1" class="radio" :label="scope.row.option_id" @change="isTrueChange(scope.$index, scope.row.option_id)" />
                        </template>
                      </el-table-column>
                      <el-table-column
                        prop="addOrdelOption"
                        label="操作"
                        align="center"
                        width="90"
                      >
                        <template slot-scope="scope">
                          <i class="pointer el-icon-plus" @click="addOption" />
                          <i class="pointer el-icon-minus" @click="delTheOption(scope.$index)" />
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-form-item>
                  <el-form-item label="题目解析">
                    <el-input v-model="topic1.topic_resolve" size="small" type="textarea" :autosize="{ minRows: 1, maxRows: 4}" />
                  </el-form-item>
                  <el-form-item class="required" label="题目分值">
                    <el-input-number v-model="topic1.topic_score" class="topic_score" controls-position="right" :min="1" />
                  </el-form-item>
                  <el-form-item class="required" label="题目难度">
                    <el-radio-group v-model="topic1.topic_level" class="topic_level">
                      <el-radio-button label="1">简单</el-radio-button>
                      <el-radio-button label="2">一般</el-radio-button>
                      <el-radio-button label="3">困难</el-radio-button>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="添加标签" class="addLabel">
                    <div v-if="currentLabels.length" class="tag">
                      <el-tag
                        v-for="(tag, index) in currentLabels"
                        :key="tag.linc"
                        closable
                        size="medium"
                        :disable-transitions="false"
                        type="success"
                        @close="handleLabelDel(index)"
                      >
                        {{ tag.lname }}
                      </el-tag>
                    </div>
                    <i class="el-icon-circle-plus-outline" @click="addLabels" />
                  </el-form-item>
                  <el-form-item label="题目考核技能" class="addSkill">
                    <div v-if="currentSkills.length" class="tag">
                      <el-tag
                        v-for="(tag, index) in currentSkills"
                        :key="tag.increase_id"
                        closable
                        size="medium"
                        :disable-transitions="false"
                        type="success"
                        @close="handleSkillDel(index)"
                      >
                        {{ tag.skill_name }}
                      </el-tag>
                    </div>
                    <i class="el-icon-circle-plus-outline" @click="addSkills" />
                  </el-form-item>
                  <el-checkbox class="saveSet" v-model="saveSet">保存设置（分值、难度、标签、技能）</el-checkbox>
                </el-form>
              </div>
            </el-tab-pane>
            <el-tab-pane label="多选题" name="2">
              多选题
            </el-tab-pane>
            <el-tab-pane label="判断题" name="3">
              判断题
            </el-tab-pane>
          </el-tabs>
        </div>
        <div class="fr preview ">
          <h3>预览区</h3>
          <p class="tip" />
        </div>
      </el-tab-pane>
      <el-tab-pane class="excel" label="Excel添加" name="excel">
        222
      </el-tab-pane>
    </el-tabs>
    <select-file :visible.sync="visible" :file-type-list="['pic']" @checkedFile="checkedFile" @visible="onvisible" />
    <add-labels :visible2.sync="visible2" :current-labels.sync="currentLabels" @addLabels="getLabels" @visible2="onvisible2" />
    <add-skills :visible3.sync="visible3" :current-skills.sync="currentSkills" @addSkills="getSkills" @visible3="onvisible3" />
  </div>
</template>

<script>
import SelectFile from '@/components/SelectFile'
import AddLabels from '@/components/AddEvalLabels'
import AddSkills from '@/components/AddEvalSkills'
import { getToken } from '@/utils/auth'

export default {
  components: {
    SelectFile,
    AddLabels,
    AddSkills
  },
  data() {
    return {
      headers: {
        Authorization: getToken() // 图片上传 header
      },
      dataIsChange: 0, // 计数器，据此判断表单是否已编辑
      noLeaveprompt: false, // 表单提交后，设置为true，据此判断提交不再弹出离开提示
      visible: false, // 弹出选择文件
      visible2: false, // 弹出选择标签
      visible3: false, // 弹出选择技能
      addType: 'hand', // 默认手动添加
      topic_type: '1', // 默认单选题
      uploadOptionIndex: null, // 上传图片的选项index
      currentLabels: [], // 当前要回显的标签
      currentSkills: [], // 当前要回显的技能
      topic1: { // 单选题
        topic_type: '', // 题目类型 1单选，2多选，3判断
        topic_content: '', // 题目
        topic_level: 1, // 难度
        topic_label: '', // 标签
        topic_skill: '', // 技能
        topic_resolve: '', // 试题解析
        topic_score: 1, // 分值
        topic_option: [ // 题目选项
          {
            option_content: '',
            option_img: '',
            correct_option: 2, // 1正确答案 2错误
            option_id: null
          }, {
            option_content: '',
            option_img: '',
            correct_option: 2,
            option_id: null
          }
        ], // 题目选项
        topic_resource: '', // 选择的图片
        topic_resource_id: '' // 主文件id
      }, // 单题数据
      saveSet: '', // 保存设置
      radio1: '', // 单选题目选项
      radio2: '', // 判断题目选项
      check2: '' // 多选题目选项
    }
  },
  computed: {

  },
  created() {
    this.topic1.topic_option[0].option_id = this.guid()
    this.topic1.topic_option[1].option_id = this.guid()

    // this.topic2.topic_option[0].option_id = this.guid()
    // this.topic2.topic_option[1].option_id = this.guid()

    // this.topic3.topic_option[0].option_id = this.guid()
    // this.topic3.topic_option[1].option_id = this.guid()
  },
  mounted() {

  },
  methods: {
    // 用于生成uuid
    S4: function() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
    },
    guid: function() {
      return (this.S4() + this.S4() + '-' + this.S4() + '-' + this.S4() + '-' + this.S4() + '-' + this.S4() + this.S4() + this.S4())
    },

    // 切换手动添加与Excel导入离开前的逻辑
    beforeLeaveTabs1(item) {

    },
    // 切换题型
    beforeLeaveTabs2(item) {

    },
    // 切换手动添加与Excel导入
    handleTabsClick1: function() {

    },
    // 切换题型
    handleTabsClick2: function() {

    },
    // 题干添加图片
    topicImg() {
      this.visible = true
    },
    // 监听选择文件组件返回数据
    checkedFile(val) {
      this.topic1.topic_resource = val.fileUrl
      this.topic1.topic_resource_id = val.mainFileId
    },
    // 监听选择文件组件返回数据
    onvisible(val) {
      this.visible = val.visible
    },

    // 删除题干图片
    delTopicImg() {
      this.$confirm('确定删除该图片吗？', '删除图片', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.topic1.topic_resource = ''
        this.topic1.topic_resource_id = ''
        this.$message.success('删除成功！')
      }).catch(() => {

      })
    },

    // 上传路径
    uploadUrl() {
      return process.env.VUE_APP_BASE_API + 'system/file/upload/'
    },

    // 获取上传图片选项index
    optionConcentIndex(index) {
      this.uploadOptionIndex = index
    },

    // 上传选项图片之前
    beforeImgUpload(file) {
      const suffixs = ['.png', '.jpg', '.gif', '.jepg', '.jpeg']
      const i = file.name.lastIndexOf('.')
      const suffix = file.name.slice(i)
      if (suffixs.indexOf(suffix) === -1) {
        this.$message.error('文件格式错误！')
        this.$refs.upload.clearFiles()
        return false
      }
      const isLt5M = file.size / 1024 / 1024 < 5
      if (!isLt5M) {
        this.$message.error('上传文件大小不能超过 5MB！')
        this.$refs.upload.clearFiles()
        return false
      }
      return true
    },

    // 成功上传选项图片
    handleImgSuccess(res, file) {
      debugger
      this.topic1.topic_option[this.uploadOptionIndex].option_img = res.data.saveHttpPath
    },

    // 删除选项图片
    delOptionImg(row) {
      this.$confirm('确定删除该图片吗？', '删除图片', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        row.option_img = ''
        this.$message.success('删除成功！')
      }).catch(() => {

      })
    },

    // 题目选项单选
    isTrueChange: function(index, option_id) {
      this.topic1.topic_option.forEach(item => {
        item.correct_option = 2
      })
      this.radio1 = option_id
      this.topic1.topic_option[index].correct_option = 1
      console.log(this.topic1.topic_option)
    },

    // 添加题目选项
    addOption: function() {
      if (this.topic1.topic_option.length === 20) {
        this.$message.warning('选项不可以超过20条！')
        return false
      }
      this.topic1.topic_option.push({
        option_content: '',
        option_img: '',
        correct_option: 2,
        option_id: this.guid()
      })
    },

    // 删除当前题目选项
    delTheOption: function(index) {
      if (this.topic1.topic_option.length === 2) {
        this.$message.warning('选项不得少于两项！')
        return false
      }
      this.$confirm('确定删除该选项？', '删除选项', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.topic1.topic_option.splice(index, 1)
        this.$message.success('删除成功！')
      }).catch(() => {

      })
    },

    // 添加标签
    addLabels() {
      this.visible2 = true
    },
    // 监听选择标签组件返回数据
    getLabels(val) {
      this.currentLabels = val
    },
    // 监听选择标签组件返回数据
    onvisible2(val) {
      this.visible2 = val.visible
    },
    // 删除标签
    handleLabelDel(index) {
      this.currentLabels.splice(index, 1)
    },

    // 添加技能
    addSkills() {
      this.visible3 = true
    },
    // 监听选择技能组件返回数据
    getSkills(val) {
      this.currentSkills = val
    },
    // 监听选择技能组件返回数据
    onvisible3(val) {
      this.visible3 = val.visible
    },
    // 删除技能
    handleSkillDel(index) {
      this.currentSkills.splice(index, 1)
    },

    addTopics() {

    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/theme.scss";
  #addTopicVue .submit{
    margin: 10px;
    position: absolute;
    right: 0;
    top: 0;
    z-index: 99;

    > /deep/ p, .addTopic {
      display: inline-block;
    }
    > /deep/ p {
      font-size: 14px;
    }
  }
  /deep/ .addType>.el-tabs__header .el-tabs__item {
    font-size: 16px!important;
    font-weight: 700!important;
  }
  /deep/ .addType .el-tabs__nav-wrap:after {
    height: 0!important;
  }
  /deep/ .addType>.el-tabs__header>.el-tabs__nav-wrap>.el-tabs__nav-scroll>.el-tabs__nav {
    width: 180px;
    margin: 0 auto;
    float: none;
  }
  #addTopicVue .edit {
    width: 60%;
  }
  #addTopicVue .preview {
    width: calc(40% - 10px);
    border-left: 8px solid #e2e6ed;
    height: 100%;
    min-height: 500px;
    padding: 0 10px;
    box-sizing: border-box;
  }
  .topicType /deep/ .el-tabs__item.is-top.is-active {
    border-radius: 3px;
    padding-bottom: 38px;
    box-shadow: inset 0 0px 2px 2px $themeColor;
  }
  .topicName {
    width: calc(100% - 160px);
  }
  .saveTopic {
    margin: 0 auto;
    text-align: center;
    margin-left: calc(50% - 49px);
  }
  .img-group {
    display: inline-block;
  }
  .selectPic {
    display: inline-block;
    width: 80px;
    height: 32px;
    line-height: 32px;
    cursor: pointer;
    text-align: center;
    margin-left: 6px;
    border-radius: 3px;
    color: #FFFFFF;
    background-color: $themeColor;
    border-color: $themeColor;
  }
  .selectPic:hover {
    opacity: 0.8;
  }
  .imgCover {
    position: relative;
    display: inline-block;
    background-size: cover;
    vertical-align: middle;
    width: 40PX;
    height: 30px;
  }
  .close {
    position: absolute;
    top: -17px;
    right: -8px;
    cursor: pointer;
  }
  .content {
    line-height: 40px;
    height: 40px;

    > /deep/ .el-form-item__label, /deep/ .el-form-item__content {
      height: 40px;
      line-height: 40px;
    }
  }
  .avatar {
    width: 40px;
    vertical-align: middle;
  }
  .closeOptionImg {
    position: absolute;
    top: 0;
    right: -1px;
    cursor: pointer;
  }
  .topicOption .radio /deep/ .el-radio__label {
    display: none;
  }
  i {
    cursor: pointer;
  }
  .tag {
    display: inline-block;
  }
  /deep/ .el-tag {
    margin-right: 10px;
  }
  /deep/ .el-tag .el-icon-close {
    vertical-align: middle;
    margin: 0;
  }
  /deep/ .el-tag .el-icon-close::before {
    margin: 0;
  }
  .saveSet {
    margin-left: 34px;
  }
</style>
