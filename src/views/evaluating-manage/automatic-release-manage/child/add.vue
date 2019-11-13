<template>
  <div id="addExamination">
    <el-steps
      :active="activeStep"
      finish-status="success"
      simple
      style="margin-top: 20px"
    >
      <el-step title="第一步：试题智能组合" />
      <el-step title="第二步：自动发布设置" />
    </el-steps>
    <div>
      <div class="content clearfix">
        <div v-show="activeStep === 1" class="fl edit">
          <el-form ref="exam" :model="exam" label-width="100px">
            <el-form-item label="选择标签" class="addLabel">
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
            <el-form-item label="选择技能" class="addSkill">
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
            <el-form-item label="选题类型" prop="select_type">
              <el-radio-group
                v-model="exam.select_type"
                @change="changeTopicType"
              >
                <el-radio :label="1">随机抽取</el-radio>
                <el-radio :label="2">根据题型随机抽取</el-radio>
                <el-radio :label="3">根据题型、难度随机抽取</el-radio>
              </el-radio-group>
              <div v-if="exam.select_type === 1" class="selectType">
                <div>
                  <span>总题数
                    <span
                      class="topicsNum"
                    >（{{ topicsNumDetail.totalNumber }}题可用）</span></span>
                  <span>抽取&nbsp;&nbsp;<el-input-number
                    v-model="exam.total_number[0]"
                    controls-position="right"
                    :min="0"
                    :max="topicsNumDetail.totalNumber"
                    @change="handleChange"
                  />&nbsp;&nbsp;试题，每题&nbsp;&nbsp;<el-input-number
                    v-model="exam.total_number[1]"
                    controls-position="right"
                    :min="0"
                    @change="handleChange"
                  />&nbsp;&nbsp;分</span>
                </div>
              </div>
              <div v-if="exam.select_type === 2" class="selectType">
                <div class="topicType">
                  <span>单选题
                    <span
                      class="topicsNum"
                    >（{{ topicsNumDetail.singleSelect }}题可用）</span></span>
                  <span>抽取&nbsp;&nbsp;<el-input-number
                    v-model="exam.single_select[0]"
                    controls-position="right"
                    :min="0"
                    :max="topicsNumDetail.singleSelect"
                    @change="handleChange"
                  />&nbsp;&nbsp;试题，每题&nbsp;&nbsp;<el-input-number
                    v-model="exam.single_select[1]"
                    controls-position="right"
                    :min="0"
                    @change="handleChange"
                  />&nbsp;&nbsp;分</span>
                </div>
                <div class="topicType">
                  <span>多选题
                    <span
                      class="topicsNum"
                    >（{{ topicsNumDetail.multiSelect }}题可用）</span></span>
                  <span>抽取&nbsp;&nbsp;<el-input-number
                    v-model="exam.multi_select[0]"
                    controls-position="right"
                    :min="0"
                    :max="topicsNumDetail.multiSelect"
                    @change="handleChange"
                  />&nbsp;&nbsp;试题，每题&nbsp;&nbsp;<el-input-number
                    v-model="exam.multi_select[1]"
                    controls-position="right"
                    :min="0"
                    @change="handleChange"
                  />&nbsp;&nbsp;分</span>
                </div>
                <div class="topicType">
                  <span>判断题
                    <span
                      class="topicsNum"
                    >（{{ topicsNumDetail.judgeSelect }}题可用）</span></span>
                  <span>抽取&nbsp;&nbsp;<el-input-number
                    v-model="exam.judge_select[0]"
                    controls-position="right"
                    :min="0"
                    :max="topicsNumDetail.judgeSelect"
                    @change="handleChange"
                  />&nbsp;&nbsp;试题，每题&nbsp;&nbsp;<el-input-number
                    v-model="exam.judge_select[1]"
                    controls-position="right"
                    :min="0"
                    @change="handleChange"
                  />&nbsp;&nbsp;分</span>
                </div>
              </div>
              <div v-if="exam.select_type === 3" class="">
                <div class="selectType selectType2">
                  <div class="">
                    单选题
                    <span
                      class="topicsNum"
                    >（{{ topicsNumDetail.singleSelect }}题可用）</span>
                  </div>
                  <div class="topicType2">
                    <span>简单&nbsp;&nbsp;<el-input-number
                      v-model="exam.single_and_easy[0]"
                      controls-position="right"
                      :min="0"
                      :max="topicsNumDetail.singleAndEasy"
                      @change="handleChange"
                    /><span
                      class="topicsNum"
                    >（{{ topicsNumDetail.singleAndEasy }}题可用）</span>每题&nbsp;&nbsp;<el-input-number
                      v-model="exam.single_and_easy[1]"
                      controls-position="right"
                      :min="0"
                      @change="handleChange"
                    />&nbsp;&nbsp;分</span>
                  </div>
                  <div class="topicType2">
                    <span>普通&nbsp;&nbsp;<el-input-number
                      v-model="exam.single_and_normal[0]"
                      controls-position="right"
                      :min="0"
                      :max="topicsNumDetail.singleAndNormal"
                      @change="handleChange"
                    /><span
                      class="topicsNum"
                    >（{{ topicsNumDetail.singleAndNormal }}题可用）</span>每题&nbsp;&nbsp;<el-input-number
                      v-model="exam.single_and_normal[1]"
                      controls-position="right"
                      :min="0"
                      @change="handleChange"
                    />&nbsp;&nbsp;分</span>
                  </div>
                  <div class="topicType2">
                    <span>困难&nbsp;&nbsp;<el-input-number
                      v-model="exam.single_and_hard[0]"
                      controls-position="right"
                      :min="0"
                      :max="topicsNumDetail.singleAndHard"
                      @change="handleChange"
                    /><span
                      class="topicsNum"
                    >（{{ topicsNumDetail.singleAndHard }}题可用）</span>每题&nbsp;&nbsp;<el-input-number
                      v-model="exam.single_and_hard[1]"
                      controls-position="right"
                      :min="0"
                      @change="handleChange"
                    />&nbsp;&nbsp;分</span>
                  </div>
                </div>
                <div class="selectType selectType2">
                  <div class="">
                    多选题
                    <span
                      class="topicsNum"
                    >（{{ topicsNumDetail.multiSelect }}题可用）</span>
                  </div>
                  <div class="topicType2">
                    <span>简单&nbsp;&nbsp;<el-input-number
                      v-model="exam.multi_and_easy[0]"
                      controls-position="right"
                      :min="0"
                      :max="topicsNumDetail.multiAndEasy"
                      @change="handleChange"
                    /><span
                      class="topicsNum"
                    >（{{ topicsNumDetail.multiAndEasy }}题可用）</span>每题&nbsp;&nbsp;<el-input-number
                      v-model="exam.multi_and_easy[1]"
                      controls-position="right"
                      :min="0"
                      @change="handleChange"
                    />&nbsp;&nbsp;分</span>
                  </div>
                  <div class="topicType2">
                    <span>普通&nbsp;&nbsp;<el-input-number
                      v-model="exam.multi_and_normal[0]"
                      controls-position="right"
                      :min="0"
                      :max="topicsNumDetail.multiAndNormal"
                      @change="handleChange"
                    /><span
                      class="topicsNum"
                    >（{{ topicsNumDetail.multiAndNormal }}题可用）</span>每题&nbsp;&nbsp;<el-input-number
                      v-model="exam.multi_and_normal[1]"
                      controls-position="right"
                      :min="0"
                      @change="handleChange"
                    />&nbsp;&nbsp;分</span>
                  </div>
                  <div class="topicType2">
                    <span>困难&nbsp;&nbsp;<el-input-number
                      v-model="exam.multi_and_hard[0]"
                      controls-position="right"
                      :min="0"
                      :max="topicsNumDetail.multiAndHard"
                      @change="handleChange"
                    /><span
                      class="topicsNum"
                    >（{{ topicsNumDetail.multiAndHard }}题可用）</span>每题&nbsp;&nbsp;<el-input-number
                      v-model="exam.multi_and_hard[1]"
                      controls-position="right"
                      :min="0"
                      @change="handleChange"
                    />&nbsp;&nbsp;分</span>
                  </div>
                </div>
                <div class="selectType selectType2">
                  <div class="">
                    判断题
                    <span
                      class="topicsNum"
                    >（{{ topicsNumDetail.judgeSelect }}题可用）</span>
                  </div>
                  <div class="topicType2">
                    <span>简单&nbsp;&nbsp;<el-input-number
                      v-model="exam.judge_and_easy[0]"
                      controls-position="right"
                      :min="0"
                      :max="topicsNumDetail.judgeAndEasy"
                      @change="handleChange"
                    /><span
                      class="topicsNum"
                    >（{{ topicsNumDetail.judgeAndEasy }}题可用）</span>每题&nbsp;&nbsp;<el-input-number
                      v-model="exam.judge_and_easy[1]"
                      controls-position="right"
                      :min="0"
                      @change="handleChange"
                    />&nbsp;&nbsp;分</span>
                  </div>
                  <div class="topicType2">
                    <span>普通&nbsp;&nbsp;<el-input-number
                      v-model="exam.judge_and_normal[0]"
                      controls-position="right"
                      :min="0"
                      :max="topicsNumDetail.judgeAndNormal"
                      @change="handleChange"
                    /><span
                      class="topicsNum"
                    >（{{ topicsNumDetail.judgeAndNormal }}题可用）</span>每题&nbsp;&nbsp;<el-input-number
                      v-model="exam.judge_and_normal[1]"
                      controls-position="right"
                      :min="0"
                      @change="handleChange"
                    />&nbsp;&nbsp;分</span>
                  </div>
                  <div class="topicType2">
                    <span>困难&nbsp;&nbsp;<el-input-number
                      v-model="exam.judge_and_hard[0]"
                      controls-position="right"
                      :min="0"
                      :max="topicsNumDetail.judgeAndHard"
                      @change="handleChange"
                    /><span
                      class="topicsNum"
                    >（{{ topicsNumDetail.judgeAndHard }}题可用）</span>每题&nbsp;&nbsp;<el-input-number
                      v-model="exam.judge_and_hard[1]"
                      controls-position="right"
                      :min="0"
                      @change="handleChange"
                    />&nbsp;&nbsp;分</span>
                  </div>
                </div>
              </div>
            </el-form-item>
          </el-form>
          <add-labels
            :visible2.sync="visible2"
            :egroup="exam.egroup"
            :select-company-id="exam.selectCompanyId"
            :current-labels.sync="currentLabels"
            @addLabels="getLabels"
            @visible2="onvisible2"
          />
          <add-skills
            :visible3.sync="visible3"
            :select-company-id="exam.selectCompanyId"
            :current-skills.sync="currentSkills"
            @addSkills="getSkills"
            @visible3="onvisible3"
          />
        </div>
        <div v-show="activeStep === 2" class="fl edit publishSet">
          <el-form
            ref="exam2"
            class="form"
            :model="exam"
            :rules="rules"
            label-width="100px"
          >
            <el-form-item label="考试名称" prop="revolution_name">
              <el-input
                v-model="exam.revolution_name"
                placeholder="请输入考试名称"
                maxlength="64"
                clearable
              />
            </el-form-item>
            <el-form-item class="required timeRange" label="考试时间">
              <el-radio-group v-model="exam.revolution_type">
                <el-radio
                  class="singleExam"
                  :label="4"
                >单次考试<span
                  class="typeTip"
                >（设定考试时间段，到期后考试结束）</span><br>
                  <el-date-picker
                    v-if="exam.revolution_type === 4"
                    ref="daterange"
                    v-model="time_range"
                    class="daterange"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :default-time="['00:00:00', '23:59:59']"
                  />
                </el-radio>
                <el-radio
                  :label="2"
                >定时考试<span
                  class="typeTip"
                >（设定考试周期，周期循环考试，有效期仅限当年）</span></el-radio>
              </el-radio-group>
              <div v-if="exam.revolution_type !== 4" class="periodExam">
                <div class="revolutionType">
                  <span class="text">每隔</span>
                  <el-input-number
                    ref="revolution"
                    v-model="exam.revolution"
                    controls-position="right"
                    :min="1"
                    :max="max_revolution"
                  />
                  <el-select
                    v-model="exam.revolution_type"
                    placeholder="请选择"
                    @change="changeRevolutionType2"
                  >
                    <el-option label="周" :value="2" />
                    <el-option label="月" :value="3" />
                  </el-select>
                </div>
                <div class="cycle">
                  <el-select v-model="exam.beginday_cycle" placeholder="请选择">
                    <el-option
                      v-for="item in beginday_cycle"
                      :key="item.id"
                      :label="item.label"
                      :value="item.id"
                    />
                  </el-select>
                  <el-time-picker
                    v-model="exam.begintime_cycle"
                    :clearable="false"
                    placeholder="开始时间"
                  />
                  <p class="text">至</p>
                  <el-select v-model="exam.endday_cycle" placeholder="请选择">
                    <el-option
                      v-for="item in endday_cycle"
                      :key="item.id"
                      :disabled="item.id < exam.beginday_cycle"
                      :label="item.label"
                      :value="item.id"
                    />
                  </el-select>
                  <el-time-picker
                    v-model="exam.endtime_cycle"
                    :clearable="false"
                    placeholder="开始时间"
                  />
                </div>
              </div>
            </el-form-item>
            <el-form-item label="及格分数" prop="pass_score">
              <el-input
                v-model="exam.pass_score"
                placeholder="请输入及格分数"
                clearable
                @keyup.native="intNum(exam.pass_score)"
              />
            </el-form-item>
            <el-form-item label="考试人员" prop="memer">
              <el-input v-show="false" v-model="exam.memer" />
              <Examiners
                :select-company-id="exam.selectCompanyId"
                @examiners="getExaminers"
              />
            </el-form-item>
            <el-form-item label="考试类型">
              <el-checkbox v-model="exam.topic_unrest">试题乱序</el-checkbox>
            </el-form-item>
          </el-form>
        </div>
        <div class="fr count">
          <div class="total">
            <span>总题数{{ totalTopics[0] }}题</span>
            <span>总分值{{ totalTopics[1] }}分</span>
          </div>
          <div class="single">
            <span>单选题{{ single_select[0] }}题</span>
            <span>分值{{ single_select[1] }}分</span>
          </div>
          <div class="multi">
            <span>多选题{{ multi_select[0] }}题</span>
            <span>分值{{ multi_select[1] }}分</span>
          </div>
          <div class="judge">
            <span>判断题{{ judge_select[0] }}题</span>
            <span>分值{{ judge_select[1] }}分</span>
          </div>

          <div id="btnGroup">
            <el-button
              type="primary"
              plain
              @click="cancel()"
            ><i class="addIcon iconfont iconcancel" />取消</el-button>
            <el-button
              v-if="activeStep !== 1"
              type="primary"
              @click="forwardStep"
            ><i class="addIcon iconfont iconshangyibu" />上一步</el-button>
            <el-button
              v-if="activeStep !== 2"
              type="primary"
              @click="nextStep"
            ><i class="addIcon iconfont iconxiayibu" />下一步</el-button>
            <el-button
              v-if="activeStep === 2"
              v-no-more-click
              type="primary"
              @click="save('exam2')"
            ><i class="addIcon iconfont iconbaocun" />保存</el-button>
            <el-button
              v-if="activeStep === 2"
              v-no-more-click
              type="primary"
              @click="publish('exam2')"
            ><i class="addIcon iconfont iconfabu1" />保存并发布</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getTopicCount } from '@/api/test-paper-manage'
import { submit, saveThenPublish } from '@/api/evolutionManage-automatic'
import AddLabels from '@/components/AddEvalLabels'
import AddSkills from '@/components/AddEvalSkills'
import Examiners from '@/components/Examiners'
import { validIntNum } from '@/utils/validate'
const $ = window.$

export default {
  components: {
    AddLabels,
    AddSkills,
    Examiners
  },
  data() {
    // 校验考试人员
    var validTargetUser = (rule, value, callback) => {
      if (!this.exam.time_range.length) {
        callback(new Error('请选择考试时间'))
      } else {
        callback()
      }
    }
    // 校验及格分数
    var validPassscore = (rule, value, callback) => {
      if (!this.exam.pass_score) {
        callback(new Error('请输入及格分数'))
      } else if (this.exam.pass_score * 1 > this.totalTopics[1]) {
        callback(
          new Error(
            '及格分数不能超过总分数（总分数:' + this.totalTopics[1] + '）'
          )
        )
      } else {
        callback()
      }
    }
    return {
      dataIsChange: -1, // 计数器，据此判断表单是否已编辑
      noLeaveprompt: false, // 表单提交后，设置为true，据此判断提交不再弹出离开提示
      activeStep: 1, // 当前激活步骤
      exam: {
        selectCompanyId: '', // 租户
        egroup: '', // 小组
        topic_count: 0, // 总题数
        score_count: 0, // 总分数
        revolution_name: '', // 考试名称
        revolution_type: 4, // 周期类型 4 单次考试；2 按周循环；3按月循环
        revolution: 0, // 周期类型 4 单次考试；2 按周循环；3按月循环
        beginday_cycle: 4, // 发布开始日期
        begintime_cycle: '00:00:00', // 发布开始时间
        endday_cycle: 4, // 发布结束天
        endtime_cycle: '23:59:59', // 发布结束时间
        start_time: '', // 开始时间
        end_time: '', // 结束时间
        pass_score: '', // 及格分数
        target_user: '', // 考试人员
        topic_unrest: 0, // 是否题号乱序
        memer: '', // 校验用的，无实际意义
        label_id: [], // 试题标签
        skill_id: [], // 试题技能
        select_type: 1, // 选题类型1随机选 2根据题型 3根据题型难度
        total_number: [0, 0], // 随机抽选试题数量和分数
        single_select: [0, 0], // 题型 单选
        multi_select: [0, 0], // 题型 多选
        judge_select: [0, 0], // 题型 判断
        single_and_easy: [0, 0], // 简单单选题数
        single_and_normal: [0, 0], // 一般单选题数
        single_and_hard: [0, 0], // 困难单选题数
        multi_and_easy: [0, 0], // 简单多选题数
        multi_and_normal: [0, 0], // 一般多选题数
        multi_and_hard: [0, 0], // 困难多选题数
        judge_and_easy: [0, 0], // 简单判断题
        judge_and_normal: [0, 0], // 一般判断题数
        judge_and_hard: [0, 0] // 困难判断题数
      },
      time_range: [], // 考试时间
      max_revolution: 52, // 最大周期 按周 52周；按月 12个月
      beginday_cycle: [
        {
          id: 1,
          label: '周一'
        },
        {
          id: 2,
          label: '周二'
        },
        {
          id: 3,
          label: '周三'
        },
        {
          id: 4,
          label: '周四'
        },
        {
          id: 5,
          label: '周五'
        }
      ],
      endday_cycle: [
        {
          id: 1,
          label: '周一'
        },
        {
          id: 2,
          label: '周二'
        },
        {
          id: 3,
          label: '周三'
        },
        {
          id: 4,
          label: '周四'
        },
        {
          id: 5,
          label: '周五'
        }
      ],
      beginday_cycle1: [
        {
          id: 1,
          label: '周一'
        },
        {
          id: 2,
          label: '周二'
        },
        {
          id: 3,
          label: '周三'
        },
        {
          id: 4,
          label: '周四'
        },
        {
          id: 5,
          label: '周五'
        }
      ],
      beginday_cycle2: [
        {
          id: 1,
          label: '1号'
        },
        {
          id: 2,
          label: '2号'
        },
        {
          id: 3,
          label: '3号'
        },
        {
          id: 4,
          label: '4号'
        },
        {
          id: 5,
          label: '5号'
        },
        {
          id: 6,
          label: '6号'
        },
        {
          id: 7,
          label: '7号'
        },
        {
          id: 8,
          label: '8号'
        },
        {
          id: 9,
          label: '9号'
        },
        {
          id: 10,
          label: '10号'
        },
        {
          id: 11,
          label: '11号'
        },
        {
          id: 12,
          label: '12号'
        },
        {
          id: 13,
          label: '13号'
        },
        {
          id: 14,
          label: '14号'
        },
        {
          id: 15,
          label: '15号'
        },
        {
          id: 16,
          label: '16号'
        },
        {
          id: 17,
          label: '17号'
        },
        {
          id: 18,
          label: '18号'
        },
        {
          id: 19,
          label: '19号'
        },
        {
          id: 20,
          label: '20号'
        },
        {
          id: 21,
          label: '21号'
        },
        {
          id: 22,
          label: '22号'
        },
        {
          id: 23,
          label: '23号'
        },
        {
          id: 24,
          label: '24号'
        },
        {
          id: 25,
          label: '25号'
        },
        {
          id: 26,
          label: '26号'
        },
        {
          id: 27,
          label: '27号'
        },
        {
          id: 28,
          label: '28号'
        },
        {
          id: 29,
          label: '29号'
        },
        {
          id: 30,
          label: '30号'
        },
        {
          id: 31,
          label: '31号'
        }
      ],
      endday_cycle1: [
        {
          id: 1,
          label: '周一'
        },
        {
          id: 2,
          label: '周二'
        },
        {
          id: 3,
          label: '周三'
        },
        {
          id: 4,
          label: '周四'
        },
        {
          id: 5,
          label: '周五'
        }
      ],
      endday_cycle2: [
        {
          id: 1,
          label: '1号'
        },
        {
          id: 2,
          label: '2号'
        },
        {
          id: 3,
          label: '3号'
        },
        {
          id: 4,
          label: '4号'
        },
        {
          id: 5,
          label: '5号'
        },
        {
          id: 6,
          label: '6号'
        },
        {
          id: 7,
          label: '7号'
        },
        {
          id: 8,
          label: '8号'
        },
        {
          id: 9,
          label: '9号'
        },
        {
          id: 10,
          label: '10号'
        },
        {
          id: 11,
          label: '11号'
        },
        {
          id: 12,
          label: '12号'
        },
        {
          id: 13,
          label: '13号'
        },
        {
          id: 14,
          label: '14号'
        },
        {
          id: 15,
          label: '15号'
        },
        {
          id: 16,
          label: '16号'
        },
        {
          id: 17,
          label: '17号'
        },
        {
          id: 18,
          label: '18号'
        },
        {
          id: 19,
          label: '19号'
        },
        {
          id: 20,
          label: '20号'
        },
        {
          id: 21,
          label: '21号'
        },
        {
          id: 22,
          label: '22号'
        },
        {
          id: 23,
          label: '23号'
        },
        {
          id: 24,
          label: '24号'
        },
        {
          id: 25,
          label: '25号'
        },
        {
          id: 26,
          label: '26号'
        },
        {
          id: 27,
          label: '27号'
        },
        {
          id: 28,
          label: '28号'
        },
        {
          id: 29,
          label: '29号'
        },
        {
          id: 30,
          label: '30号'
        },
        {
          id: 31,
          label: '31号'
        }
      ],
      selectCompanyId: '', // 租户
      egroup: '', // 小组
      currentLabels: [], // 当前要回显的标签
      currentSkills: [], // 当前要回显的技能
      visible2: false, // 弹出选择标签
      visible3: false, // 弹出选择技能
      topicsNumDetail: {}, // 可选题数详情
      totalTopics: [0, 0], // 总题数/总分数
      single_select: [0, 0], // 总的单选
      multi_select: [0, 0], // 总的多选
      judge_select: [0, 0], // 总的判断
      rules: {
        revolution_name: [
          {
            required: true,
            message: '请输入考试名称（长度在 2 到 20 个字符）',
            trigger: 'blur'
          },
          {
            required: true,
            message: '请输入考试名称（长度在 2 到 20 个字符）',
            trigger: 'change'
          },
          {
            min: 2,
            max: 20,
            message: '长度在 2 到 20 个字符',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 20,
            message: '长度在 2 到 20 个字符',
            trigger: 'change'
          }
        ],
        time_range: [
          { required: true, message: '请选择考试时间', trigger: 'blur' },
          { required: true, message: '请选择考试时间', trigger: 'change' }
        ],
        memer: [
          { required: true, message: '请选择考试人员', trigger: 'change' }
        ],
        pass_score: [
          { required: true, validator: validPassscore, trigger: 'blur' },
          { required: true, validator: validPassscore, trigger: 'change' }
        ],
        target_user: [
          { required: true, validator: validTargetUser, trigger: 'blur' },
          { required: true, validator: validTargetUser, trigger: 'change' }
        ]
      }
    }
  },
  computed: {},
  watch: {
    exam: {
      handler(val) {
        if (val) {
          this.dataIsChange++
        }
      },
      deep: true // 深层次监听
    }
  },
  created() {
    this.exam.selectCompanyId = this.$route.query.selectCompanyId
    this.exam.egroup = this.$route.query.egroup * 1
    this.getTopicCount()
  },
  methods: {
    // 上一步
    forwardStep() {
      if (this.activeStep !== 1) {
        --this.activeStep
      }
    },

    // 下一步
    nextStep() {
      if (!this.totalTopics[0]) {
        this.$message.warning('请选择题目数！')
        return false
      }
      if (!this.totalTopics[1]) {
        this.$message.warning('请输入试题分值！')
        return false
      }
      if (this.activeStep === 1) {
        ++this.activeStep
      }
    },

    // 获取可用题数
    getTopicCount() {
      const params = {
        egroup: this.exam.egroup,
        topic_label: this.exam.label_id,
        topic_skill: this.exam.skill_id
      }
      getTopicCount(params).then(res => {
        this.topicsNumDetail = res.data
      })
    },

    // 添加标签
    addLabels() {
      this.visible2 = true
    },

    // 监听选择标签组件返回数据
    getLabels(val) {
      this.currentLabels = val
      this.exam.label_id = []
      this.currentLabels.forEach(item => {
        this.exam.label_id.push(item.linc)
      })
      this.getTopicCount()
    },

    // 监听选择标签组件返回数据
    onvisible2(val) {
      this.visible2 = val.visible
    },

    // 删除标签
    handleLabelDel(index) {
      this.currentLabels.splice(index, 1)
      this.exam.label_id = []
      this.currentLabels.forEach(item => {
        this.exam.label_id.push(item.linc)
      })
      this.getTopicCount()
    },

    // 添加技能
    addSkills() {
      this.visible3 = true
    },

    // 监听选择技能组件返回数据
    getSkills(val) {
      this.currentSkills = val
      this.exam.skill_id = []
      this.currentSkills.forEach(item => {
        this.exam.skill_id.push(item.increase_id)
      })
      this.getTopicCount()
    },

    // 监听选择技能组件返回数据
    onvisible3(val) {
      this.visible3 = val.visible
    },

    // 删除技能
    handleSkillDel(index) {
      this.currentSkills.splice(index, 1)
      this.exam.skill_id = []
      this.currentSkills.forEach(item => {
        this.exam.skill_id.push(item.increase_id)
      })
      this.getTopicCount()
    },

    // 更改题型
    changeTopicType(val) {
      // 重置
      // ======================================================
      this.exam.total_number = [0, 0]

      // ======================================================
      this.exam.single_select = [0, 0]

      this.exam.multi_select = [0, 0]

      this.exam.judge_select = [0, 0]

      // ======================================================
      this.exam.single_and_easy = [0, 0]

      this.exam.single_and_normal = [0, 0]

      this.exam.single_and_hard = [0, 0]

      this.exam.multi_and_easy = [0, 0]

      this.exam.multi_and_normal = [0, 0]

      this.exam.multi_and_hard = [0, 0]

      this.exam.judge_and_easy = [0, 0]

      this.exam.judge_and_normal = [0, 0]

      this.exam.judge_and_hard = [0, 0]

      // ================================================
      this.totalTopics = [0, 0]
      this.single_select = [0, 0]
      this.multi_select = [0, 0]
      this.judge_select = [0, 0]
    },

    // 题数、分值变化
    handleChange(val) {
      switch (this.exam.select_type) {
        case 1:
          this.totalTopics[0] = this.exam.total_number[0]
          this.totalTopics[1] =
            this.exam.total_number[0] * this.exam.total_number[1]
          break
        case 2:
          this.totalTopics[0] =
            this.exam.single_select[0] +
            this.exam.multi_select[0] +
            this.exam.judge_select[0]
          this.totalTopics[1] =
            this.exam.single_select[0] * this.exam.single_select[1] +
            this.exam.multi_select[0] * this.exam.multi_select[1] +
            this.exam.judge_select[0] * this.exam.judge_select[1]

          this.single_select[0] = this.exam.single_select[0]
          this.single_select[1] =
            this.exam.single_select[0] * this.exam.single_select[1]

          this.multi_select[0] = this.exam.multi_select[0]
          this.multi_select[1] =
            this.exam.multi_select[0] * this.exam.multi_select[1]

          this.judge_select[0] = this.exam.judge_select[0]
          this.judge_select[1] =
            this.exam.judge_select[0] * this.exam.judge_select[1]
          break
        case 3:
          this.totalTopics[0] =
            this.exam.single_and_easy[0] +
            this.exam.single_and_normal[0] +
            this.exam.single_and_hard[0] +
            this.exam.multi_and_easy[0] +
            this.exam.multi_and_normal[0] +
            this.exam.multi_and_hard[0] +
            this.exam.judge_and_easy[0] +
            this.exam.judge_and_normal[0] +
            this.exam.judge_and_hard[0]

          this.totalTopics[1] =
            this.exam.single_and_easy[0] * this.exam.single_and_easy[1] +
            this.exam.single_and_normal[0] * this.exam.single_and_normal[1] +
            this.exam.single_and_hard[0] * this.exam.single_and_hard[1] +
            this.exam.multi_and_easy[0] * this.exam.multi_and_easy[1] +
            this.exam.multi_and_normal[0] * this.exam.multi_and_normal[1] +
            this.exam.multi_and_hard[0] * this.exam.multi_and_hard[1] +
            this.exam.judge_and_easy[0] * this.exam.judge_and_easy[1] +
            this.exam.judge_and_normal[0] * this.exam.judge_and_normal[1] +
            this.exam.judge_and_hard[0] * this.exam.judge_and_hard[1]

          this.single_select[0] =
            this.exam.single_and_easy[0] +
            this.exam.single_and_normal[0] +
            this.exam.single_and_hard[0]
          this.single_select[1] =
            this.exam.single_and_easy[0] * this.exam.single_and_easy[1] +
            this.exam.single_and_normal[0] * this.exam.single_and_normal[1] +
            this.exam.single_and_hard[0] * this.exam.single_and_hard[1]

          this.judge_select[0] =
            this.exam.judge_and_easy[0] +
            this.exam.judge_and_normal[0] +
            this.exam.judge_and_hard[0]
          this.judge_select[1] =
            this.exam.judge_and_easy[0] * this.exam.judge_and_easy[1] +
            this.exam.judge_and_normal[0] * this.exam.judge_and_normal[1] +
            this.exam.judge_and_hard[0] * this.exam.judge_and_hard[1]
          break
        default:
          this.totalTopics[0] = this.exam.total_number[0]
          this.totalTopics[1] =
            this.exam.total_number[0] * this.exam.total_number[1]
          break
      }
    },

    // 监听选择人员
    getExaminers(val) {
      this.target_user = val
      var flag = true
      for (var key in val) {
        if (!val[key][0]) {
          flag = false
        }
      }
      if (flag) {
        this.exam.memer = '111'
      } else {
        this.exam.memer = ''
      }
    },

    // 选择按周和按月
    changeRevolutionType2(val) {
      if (val === 2) {
        this.max_revolution = 52
        this.exam.beginday_cycle = 4
        this.exam.endday_cycle = 4
        this.beginday_cycle.length = 0
        this.endday_cycle.length = 0
        $.merge(this.beginday_cycle, this.beginday_cycle1)
        $.merge(this.endday_cycle, this.endday_cycle1)
      } else if (val === 3) {
        this.max_revolution = 12
        this.exam.beginday_cycle = 14
        this.exam.endday_cycle = 14
        this.beginday_cycle.length = 0
        this.endday_cycle.length = 0
        $.merge(this.beginday_cycle, this.beginday_cycle2)
        $.merge(this.endday_cycle, this.endday_cycle2)
      }
    },

    // 取消
    cancel() {
      this.$router.push({
        path: '/evaluating-manage/automatic-release-manage/list'
      })
    },

    // 保存
    save(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.valid()) {
            submit(this.exam).then(res => {
              this.noLeaveprompt = true
              this.$message.success('保存成功！')
              this.$router.push({
                path: '/evaluating-manage/automatic-release-manage/list'
              })
            })
          }
        }
      })
    },

    // 保存并发布
    publish(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.valid()) {
            saveThenPublish(this.exam).then(res => {
              this.noLeaveprompt = true
              this.$message.success('保存并发布成功！')
              this.$router.push({
                path: '/evaluating-manage/automatic-release-manage/list'
              })
            })
          }
        }
      })
    },

    // 校验
    valid() {
      if (this.exam.revolution_type === 4) {
        if (!this.time_range.length) {
          this.$message.warning('请选择考试时间！')
          this.$refs.daterange.focus()
          return false
        } else {
          this.exam.start_time = this.time_range[0]
          this.exam.end_time = this.time_range[1]
        }
      } else {
        if (!this.exam.revolution) {
          this.$message.warning('请填写循环周期！')
          this.$refs.revolution.focus()
          return false
        }
      }
      if (this.exam.topic_unrest) {
        this.exam.topic_unrest = 1
      } else {
        this.exam.topic_unrest = 0
      }
      this.exam.target_user = this.target_user
      return true
    },

    // 校验最大用户数为正整数
    intNum(val) {
      this.exam.pass_score = validIntNum(val)
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
.content {
  padding-top: 20px;
}
.edit {
  width: calc(100% - 350px);
}
.count {
  width: 340px;
  height: calc(100vh - 140px);
  border-left: 8px solid #e2e6ed;
}
.selectType {
  padding: 20px;
  border: 1px solid #ededed;
  border-radius: 2px;
}
.topicsNum {
  display: inline-block;
  width: 120px;
  color: #cccccc;
}
.edit .selectType {
  width: 660px;
}
.topicType {
  margin-bottom: 20px;
}
.topicType:last-child {
  margin-bottom: 0;
}
.topicType2 {
  margin-bottom: 20px;
}
.topicType2:last-child {
  margin-bottom: 0;
}
.num {
  color: #cccccc;
}
.edit .selectType2 {
  width: 540px;
  margin-bottom: 10px;
}
.selectType2:last-child {
  margin-bottom: 0;
}
.count {
  text-align: center;
}
.count .total {
  margin-bottom: 20px;
}
.count span {
  margin-right: 20px;
}
.count .single,
.count .multi,
.count .judge {
  margin-bottom: 20px;
  color: #999;
}
.tag {
  display: inline;
}
.tag /deep/ .el-tag {
  margin-right: 10px;
}
.publishSet .form {
  width: 700px;
  margin: 0 auto;
}
.typeTip {
  color: #cccccc;
}
.timeRange /deep/ .el-radio-group {
  margin-top: 9px;
}
.timeRange /deep/ .el-radio-group .el-radio {
  display: block;
}
.singleExam {
  margin-bottom: 18px;
}
.daterange {
  margin-top: 18px;
}
#btnGroup /deep/ .el-button {
  width: 80%;
  margin-bottom: 10px;
}
.periodExam,
.revolutionType,
.cycle {
  margin-top: 18px;
}
.cycle {
  margin-left: 165px;
}
.timeRange .text {
  color: #606266;
}
</style>
