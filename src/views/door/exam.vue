<template>
  <div class="app-container">
    <div class="content clearfix">
      <div class="exam-title">
        {{ exam.exam_name }}
      </div>

      <div class="fl edit">
        <div class="count">
          <span>第{{ count + 1 }}题</span>/<span>共{{ exam.answer_info && exam.answer_info.length }}题</span>
        </div>
        <el-scrollbar wrap-class="scrollbar-wrapper">
          <div class="topicItem">
            <p class="topic-type">
              {{ count + 1 }}、{{
                switchTopicTypeToName(topic.topic_type)
              }}&nbsp;[{{ topic.topic_score }}分]
            </p>
            <p class="topic-content">{{ topic.topic_content }}</p>
            <ul class="topic-options">
              <li
                v-for="(item2, index2) in topic.topic_option"
                :key="item2.option_id"
                class="item-topic"
              >
                <el-checkbox
                  v-model="item2.check"
                  @change="handleChangeAnswer"
                >{{ getOptionOrderByIndex(index2)
                }}{{ item2.option_content }}</el-checkbox>
              </li>
            </ul>
          </div>
          <div class="btnGroup">
            <el-button
              v-show="count !== 0"
              type="primary"
              plain
              @click="prev"
            >上一题</el-button>
            <el-button
              v-show="count !== exam.answer_info.length - 1"
              type="primary"
              @click="next"
            >下一题</el-button>
            <el-button
              v-show="count === exam.answer_info.length - 1"
              v-no-more-click
              class="saveTopic"
              type="primary"
              @click="saveExam"
            >提交</el-button>
          </div>
        </el-scrollbar>
      </div>
      <div class="fr preview">
        <p class="preview-text">预览区</p>
        <span class="tip">(小提示:完成的考试记得提交哦!)</span>
        <el-scrollbar wrap-class="scrollbar-wrapper">
          <div
            v-for="(item, index) in exam.answer_info"
            :key="item._id"
            class="topicItem"
          >
            <p class="topic-type">
              {{ index + 1 }}、{{
                switchTopicTypeToName(item.topic_type)
              }}&nbsp;[{{ item.topic_score }}分]
            </p>
            <p class="topic-content">{{ item.topic_content }}</p>
            <ul class="topic-options">
              <li
                v-for="(item2, index2) in item.topic_option"
                :key="item2.option_id"
                class="item-topic"
              >
                <el-checkbox
                  :checked="item2.check"
                  disabled
                >{{ getOptionOrderByIndex(index2)
                }}{{ item2.option_content }}</el-checkbox>
              </li>
            </ul>
          </div>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script>
import { getOptionOrderByIndex } from '@/utils/index'
import {
  getOneExam,
  findTempAnswer,
  saveTempAnswer,
  answerCommit
} from '@/api/door/index'

export default {
  data() {
    return {
      id: '', // 查询id
      exam: {
        answer_info: [] // 试题
      }, // 考试数据
      count: 1, // 当前题号
      exam_id: null, // 考试id
      topic: {}, // 当前编辑的试题
      startTime: 0, // 开始时间
      endTime: 0, // 开始时间
      checkedList: []
    }
  },
  watch: {},
  created() {
    this.id = this.$route.query.id
    this.getOneExam()
  },
  methods: {
    // 获取当前考试信息
    getOneExam() {
      getOneExam({ _id: this.id }).then(res => {
        var exam = res.data.exam
        exam.answer_info = exam.answer_info || []
	      this.exam_id = res.data.exam.exam_id
        if (exam.haveTempTopic) {
          findTempAnswer({ exam_id: res.data.exam.exam_id }).then(response => {
            var option_ids = []
            var tempTopics = response.data || []
            var countArr = []
            tempTopics.forEach(item => {
              option_ids = option_ids.concat(item.option_ids)
            })
            option_ids.forEach(item => {
              exam.answer_info.forEach((item2, index2) => {
                item2.topic_option = item2.topic_option || []
                item2.topic_option.forEach(item3 => {
                  if (item === item3.option_id) {
                    item3.check = true
                    countArr.push(index2)
                  }
                })
              })
            })
            this.count = countArr.sort((a, b) => {
              return b - a
            })[0]
            this.exam = exam
            this.topic = JSON.parse(JSON.stringify(exam.answer_info[this.count]))
            this.startTime = new Date().getTime()
          })
        } else {
          this.count = 0
          this.exam = exam
          this.topic = JSON.parse(JSON.stringify(exam.answer_info[this.count]))
          this.startTime = new Date().getTime()
        }
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

	  // 选择
    handleChangeAnswer(val) {
      console.log('val', val)
      console.log(this.topic)
      switch (this.topic.topic_type) {
        case 1:

          break
        case 2:
          break
        case 3:
          break
      }
    },

	  // 保存临时答题数据
    saveTempAnswer() {
      var select_option = []
      var option_ids = []
      this.topic.topic_option.forEach((item, index) => {
        if (item.check) {
          select_option.push(index + 1)
          option_ids.push(item.option_id)
        }
      })
      const params = {
        exam_id: this.exam_id,
        topic_id: this.topic._id,
        select_option: select_option,
        option_ids: option_ids
      }
      saveTempAnswer(params).then(res => {

      })
    },

	  // 校验
	  valid() {
      var hasSelected = this.topic.topic_option.find(function(item) {
	      return item.check
      })
		  return hasSelected
	  },

    // 上一题
    prev() {
      if (this.count > 0) {
        if (this.valid()) {
          this.saveTempAnswer()
        }
        this.count--
        this.topic = this.exam.answer_info[this.count]
      }
    },

    // 下一题
    next() {
      if (this.count < this.exam.answer_info.length - 1) {
        if (!this.valid()) {
          this.$message.warning('请选择正确选项！')
          return false
        }
        this.saveTempAnswer()
        this.count++
        this.topic = this.exam.answer_info[this.count]
      }
    },

    // 提交
    saveExam() {
      if (!this.valid()) {
        this.$message.warning('请选择正确选项！')
        return false
      }
      this.endTime = new Date().getTime()
      const params = {
        _id: this.id,
        time_consuming: this.endTime - this.startTime,
        answer_info: this.exam.answer_info
      }
      answerCommit(params).then(res => {
        this.$message.success('提交成功！')
        this.$router.push({ path: '/' })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/theme.scss";
.content {
  width: 1100px;
  margin: 0 auto;
  position: relative;

  .exam-title {
    height: 40px;
    line-height: 40px;
    padding-left: 10px;
    background-color: $themeColor;
  }

  .edit,
  .preview {
    width: calc(50% - 10px);
  }

  .edit {
    .count {
      height: 103px;
      line-height: 172px;
      border-bottom: 1px solid #e8e8e8;
    }

	  .btnGroup {
		  text-align: center;
	  }
  }

  .edit,
  .preview {
    .preview-text {
      font-size: 24px;
    }

    .tip {
      display: inline-block;
      font-size: 14px;
      width: 100%;
      padding-bottom: 10px;
      border-bottom: 1px solid #e8e8e8;
    }

    .topicItem {
      padding: 20px;
      padding-top: 0;
      background-color: #f8f8f8;
      margin-bottom: 20px;
      padding-bottom: 12px;
    }
    .topic-options {
      position: relative;
    }
    .item-topic {
      background-color: #fff;
      padding: 10px;
      width: 100%;
      margin-bottom: 10px;
    }

    .topic-type {
      padding-top: 20px;
      font-size: 14px;
      font-weight: 700;
    }
    .topic-content {
      font-size: 14px;
    }
  }

  .item-topic /deep/ .el-checkbox__label {
    word-break: break-all;
    word-wrap: break-word;
    white-space: pre-wrap;
    vertical-align: text-top;
  }

  .el-scrollbar {
    height: calc(100vh - 290px);
  }
}
</style>
