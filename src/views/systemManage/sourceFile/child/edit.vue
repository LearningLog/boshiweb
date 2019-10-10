<template>
  <div class="form-edit">
    <el-form ref="form" class="form" :model="form" label-width="120px">
      <el-form-item label="文件代码">
        <el-input v-model="form.code" placeholder="请输入系统代码" /><span class="tip">文件代码,长度2-64位字符</span>
      </el-form-item>
      <el-form-item label="文件名称">
        <el-input v-model="form.name" placeholder="请输入文件名称" /><span class="tip">文件名称,长度2-64位字符</span>
      </el-form-item>
      <el-form-item label="是否启用">
        <el-radio-group v-model="form.enable_status">
          <el-radio label="1">启用</el-radio>
          <el-radio label="2">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div id="btnGroup">
      <el-button type="primary" @click="onSubmit">确定</el-button>
      <el-button>取消</el-button>
    </div>
  </div>
</template>

<script>
import { strLength } from '@/utils/validate'
import { source_file_edit } from '@/api/systemManage-sourceFile.js'
export default {
  data() {
    return {
      form: {
        code: '',
        name: '',
        enable_status: 1
      },
      query_param: ''
    }
  },
  created(options) {
    this.query_param = this.$route.query.ids
  },
  methods: {
    get_original_info() {
      const that = this
      const param = {}
      param.ids = that.query_param
      // 根据id获取单个数据
      that.form.code = ''
      that.form.name = ''
      that.form.enable_status = ''
    },
    onSubmit() {
      const that = this
      const param = {}
      const code = that.form.code
      const name = that.form.name
      if (!strLength(code, 2, 64)) {
        that.$message.error('文件代码,长度2-64位字符')
        return
      }
      if (!strLength(name, 2, 64)) {
        that.$message.error('文件名称,长度2-64位字符')
        return
      }
      param.code = code
      param.name = name
      param.enable_status = that.form.enable_status
      source_file_edit(param).then(res => {
        that.$message({
          message: res.message,
          type: 'success'
        })
        this.$router.push({ path: '/systemManage/sourceFile' })
      }).catch(error => {
        console.log(error)
      })
    }
  }

}
</script>

<style lang="scss" scoped>
  #btnGroup{
    padding-left: 120px;
  }
</style>
