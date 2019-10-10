<template>
  <div class="tenant-add">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="文件代码">
        <el-input v-model="form.code" placeholder="请输入系统代码" /><span class="tip">文件代码,长度2-64位字符</span>
      </el-form-item>
      <el-form-item label="文件名称">
        <el-input v-model="form.name" placeholder="请输入文件名称" /><span class="tip">文件名称,长度2-64位字符</span>
      </el-form-item>
      <el-form-item label="是否启用">
        <el-radio-group v-model="form.enable_status">
          <el-radio label="1" >启用</el-radio>
          <el-radio label="2" >禁用</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div class="btn-box">
      <el-button type="primary" @click="onSubmit">确定</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        code: '',
        name: '',
        enable_status: 1
      }

    }
  },
  created() {
  },
  methods: {

  }

}
</script>

<style lang="scss" scoped>

</style>
