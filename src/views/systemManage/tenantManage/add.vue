<template>
  <div class="app-containercla">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="租户名称">
        <el-input v-model="form.name" placeholder="请输入租户名称"/>
      </el-form-item>
      <el-form-item label="租户描述">
        <el-input v-model="form.name" placeholder="请输入租户描述"/>
      </el-form-item>
      <el-form-item label="最大用户数">
        <el-input v-model="form.name" placeholder="请输入最大用户数"/>
      </el-form-item>
      <el-form-item label="租户状态">
        <el-radio-group v-model="form.resource">
          <el-radio label="生效"></el-radio>
          <el-radio label="失效"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="开通智能搜索">
        <el-radio-group v-model="form.resource">
          <el-radio label="开启"></el-radio>
          <el-radio label="关闭"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="租户管理员">
        <el-input v-model="form.name" placeholder="请输入租户管理员"/>
      </el-form-item>
      <el-form-item label="管理员">
        <el-input v-model="form.name" placeholder="请输入管理员昵称"/>
      </el-form-item>
      <el-form-item label="管理员密码">
        <el-input v-model="form.name" placeholder="请输入管理员密码"/>
      </el-form-item>
      <el-form-item label="平台Logo">
        <el-upload
          class="avatar-uploader"
          action=""
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="移动端Logo">
        <el-upload
          class="avatar-uploader"
          action=""
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="个性化系统名称">
        <el-input v-model="form.name" placeholder="请输入管理员昵称"/>
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
      model: {}
    }
  },
  created() {
  },
  methods: {

  }

}
</script>

<style lang="scss" scoped>
  .app-containercla{
    padding-left: 15px;
    padding-top: 15px;
    .page-piliang{
      padding-top: 15px;
    }
  }
</style>
