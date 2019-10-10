<template>
  <div class="tenant-add">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item  label="模块名称">
        <p>{{form.modulename}}</p>
      </el-form-item>
      <el-form-item  label="权限名称">
        <el-input v-model="form.permissionname" placeholder="请输入权限名称" @blur="name_blur_fn" /><span class="tip">权限名称,长度1-64位字符</span>
      </el-form-item>
      <el-form-item  label="权限标识">
        <el-input v-model="form.permissionmark" placeholder="请输入权限标识" @blur="mark_blur_fn" /><span class="tip">权限标识,长度1-64位字符</span>
      </el-form-item>
      <el-form-item  label="权限code">
        <el-input v-model="form.permissioncode" placeholder="请输入权限code" @blur="code_blur_fn" /><span class="tip">权限code,长度1-64位字符</span>
      </el-form-item>
      <el-form-item label="权限描述">
        <el-input v-model="form.permissiondesc" placeholder="请输入权限描述" />
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="onSubmit">确定</el-button>
    <el-button>取消</el-button>
  </div>
</template>

<script>
import { permission_det } from '@/api/systemManage-permissionManage.js'
export default {
  data() {
    return {
      form: {
        modulename: '',
        permissionname: '',
        permissionmark: '',
        permissioncode: '',
        permissiondesc: ''
      }

    }
  },
  created(options) {
  },
  methods: {
    get_det() {

    },
    onSubmit() {

    }

  }

}
</script>

<style lang="scss" scoped>

</style>
