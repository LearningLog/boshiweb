<template>
  <div class="app-container">
    <div class="content clearfix">
      <div class="exam-title">
        {{ exam.exam_name }}
      </div>
      <p class="answerScore">您的成绩是：{{ exam.answer_score }}分，您的成绩已击败&nbsp;{{ exam.scorerate }}&nbsp;的考生</p>
      <div class="preview">
        <el-scrollbar wrap-class="scrollbar-wrapper">
          <div
            v-for="(item, index) in exam.answer_info"
            :key="item._id"
            class="topicItem clearfix"
          >
            <div class="detail">
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
                    :checked="item2.is_selected === 'y'"
                    disabled
                  >{{ getOptionOrderByIndex(index2)
                  }}{{ item2.option_content }}</el-checkbox>
                </li>
              </ul>
            </div>
            <div class="answerInfo">
              <p v-if="item.result">本人作答情况：<span class="right">回答正确</span></p>
              <div v-else>
                <p>本人作答情况：<span class="error">回答错误</span></p>
                <p class="error">正确答案：{{ item.rightOption }}</p>
                <p>解析：{{ item.topic_resolve }}</p>
              </div>
            </div>
          </div>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script>
import { getOptionOrderByIndex } from '@/utils/index'
import { getOneExam } from '@/api/door/index'

export default {
  data() {
    return {
      id: '', // 查询id
      exam: {
        answer_info: [] // 试题
      } // 考试数据
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
        this.exam = res.data.exam
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
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/theme.scss";
  @import "~@/styles/variables.scss";
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

    .preview {

      .detail, .answerInfo {
        display: inline-block;
        width: 49%;
      }

      .answerInfo {
        font-size: 14px;
        vertical-align: top;
        padding-left: 20px;
      }

      .right {
        color: $success;
      }

      .error {
        color: $red;
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
      height: calc(100vh - 230px);
    }
  }
</style>
