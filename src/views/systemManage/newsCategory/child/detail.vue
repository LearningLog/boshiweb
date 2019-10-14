<template>
  <div class="form-edit">
    <el-form ref="form" class="form" :model="form" label-width="120px">
      <el-form-item label="类别名称：">
        <span>{{ form.newscategory_name }}</span>
      </el-form-item>
      <el-form-item label="类别描述：">
        <span>{{ form.newscategory_desc }}</span>
      </el-form-item>
      <el-form-item label="网站：">
        <span>{{ form.net_list }}</span>
      </el-form-item>
    </el-form>
    <div id="btnGroup">
      <el-button type="primary" @click="onSubmit">确定</el-button>
    </div>
  </div>
</template>

<script>
import { newscategory_det } from '@/api/systemManage-newsCategorry.js'
export default {
  data() {
    return {
      form: {
        newscategory_name: '',
        newscategory_desc: '',
        net_list: ''
      },
      query_param: ''
    }
  },
  created() {
    this.query_param = this.$route.query.ids
    this.get_list()
  },
  methods: {
    // 列表
    get_list() {
      const that = this
      const param = {}
      param._id = that.query_param
      newscategory_det(param).then(res => {
        that.form.newscategory_name = res.data.permission.newscategory_name ? res.data.permission.newscategory_name : '--'
        that.form.newscategory_desc = res.data.permission.newscategory_desc ? res.data.permission.newscategory_desc : '--'
        that.form.net_list = res.data.permission.net_list ? res.data.permission.net_list : '--'
      }).catch(error => {
        console.log(error)
      })
    },
    onSubmit() {
      this.$router.push({ path: '/systemManage/newsCategory' })
    }

  }
}
</script>

<style lang="scss" scoped>
  #btnGroup{
    padding-left: 120px;
  }
</style>
