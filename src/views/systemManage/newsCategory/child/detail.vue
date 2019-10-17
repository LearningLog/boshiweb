<template>
  <div class="form-edit">
    <el-form ref="form" class="form" :model="form" label-width="120px">
      <el-form-item label="类别名称：">
        <span>{{ form.newscategory_name }}</span>
      </el-form-item>
      <el-form-item label="类别描述：">
        <span>{{ form.newscategory_desc }}</span>
      </el-form-item>
      <el-form-item class="website" label="网站：">
        <p class="websiteItem" v-for="item in form.net_list" :key="item._id">{{ item.website_name }}</p>
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
    this.query_param = this.$route.query.id
    this.get_det()
  },
  methods: {
    // 获取详情
    get_det() {
      const that = this
      const param = {}
      param._id = that.query_param
      newscategory_det(param).then(res => {
        const res_dt = res.data.newscategory
        // let net_dt = ''
        that.form.newscategory_name = res_dt.newscategory_name
        that.form.newscategory_desc = res_dt.newscategory_desc
        that.form.net_list = res.data.website || []
      }).catch(error => {
        console.log(error)
      })
    },
    // 返回列表页
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
  .websiteItem {
    margin: 0;
  }
</style>
