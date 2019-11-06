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
                      <el-radio-button label="2">普通</el-radio-button>
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
                  <el-checkbox v-model="saveSet" class="saveSet">保存设置（分值、难度、标签、技能）</el-checkbox>
                </el-form>
                <el-button class="saveTopic" type="primary" @click="saveTopic">添加题目</el-button>
              </div>
            </el-tab-pane>
            <el-tab-pane label="多选题" name="2">
              <div class="edit-hand-topic2">
                <el-form ref="form" label-width="100px">
                  <el-form-item class="required content" label="题目内容">
                    <el-input v-model="topic2.topic_content" class="topicName" placeholder="请输入题目" clearable />
                    <div v-show="topic2.topic_resource" class="img-group">
                      <div class="imgCover" :style="{backgroundImage:'url(' + topic2.topic_resource + ')'}"> <i class="close iconfont iconfalse-circle" @click="delTopicImg" /></div>
                    </div>
                    <div class="selectPic" @click="topicImg">添加图片</div>
                  </el-form-item>
                  <el-form-item class="required" label="题目选项">
                    <el-table
                      class="topicOption"
                      :data="topic2.topic_option"
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
                          <el-checkbox v-model="scope.row.check" @change="chcekboxChange(scope.row)" />
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
                    <el-input v-model="topic2.topic_resolve" size="small" type="textarea" :autosize="{ minRows: 1, maxRows: 4}" />
                  </el-form-item>
                  <el-form-item class="required" label="题目分值">
                    <el-input-number v-model="topic2.topic_score" class="topic_score" controls-position="right" :min="1" />
                  </el-form-item>
                  <el-form-item class="required" label="题目难度">
                    <el-radio-group v-model="topic2.topic_level" class="topic_level">
                      <el-radio-button label="1">简单</el-radio-button>
                      <el-radio-button label="2">普通</el-radio-button>
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
                  <el-checkbox v-model="saveSet" class="saveSet">保存设置（分值、难度、标签、技能）</el-checkbox>
                </el-form>
                <el-button class="saveTopic" type="primary" @click="saveTopic">添加题目</el-button>
              </div>
            </el-tab-pane>
            <el-tab-pane label="判断题" name="3">
              <div class="edit-hand-topic3">
                <el-form ref="form" label-width="100px">
                  <el-form-item class="required content" label="题目内容">
                    <el-input v-model="topic3.topic_content" class="topicName" placeholder="请输入题目" clearable />
                    <div v-show="topic3.topic_resource" class="img-group">
                      <div class="imgCover" :style="{backgroundImage:'url(' + topic3.topic_resource + ')'}"> <i class="close iconfont iconfalse-circle" @click="delTopicImg" /></div>
                    </div>
                    <div class="selectPic" @click="topicImg">添加图片</div>
                  </el-form-item>
                  <el-form-item class="required" label="题目选项">
                    <el-table
                      class="topicOption"
                      :data="topic3.topic_option"
                      border
                      style="width: 100%"
                    >
                      <el-table-column
                        prop="option_content"
                        align="center"
                        label="选项内容"
                      />
                      <el-table-column
                        prop="correct_option"
                        label="正确选项"
                        align="center"
                        width="90"
                      >
                        <template slot-scope="scope">
                          <el-radio v-model="radio2" :label="scope.row.option_id" @change="isTrueChange(scope.$index)" />
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-form-item>
                  <el-form-item label="题目解析">
                    <el-input v-model="topic3.topic_resolve" size="small" type="textarea" :autosize="{ minRows: 1, maxRows: 4}" />
                  </el-form-item>
                  <el-form-item class="required" label="题目分值">
                    <el-input-number v-model="topic3.topic_score" class="topic_score" controls-position="right" :min="1" />
                  </el-form-item>
                  <el-form-item class="required" label="题目难度">
                    <el-radio-group v-model="topic3.topic_level" class="topic_level">
                      <el-radio-button label="1">简单</el-radio-button>
                      <el-radio-button label="2">普通</el-radio-button>
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
                  <el-checkbox v-model="saveSet" class="saveSet">保存设置（分值、难度、标签、技能）</el-checkbox>
                </el-form>
                <el-button class="saveTopic" type="primary" @click="saveTopic">添加题目</el-button>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
        <div class="fr preview ">
          <h3>预览区</h3>
          <p class="tip" />
          <div class="topics-preview">
            <div v-for="(item, index) in topics" :key="item.timeStamp" class="topics-item">
              <p class="topic-type">
                <span>{{ index+1 + '、' }}{{ item.topicTypeTitle }}</span><el-tooltip class="item" effect="dark" :content="item.labelStr" placement="top"><span v-if="item.labelStr"><span class="single-line">【{{ item.labelStr }}</span><span>】</span></span></el-tooltip><el-tooltip class="item" effect="dark" :content="item.skillStr" placement="top"><span v-if="item.skillStr"><span class="single-line">【{{ item.skillStr }}</span><span>】</span></span></el-tooltip>
              </p>
              <p>
                {{ item.topic_content }}
                <img v-if="item.topic_resource" class="previewImg" :src="item.topic_resource" alt="">
              </p>
              <ul class="topic-options">
                <div class="handle">
                  <el-button size="small" type="primary" @click="topicEdit(index, item.id)">编辑</el-button>
                  <el-button size="small" type="primary" @click="delTopic(index)">删除</el-button>
                </div>
                <li v-for="(item2, index2) in item.topic_option" :key="item2.option_id" class="topic-item">
                  <el-checkbox :checked="item2.correct_option==1?true:false" :title="item2.option_content" class="single-line3" read-only>{{ getOptionOrderByIndex(index2) }}{{ item2.option_content }}</el-checkbox>
                </li>
              </ul>
              <p class="topic_resolve">解析：{{ item.topic_resolve }}</p>
            </div>
          </div>
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
const $ = window.$

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
      canLeave: false, // 是否可以离开
      visible: false, // 弹出选择文件
      visible2: false, // 弹出选择标签
      visible3: false, // 弹出选择技能
      addType: 'hand', // 默认手动添加
      topic_type: '1', // 默认单选题
      uploadOptionIndex: null, // 上传图片的选项index
      currentLabels: [], // 当前要回显的标签
      currentSkills: [], // 当前要回显的技能
      topics: [], // 添加的所有试题
      topics1: [], // 手动添加的所有试题
      topics2: [], // Excel添加的所有试题
      topic1: { // 单选题
        topic_type: '', // 题目类型 1单选，2多选，3判断
        topic_content: '', // 题目
        topic_level: 1, // 难度
        topic_label: '', // 标签
        topic_skill: '', // 技能
        currentLabels: [], // 标签obj
        currentSkills: [], // 技能obj
        topic_resolve: '', // 试题解析
        topic_score: 1, // 分值
        topic_option: [ // 题目选项
          {
            option_content: '',
            option_img: '',
            correct_option: 2, // 1正确答案 2错误
            option_id: this.guid()
          }, {
            option_content: '',
            option_img: '',
            correct_option: 2,
            option_id: this.guid()
          }
        ], // 题目选项
        topic_resource: '', // 选择的图片
        topic_resource_id: '' // 主文件id
      }, // 单题数据
      topic2: { // 多选题
        topic_type: '', // 题目类型 1单选，2多选，3判断
        topic_content: '', // 题目
        topic_level: 1, // 难度
        topic_label: '', // 标签
        topic_skill: '', // 技能
        currentLabels: [], // 标签obj
        currentSkills: [], // 技能obj
        topic_resolve: '', // 试题解析
        topic_score: 1, // 分值
        topic_option: [ // 题目选项
          {
            option_content: '',
            option_img: '',
            correct_option: 2, // 1正确答案 2错误
            check: false,
            option_id: this.guid()
          }, {
            option_content: '',
            option_img: '',
            correct_option: 2,
            check: false,
            option_id: this.guid()
          }
        ], // 题目选项
        topic_resource: '', // 选择的图片
        topic_resource_id: '' // 主文件id
      }, // 单题数据
      topic3: { // 判断题
        topic_type: '', // 题目类型 1单选，2多选，3判断
        topic_content: '', // 题目
        topic_level: 1, // 难度
        topic_label: '', // 标签
        topic_skill: '', // 技能
        currentLabels: [], // 标签obj
        currentSkills: [], // 技能obj
        topic_resolve: '', // 试题解析
        topic_score: 1, // 分值
        topic_option: [ // 题目选项
          {
            option_content: '正确',
            option_img: '',
            correct_option: 2, // 1正确答案 2错误
            option_id: this.guid()
          }, {
            option_content: '错误',
            option_img: '',
            correct_option: 2,
            option_id: this.guid()
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
    // 计算属性的 getter
    topic0: function() {
      return 'topic' + this.topic_type
    },

    topic_class: function() {
      return this.addType + '-topic' + this.topic_type
    }
  },
  watch: {
    // 监听表单数据变化
    topic1: {
      handler(val) {
        if (val && !this.canLeave) {
          this.dataIsChange++
        }
      },
      deep: true // 深层次监听
    },
    topic2: {
      handler(val) {
        if (val && !this.canLeave) {
          this.dataIsChange++
        }
      },
      deep: true // 深层次监听
    },
    topic3: {
      handler(val) {
        if (val && !this.canLeave) {
          this.dataIsChange++
        }
      },
      deep: true // 深层次监听
    },
    topics: {
      handler(val) {
        if (val && !this.canLeave) {
          this.dataIsChange++
        }
      },
      deep: true // 深层次监听
    },
    saveSet(val, val2) {
      this.dataIsChange++
    }
  },
  created() {
    // this.topic1.topic_option[0].option_id = this.guid()
    // this.topic1.topic_option[1].option_id = this.guid()
    //
    // this.topic2.topic_option[0].option_id = this.guid()
    // this.topic2.topic_option[1].option_id = this.guid()
    //
    // this.topic3.topic_option[0].option_id = this.guid()
    // this.topic3.topic_option[1].option_id = this.guid()
  },
  mounted() {
    // 动态设置高度
    // var g_main_contHeight=$('.g_main_cont').height();
    // $('.topicType .el-tabs__content').css('height', (g_main_contHeight-150)+'px');
    // $('#addTopicVue .preview').css('height', (g_main_contHeight-100)+'px');
    // $('#addTopicVue .topics-preview').css('height', (g_main_contHeight-160)+'px');
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
      if(this.dataIsChange){
        var p = new Promise((resolve, reject) => {
          this.$confirm('您还有正在编辑尚未保存的内容哦，确定要离开吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.canLeave = true
            this.dataIsChange = 0
            this.topics=[];
            // 清空所有topic数据
            this.clearAllTopic();
            resolve()
          }).catch(err => {
            // 你可以在这儿做些操作
            reject(err)
          })
        })
        return p
      }
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
      this[this.topic0].topic_resource = val.fileUrl
      this[this.topic0].topic_resource_id = val.mainFileId
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
        this[this.topic0].topic_resource = ''
        this[this.topic0].topic_resource_id = ''
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
      this[this.topic0].topic_option[this.uploadOptionIndex].option_img = res.data.saveHttpPath
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
    isTrueChange(index, option_id) {
      this[this.topic0].topic_option.forEach(item => {
        item.correct_option = 2
      })
      this.radio1 = option_id
      this[this.topic0].topic_option[index].correct_option = 1
      console.log(this[this.topic0].topic_option)
    },

    // 题目选项多选
    chcekboxChange(item) {
      if (item.check) {
        item.correct_option = 1
      } else {
        item.correct_option = 2
      }
    },

    // 添加题目选项
    addOption: function() {
      if (this[this.topic0].topic_option.length === 20) {
        this.$message.warning('选项不可以超过20条！')
        return false
      }
      this[this.topic0].topic_option.push({
        option_content: '',
        option_img: '',
        correct_option: 2,
        option_id: this.guid()
      })
    },

    // 删除当前题目选项
    delTheOption: function(index) {
      if (this[this.topic0].topic_option.length === 2) {
        this.$message.warning('选项不得少于两项！')
        return false
      }
      this.$confirm('确定删除该选项？', '删除选项', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this[this.topic0].topic_option.splice(index, 1)
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

    // 根据选项在数组中位置获取选项序号
    getOptionOrderByIndex(index) {
      // 选项序号
      var option_order = ['A. ', 'B. ', 'C. ', 'D. ', 'E. ', 'F. ', 'G. ', 'H. ', 'I. ', 'J. ', 'K. ', 'L. ', 'M. ', 'N. ', 'O. ', 'P. ', 'Q. ', 'R. ', 'S. ', 'T. ', 'U. ', 'V. ', 'W. ', 'X. ', 'Y. ', 'Z. ']
      index = parseInt(index)
      if (index < 0 || index > (option_order.length - 1)) {
        return 'Z. '
      }
      return option_order[index]
    },

    // 添加试题
    saveTopic() {
      // 如果没有id并且当前是excel添加不可以通过
      if (!this[this.topic0].id && this.addType === 'excel') {
        this.$message.warning('Excel添加的数据只能修改，不支持新增！')
        return false
      }
      // 校验题目
      if (!this[this.topic0].topic_content) {
        this.$message.warning('请输入题目！')
        $('.edit-' + this.topic_class + ' .topicName input').focus()
        return false
      }

      // 校验题目
      var correct_option_arr = [] // 答案数组
      for (var i = 0, len = this[this.topic0].topic_option.length; i < len; i++) {
        var item = this[this.topic0].topic_option[i]
        if (!item.option_content) {
          this.$message.warning('请输入选项内容！')
          $('.edit-' + this.topic_class + ' .topicOption .option_content').eq(i).find('.el-input__inner').focus()
          return false
        }
        correct_option_arr.push(item.correct_option)
      }

      if (correct_option_arr.indexOf(1) === -1) {
        this.$message.warning('请选择正确选项')
        return false
      }

      // 校验分数
      if (!this[this.topic0].topic_score) {
        this.$message.warning('请输入分值')
        $('.edit-' + this.topic_class + ' .topic_score input').focus()
        return false
      }

      // 校验难度
      if (!this[this.topic0].topic_level) {
        this.$message.warning('请选择难度')
        return false
      }

      var str1 = []
      this.currentLabels.forEach(item => {
        str1.push(item.lname)
      })
      var str2 = []
      this.currentSkills.forEach(item => {
        str2.push(item.skill_name)
      })
      // 获取标签
      this[this.topic0].topic_label = str1.join()
      // 获取技能
      this[this.topic0].topic_skill = str2.join()

      // 获取题目类型
      this[this.topic0].topic_type = this.topic_type

      // 获取预览区题型中的文本===begin===
      var topicType = ''
      switch (this[this.topic0].topic_type) {
        case '1':
          topicType += '单选题'
          break
        case '2':
          topicType += '多选题'
          break
        case '3':
          topicType += '判断题'
          break
      }

      topicType += '【' + this[this.topic0].topic_score + '分】'

      switch (this[this.topic0].topic_level + '') {
        case '1':
          topicType += '【难度：简单】'
          break
        case '2':
          topicType += '【难度：普通】'
          break
        case '3':
          topicType += '【难度：困难】'
      }

      this[this.topic0].labelStr = str1.length ? '标签：' + str1 : ''
      this[this.topic0].skillStr = str2.length ? '技能：' + str2 : ''
      this[this.topic0].topicTypeTitle = topicType

      this[this.topic0].id = this.guid() // 设置题id
      this[this.topic0].timeStamp = new Date().getTime() // 设置题key
      this.topics.push($.extend(true, {}, this[this.topic0]))

      // 保存设置
      if (this.saveSet) {
        this.topic1.topic_level = this[this.topic0].topic_level * 1
        this.topic1.topic_score = this[this.topic0].topic_score * 1
        this.topic1.currentLabels = this[this.topic0].currentLabels
        this.topic1.currentSkills = this[this.topic0].currentSkills

        this.topic2.topic_level = this[this.topic0].topic_level * 1
        this.topic2.topic_score = this[this.topic0].topic_score * 1
        this.topic2.currentLabels = this[this.topic0].currentLabels
        this.topic2.currentSkills = this[this.topic0].currentSkills

        this.topic3.topic_level = this[this.topic0].topic_level * 1
        this.topic3.topic_score = this[this.topic0].topic_score * 1
        this.topic3.currentLabels = this[this.topic0].currentLabels
        this.topic3.currentSkills = this[this.topic0].currentSkills
      } else {
        this[this.topic0].topic_level = 1
        this[this.topic0].topic_score = 1
        this[this.topic0].currentLabels = []
        this[this.topic0].currentSkills = []
        this.currentLabels = []
        this.currentSkills = []
      }
      // 保存试题后清空表单===begin====
      this[this.topic0].topic_type = ''
      this[this.topic0].topic_content = ''
      this[this.topic0].topic_label = ''
      this[this.topic0].topic_skill = ''
      this[this.topic0].topic_resolve = ''
      this[this.topic0].topic_resource = ''
      this[this.topic0].topic_resource_id = ''
      this[this.topic0].check = ''
      this[this.topic0].id = ''
      if (this.topic0 === 'topic1' || this.topic0 === 'topic2') {
        this[this.topic0].topic_option = [ // 题目选项
          {
            option_content: '',
            option_img: '',
            correct_option: 2, // 1正确答案 2错误
            check: false,
            option_id: this.guid()
          }, {
            option_content: '',
            option_img: '',
            correct_option: 2,
            check: false,
            option_id: this.guid()
          }
        ]
        this.radio1 = ''
      } else {
        this[this.topic0].topic_option = [ // 题目选项
          {
            option_content: '正确',
            option_img: '',
            correct_option: 2, // 1正确答案 2错误
            option_id: this.guid()
          }, {
            option_content: '错误',
            option_img: '',
            correct_option: 2,
            option_id: this.guid()
          }
        ]
        this.radio2 = ''
      }
    },

    // 清空所有topic数据
    clearAllTopic(topic_type) {
      this.topic1 = { // 单选题
        topic_type: '', // 题目类型 1单选，2多选，3判断
        topic_content: '', // 题目
        topic_level: 1, // 难度
        topic_label: '', // 标签
        topic_skill: '', // 技能
        currentLabels: [], // 标签obj
        currentSkills: [], // 技能obj
        topic_resolve: '', // 试题解析
        topic_score: 1, // 分值
        topic_option: [ // 题目选项
          {
            option_content: '',
            option_img: '',
            correct_option: 2, // 1正确答案 2错误
            option_id: this.guid()
          }, {
            option_content: '',
            option_img: '',
            correct_option: 2,
            option_id: this.guid()
          }
        ], // 题目选项
        topic_resource: '', // 选择的图片
        topic_resource_id: '', // 主文件id
        check: '',
        id: ''
      }
      this.topic2 = { // 多选题
        topic_type: '', // 题目类型 1单选，2多选，3判断
        topic_content: '', // 题目
        topic_level: 1, // 难度
        topic_label: '', // 标签
        topic_skill: '', // 技能
        currentLabels: [], // 标签obj
        currentSkills: [], // 技能obj
        topic_resolve: '', // 试题解析
        topic_score: 1, // 分值
        topic_option: [ // 题目选项
          {
            option_content: '',
            option_img: '',
            correct_option: 2, // 1正确答案 2错误
            option_id: this.guid()
          }, {
            option_content: '',
            option_img: '',
            correct_option: 2,
            option_id: this.guid()
          }
        ], // 题目选项
        topic_resource: '', // 选择的图片
        topic_resource_id: '', // 主文件id
        check: '',
        id: ''
      }
      this.topic3 = { // 判断题
        topic_type: '', // 题目类型 1单选，2多选，3判断
        topic_content: '', // 题目
        topic_level: 1, // 难度
        topic_label: '', // 标签
        topic_skill: '', // 技能
        currentLabels: [], // 标签obj
        currentSkills: [], // 技能obj
        topic_resolve: '', // 试题解析
        topic_score: 1, // 分值
        topic_option: [ // 题目选项
          {
            option_content: '正确',
            option_img: '',
            correct_option: 2, // 1正确答案 2错误
            option_id: this.guid()
          }, {
            option_content: '错误',
            option_img: '',
            correct_option: 2,
            option_id: this.guid()
          }
        ], // 题目选项
        topic_resource: '', // 选择的图片
        topic_resource_id: '', // 主文件id
        id: ''
      }
      this.radio1 = ''
      this.radio2 = ''
      this.topic_type = '1'
      this.currentLabels = []
      this.currentSkills = []
    },

    addTopics() {
      this.noLeaveprompt = true
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
  .saveTopic {
    margin: 0 auto;
    text-align: center;
    margin-left: calc(50% - 49px);
  }
  .preview h3 {
    margin-top: 4px;
  }
  #addTopicVue .preview .tip {
    margin-top: 0;
    padding-bottom: 10px;
    margin-bottom: 0;
    border-bottom: 1px solid #e4e7ed;
  }
  #addTopicVue .topics-preview {
    overflow: auto;
  }
  .preview h3 {
    font-style: normal;
    font-weight: 500;
    font-size: 24px;
    color: #333;
    margin-bottom: 0;
  }
  .topics-item {
    padding: 10px;
    border-bottom: 1px solid #e4e7ed;
  }
  .topic-type {
    font-weight: 700;
    font-size: 14px;
    height: 30px;
  }
  .single-line {
    display: inline-block;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
    max-width:17%;
    vertical-align: middle;
  }
  .previewImg {
    display: inline-block;
    width: 50px;
    height: 30px;
  }
  .topic-options {
    position: relative;
  }
  .topic-options .topic-item {
    border: 1px solid #20c7b2;
    width: 60%;
    padding: 4px;
    margin-bottom: 4px;
    font-size: 14px;
  }
  .topic-options .topic-item label {
    margin-bottom: 0;
  }
  .topic-options .topic-item {
    border: 1px solid #20c7b2;
    width: 60%;
    padding: 4px;
    margin-bottom: 4px;
  }
  .topic-options .topic-item label {
    margin-bottom: 0;
  }
  .topic-item .el-checkbox__label {
    display: inline-block;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
    max-width:94%;
    box-sizing: border-box;
    vertical-align: middle;
  }
  .topics-item p {
    margin: 0;
  }
  .topic_resolve {
    font-size: 14px;
  }
  .handle {
    position: absolute;
    top: 0;
    right: 0;
  }
  .topicOption /deep/ .el-radio__label {
    display: none;
  }
</style>
