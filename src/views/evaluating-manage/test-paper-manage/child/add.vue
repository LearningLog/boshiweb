<template>
  <div id="add-test-paper">
    <div class="top clearfix">
      <div class="fl">
        <span class="count">总题数：</span><span class="topic_count">{{ testPaper.topic_count }}</span>
        <span class="count">当前总分数：</span><span class="score_count">{{ testPaper.score_count }}</span>
      </div>
      <div class="fr">
        <el-button v-no-more-click type="primary" @click="publishTestPaper"><i class="addIcon iconfont iconfabu1" />发布考试</el-button>
        <el-button v-no-more-click type="primary" @click="saveTestPaper"><i class="addIcon iconfont iconbaocun" />保存考试</el-button>
      </div>
    </div>
    <div>
      <div class="selectArea clearfix">
        <div class="fl">
          <md-input class="mdInput" v-model="testPaper.exampaper_name" icon="iconxiugai" name="title" placeholder="请输入试卷标题">试卷标题</md-input>
        </div>
        <div class="fr">
          <span @click="intelligentAdd" class="intelligentAdd pointer"><i class="iconfont iconzhinenghua"></i>智能添加</span>
          <span @click="questionBankAdd" class="questionBankAdd pointer"><i class="iconfont icontikuguanli"></i>题库中添加</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MdInput from '@/components/MDinput'
import store from '@/store'

export default {
  components: {
    MdInput
  },
  data() {
    return {
      selectCompanyId: '', // 租户
      egroup: '', // 小组
      dataIsChange: 0, // 计数器，据此判断表单是否已编辑
      noLeaveprompt: false, // 表单提交后，设置为true，据此判断提交不再弹出离开提示
      testPaper: {
        topic_count: null, // 总题数
        score_count: null, // 总分数
        exampaper_name: '', // 试卷标题
      }
    }
  },
  computed: {

  },
  watch: {

  },
  created() {
    this.selectCompanyId = this.$route.query.selectCompanyId
    this.egroup = this.$route.query.egroup
  },
  methods: {
    // 暂存当前试卷数据
    temporaryStorage() {
      store.dispatch('testPaper/temporaryStorage', this.testPaper)
    },
    // 智能添加
    intelligentAdd() {
      this.temporaryStorage()
      this.$router.push({ path: '/evaluating-manage/test-paper-manage/intelligent-add', query: { selectCompanyId: this.selectCompanyId, egroup: this.egroup }})
    },
    // 题库中添加
    questionBankAdd() {
      this.temporaryStorage()
      this.$router.push({ path: '/evaluating-manage/test-paper-manage/question-bank-add', query: { selectCompanyId: this.selectCompanyId, egroup: this.egroup }})
    },
    // 发布考试
    publishTestPaper() {

    },
    // 保存考试
    saveTestPaper() {

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
  #add-test-paper {
    height: 38px;
    line-height: 38px;
  }
  .count {
    color: #666666;
    font-size: 14px;
  }
  .topic_count, .score_count {
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
    background-color: #F2F2F2;

    > .fl, .fr {
      display: inline-block;
    }
  }
  .selectArea /deep/ .material-input__component {
    width: 300px;
    height: 40px;
    line-height: 40px;
    margin-top: 0;
    background: #F2F2F2;
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
  .intelligentAdd, .questionBankAdd {
    color: $themeColor;
  }
</style>
