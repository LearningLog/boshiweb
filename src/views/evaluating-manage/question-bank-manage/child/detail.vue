<template>
  <div class="form-edit">
    <div class="form">
      <div v-for="(item, index) in topics" :key="item.id" class="topics-item">
        <p class="topic-type">
          <span>{{ index+1 + '、' }}{{ item.topicTypeTitle }}</span><el-tooltip class="item" effect="dark" :content="item.labelStr" placement="top"><span v-if="item.labelStr"><span class="single-line">【{{ item.labelStr }}</span><span>】</span></span></el-tooltip><el-tooltip class="item" effect="dark" :content="item.skillStr" placement="top"><span v-if="item.skillStr"><span class="single-line">【{{ item.skillStr }}</span><span>】</span></span></el-tooltip>
        </p>
        <p>
          {{ item.topic_content }}
          <img v-if="item.topic_resource" class="previewImg" :src="item.topic_resource" alt="">
        </p>
        <ul class="topic-options">
          <li v-for="(item2, index2) in item.topic_option" :key="item2.option_id" class="topic-item">
            <el-checkbox :checked="item2.correct_option===1?true:false" :title="item2.option_content" class="single-line3" disabled>{{ getOptionOrderByIndex(index2) }}{{ item2.option_content }}</el-checkbox>
          </li>
        </ul>
        <p class="topic_resolve">解析：{{ item.topic_resolve }}</p>
        <div class="btnGroup">
          <el-button type="primary" @click="confirm">确定</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
import { topicDetil } from '@/api/question-bank-manage'

export default {
  directives: { elDragDialog },
  data() {
    return {
      id: '', // 查询参数
      topics: [] // 试题
    }
  },
  created() {
    this.id = this.$route.query._id
    this.topicDetil()
  },
  methods: {
    // 获取初始数据
    topicDetil() {
      topicDetil({ _id: this.id }).then(res => {
        const { data } = res

        data.topic.forEach((item, index1) => {
          // 获取预览区题型中的文本===begin===
          let topicType = ''
          switch (item.topic_type) {
            case 1:
              topicType += '单选题'
              break
            case 2:
              topicType += '多选题'
              break
            case 3:
              topicType += '判断题'
              break
          }
          topicType += '【' + item.topic_score + '分】'

          var str1 = []
          item.labels.forEach(item => {
            str1.push(item.lname)
          })
          var str2 = []
          item.skills.forEach(item => {
            str2.push(item.skill_name)
          })

          item.topic_level = item.topic_level + ''
          switch (item.topic_level) {
            case 1:
              topicType += '【难度：简单】'
              break
            case 2:
              topicType += '【难度：一般】'
              break
            case 3:
              topicType += '【难度：困难】'
              break
          }
          item.labelStr = str1.length ? '标签：' + str1 : ''
          item.skillStr = str2.length ? '技能：' + str2 : ''
          item.topicTypeTitle = topicType
          item.topic_skill = item.topic_skill.length ? item.topic_skill.join(',') : ''
          item.topic_label = item.topic_label.length ? item.topic_label.join(',') : ''
        })
        this.topics = data.topic || []
      })
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
    // 确定
    confirm() {
      this.$router.push({ path: '/evaluating-manage/question-bank-manage/list' })
    }
  }
}
</script>

<style lang="scss" scoped>
#btnGroup {
  padding-left: 130px;
}
@import "~@/styles/theme.scss";
.topics-item {
  padding: 10px;
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
.btnGroup {
  margin-top: 20px;
}
</style>
