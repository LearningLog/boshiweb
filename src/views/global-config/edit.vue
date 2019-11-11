<template>
  <div class="app-container">
    <div class="form-edit">
      <el-form ref="form" class="form" :model="form" :rules="rules" label-width="100px" :status-icon="true">
        <el-form-item class="" label="key:">
          <el-input v-model="obj.key" placeholder="" maxlength="12" clearable readonly="readonly" />
        </el-form-item>
        <el-form-item class="pas" label="管理员密码:">
          <el-input v-model="pwd" placeholder="" maxlength="64" clearable />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="obj.type" placeholder="" clearable>
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="值">
          <el-input v-model="obj.value" type="textarea" resize="none" rows=" 4 " />
        </el-form-item>
      </el-form>
      <div id="btnGroup">
        <el-button v-no-more-click type="primary" @click="save('form')">确认</el-button>
        <el-button type="primary" plain @click="cancel">关闭</el-button>
      </div>
    </div>
  </div>

</template>

<script>
import { mapGetters } from 'vuex'
import { setConfigValue } from '@/api/global-config'

export default {
  computed: {
    ...mapGetters([
      'menuType'
    ])
  },
  watch: {
    // 监听对象变化
    obj: {
      handler(val) {
        if (val) {
          this.dataIsChange++
        }
      },
      deep: true // 深层次监听
    }
  },
  created() {
    console.log(this.$route.query)
    this.obj.key = this.$route.query.key
    this.obj.value = this.$route.query.value
    this.obj.type = this.$route.query.type
    this.obj.password = this.pwd
    console.log(this.obj)
  },
  data() {
    return {
      dataIsChange: 0, // 计数器，据此判断表单是否已编辑
      noLeaveprompt: false, // 表单提交后，设置为true，据此判断提交不再弹出离开提示
      pwd: '', // 管理员密码
      options: [{
        value: 'number',
        label: '数值'
      }, {
        value: 'string',
        label: '字符串'
      }, {
        value: 'boolean',
        label: '布尔值'
      }, {
        value: 'array',
        label: '数组'
      }, {
        value: 'object',
        label: '对象'
      }],
      obj: {}, // 当前的对象
      rules: []
    }
  },
  methods: {
    // 提交
    save(formName) {
      this.noLeaveprompt = true
      this.obj.password = this.pwd
      setConfigValue(this.obj)
      console.log(this.obj)
      this.$router.push({ path: '/global-config/list' })
    },
    // 取消
    cancel() {
      this.$router.push({ path: '/global-config/list' })
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

</style>
