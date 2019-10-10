<template>
  <div class="tenant-add">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item class="required" label="文件代码">
        <el-input v-model="form.code" placeholder="请输入系统代码" @blur="code_blur_fn" /><span class="tip">文件代码,长度2-64位字符</span>
      </el-form-item>
      <el-form-item class="required" label="文件名称">
        <el-input v-model="form.name" placeholder="请输入文件名称" @blur="name_blur_fn" /><span class="tip">文件名称,长度2-64位字符</span>
      </el-form-item>
      <el-form-item class="required" label="是否启用">
        <el-radio-group v-model="form.enable_status">
          <el-radio label="1" >启用</el-radio>
          <el-radio label="2" >禁用</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div class="btn-box">
      <el-button type="primary" @click="onSubmit">确定</el-button>
      <el-button>取消</el-button>
    </div>
  </div>
</template>

<script>
import { strLength } from '@/utils/validate'
import { source_file_add } from '@/api/systemManage-sourceFile.js'
export default {
  data() {
    return {
      form: {
        code: '',
        name: '',
        enable_status: '1'
      }

    }
  },
  created() {
  },
  methods: {
    code_blur_fn() {
      const code = this.form.code
      if (!strLength(code, 2, 64)) {
        this.$message.error('文件代码,长度2-64位字符')
        return
      }
    },
    name_blur_fn() {
      const name = this.form.name
      if (!strLength(name, 2, 64)) {
        this.$message.error('文件代码,长度2-64位字符')
        return
      }
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
      param.name = that.form.name
      param.enable_status = that.form.enable_status
      source_file_add(param).then(res => {
        that.$message({
          message: res.message,
          type: 'success'
        })
      }).catch(error => {
        console.log(error)
      })
    }
  }

}
</script>

<style lang="scss" scoped>

</style>
