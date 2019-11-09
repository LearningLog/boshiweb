<template>
  <div id="intelligentAdd" class="clearfix">
    <div class="fl edit">
      <div class="select">
        <el-form
          ref="intelligenceForm"
          :model="intelligenceForm"
          label-width="100px"
        >
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
              v-model="intelligenceForm.select_type"
              @change="changeTopicType"
            >
              <el-radio :label="1">随机抽取</el-radio>
              <el-radio :label="2">根据题型随机抽取</el-radio>
              <el-radio :label="3">根据题型、难度随机抽取</el-radio>
            </el-radio-group>
            <div v-if="intelligenceForm.select_type === 1" class="selectType">
              <div>
                <span>总题数
                  <span
                    class="topicsNum"
                  >（{{ topicsNumDetail.totalNumber }}题可用）</span></span>
                <span>抽取&nbsp;&nbsp;<el-input-number
                  v-model="intelligenceForm.total_number[0]"
                  controls-position="right"
                  :min="0"
                  :max="topicsNumDetail.totalNumber"
                  @change="handleChange"
                />&nbsp;&nbsp;试题，每题&nbsp;&nbsp;<el-input-number
                  v-model="intelligenceForm.total_number[1]"
                  controls-position="right"
                  :min="0"
                  @change="handleChange"
                />&nbsp;&nbsp;分</span>
              </div>
            </div>
            <div v-if="intelligenceForm.select_type === 2" class="selectType">
              <div class="topicType">
                <span>单选题
                  <span
                    class="topicsNum"
                  >（{{ topicsNumDetail.singleSelect }}题可用）</span></span>
                <span>抽取&nbsp;&nbsp;<el-input-number
                  v-model="intelligenceForm.single_select[0]"
                  controls-position="right"
                  :min="0"
                  :max="topicsNumDetail.singleSelect"
                  @change="handleChange"
                />&nbsp;&nbsp;试题，每题&nbsp;&nbsp;<el-input-number
                  v-model="intelligenceForm.single_select[1]"
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
                  v-model="intelligenceForm.multi_select[0]"
                  controls-position="right"
                  :min="0"
                  :max="topicsNumDetail.multiSelect"
                  @change="handleChange"
                />&nbsp;&nbsp;试题，每题&nbsp;&nbsp;<el-input-number
                  v-model="intelligenceForm.multi_select[1]"
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
                  v-model="intelligenceForm.judge_select[0]"
                  controls-position="right"
                  :min="0"
                  :max="topicsNumDetail.judgeSelect"
                  @change="handleChange"
                />&nbsp;&nbsp;试题，每题&nbsp;&nbsp;<el-input-number
                  v-model="intelligenceForm.judge_select[1]"
                  controls-position="right"
                  :min="0"
                  @change="handleChange"
                />&nbsp;&nbsp;分</span>
              </div>
            </div>
            <div v-if="intelligenceForm.select_type === 3" class="">
              <div class="selectType selectType2">
                <div class="">
                  单选题
                  <span
                    class="topicsNum"
                  >（{{ topicsNumDetail.singleSelect }}题可用）</span>
                </div>
                <div class="topicType2">
                  <span>简单&nbsp;&nbsp;<el-input-number
                    v-model="intelligenceForm.single_and_easy[0]"
                    controls-position="right"
                    :min="0"
                    :max="topicsNumDetail.singleAndEasy"
                    @change="handleChange"
                  /><span
                    class="topicsNum"
                  >（{{ topicsNumDetail.singleAndEasy }}题可用）</span>每题&nbsp;&nbsp;<el-input-number
                    v-model="intelligenceForm.single_and_easy[1]"
                    controls-position="right"
                    :min="0"
                    @change="handleChange"
                  />&nbsp;&nbsp;分</span>
                </div>
                <div class="topicType2">
                  <span>普通&nbsp;&nbsp;<el-input-number
                    v-model="intelligenceForm.single_and_normal[0]"
                    controls-position="right"
                    :min="0"
                    :max="topicsNumDetail.singleAndNormal"
                    @change="handleChange"
                  /><span
                    class="topicsNum"
                  >（{{ topicsNumDetail.singleAndNormal }}题可用）</span>每题&nbsp;&nbsp;<el-input-number
                    v-model="intelligenceForm.single_and_normal[1]"
                    controls-position="right"
                    :min="0"
                    @change="handleChange"
                  />&nbsp;&nbsp;分</span>
                </div>
                <div class="topicType2">
                  <span>困难&nbsp;&nbsp;<el-input-number
                    v-model="intelligenceForm.single_and_hard[0]"
                    controls-position="right"
                    :min="0"
                    :max="topicsNumDetail.singleAndHard"
                    @change="handleChange"
                  /><span
                    class="topicsNum"
                  >（{{ topicsNumDetail.singleAndHard }}题可用）</span>每题&nbsp;&nbsp;<el-input-number
                    v-model="intelligenceForm.single_and_hard[1]"
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
                    v-model="intelligenceForm.multi_and_easy[0]"
                    controls-position="right"
                    :min="0"
                    :max="topicsNumDetail.multiAndEasy"
                    @change="handleChange"
                  /><span
                    class="topicsNum"
                  >（{{ topicsNumDetail.multiAndEasy }}题可用）</span>每题&nbsp;&nbsp;<el-input-number
                    v-model="intelligenceForm.multi_and_easy[1]"
                    controls-position="right"
                    :min="0"
                    @change="handleChange"
                  />&nbsp;&nbsp;分</span>
                </div>
                <div class="topicType2">
                  <span>普通&nbsp;&nbsp;<el-input-number
                    v-model="intelligenceForm.multi_and_normal[0]"
                    controls-position="right"
                    :min="0"
                    :max="topicsNumDetail.multiAndNormal"
                    @change="handleChange"
                  /><span
                    class="topicsNum"
                  >（{{ topicsNumDetail.multiAndNormal }}题可用）</span>每题&nbsp;&nbsp;<el-input-number
                    v-model="intelligenceForm.multi_and_normal[1]"
                    controls-position="right"
                    :min="0"
                    @change="handleChange"
                  />&nbsp;&nbsp;分</span>
                </div>
                <div class="topicType2">
                  <span>困难&nbsp;&nbsp;<el-input-number
                    v-model="intelligenceForm.multi_and_hard[0]"
                    controls-position="right"
                    :min="0"
                    :max="topicsNumDetail.multiAndHard"
                    @change="handleChange"
                  /><span
                    class="topicsNum"
                  >（{{ topicsNumDetail.multiAndHard }}题可用）</span>每题&nbsp;&nbsp;<el-input-number
                    v-model="intelligenceForm.multi_and_hard[1]"
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
                    v-model="intelligenceForm.judge_and_easy[0]"
                    controls-position="right"
                    :min="0"
                    :max="topicsNumDetail.judgeAndEasy"
                    @change="handleChange"
                  /><span
                    class="topicsNum"
                  >（{{ topicsNumDetail.judgeAndEasy }}题可用）</span>每题&nbsp;&nbsp;<el-input-number
                    v-model="intelligenceForm.judge_and_easy[1]"
                    controls-position="right"
                    :min="0"
                    @change="handleChange"
                  />&nbsp;&nbsp;分</span>
                </div>
                <div class="topicType2">
                  <span>普通&nbsp;&nbsp;<el-input-number
                    v-model="intelligenceForm.judge_and_normal[0]"
                    controls-position="right"
                    :min="0"
                    :max="topicsNumDetail.judgeAndNormal"
                    @change="handleChange"
                  /><span
                    class="topicsNum"
                  >（{{ topicsNumDetail.judgeAndNormal }}题可用）</span>每题&nbsp;&nbsp;<el-input-number
                    v-model="intelligenceForm.judge_and_normal[1]"
                    controls-position="right"
                    :min="0"
                    @change="handleChange"
                  />&nbsp;&nbsp;分</span>
                </div>
                <div class="topicType2">
                  <span>困难&nbsp;&nbsp;<el-input-number
                    v-model="intelligenceForm.judge_and_hard[0]"
                    controls-position="right"
                    :min="0"
                    :max="topicsNumDetail.judgeAndHard"
                    @change="handleChange"
                  /><span
                    class="topicsNum"
                  >（{{ topicsNumDetail.judgeAndHard }}题可用）</span>每题&nbsp;&nbsp;<el-input-number
                    v-model="intelligenceForm.judge_and_hard[1]"
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
          :egroup="egroup"
          :select-company-id="selectCompanyId"
          :current-labels.sync="currentLabels"
          @addLabels="getLabels"
          @visible2="onvisible2"
        />
        <add-skills
          :visible3.sync="visible3"
          :select-company-id="selectCompanyId"
          :current-skills.sync="currentSkills"
          @addSkills="getSkills"
          @visible3="onvisible3"
        />
      </div>
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
    </div>
  </div>
</template>

<script>
import { intelligence, getTopicCount } from '@/api/test-paper-manage'
import AddLabels from '@/components/AddEvalLabels'
import AddSkills from '@/components/AddEvalSkills'
export default {
  components: {
    AddLabels,
    AddSkills
  },
  data() {
    return {
      selectCompanyId: '', // 租户
      egroup: '', // 小组
      dataIsChange: 0, // 计数器，据此判断表单是否已编辑
      noLeaveprompt: false, // 表单提交后，设置为true，据此判断提交不再弹出离开提示
      currentLabels: [], // 当前要回显的标签
      currentSkills: [], // 当前要回显的技能
      visible2: false, // 弹出选择标签
      visible3: false, // 弹出选择技能
      intelligenceForm: {
        // 智能添加入参
        topic_label: [], // 试题标签
        topic_skill: [], // 试题技能
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
        judge_and_hard: [0, 0], // 困难判断题数
        egroup: this.egroup, // 所选管理小组
        ids: [] // 当前已有试题id集合
      },
      topicsNumDetail: {}, // 可选题数详情
      totalTopics: [0, 0], // 总题数/总分数
      single_select: [0, 0], // 总的单选
      multi_select: [0, 0], // 总的多选
      judge_select: [0, 0] // 总的判断
    }
  },
  computed: {},
  watch: {},
  created() {
    this.selectCompanyId = this.$route.query.selectCompanyId
    this.egroup = this.$route.query.egroup
    this.getTopicCount()
  },
  methods: {
    // 获取可用题数
    getTopicCount() {
      const params = {
        egroup: this.egroup,
        topic_label: this.intelligenceForm.topic_label,
        topic_skill: this.intelligenceForm.topic_skill,
        ids: []
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
      this.intelligenceForm.topic_label = []
      this.currentLabels.forEach(item => {
        this.intelligenceForm.topic_label.push(item.linc)
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
      this.intelligenceForm.topic_label = []
      this.currentLabels.forEach(item => {
        this.intelligenceForm.topic_label.push(item.linc)
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
      this.intelligenceForm.topic_skill = []
      this.currentSkills.forEach(item => {
        this.intelligenceForm.topic_skill.push(item.increase_id)
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
      this.intelligenceForm.topic_skill = []
      this.currentSkills.forEach(item => {
        this.intelligenceForm.topic_skill.push(item.increase_id)
      })
      this.getTopicCount()
    },

    // 更改题型
    changeTopicType(val) {
      // 重置
      // ======================================================
      this.intelligenceForm.total_number[0] = 0
      this.intelligenceForm.total_number[1] = 0

      // ======================================================
      this.intelligenceForm.single_select[0] = 0
      this.intelligenceForm.single_select[1] = 0

      this.intelligenceForm.multi_select[0] = 0
      this.intelligenceForm.multi_select[1] = 0

      this.intelligenceForm.judge_select[0] = 0
      this.intelligenceForm.judge_select[1] = 0

      // ======================================================
      this.intelligenceForm.single_and_easy[0] = 0
      this.intelligenceForm.single_and_easy[1] = 0

      this.intelligenceForm.single_and_normal[0] = 0
      this.intelligenceForm.single_and_normal[1] = 0

      this.intelligenceForm.single_and_hard[0] = 0
      this.intelligenceForm.single_and_hard[1] = 0

      this.intelligenceForm.multi_and_easy[0] = 0
      this.intelligenceForm.multi_and_easy[1] = 0

      this.intelligenceForm.multi_and_normal[0] = 0
      this.intelligenceForm.multi_and_normal[1] = 0

      this.intelligenceForm.multi_and_hard[0] = 0
      this.intelligenceForm.multi_and_hard[1] = 0

      this.intelligenceForm.judge_and_easy[0] = 0
      this.intelligenceForm.judge_and_easy[1] = 0

      this.intelligenceForm.judge_and_normal[0] = 0
      this.intelligenceForm.judge_and_normal[1] = 0

      this.intelligenceForm.judge_and_hard[0] = 0
      this.intelligenceForm.judge_and_hard[1] = 0

      // ================================================
      this.totalTopics[0] = 0
      this.totalTopics[1] = 0

      this.single_select[0] = 0
      this.single_select[1] = 0

      this.multi_select[0] = 0
      this.multi_select[1] = 0

      this.judge_select[0] = 0
      this.judge_select[1] = 0
    },

    handleChange(val) {
      switch (this.intelligenceForm.select_type) {
        case 1:
          this.totalTopics[0] = this.intelligenceForm.total_number[0]
          this.totalTopics[1] =
            this.intelligenceForm.total_number[0] *
            this.intelligenceForm.total_number[1]
          break
        case 2:
          this.totalTopics[0] =
            this.intelligenceForm.single_select[0] +
            this.intelligenceForm.multi_select[0] +
            this.intelligenceForm.judge_select[0]
          this.totalTopics[1] =
            this.intelligenceForm.single_select[0] *
              this.intelligenceForm.single_select[1] +
            this.intelligenceForm.multi_select[0] *
              this.intelligenceForm.multi_select[1] +
            this.intelligenceForm.judge_select[0] *
              this.intelligenceForm.judge_select[1]

          this.single_select[0] = this.intelligenceForm.single_select[0]
          this.single_select[1] =
            this.intelligenceForm.single_select[0] *
            this.intelligenceForm.single_select[1]

          this.multi_select[0] = this.intelligenceForm.multi_select[0]
          this.multi_select[1] =
            this.intelligenceForm.multi_select[0] *
            this.intelligenceForm.multi_select[1]

          this.judge_select[0] = this.intelligenceForm.judge_select[0]
          this.judge_select[1] =
            this.intelligenceForm.judge_select[0] *
            this.intelligenceForm.judge_select[1]
          break
        case 3:
          this.totalTopics[0] =
            this.intelligenceForm.single_and_easy[0] +
            this.intelligenceForm.single_and_normal[0] +
            this.intelligenceForm.single_and_hard[0] +
            this.intelligenceForm.multi_and_easy[0] +
            this.intelligenceForm.multi_and_normal[0] +
            this.intelligenceForm.multi_and_hard[0] +
            this.intelligenceForm.judge_and_easy[0] +
            this.intelligenceForm.judge_and_normal[0] +
            this.intelligenceForm.judge_and_hard[0]

          this.totalTopics[1] =
            this.intelligenceForm.single_and_easy[0] *
              this.intelligenceForm.single_and_easy[1] +
            this.intelligenceForm.single_and_normal[0] *
              this.intelligenceForm.single_and_normal[1] +
            this.intelligenceForm.single_and_hard[0] *
              this.intelligenceForm.single_and_hard[1] +
            this.intelligenceForm.multi_and_easy[0] *
              this.intelligenceForm.multi_and_easy[1] +
            this.intelligenceForm.multi_and_normal[0] *
              this.intelligenceForm.multi_and_normal[1] +
            this.intelligenceForm.multi_and_hard[0] *
              this.intelligenceForm.multi_and_hard[1] +
            this.intelligenceForm.judge_and_easy[0] *
              this.intelligenceForm.judge_and_easy[1] +
            this.intelligenceForm.judge_and_normal[0] *
              this.intelligenceForm.judge_and_normal[1] +
            this.intelligenceForm.judge_and_hard[0] *
              this.intelligenceForm.judge_and_hard[1]

          this.single_select[0] =
            this.intelligenceForm.single_and_easy[0] +
            this.intelligenceForm.single_and_normal[0] +
            this.intelligenceForm.single_and_hard[0]
          this.single_select[1] =
            this.intelligenceForm.single_and_easy[0] *
              this.intelligenceForm.single_and_easy[1] +
            this.intelligenceForm.single_and_normal[0] *
              this.intelligenceForm.single_and_normal[1] +
            this.intelligenceForm.single_and_hard[0] *
              this.intelligenceForm.single_and_hard[1]

          this.judge_select[0] =
            this.intelligenceForm.judge_and_easy[0] +
            this.intelligenceForm.judge_and_normal[0] +
            this.intelligenceForm.judge_and_hard[0]
          this.judge_select[1] =
            this.intelligenceForm.judge_and_easy[0] *
              this.intelligenceForm.judge_and_easy[1] +
            this.intelligenceForm.judge_and_normal[0] *
              this.intelligenceForm.judge_and_normal[1] +
            this.intelligenceForm.judge_and_hard[0] *
              this.intelligenceForm.judge_and_hard[1]
          break
        default:
          this.totalTopics[0] = this.intelligenceForm.total_number[0]
          this.totalTopics[1] =
            this.intelligenceForm.total_number[0] *
            this.intelligenceForm.total_number[1]
          break
      }
    },

    // 保存
    intelligence() {
      intelligence()
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
//$themeColor
/*.select /deep/ .el-form-item {*/
/*display: inline-block;*/
/*width: 49%;*/
/*vertical-align: top;*/
/*}*/
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
  /*width: calc((100% - 100px) / 3);*/
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
</style>
