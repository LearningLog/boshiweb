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
      <el-form-item label="菜单类型：">
        <span>{{ form.typeName }}</span>
      </el-form-item>
    </el-form>
    <div id="btnGroup">
      <el-button type="primary" @click="confirm">确定</el-button>
    </div>
  </div>
</template>

<script>
import { getMenu } from '@/api/systemManage-menuManage'
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters(['menuType'])
  },
  data() {
    return {
      form: {
        menuname: '',
        cmark: '',
        imagename: '',
        menuurl: '',
        type: '',
        typeName: ''
      },
      id: ''
    }
  },
  created() {
    this.id = this.$route.query._id
    this.getMenu()
  },
  methods: {
    getMenu() {
      getMenu({ _id: this.id }).then(response => {
        this.form = response.data.MenuV2
        this.form.typeName = this.getMenuTypeName(response.data.MenuV2.type)
      })
    },
    getMenuTypeName(type) {
      let name = ''
      this.menuType.forEach(item => {
        if (item.id === type) {
          name = item.name
        }
      })
      return name
    },
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
