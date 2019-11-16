<template>
  <div class="app-container">
    <div class="form-edit">
      <el-form
        ref="form"
        class="form"
        :model="form"
        :rules="rules"
        label-width="100px"
        :status-icon="true"
      >
        <el-form-item label="key" prop="key">
          <el-input v-model="form.key" placeholder="请输入key" maxlength="100" clearable />
        </el-form-item>
        <el-form-item label="管理员密码" prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            maxlength="50"
            autocomplete="new-password"
            clearable
          />
        </el-form-item>
        <el-form-item label="数据类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择数据类型" clearable>
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="值" prop="val">
          <el-input
            v-model="form.val"
            type="textarea"
            placeholder="请输入值"
            :row="2"
          />
        </el-form-item>
      </el-form>
      <div id="btnGroup">
        <el-button
          v-no-more-click
          type="primary"
          @click="save('form')"
        >确认</el-button>
        <el-button type="primary" plain @click="cancel">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { regPwd } from '@/utils/validate'
import { setConfigValue } from '@/api/global-config'

export default {
  data() {
    // 校验管理员密码
    var validatePass = (rule, value, callback) => {
      if (!value && value !== 0) {
        callback(new Error('请输入管理员密码'))
      } else if (!regPwd(value)) {
        callback(new Error('6 到 50 位字母和数字的组合'))
      } else {
        callback()
      }
    }
    var regInt = /^-?[0-9]\d*$/ // 匹配整数
    // 校验 值 和 数据类型
    var validateValueType = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入值'))
      }
      if (this.form.type === 'number' && !regInt.test(value)) {
        callback(new Error('格式不正确，请输入数字类型值'))
      } else if (this.form.type === 'boolean') {
        if (value === true || value === false) {
          callback()
        } else {
          value = value.toLowerCase()
          if (value !== 'true' && value !== 'false') {
            callback(new Error('格式不正确，请输入布尔类型值'))
          } else {
            callback()
          }
        }
      } else if (this.form.type === 'array') {
        var val = null
        try {
          val = JSON.parse(value)
        } catch (e) {
          console.log('数据类型不正确')
        }
        if (Object.prototype.toString.call(val) !== '[object Array]') {
          callback(new Error('格式不正确，请输入数组类型值'))
        } else {
          callback()
        }
      } else if (this.form.type === 'object') {
        var val2 = null
        try {
          val2 = JSON.parse(value)
        } catch (e) {
          console.log('数据类型不正确')
        }
        if (Object.prototype.toString.call(val2) !== '[object Object]') {
          callback(new Error('格式不正确，请输入对象类型值'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      dataIsChange: 0, // 计数器，据此判断表单是否已编辑
      noLeaveprompt: false, // 表单提交后，设置为true，据此判断提交不再弹出离开提示
      options: [
        {
          value: 'number',
          label: '数值'
        },
        {
          value: 'string',
          label: '字符串'
        },
        {
          value: 'boolean',
          label: '布尔值'
        },
        {
          value: 'array',
          label: '数组'
        },
        {
          value: 'object',
          label: '对象'
        }
      ],
      form: {
        key: '',
        value: '',
        val: '',
        password: '',
        type: ''
      },
      rules: {
        key: [
          { required: true, message: '请输入key（长度在 1 到 100 个字符）', trigger: 'blur' },
          { required: true, message: '请输入key（长度在 1 到 100 个字符）', trigger: 'change' }
        ],
        password: [
          { required: true, validator: validatePass, trigger: 'blur' },
          { required: true, validator: validatePass, trigger: 'change' }
        ],
        type: [
          { required: true, message: '请选择数据类型', trigger: 'change' }
        ],
        val: [
          { required: true, validator: validateValueType, trigger: 'blur' },
          { required: true, validator: validateValueType, trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.form.key = this.$route.query.key
    this.form.val = this.$route.query.value
    this.form.type = this.$route.query.type
    this.form.password = this.pwd
    this.dataIsChange = -1
  },
  watch: {
    // 监听对象变化
    form: {
      handler(val) {
        debugger
        if (val) {
          this.dataIsChange++
        }
      },
      deep: true // 深层次监听
    }
  },
  methods: {
    // 提交
    save(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          switch (this.form.type) {
            case 'number':
              this.form.value = this.form.value * 1
              break
            case 'boolean':
              var val = this.form.val
              if (val.toLowerCase() === 'true') {
                this.form.value = true
              } else {
                this.form.val = false
              }
              break
            case 'array':
              this.form.value = JSON.parse(this.form.val)
              break
            case 'object':
              this.form.value = JSON.parse(this.form.val)
              break
          }
          setConfigValue(this.form).then(res => {
            this.$message.success('修改配置成功！')
            this.noLeaveprompt = true
            this.$router.push({ path: '/global-config/list' })
          })
        }
      })
    },
    // 取消
    cancel() {
      this.$router.push({ path: '/global-config/list' })
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
  #btnGroup {
    padding-left: 100px;
  }
</style>
