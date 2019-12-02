<template>
  <div class="form-edit">
    <el-form ref="form" class="form" :model="form" label-width="100px">
      <el-form-item class="" label="菜单名称：">
        <span>{{ form.menuname }}</span>
      </el-form-item>
      <el-form-item class="" label="菜单标识：">
        <span>{{ form.cmark }}</span>
      </el-form-item>
      <el-form-item class="" label="菜单图标：">
        <i v-if="form.imagename" :class="'iconfont ' + form.imagename" />
      </el-form-item>
      <el-form-item class="" label="菜单路径：">
        <span>{{ form.menuurl }}</span>
      </el-form-item>
      <el-form-item label="菜单模块：">
        <span>{{ form.typeName }}</span>
      </el-form-item>
      <el-form-item label="父级菜单：">
        <span>{{ form.pname }}</span>
      </el-form-item>
    </el-form>
    <div id="btnGroup">
      <el-button type="primary" @click="confirm">确定</el-button>
    </div>
  </div>
</template>

<script>
import { getMenu } from '@/api/system-manage/menuManage'

export default {
  data() {
    return {
      form: { // 表单数据
        menuname: '', // 菜单名称
        cmark: '', // 描述
        imagename: '', // 菜单图标
        menuurl: '', // 菜单路径path
        type: '' // 菜案模块
      },
      menuType: [], // 菜单类型
      id: '' // 查询id
    }
  },
  created() {
    this.menuType = this.$store.state.menuManage.menuType
    this.id = this.$route.query._id
    this.pname = this.$route.query.pname
    this.getMenu()
  },
  methods: {
    // 获取初始数据
    getMenu() {
      getMenu({ _id: this.id }).then(response => {
        this.form = response.data.MenuV2
        this.form.typeName = this.getMenuTypeName(response.data.MenuV2.type)
      })
    },
    // 转换菜单模块
    getMenuTypeName(type) {
      let name = ''
      this.menuType.forEach(item => {
        if (item.id === type) {
          name = item.name
        }
      })
      return name
    },
    // 确定
    confirm() {
      this.$router.push({ path: '/systemManage/menuManage/list' })
    }
  }
}
</script>

<style scoped>
.el-form-item__content .el-input {
  width: calc(100% - 120px);
}
	#btnGroup {
		padding-left: 100px;
	}
</style>
