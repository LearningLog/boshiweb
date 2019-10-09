
<template>
  <div class="tenant-add">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="租户名称">
        <el-input v-model="form.name" placeholder="请输入租户名称" /><span class="tip">请输入租户平台名称(长度2-64位字符)</span>
      </el-form-item>
      <el-form-item label="租户描述">
        <el-input v-model="form.name" placeholder="请输入租户描述" /><span class="tip">请填写租户描述(长度1-100位字符)</span>
      </el-form-item>
      <el-form-item label="最大用户数">
        <el-input v-model="form.name" placeholder="请输入最大用户数" /><span class="tip">租户最多创建用户数(自然数)</span>
      </el-form-item>
      <el-form-item label="租户状态">
        <el-radio-group v-model="form.resource">
          <el-radio label="生效" />
          <el-radio label="失效" />
        </el-radio-group>
      </el-form-item>
      <el-form-item label="开通智能搜索">
        <el-radio-group v-model="form.resource">
          <el-radio label="开启" />
          <el-radio label="关闭" />
        </el-radio-group>
      </el-form-item>
      <el-form-item label="租户管理员">
        <el-input v-model="form.name" placeholder="请输入租户管理员" /><span class="tip">租户登入平台的名称(长度2-64位字母或数字)</span>
      </el-form-item>
      <el-form-item label="管理员">
        <el-input v-model="form.name" placeholder="请输入管理员昵称" /><span class="tip">租户登入平台显示的昵称(长度2-20位字符)</span>
      </el-form-item>
      <el-form-item label="管理员密码">
        <el-input v-model="form.name" placeholder="请输入管理员密码" /><span class="tip">请输入管理员密码(长度6-50位字母和数字组合)</span>
      </el-form-item>
      <el-form-item label="平台Logo">
        <img>
      </el-form-item>
      <el-form-item label="移动端Logo">
        <img>
      </el-form-item>
      <el-form-item label="个性化系统名称">
        <el-input v-model="form.name" placeholder="请输入管理员昵称" />
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="onSubmit">确定</el-button>
    <el-button>取消</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {}
    }
  },
  created() {
  },
  methods: {}

}
</script>

<style lang="scss" scoped>
  .com-logo /deep/ .el-upload-dragger{
    width: 60px;
    height: 60px;
  }
  .com-logo /deep/ [class^="el-icon-"], [class*=" el-icon-"]{
    line-height: 60px;
  }
  .vueCropper {
    text-align: left;
  }
  // 截图
  .cropper-content {
    .cropper {
      width: auto;
      height: 300px;
    }
  }
</style>
