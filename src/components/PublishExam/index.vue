<template>
  <div class="publishExam">
    <el-dialog
      v-el-drag-dialog
      class="publishDialog"
      title="发布考试"
      :visible.sync="visible"
      @close="cancel('paparForm')"
    >
      <el-form
        ref="paparForm"
        :model="paparForm"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="考试名称" prop="exam_name">
          <el-input
            v-model="paparForm.exam_name"
            placeholder="请输入考试名称"
            maxlength="64"
            clearable
          />
        </el-form-item>
        <el-form-item label="考试时间" prop="time_range">
          <el-date-picker
            v-model="paparForm.time_range"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="及格分数" prop="passscore">
          <el-input
            v-model="paparForm.passscore"
            placeholder="请输入及格分数"
            clearable
            @keyup.native="intNum(paparForm.passscore)"
          />
        </el-form-item>
        <el-form-item label="考试人员" prop="memer">
          <el-input v-show="false" v-model="paparForm.memer" />
          <Examiners
            :select-company-id="selectCompanyId"
            :selected-options="selectedOptions"
            :load="true"
            @examiners="getExaminers"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="publish('paparForm')">发布</el-button>
        <el-button @click="cancel('paparForm')">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
import Examiners from '@/components/Examiners'
import { validIntNum } from '@/utils/validate'
const $ = window.$

export default {
  name: 'PublishExam',
  components: { Examiners },
  directives: { elDragDialog },
  props: {
    // 租户id
    selectCompanyId: {
      type: String,
      default: ''
    },
    // 总分
    scoreCount: {
      type: Number,
      default: 0
    },
    // 是否弹出
    publishDialog: {
      type: Boolean,
      default: false
    },
    exam: {
      type: Object,
      default: null
    }
  },
  data() {
    // 校验考试人员
    var validTargetUser = (rule, value, callback) => {
      if (!this.paparForm.time_range.length) {
        callback(new Error('请选择考试时间'))
      } else {
        callback()
      }
    }
    // 校验及格分数
    var validPassscore = (rule, value, callback) => {
      if (!this.paparForm.passscore) {
        callback(new Error('请输入及格分数'))
      } else if (this.paparForm.passscore * 1 > this.scoreCount) {
        callback(
          new Error('及格分数不能超过总分数（总分数:' + this.scoreCount + '）')
        )
      } else {
        callback()
      }
    }
    return {
      visible: false,
      paparForm: {
        exampaper_id: '', // 试卷Id
        exam_name: '', // 考试名称
        time_range: [], // 考试时间
        begin_time: '', // 开始时间
        end_time: '', // 结束时间
        passscore: '', // 及格分数
        egroup: '', // 小组
        targetUser: '', // 考试人员
        topic_disorder: '', // 是否题号乱序
        memer: '' // 校验用的，无实际意义
      },
      targetUser: [], // 未处理的考试人员
      selectedOptions: [], // 回显的级联菜单值
      rules: {
        exam_name: [
          {
            required: true,
            message: '请输入考试名称（长度在 2 到 30 个字符）',
            trigger: 'blur'
          },
          {
            required: true,
            message: '请输入考试名称（长度在 2 到 30 个字符）',
            trigger: 'change'
          },
          {
            min: 2,
            max: 30,
            message: '长度在 2 到 30 个字符',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 30,
            message: '长度在 2 到 30 个字符',
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
        passscore: [
          { required: true, validator: validPassscore, trigger: 'blur' },
          { required: true, validator: validPassscore, trigger: 'change' }
        ],
        targetUser: [
          { required: true, validator: validTargetUser, trigger: 'blur' },
          { required: true, validator: validTargetUser, trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    publishDialog: function(val, val2) {
      if (val) {
        this.visible = true
      }
    },
    exam: function(val, val2) {
      if (val) {
        this.paparForm.time_range[0] = val.begin_time
        this.paparForm.time_range[1] = val.end_time
        this.selectedOptions.length = 0
        $.extend(true, this.paparForm, val)
        for (const key in val.target_user) {
          const item = val.target_user[key]
          item.forEach(value => {
            this.selectedOptions.push([key, value])
          })
        }
        if (this.selectedOptions.length && this.selectedOptions[0].length >= 2) {
          this.paparForm.memer = '111'
        } else {
          this.paparForm.memer = ''
        }
      }
    }
  },
  methods: {
    // 监听选择人员
    getExaminers(val) {
      this.targetUser = val
      var flag = true
      for (var key in val) {
        if (!val[key][0]) {
          flag = false
        }
      }
      if (flag) {
        this.paparForm.memer = '111'
      } else {
        this.paparForm.memer = ''
      }
    },
    // 取消
    cancel(formName) {
      this.visible = false
      this.$refs[formName].resetFields()
      this.$emit('visiblePublish', { visible: false })
    },
    // 发布考试
    publish(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.paparForm.begin_time = this.paparForm.time_range[0]
          this.paparForm.end_time = this.paparForm.time_range[1]
          delete this.paparForm.time_range
          this.paparForm.targetUser = this.targetUser
          const paparForm = JSON.parse(JSON.stringify(this.paparForm))
          this.$emit('publishExam', paparForm)
          this.visible = false
        }
      })
    },
    // 校验最大用户数为正整数
    intNum(val) {
      this.paparForm.passscore = validIntNum(val)
    }
  }
}
</script>

<style scoped>
/deep/ .el-cascader-menu:last-child {
  border-right: solid 1px #dfe4ed;
}
.examiners .el-cascader-panel {
  width: 379px;
}
.examiners .group {
  display: inline-block;
  width: 188px;
  background-color: #f5f7fa;
  padding-left: 20px;
}
.examiners .member {
  display: inline-block;
  width: 190px;
  background-color: #f5f7fa;
  padding-left: 20px;
}
</style>
