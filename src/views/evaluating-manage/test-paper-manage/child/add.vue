<template>
  <div id="add-test-paper">
    <div class="top clearfix">
      <div class="fl">
        <span class="count">总题数：</span><span class="topic_count">{{ testPaper.topic_count }}</span>
        <span class="count">当前总分数：</span><span class="score_count">{{ testPaper.score_count }}</span>
      </div>
      <div class="fr">
        <el-button
          v-no-more-click
          type="primary"
          @click="publishTestPaper"
        ><i class="addIcon iconfont iconfabu1" />发布考试</el-button>
        <el-button
          v-no-more-click
          type="primary"
          @click="saveTestPaper"
        ><i class="addIcon iconfont iconbaocun" />保存考试</el-button>
      </div>
    </div>
    <div>
      <div class="selectArea clearfix">
        <div class="fl">
          <md-input
            v-model="testPaper.exampaper_name"
            class="mdInput"
            icon="iconxiugai"
            name="title"
            placeholder="请输入试卷标题"
          >试卷标题</md-input>
        </div>
        <div class="fr">
          <span
            class="intelligentAdd pointer"
            @click="intelligentAdd"
          ><i class="iconfont iconzhinenghua" />智能添加</span>
          <span
            class="questionBankAdd pointer"
            @click="questionBankAdd"
          ><i class="iconfont icontikuguanli" />题库中添加</span>
        </div>
      </div>
    </div>
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <div class="topics">
        <span>添加标签</span>
        <div v-if="currentLabels.length" class="tag">
          <el-tag
              v-for="(tag, index) in currentLabels"
              :key="tag.linc"
              closable
              size="medium"
              :disable-transitions="false"
              type="success"
              @close="handlePaperLabelDel(index)"
          >
            {{ tag.lname }}
          </el-tag>
        </div>
        <i class="el-icon-circle-plus-outline" @click="addPaperLabels" />
        <div
          v-for="(item, index) in testPaper.topic_info"
          :key="item._id"
          class="topicItem"
        >
          <div class="topicItemTop clearfix">
            <div class="fl">
              <span class="topicType">{{
                switchTopicTypeToName(item.topic_type)
              }}</span>
            </div>
            <div class="fr operation">
              <el-link
                  v-if="index"
                  type="info"
                  @click="shiftTop(item, index)"
              >置顶</el-link>
              <el-link
                  v-if="index !== testPaper.topic_info.length - 1"
                  type="info"
                  @click="shiftFooter(item, index)"
              >置底</el-link>
              <el-link
                v-if="index"
                type="info"
                @click="shiftUp(item, index)"
              >上移</el-link>
              <el-link
                v-if="index !== testPaper.topic_info.length - 1"
                type="info"
                @click="shiftDown(item, index)"
              >下移</el-link>
              <el-link type="primary" @click="edit(item)">编辑</el-link>
              <el-link type="danger" @click="del(index)">删除</el-link>
            </div>
          </div>
          <p>{{ index + 1 }}、{{ item.topic_content }}</p>
          <ul class="topic-options">
            <li
              v-for="(item2, index2) in item.topic_option"
              :key="item2.option_id"
              class="item-topic"
            >
              <el-checkbox
                :checked="item2.correct_option === 1 ? true : false"
                :title="item2.option_content"
                class="single-line3"
                disabled
              >{{ getOptionOrderByIndex(index2)
              }}{{ item2.option_content }}</el-checkbox>
            </li>
          </ul>
        </div>
      </div>
    </el-scrollbar>
    <el-drawer
      title="编辑试题"
      :visible.sync="editTopicDrawer"
      direction="rtl"
      size="50%"
      :before-close="handleCloseEditTopicDrawer"
    >
      <div class="form-edit">
        <el-form
          v-if="topic_type === 1"
          ref="form"
          class="form"
          label-width="100px"
        >
          <el-form-item class="required content" label="题目内容">
            <el-input
              v-model="topic1.topic_content"
              class="topicName"
              placeholder="请输入题目"
              clearable
            />
            <div v-show="topic1.topic_resource" class="img-group">
              <div
                class="imgCover"
                :style="{
                  backgroundImage: 'url(' + topic1.topic_resource + ')'
                }"
              >
                <i
                  class="close iconfont iconfalse-circle"
                  @click="delTopicImg"
                />
              </div>
            </div>
            <div class="selectPic" @click="topicImg">添加图片</div>
          </el-form-item>
          <el-form-item class="required" label="题目选项">
            <el-table
              class="topicOption"
              :data="topic1.topic_option"
              border
              style="width: 100%"
              max-height="291"
            >
              <el-table-column
                prop="option_content"
                align="center"
                label="选项内容"
              >
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.option_content"
                    size="small"
                    class="option_content"
                    placeholder="请输入选项内容，字数不超过100个字"
                    maxlength="100"
                  />
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
                    <img
                      v-if="scope.row.option_img"
                      :src="scope.row.option_img"
                      class="avatar"
                    >
                    <i
                      v-else
                      class="el-icon-plus avatar-uploader-icon"
                      @click="optionConcentIndex(scope.$index)"
                    />
                  </el-upload>
                  <i
                    v-if="scope.row.option_img"
                    class="closeOptionImg iconfont iconfalse-circle"
                    @click="delOptionImg(scope.row)"
                  />
                </template>
              </el-table-column>
              <el-table-column
                prop="correct_option"
                label="正确选项"
                align="center"
                width="90"
              >
                <template slot-scope="scope">
                  <el-radio
                    v-model="radio1"
                    class="radio"
                    :label="scope.row.option_id_time_stamp"
                    @change="
                      isTrueChange(scope.$index, scope.row.option_id_time_stamp)
                    "
                  />
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
                  <i
                    class="pointer el-icon-minus"
                    @click="delTheOption(scope.$index)"
                  />
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item label="题目解析">
            <el-input
              v-model="topic1.topic_resolve"
              size="small"
              type="textarea"
              :autosize="{ minRows: 1, maxRows: 4 }"
            />
          </el-form-item>
          <el-form-item class="required" label="题目分值">
            <el-input-number
              v-model="topic1.topic_score"
              class="topic_score"
              controls-position="right"
              :min="1"
            />
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
        </el-form>
        <el-form
          v-else-if="topic_type === 2"
          ref="form"
          class="form"
          label-width="100px"
        >
          <el-form-item class="required content" label="题目内容">
            <el-input
              v-model="topic2.topic_content"
              class="topicName"
              placeholder="请输入题目"
              clearable
            />
            <div v-show="topic2.topic_resource" class="img-group">
              <div
                class="imgCover"
                :style="{
                  backgroundImage: 'url(' + topic2.topic_resource + ')'
                }"
              >
                <i
                  class="close iconfont iconfalse-circle"
                  @click="delTopicImg"
                />
              </div>
            </div>
            <div class="selectPic" @click="topicImg">添加图片</div>
          </el-form-item>
          <el-form-item class="required" label="题目选项">
            <el-table
              class="topicOption"
              :data="topic2.topic_option"
              border
              style="width: 100%"
              max-height="291"
            >
              <el-table-column
                prop="option_content"
                align="center"
                label="选项内容"
              >
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.option_content"
                    size="small"
                    class="option_content"
                    placeholder="请输入选项内容，字数不超过100个字"
                    maxlength="100"
                  />
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
                    <img
                      v-if="scope.row.option_img"
                      :src="scope.row.option_img"
                      class="avatar"
                    >
                    <i
                      v-else
                      class="el-icon-plus avatar-uploader-icon"
                      @click="optionConcentIndex(scope.$index)"
                    />
                  </el-upload>
                  <i
                    v-if="scope.row.option_img"
                    class="closeOptionImg iconfont iconfalse-circle"
                    @click="delOptionImg(scope.row)"
                  />
                </template>
              </el-table-column>
              <el-table-column
                prop="correct_option"
                label="正确选项"
                align="center"
                width="90"
              >
                <template slot-scope="scope">
                  <el-checkbox
                    v-model="scope.row.check"
                    @change="chcekboxChange(scope.row)"
                  />
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
                  <i
                    class="pointer el-icon-minus"
                    @click="delTheOption(scope.$index)"
                  />
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item label="题目解析">
            <el-input
              v-model="topic2.topic_resolve"
              size="small"
              type="textarea"
              :autosize="{ minRows: 1, maxRows: 4 }"
            />
          </el-form-item>
          <el-form-item class="required" label="题目分值">
            <el-input-number
              v-model="topic2.topic_score"
              class="topic_score"
              controls-position="right"
              :min="1"
            />
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
        </el-form>
        <el-form
          v-else-if="topic_type === 3"
          ref="form"
          class="form"
          label-width="100px"
        >
          <el-form-item class="required content" label="题目内容">
            <el-input
              v-model="topic3.topic_content"
              class="topicName"
              placeholder="请输入题目"
              clearable
            />
            <div v-show="topic3.topic_resource" class="img-group">
              <div
                class="imgCover"
                :style="{
                  backgroundImage: 'url(' + topic3.topic_resource + ')'
                }"
              >
                <i
                  class="close iconfont iconfalse-circle"
                  @click="delTopicImg"
                />
              </div>
            </div>
            <div class="selectPic" @click="topicImg">添加图片</div>
          </el-form-item>
          <el-form-item class="required" label="题目选项">
            <el-table
              class="topicOption"
              :data="topic3.topic_option"
              border
              style="width: 100%"
              max-height="291"
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
                  <el-radio
                    v-model="radio2"
                    :label="scope.row.option_id_time_stamp"
                    @change="isTrueChange(scope.$index)"
                  />
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item label="题目解析">
            <el-input
              v-model="topic3.topic_resolve"
              size="small"
              type="textarea"
              :autosize="{ minRows: 1, maxRows: 4 }"
            />
          </el-form-item>
          <el-form-item class="required" label="题目分值">
            <el-input-number
              v-model="topic3.topic_score"
              class="topic_score"
              controls-position="right"
              :min="1"
            />
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
        </el-form>
        <div id="btnGroup">
          <el-button
            v-no-more-click
            class="saveTopic"
            type="primary"
            @click="saveTopic"
          >保存</el-button>
          <el-button
            type="primary"
            plain
            @click="cancelEdit('form')"
          >取消</el-button>
        </div>
      </div>
    </el-drawer>
    <add-labels
        :visible2.sync="visible1"
        :current-labels.sync="paperLabels"
        :selectCompanyId="testPaper.selectCompanyId"
        :egroup="testPaper.egroup"
        @addLabels="getPaperLabels"
        @visible2="onvisible1"
    />
    <select-file
      :visible.sync="visible"
      :file-type-list="['pic']"
      @checkedFile="checkedFile"
      @visible="onvisible"
    />
    <add-labels
      :visible2.sync="visible2"
      :current-labels.sync="currentLabels"
      :selectCompanyId="testPaper.selectCompanyId"
      :egroup="testPaper.egroup"
      @addLabels="getLabels"
      @visible2="onvisible2"
    />
    <add-skills
      :visible3.sync="visible3"
      :current-skills.sync="currentSkills"
      :selectCompanyId="testPaper.selectCompanyId"
      @addSkills="getSkills"
      @visible3="onvisible3"
    />
    <PublishExam :selectCompanyId="testPaper.selectCompanyId" :publishDialog="publishDialog" :scoreCount="testPaper.score_count" @publishExam="publishExam"></PublishExam>
  </div>
</template>

<script>
  import { addTestPaper } from '@/api/test-paper-manage'
import SelectFile from '@/components/SelectFile'
import AddLabels from '@/components/AddEvalLabels'
import AddSkills from '@/components/AddEvalSkills'
import MdInput from '@/components/MDinput'
  import PublishExam from '@/components/PublishExam'
import store from '@/store'
import { getOptionOrderByIndex } from '@/utils/index'
import { getToken } from '@/utils/auth'
const $ = window.$
export default {
  components: {
    MdInput,
    SelectFile,
    AddLabels,
    AddSkills,
    PublishExam
  },
  data() {
    return {
      publishDialog: false, // 发布考试弹窗
      editTopicDrawer: false, // 编辑抽屉
      dataIsChange: 0, // 计数器，据此判断表单是否已编辑
      noLeaveprompt: false, // 表单提交后，设置为true，据此判断提交不再弹出离开提示
      testPaper: {
        topic_count: 0, // 总题数
        score_count: 0, // 总分数
        selectCompanyId: '', // 租户
        egroup: 0, // 小组
        exampaper_name: '', // 试卷标题
        exampaper_label: '', // 标签[]string
        exampaper_src: 1, // 添加类型 1：手动添加
        topic_info: [] // 试题
      },
      editTopicIndex: null, // 当前编辑的试题index
      headers: {
        Authorization: getToken() // 图片上传 header
      },
      canLeave: false, // 是否可以离开
      visible: false, // 弹出选择文件
      visible1: false, // 弹出试卷选择标签
      visible2: false, // 弹出选择标签
      visible3: false, // 弹出选择技能
      topic_type: '1', // 默认单选题
      uploadOptionIndex: null, // 上传图片的选项index
      paperLabels: [], // 试卷的标签
      currentLabels: [], // 当前要回显的标签
      currentSkills: [], // 当前要回显的技能
      topics: [], // 添加的所有试题
      topics1: [], // 手动添加的所有试题
      topics2: [], // Excel添加的所有试题
      topic1: {
        // 单选题
        topic_type: '', // 题目类型 1单选，2多选，3判断
        topic_content: '', // 题目
        topic_level: 1, // 难度
        topic_label: '', // 标签
        topic_skill: '', // 技能
        currentLabels: [], // 标签obj
        currentSkills: [], // 技能obj
        topic_resolve: '', // 试题解析
        topic_score: 1, // 分值
        topic_option: [
          // 题目选项
          {
            option_content: '',
            option_img: '',
            correct_option: 2, // 1正确答案 2错误
            option_id: this.guid(),
            option_id_time_stamp: new Date().getTime()
          },
          {
            option_content: '',
            option_img: '',
            correct_option: 2,
            option_id: this.guid(),
            option_id_time_stamp: new Date().getTime() + 1
          }
        ], // 题目选项
        topic_resource: '', // 选择的图片
        topic_resource_id: '' // 主文件id
      }, // 单题数据
      topic2: {
        // 多选题
        topic_type: '', // 题目类型 1单选，2多选，3判断
        topic_content: '', // 题目
        topic_level: 1, // 难度
        topic_label: '', // 标签
        topic_skill: '', // 技能
        currentLabels: [], // 标签obj
        currentSkills: [], // 技能obj
        topic_resolve: '', // 试题解析
        topic_score: 1, // 分值
        topic_option: [
          // 题目选项
          {
            option_content: '',
            option_img: '',
            correct_option: 2, // 1正确答案 2错误
            check: false,
            option_id: this.guid(),
            option_id_time_stamp: new Date().getTime() + 2
          },
          {
            option_content: '',
            option_img: '',
            correct_option: 2,
            check: false,
            option_id: this.guid(),
            option_id_time_stamp: new Date().getTime() + 3
          }
        ], // 题目选项
        topic_resource: '', // 选择的图片
        topic_resource_id: '' // 主文件id
      }, // 单题数据
      topic3: {
        // 判断题
        topic_type: '', // 题目类型 1单选，2多选，3判断
        topic_content: '', // 题目
        topic_level: 1, // 难度
        topic_label: '', // 标签
        topic_skill: '', // 技能
        currentLabels: [], // 标签obj
        currentSkills: [], // 技能obj
        topic_resolve: '', // 试题解析
        topic_score: 1, // 分值
        topic_option: [
          // 题目选项
          {
            option_content: '正确',
            option_img: '',
            correct_option: 2, // 1正确答案 2错误
            option_id: this.guid(),
            option_id_time_stamp: new Date().getTime() + 4
          },
          {
            option_content: '错误',
            option_img: '',
            correct_option: 2,
            option_id: this.guid(),
            option_id_time_stamp: new Date().getTime() + 5
          }
        ], // 题目选项
        topic_resource: '', // 选择的图片
        topic_resource_id: '' // 主文件id
      }, // 单题数据
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
    testPaper: {
      handler(val) {
        if (val) {
          this.dataIsChange++
        }
      },
      deep: true // 深层次监听
    },
  },
  created() {
    this.testPaper.selectCompanyId = this.$route.query.selectCompanyId
    this.testPaper.egroup = this.$route.query.egroup
    this.testPaper.topic_info = this.$store.state.testPaper.topics || []
    this.getCount()
  },
  methods: {
    // 获取题数和分值
    getCount() {
      this.testPaper.topic_count = this.testPaper.topic_info.length
      this.testPaper.score_count = 0
      this.testPaper.topic_info.forEach(item => {
        this.testPaper.score_count += item.topic_score * 1
      })
    },
    // 暂存当前试卷数据
    temporaryStorage() {
      store.dispatch('testPaper/temporaryStorageTestPaper', this.testPaper)
      store.dispatch('testPaper/temporaryStorageTopics', this.testPaper.topic_info)
    },
    // 智能添加
    intelligentAdd() {
      this.noLeaveprompt = true
      this.temporaryStorage()
      this.$router.push({
        path: '/evaluating-manage/test-paper-manage/intelligent-add',
        query: { selectCompanyId: this.testPaper.selectCompanyId, egroup: this.testPaper.egroup }
      })
    },
    // 题库中添加
    questionBankAdd() {
      this.noLeaveprompt = true
      this.temporaryStorage()
      this.$router.push({
        path: '/evaluating-manage/test-paper-manage/question-bank-add',
        query: { selectCompanyId: this.testPaper.selectCompanyId, egroup: this.testPaper.egroup }
      })
    },

    // 题型转换为name
    switchTopicTypeToName(topic_type) {
      switch (topic_type) {
        case 1:
          return '单选'
        case 2:
          return '多选'
        case 3:
          return '判断'
      }
    },

    // 根据选项在数组中位置获取选项序号
    getOptionOrderByIndex(index) {
      return getOptionOrderByIndex(index)
    },

    // 置顶
    shiftTop(row, index) {
      this.testPaper.topic_info.splice(index, 1)
      this.testPaper.topic_info.unshift(row)
    },

    // 置底
    shiftFooter(row, index) {
      this.testPaper.topic_info.splice(index, 1)
      this.testPaper.topic_info.push(row)
    },

    // 上移
    shiftUp(row, index) {
      this.testPaper.topic_info.splice(index, 1)
      this.testPaper.topic_info.splice(index - 1, 0, row)
    },

    // 下移
    shiftDown(row, index) {
      this.testPaper.topic_info.splice(index, 1)
      this.testPaper.topic_info.splice(index + 1, 0, row)
    },

    // 编辑
    edit(row, index) {
      this.handleTopic(row)
      this.editTopicIndex = index
      this.editTopicDrawer = true
    },

    // 删除
    del(index) {
      this.$confirm('确定删除该试题吗？', '删除试题', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.testPaper.topic_info.splice(index, 1)
          this.getCount()
          this.$message.success('删除成功！')
        })
        .catch(() => {})
    },

    // =====================================================================================
    // 用于生成uuid
    handleTopic(row) {
      const topic = {}
      $.extend(true, topic, row)
      this.topic_type = topic.topic_type

      topic.topic_option.forEach((item, index) => {
        item.option_id_time_stamp = new Date().getTime() + index
        if (item.correct_option === 1 && this.topic_type === 1) {
          this.radio1 = item.option_id_time_stamp
        }
        if (item.correct_option === 1 && this.topic_type === 3) {
          this.radio2 = item.option_id_time_stamp
        }
        if (item.correct_option === 1 && this.topic_type === 2) {
          item.check = true
        }
      })
      this.currentLabels = []
      this.currentSkills = []
      for (var key in topic.labels) {
        this.currentLabels.push(topic.labels[key])
      }
      for (var key2 in topic.skills) {
        this.currentSkills.push(topic.skills[key2])
      }
      // this.currentLabels = topic.labels || []
      // this.currentSkills = topic.skills || []
      switch (this.topic_type) {
        case 1:
          this.topic1 = topic
          break
        case 2:
          this.topic2 = topic
          break
        case 3:
          this.topic3 = topic
          break
      }
    },

    // 用于生成uuid
    S4: function() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
    },
    guid: function() {
      return (
        this.S4() +
        this.S4() +
        '-' +
        this.S4() +
        '-' +
        this.S4() +
        '-' +
        this.S4() +
        '-' +
        this.S4() +
        this.S4() +
        this.S4()
      )
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
      })
        .then(() => {
          this[this.topic0].topic_resource = ''
          this[this.topic0].topic_resource_id = ''
          this.$message.success('删除成功！')
        })
        .catch(() => {})
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
      this[this.topic0].topic_option[this.uploadOptionIndex].option_img =
        res.data.saveHttpPath
    },

    // 删除选项图片
    delOptionImg(row) {
      this.$confirm('确定删除该图片吗？', '删除图片', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          row.option_img = ''
          this.$message.success('删除成功！')
        })
        .catch(() => {})
    },

    // 题目选项单选
    isTrueChange(index, option_id_time_stamp) {
      this[this.topic0].topic_option.forEach(item => {
        item.correct_option = 2
      })
      this.radio1 = option_id_time_stamp
      this[this.topic0].topic_option[index].correct_option = 1
      this[this.topic0].topic_option[index].check = true
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
        option_id: this.guid(),
        option_id_time_stamp: new Date().getTime()
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
      })
        .then(() => {
          this[this.topic0].topic_option.splice(index, 1)
          this.$message.success('删除成功！')
        })
        .catch(() => {})
    },

    // 试卷添加标签
    addPaperLabels() {
      this.visible1 = true
    },
    // 监听选择标签组件返回数据
    getPaperLabels(val) {
      this.paperLabels = val
    },
    // 监听选择标签组件返回数据
    onvisible1(val) {
      this.visible1 = val.visible
    },
    // 试卷删除标签
    handlePaperLabelDel(index) {
      this.paperLabels.splice(index, 1)
    },

    // 添加标签
    addLabels() {
      this.visible2 = true
    },
    // 监听选择标签组件返回数据
    getLabels(val) {
      this.currentLabels = val
      this[this.topic0].currentLabels = val
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
      this[this.topic0].currentSkills = val
    },
    // 监听选择技能组件返回数据
    onvisible3(val) {
      this.visible3 = val.visible
    },
    // 删除技能
    handleSkillDel(index) {
      this.currentSkills.splice(index, 1)
    },

    // 添加试题
    saveTopic() {
      // 校验题目
      if (!this[this.topic0].topic_content) {
        this.$message.warning('请输入题目！')
        $('.topicName input').focus()
        return false
      }

      // 校验题目
      var correct_option_arr = [] // 答案数组
      for (
        var i = 0, len = this[this.topic0].topic_option.length;
        i < len;
        i++
      ) {
        var item = this[this.topic0].topic_option[i]
        if (!item.option_content) {
          this.$message.warning('请输入选项内容！')
          $('.topicOption .option_content')
            .eq(i)
            .find('.el-input__inner')
            .focus()
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

      var topic_label = []
      this.currentLabels = this.currentLabels || []
      this.currentSkills = this.currentSkills || []
      this.currentLabels.forEach(item => {
        topic_label.push(item.linc)
      })
      var topic_skill = []
      this.currentSkills.forEach(item => {
        topic_skill.push(item.increase_id)
      })
      // 获取标签
      this[this.topic0].topic_label = topic_label
      // 获取技能
      this[this.topic0].topic_skill = topic_skill
      this[this.topic0].topic_type = this[this.topic0].topic_type + ''
      this[this.topic0].topic_level = this[this.topic0].topic_level + ''
      this.testPaper.topic_info.splice(this.editTopicIndex, 1, this[this.topic0])
      this.editTopicDrawer = false
      this.getCount()
      this.$message.success('编辑试题成功！')
    },

    // 取消编辑
    cancelEdit() {
      this[this.topic0] = {}
    },

    // 编辑试题关闭
    handleCloseEditTopicDrawer(done) {
      this.$confirm('当前试题尚未保存，确认关闭？', '关闭', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          done()
        })
        .catch(() => {})
    },

    // 发布考试
    publishTestPaper() {
      if (this.valid()) {
        this.publishDialog = true
      }
    },

    // 监听发布考试
    publishExam(val) {
      this.testPaper.operatetype = 'publish'
      $.extend(true, val, this.testPaper)
      addTestPaper(val).then(res => {
        this.noLeaveprompt = true
        store.dispatch('testPaper/temporaryStorageTestPaper', {})
        store.dispatch('testPaper/temporaryStorageTopics', [])
        this.$message.success('发布考试成功！')
        this.$router.push({ path: '/evaluating-manage/test-paper-manage/list' })
      })
    },

    // 保存考试
    saveTestPaper() {
      if (this.valid()) {
        this.testPaper.operatetype = 'save'
        addTestPaper(this.testPaper).then(res => {
          this.noLeaveprompt = true
          store.dispatch('testPaper/temporaryStorageTestPaper', {})
          store.dispatch('testPaper/temporaryStorageTopics', [])
          this.$message.success('保存试卷成功！')
          this.$router.push({ path: '/evaluating-manage/test-paper-manage/list' })
        })
      }
    },

    // 校验
    valid() {
      if (!this.testPaper.exampaper_name) {
        $('.material-input').focus()
        this.$message.warning('请输入试卷标题！')
        return false
      }
      if (!this.testPaper.topic_info.length) {
        this.$message.warning('请添加试题！')
        return false
      }
      this.testPaper.topic_count = this.testPaper.topic_info.length
      this.testPaper.topic_info.forEach(item => {
        this.testPaper.score_count += item.topic_score * 1
      })
      return true
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.dataIsChange && !this.noLeaveprompt) {
      // 判断表单数据是否变化，以及提交后不进行此保存提示
      setTimeout(() => {
        // 此处必须要加延迟执行，主要解决浏览器前进后退带来的闪现
        this.$confirm('您的数据尚未保存，是否离开？', '离开页面', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            store.dispatch('testPaper/temporaryStorageTestPaper', {})
            store.dispatch('testPaper/temporaryStorageTopics', [])
            next()
          })
          .catch(() => {
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
#add-test-paper {
  height: 38px;
  line-height: 38px;
}
.count {
  color: #666666;
  font-size: 14px;
}
.topic_count,
.score_count {
  display: inline-block;
  color: $themeColor;
  margin-right: 20px;
}
.addIcon {
  margin-right: 4px;
  vertical-align: middle;
}
.selectArea {
  color: #666666;
  font-size: 14px;
  width: 100%;
  height: 40px;
  line-height: 40px;
  margin-top: 30px;
  background-color: #f2f2f2;

  > .fl,
  .fr {
    display: inline-block;
  }
}
.selectArea /deep/ .material-input__component {
  width: 300px;
  height: 40px;
  line-height: 40px;
  margin-top: 0;
  background: #f2f2f2;
}
.selectArea /deep/ .material-input__component .iconClass {
  width: 300px;
  height: 40px;
  line-height: 40px;
}
.selectArea /deep/ .material-input__component .material-input {
  border-bottom: none;
  margin-bottom: 10px;
  height: 30px;
}
.questionBankAdd {
  display: inline-block;
  margin: 0 30px;
}
.intelligentAdd,
.questionBankAdd {
  color: $themeColor;
}
.topicItem {
  padding: 20px;
  padding-top: 0;
  background-color: #f8f8f8;
  margin-bottom: 20px;
}
.topics {
  width: 100%;
  border: 1px solid #f2f2f2;
  padding: 20px;
}
.topicItemTop {
  height: 40px;
  line-height: 40px;
  border-bottom: 1px solid #eaeaea;
}
.topicType {
  color: $themeColor;
}
.operation /deep/ .el-link {
  margin-left: 20px;
}
.item-topic {
  background-color: #fff;
  padding-left: 10px;
  width: 524px;
  margin-bottom: 10px;
}
.item-topic /deep/ .el-checkbox__label {
  color: #000;
}
#add-test-paper>.el-scrollbar {
  height: calc(100vh - 230px);
}

/*==============================================================*/
#btnGroup {
  padding-left: 100px;
}
#addTopicVue .submit {
  margin: 10px;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 99;

  > /deep/ p,
  .addTopic {
    display: inline-block;
  }
  > /deep/ p {
    font-size: 14px;
  }
}
/deep/ .addType > .el-tabs__header .el-tabs__item {
  font-size: 16px !important;
  font-weight: 700 !important;
}
/deep/ .addType .el-tabs__nav-wrap:after {
  height: 0 !important;
}
/deep/
  .addType
  > .el-tabs__header
  > .el-tabs__nav-wrap
  > .el-tabs__nav-scroll
  > .el-tabs__nav {
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
  color: #ffffff;
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
  width: 40px;
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

  > /deep/ .el-form-item__label,
  /deep/ .el-form-item__content {
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
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 17%;
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
  border: 1px solid $themeColor;
  width: 60%;
  padding: 4px;
  margin-bottom: 4px;
  font-size: 14px;
}
.topic-options .topic-item label {
  margin-bottom: 0;
}
.topic-options .topic-item {
  border: 1px solid $themeColor;
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
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 94%;
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
.excel-uploader {
  display: inline-block;
}
.error-option {
  color: red;
}
.error-desc {
  word-break: break-all;
  word-wrap: break-word;
  font-size: 14px;
}
.error-option .el-checkbox__label {
  color: red !important;
}
.preview /deep/ .el-scrollbar {
  height: calc(100vh - 260px);
}
.addIcon {
  font-size: 14px;
}
</style>
