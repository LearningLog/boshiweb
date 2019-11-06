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
                  <el-form-item class="content" label="题目内容">
                    <el-input v-model="topic1.topic_content" class="topicName" placeholder="请输入题目" clearable />
                    <select-file :visible="visible" :file-type-list="['pic']" @checkedFile="checkedFile" @visible="onvisible" />
                    <div v-show="topic1.topic_resource" class="img-group">
                      <div class="imgCover" :style="{backgroundImage:'url(' + topic1.topic_resource + ')'}"> <i class="close iconfont iconfalse-circle" @click="delTopicImg" /></div>
                    </div>
                    <div class="selectPic" @click="topicImg">
                      添加图片
                    </div>
                  </el-form-item>
                </el-form>
              </div>
            </el-tab-pane>
            <el-tab-pane label="多选题" name="2">
              多选题
            </el-tab-pane>
            <el-tab-pane label="判断题" name="3">
              判断题
            </el-tab-pane>
          </el-tabs>
        </div>
        <div class="fr preview ">
          <h3>预览区</h3>
          <p class="tip" />
        </div>
      </el-tab-pane>
      <el-tab-pane class="excel" label="Excel添加" name="excel">
        222
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import SelectFile from '@/components/SelectFile'
export default {
  components: {
    SelectFile
  },
  data() {
    return {
      dataIsChange: 0, // 计数器，据此判断表单是否已编辑
      noLeaveprompt: false, // 表单提交后，设置为true，据此判断提交不再弹出离开提示
      visible: false, // 弹出选择文件
      addType: 'hand', // 默认手动添加
      topic_type: '1', // 默认单选题
      topic1: { // 单选题
        topic_type: '', // 题目类型 1单选，2多选，3判断
        topic_content: '', // 题目
        topic_level: 1, // 难度
        topic_label: '', // 标签
        topic_skill: '', // 技能
        topic_resolve: '', // 试题解析
        topic_score: 1, // 分值
        topic_option: [ // 题目选项
          {
            option_content: '',
            option_img: '',
            correct_option: 2, // 1正确答案 2错误
            option_id: null
          }, {
            option_content: '',
            option_img: '',
            correct_option: 2,
            option_id: null
          }
        ], // 题目选项
        topic_resource: '', // 选择的图片
        topic_resource_id: '' // 主文件id
      } // 单题数据
    }
  },
  computed: {

  },
  created() {

  },
  mounted() {

  },
  methods: {
    // 切换手动添加与Excel导入离开前的逻辑
    beforeLeaveTabs1(item) {

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
    checkedFile(val) {
      this.topic1.topic_resource = val.fileUrl
      this.topic1.topic_resource_id = val.mainFileId
    },
    onvisible(val) {
      this.visible = val.visible
    },

    // 题干添加图片
    topicImg() {
      this.visible = true
    },
    // 删除题干图片
    delTopicImg() {
      this.$confirm('确定删除该图片吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.topic1.topic_resource = ''
        this.topic1.topic_resource_id = ''
        this.$message.success('删除成功')
      }).catch(() => {

      })
    },

    addTopics() {

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
  }
</style>
