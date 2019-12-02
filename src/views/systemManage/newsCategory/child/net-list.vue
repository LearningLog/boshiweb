<template>
  <div class="list-box">
    <div id="topSearch">
      <el-input v-model="listQuery.website_name" placeholder="请输入网站名称" clearable @keyup.enter.native="topSearch">
        <el-button slot="append" type="primary" icon="el-icon-search" @click="topSearch" />
      </el-input>
      <span id="advancedSearchBtn" slot="reference" @click="popoverVisible = !popoverVisible">高级搜索<i v-show="popoverVisible" class="el-icon-caret-bottom" /><i v-show="!popoverVisible" class="el-icon-caret-top" /></span>
      <transition name="fade-advanced-search">
        <el-row v-show="popoverVisible">
          <el-card id="advancedSearchArea" shadow="never">
            <el-form ref="form" :model="listQuery" label-width="100px">
              <el-form-item label="创建时间">
                <el-date-picker
                  v-model="listQuery.time_range"
                  type="daterange"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  clearable
                />
              </el-form-item>
            </el-form>
            <div id="searchPopoverBtn">
              <el-button type="primary" @click="topSearch">搜索</el-button>
              <el-button type="primary" plain @click="reset">重置</el-button>
            </div>
          </el-card>
        </el-row>
      </transition>
    </div>
    <div id="topBtn">
      <el-button type="primary" @click="show_add"><i class="iconfont iconzengjia" />新增</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="类别" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.website_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述" min-width="150" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.website_desc }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" min-width="140" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.createtime }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="操作" width="160" align="center" fixed="right" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button size="mini" @click="show_edit_fn(scope.row)"><i class="iconfont iconxiugai" />修改</el-button>
          <el-button size="mini" @click="delet_fn(scope.row)"><i class="iconfont iconshanchu" />删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="get_list" />
    <!--新增网站弹窗-->
    <el-dialog
      v-el-drag-dialog
      title="新增网站"
      :visible.sync="net_add_flag"
      width="50%"
    >
      <div class="form-edit">
        <el-form ref="net_add_form" class="form" :model="net_add_form" :rules="rules" :status-icon="true" label-width="120px">
          <el-form-item class="required" label="网站名称" prop="website_name">
            <el-input v-model="net_add_form.website_name" placeholder="请输入网站名称" clearable />
          </el-form-item>
          <el-form-item label="网站描述" prop="website_desc">
            <el-input v-model="net_add_form.website_desc" type="textarea" :rows="3" placeholder="请输入网站描述" clearable />
          </el-form-item>
        </el-form>
        <!--<div id="btnGroup">-->
        <!--<el-button type="primary" @click="save('net_add_form')">提交</el-button>-->
        <!--<el-button type="primary" plain @click="cancel('net_add_form')">取消</el-button>-->
        <!--</div>-->
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="save_add('net_add_form')">提交</el-button>
        <el-button type="primary" plain @click="cancel_add('net_add_form')">取消</el-button>
      </span>
    </el-dialog>
    <!--修改网站弹窗-->
    <el-dialog
      v-el-drag-dialog
      title="修改网站"
      :visible.sync="net_edit_flag"
      width="50%"
    >
      <div class="form-edit">
        <el-form ref="net_edit_form" class="form" :model="net_edit_form" :rules="rules" :status-icon="true" label-width="120px">
          <el-form-item class="required" label="网站名称" prop="website_name">
            <el-input v-model="net_edit_form.website_name" placeholder="请输入网站名称" clearable />
          </el-form-item>
          <el-form-item label="网站描述" prop="website_desc">
            <el-input v-model="net_edit_form.website_desc" type="textarea" :rows="3" placeholder="请输入网站描述" clearable />
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="save_edit('net_edit_form')">保存</el-button>
        <el-button type="primary" plain @click="cancel_edit()">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { net_list, net_delet, net_add, net_edit } from '@/api/system-manage/newsCategorry.js'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui

export default {
  components: { Pagination },
  directives: { elDragDialog },
  data() {
    return {
      listQuery: {
        website_name: '',
        time_range: null,
        currentPage: 1,
        pageSize: 10
      },
      list: null,
      listLoading: false,
      total: 0,
      page_count: 0,
      popoverVisible: false,
      net_add_flag: false,
      net_edit_flag: false,
      net_edit_id: '',
      net_add_form: {
        website_name: '',
        website_desc: ''
      },
      net_edit_form: {
        website_name: '',
        website_desc: ''
      },
      rules: {
        website_name: [
          { required: true, message: '请输入网站名称（长度在 2 到 20个字符）', trigger: 'blur' },
          { required: true, message: '请输入网站名称（长度在 2 到 20 个字符）', trigger: 'change' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'change' }
        ]
      },
      query_param: ''
    }
  },
  created() {
    this.query_param = this.$route.query.id
    this.get_list()
  },
  methods: {
    topSearch() {
      this.get_list()
    },
    reset() {
      this.listQuery.website_name = ''
      this.listQuery.time_range = null
    },
    // 列表
    get_list() {
      const that = this
      const param = {}
      let stime = ''
      let edtime = ''
      if (that.listQuery.time_range && that.listQuery.time_range[0]) {
        stime = that.listQuery.time_range[0]
      }
      if (that.listQuery.time_range && that.listQuery.time_range[1]) {
        edtime = that.listQuery.time_range[1]
      }
      param.webcategoryid = that.query_param
      param.website_name = that.listQuery.website_name ? that.listQuery.website_name : ''
      param.startTime = stime
      param.endTime = edtime
      param.currentPage = that.listQuery.currentPage ? that.listQuery.currentPage : 1
      param.pageSize = that.listQuery.pageSize ? that.listQuery.pageSize : 10
      net_list(param).then(res => {
        that.list = res.data.page.list
        that.total = res.data.page.totalCount
        that.page_count = res.data.page.pageCount
      }).catch(error => {
        console.log(error)
      })
    },
    // 删除
    delet_fn(row) {
      this.$confirm('确定要删除【' + row.website_name + '】吗？', '删除网站', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        net_delet({ _id: row._id }).then(response => {
          this.$message.success(response.message)
          if ((this.list.length - 1) === 0) { // 如果当前页数据已删完，则去往上一页
            this.listQuery.currentPage -= 1
          }
          this.get_list()
        })
      }).catch(() => {})
    },
    // 网站编辑弹窗
    show_edit_fn(row) {
      this.net_edit_flag = true
      this.net_edit_id = row._id
      this.net_edit_form.website_name = row.website_name
      this.net_edit_form.website_desc = row.website_desc
    },
    // 网站添加弹窗
    show_add(row) {
      this.net_add_flag = true
    },
    save_add(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const param = {}
          param.webcategoryid = this.query_param
          param.website_name = this.net_add_form.website_name
          param.website_desc = this.net_add_form.website_desc
          this.listLoading = true
          net_add(param).then(response => {
            this.listLoading = false
            this.$message.success('添加成功！')
            this.net_add_flag = false
            this.get_list()
            this.net_add_form.website_desc = ''
            this.net_add_form.website_name = ''
          })
        }
      })
    },
    // 取消添加
    cancel_add(formName) {
      this.$refs[formName].resetFields()
      this.net_add_flag = false
    },
    // 保存编辑
    save_edit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const param = {}
          param._id = this.net_edit_id
          param.webcategoryid = this.query_param
          param.website_name = this.net_edit_form.website_name
          param.website_desc = this.net_edit_form.website_desc
          net_edit(param).then(response => {
            this.$message.success('修改成功！')
            this.net_edit_flag = false
            this.get_list()
          })
        }
      })
    },
    // 取消编辑
    cancel_edit() {
      this.net_edit_flag = false
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
