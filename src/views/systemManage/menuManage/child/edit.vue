<template>
  <div>
    <el-form ref="form" class="form" :model="form" label-width="80px">
      <el-form-item class="required" label="菜单名称">
        <el-input v-model="form.name" placeholder="请输入菜单名称" /><span class="tip">长度1-12位字符</span>
      </el-form-item>
      <el-form-item class="required" label="菜单标识">
        <el-input v-model="form.name" placeholder="请输入菜单标识" /><span class="tip">长度1-64位字符</span>
      </el-form-item>
      <el-form-item class="" label="菜单名称">
        <el-input v-model="form.name" placeholder="请输入菜单图标" /><span class="tip">长度1-50位字符</span>
      </el-form-item>
      <el-form-item class="required" label="菜单名称">
        <el-input v-model="form.name" placeholder="请输入菜单路径" /><span class="tip">长度1-120位字符</span>
      </el-form-item>
      <el-form-item label="菜单类型">
        <el-select v-model="form.type" placeholder="请选择菜单类型">
          <el-option v-for="item in type" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
        <span class="tip">系统后台归属的菜单，不会出现在租户菜单列表中</span>
      </el-form-item>
    </el-form>
    <div id="btnGroup">
      <el-button type="primary" @click="save">确认</el-button>
      <el-button type="primary" plain>取消</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {},
      type: []
    }
  },
  methods: {
    save() {
      console.log('save')
    }
  }
}
</script>

<style scoped>
	.form {
		width: 620px;
	}
	.el-form-item__content .el-input {
		width: calc(100% - 120px);
	}
	#btnGroup {
		width: 620px;
		text-align: center;
	}
</style>
