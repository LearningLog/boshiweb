<template>
  <div>
    <div class="detailForm">
      <div class="detailFormTop">
        {{ form.examName }}
      </div>
      <div class="detailFormContent">
        <el-form
          class="form"
          :model="form"
          label-width="100px"
        >
          <el-form-item label="题目数：">
            <span>{{ form.topic_count }}道</span>
          </el-form-item>
          <el-form-item label="应考人数：">
            <span>{{ form.userCount }}人（实考{{ form.realUserCount }}人，参考率{{ form.rate }}）</span>
          </el-form-item>
          <el-form-item label="总分：">
            <span>{{ form.scoreCount }}分</span>
          </el-form-item>
          <el-form-item label="平均分：">
            <span>{{ form.averageScore }}分</span>
          </el-form-item>
          <el-form-item label="最高分：">
            <span>{{ form.maxScore }}分</span>
          </el-form-item>
          <el-form-item label="最低分：">
            <span>{{ form.minScore }}分</span>
          </el-form-item>
          <el-form-item label="考试时间：">
            <span>{{ form.examBeginTime }}~{{ form.examEndTime }}</span>
          </el-form-item>
          <el-form-item label="及格分数：">
            <span>{{ form.passscore }}分</span>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="detailTable">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="成绩统计" name="mark">
          <el-table
            v-loading="listLoading"
            :data="userGradeList"
            element-loading-text="Loading"
            border
            fit
            highlight-current-row
          >
            <el-table-column align="center" label="员工" min-width="120" show-overflow-tooltip prop="nickname" />
            <el-table-column align="center" label="所属分组" min-width="100" show-overflow-tooltip prop="user_group" />
            <el-table-column align="center" label="答题时间" min-width="140" show-overflow-tooltip prop="time_consuming" />
            <el-table-column align="center" label="用时" min-width="140" show-overflow-tooltip prop="time_consuming" />
            <el-table-column align="center" label="得分" min-width="60" show-overflow-tooltip prop="answer_score" />
            <el-table-column align="center" label="错误数" min-width="50" show-overflow-tooltip prop="error_sum" />
            <el-table-column class-name="status-col" label="操作" width="100" align="center" fixed="right">
              <template slot-scope="scope">
                <el-button size="mini" @click="detail(scope.row)"><i class="iconfont iconchakan" />详情</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="得分统计" name="score">
          <el-table
            v-loading="listLoading"
            :data="topicGradeList"
            element-loading-text="Loading"
            border
            fit
            highlight-current-row
          >
            <el-table-column type="expand" width="60" label="展开">
              <template slot-scope="props">
                <el-table
                  class="expand-table"
                  :data="props.row.topic_option"
                  border
                  fit
                  highlight-current-row
                >
                  <el-table-column align="center" label="选项" min-width="120" show-overflow-tooltip prop="option_content" />
                  <el-table-column align="center" label="选择人数" min-width="100" show-overflow-tooltip prop="selectUserCount" />
                  <el-table-column header-align="center" label="比例" width="300" show-overflow-tooltip align="left">
                    <template slot-scope="scope2">
                      <el-progress :percentage="(scope2.row.selectRate.substring(0, scope2.row.selectRate.length - 1)) * 1" />
                    </template>
                  </el-table-column>
                </el-table>
              </template>
            </el-table-column>
            <el-table-column align="center" label="序号" width="60" show-overflow-tooltip prop="nickname">
              <template slot-scope="scope">
                {{ scope.$index + 1 }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="题目" min-width="100" show-overflow-tooltip prop="topic_content" />
            <el-table-column align="center" label="参与人数" min-width="130" show-overflow-tooltip prop="userCount" />
            <el-table-column align="center" label="答错人数" min-width="130" show-overflow-tooltip prop="errorCount" />
            <el-table-column align="center" label="正确率" min-width="60" show-overflow-tooltip prop="right_rate" />
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog v-el-drag-dialog class="answerInfodialog" title="答题详情" :visible.sync="answerInfodialog">
      <div class="userTopDetail"><span class="username">答题人：{{ topicsDetail.username }}</span><span class="examname">{{ topicsDetail.examname }}</span><span class="answerScore">得分：{{ topicsDetail.answer_score }}分</span></div>
      <el-scrollbar wrap-class="scrollbar-wrapper">
        <div v-for="(item, index) in topicsList" :key="item._id" class="topicItem">
          <p>{{ index + 1 }}、{{ item.topic_content }} <span class="rightOption">（正确答案：{{ item.rightOption }}）</span></p>
          <ul class="topic-options">
            <li
              v-for="(item2, index2) in item.topic_option"
              :key="item2.option_id"
              class="item-topic"
            >
              <el-tooltip class="item" effect="dark" :content="item2.option_content" placement="top-start">
                <el-checkbox
                  v-model="item2.is_selected"
                  class="single-line3"
                  disabled
                >{{ getOptionOrderByIndex(index2)
                }}{{ item2.option_content }}</el-checkbox>
              </el-tooltip>
            </li>
          </ul>
        </div>
      </el-scrollbar>
    </el-dialog>
  </div>
</template>

<script>
import { answerInfo, userGrade, topicGrade, oneAnswerInfo } from '@/api/evolutionManage-examination'
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
import { getOptionOrderByIndex } from '@/utils/index'
export default {
  directives: { elDragDialog },
  data() {
    return {
      answerInfodialog: false,
      listLoading: false,
      id: null, // 查询id
      form: {}, // 顶部数据
      activeName: 'mark', // 默认显示成绩统计
      topicsList: [], // 详情
      topicsDetail: {
        username: '', // 答题人
        examname: '', // 考试名称
        answer_score: '' // 答题分数
      },
      userGradeList: [], // 成绩统计
      topicGradeList: [] // 得分统计
    }
  },
  created() {
    this.id = this.$route.query._id
    this.getInitData()
    this.getMarkList()
  },
  methods: {
    // 获取初始数据
    getInitData() {
      answerInfo({ _id: this.id }).then(response => {
        this.form = response.data
      })
    },

    // 获取成绩统计数据
    getMarkList() {
      this.listLoading = true
      userGrade({ _id: this.id }).then(response => {
        this.listLoading = false
        this.userGradeList = response.data.resList
      })
    },

    // 获取得分统计数据
    getTopicsList() {
      this.listLoading = true
      topicGrade({ _id: this.id }).then(response => {
        this.listLoading = false
        this.topicGradeList = response.data
      })
    },

    // 切换
    handleClick(val) {
      if (val === 'mark') {
        this.getMarkList()
      } else {
        this.getTopicsList()
      }
    },

    // 详情
    detail(row) {
      oneAnswerInfo({ _id: row._id }).then(response => {
        this.topicsList = response.data.answerInfo.answer_info
        var list1 = this.topicsList
        for (let i = 0; i < list1.length; i++) {
          for (let j = 0; j < list1[i].topic_option.length; j++) {
            if (list1[i].topic_option[j].is_selected === 'y') {
              list1[i].topic_option[j].is_selected = true
            }
          }
        }
        this.topicsList = list1
        this.topicsDetail = {
          username: response.data.username,
          examname: response.data.examname,
          answer_score: response.data.answerInfo.answer_score
        }
        this.answerInfodialog = true
      })
    },

    // 序号
    getOptionOrderByIndex(index) {
      return getOptionOrderByIndex(index)
    },

    // 确定
    confirm() {
      this.$router.push({ path: '/evaluating-manage/examination-manage/list' })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/theme.scss";
  @import "~@/styles/variables.scss";
  .detailForm {
    border: 1px solid #f2f2f2;

    > .detailFormTop {
      color: #666666;
      font-size: 14px;
      width: 100%;
      height: 40px;
      line-height: 40px;
      padding-left: 22px;
      background-color: #f2f2f2;
    }
  }
  .detailFormContent .form /deep/ .el-form-item {
    margin-bottom: 18px;
    width: 49%;
    display: inline-block;
  }
  .detailFormContent .form {
    width: 70%;
    margin: 0 auto;
    padding-top: 18px;
  }
  .detailTable {
    margin-top: 18px;
  }
  .el-scrollbar {
    height: 50vh;
  }
  .topicItem {
    padding: 20px;
    padding-top: 10px;
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
    padding: 10px;
    margin-bottom: 10px;
  }
  .answerInfodialog /deep/ .el-dialog__body {
    padding-top: 0;
  }
  .rightOption {
    color: $red;
  }
  .item-topic /deep/ .el-checkbox__label {
    word-break: break-all;
    word-wrap: break-word;
    white-space: pre-wrap;
    vertical-align: top;
    padding-right: 10px;
  }
  .userTopDetail {
    width: 100%;
    height: 30px;
    line-height: 30px;

    > span {
      display: inline-block;
      width: 33%;
      padding-left: 20px;
    }

    > .answerScore {
      color: $red;
    }
  }
  .expand-table /deep/ .el-progress {
    -ms-text-align-last: left;
    text-align-last: left;
  }
</style>
