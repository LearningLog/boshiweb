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
            @click="cancel0"
        >确定</el-button>
      </div>
    </div>
    <div>
      <div class="selectArea clearfix">
        试卷标题：{{ testPaper.exampaper_name }}
      </div>
    </div>
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <div class="topics">
        <div class="paperLabels">
          <i class="iconfont icontag"></i>
          <span>标签：</span>
          <el-tag
              v-for="tag in paperLabels"
              :key="tag.linc"
              size="medium"
              type="success"
          >
            {{ tag.lname }}
          </el-tag>
        </div>
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
          </div>
          <p>{{ index + 1 }}、{{ item.topic_content }}</p>
          <ul class="topic-options">
            <li
              v-for="(item2, index2) in item.topic_option"
              :key="item2.option_id"
              class="item-topic"
            >
              <el-tooltip class="item" effect="dark" :content="item2.option_content" placement="top-start">
                <el-checkbox
                  :checked="item2.correct_option === 1 ? true : false"
                  class="single-line3"
                  disabled
                >{{ getOptionOrderByIndex(index2)
                }}{{ item2.option_content }}</el-checkbox>
              </el-tooltip>
            </li>
          </ul>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import { paperDetail } from '@/api/test-paper-manage'
import { getOptionOrderByIndex } from '@/utils/index'
export default {
  data() {
    return {
      paperLabels: [], // 标签
      testPaper: {
        topic_count: 0, // 总题数
        score_count: 0, // 总分数
        id: '', // 试卷ID
        selectCompanyId: '', // 租户
        egroup: 0, // 小组
        exampaper_name: '', // 试卷标题
        exampaper_label: '', // 标签[]string
        exampaper_src: 1, // 添加类型 1：手动添加
        topic_info: [] // 试题
      }
    }
  },
  created() {
    this.testPaper.id = this.$route.query._id
    this.paperDetail()
  },
  methods: {
    paperDetail() {
      paperDetail({ _id: this.testPaper.id }).then(res => {
        const exampaper = res.data.exampaper
        exampaper.id = res.data.exampaper._id
        exampaper.selectCompanyId = res.data.exampaper.groupId
        exampaper.egroup = res.data.exampaper.egroup[0]
        this.testPaper = exampaper
        var arrLabels = []
        for (var key in exampaper.labels) {
          arrLabels.push({ linc: key, lname: exampaper.labels[key] })
        }
        this.paperLabels = arrLabels
        this.getCount()
      })
    },
    // 获取题数和分值
    getCount() {
      this.testPaper.topic_count = this.testPaper.topic_info.length
      this.testPaper.score_count = 0
      this.testPaper.topic_info.forEach(item => {
        this.testPaper.score_count += item.topic_score * 1
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

    // 确定
    cancel0() {
      this.$router.push({ path: '/evaluating-manage/test-paper-manage/list' })
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
    margin-top: 20px;
    padding-left: 22px;
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
    width: 50%;
    margin-bottom: 10px;
    padding-right: 10px;
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
  .item-topic /deep/ .el-checkbox__label {
    word-break: break-all;
    word-wrap: break-word;
    white-space: pre-wrap;
    vertical-align: text-top;
    padding-right: 10px;
  }
  .paperLabels {
    margin-bottom: 20px;
  }
  .tag {
    display: inline;
  }
</style>
