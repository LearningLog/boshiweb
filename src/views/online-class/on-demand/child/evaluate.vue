<template>
  <div class="tenant-list-box">
    <el-form
      class="form"
      :model="form"
      label-width="120px"
    >
      <el-row>
        <el-col :span="6">
          <el-form-item label="课程名称：">
            <span>{{ form.cname }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6" :offset="2">
          <el-form-item label="整体评价：">
            <el-rate
              v-model="form.generalData.general_level"
              disabled
              show-score
              text-color="#ff9900"
              score-template="{value}"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="总时长：">
            <span>{{ form.generalData.video_time }}分钟</span>
          </el-form-item>
        </el-col>
        <el-col :span="6" :offset="2">
          <el-form-item label="课程内容：">
            <el-rate
              v-model="form.generalData.content_level"
              disabled
              show-score
              text-color="#ff9900"
              score-template="{value}"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="evaluate-list">
      <div class="listbox">
        <div v-for="item in list" :key="item._id" class="listone">
          <el-row style="cursor:default">
            <el-col :span="4">
              <el-avatar class="user-avatar" :src="item.headPic || avatar1" @error="avatarErrorHandler">
                <img :src="avatar1">
              </el-avatar>
            </el-col>
            <el-col :span="9" :offset="1">
              <el-link type="primary" class="saytalk">{{ item.appraise_text }}</el-link>
            </el-col>
            <el-col :span="4" :offset="2" class="star-box">
              <el-rate
                v-if="item.general_level"
                v-model="item.general_level"
                disabled
                show-score
                text-color="#ff9900"
              />
            </el-col>
            <el-col :span="2">
              <el-button size="mini" @click="del(item)"><i class="iconfont iconshanchu" />删除</el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4" class="usersname">
              <el-link type="primary">{{ item.nick_name }}</el-link>
            </el-col>
            <el-col :span="9" :offset="1">
              <el-link type="primary">观看时间 : {{ item.view_time }}分钟</el-link>
              <el-tag v-for="items in item.label_name" :key="items._id" class="tip_lable" type="success">{{ items.label_name }}</el-tag>
            </el-col>
            <el-col :span="8" :offset="2">
              <el-link value-format="yyyy-MM-dd" type="primary">{{ item.c_timestamp }}</el-link>
            </el-col>
          </el-row>
        </div>
      </div>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="getLablesList" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import avatar1 from '@/assets/images/avatar.png'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { parseTime } from '@/utils/index'
import { label_evaluate, delete_evaluate } from '@/api/online-class/label-manage'
export default {
  name: 'Evaluate',
  components: { Pagination },
  data() {
    return {
      avatar1,
      total: 0, // 总条数
      form: {
        cname: '', // 课程名称
        generalData: {} // 总体评价和时长
      },
      listQuery: {
        selectCompanyId: '',
        currentPage: 1, // 当前页
        pageSize: 1, //
        type: ''
      },

      list: []// 评价列表
    }
  },
  computed: {
    ...mapGetters([
      'avatar'
    ])
  },
  created() {
    this.listQuery.selectCompanyId = this.$route.query._id
    this.listQuery.type = this.$route.query.type
    this.form.cname = this.$route.query.cname
    this.getLablesList()
  },
  methods: {
    // 获取标签list
    getLablesList() {
      label_evaluate({ lesson_id: this.listQuery.selectCompanyId, lesson_type: this.listQuery.type }).then(res => {
        // console.log(res)
        this.form.generalData = res.data.generalData
        this.listQuery.currentPage = res.data.appraiseList.currentPage
        this.listQuery.pageSize = res.data.appraiseList.pageSize
        this.list = res.data.appraiseList.list
        this.total = res.data.appraiseList.totalCount
        if (res.data.appraiseList.list) {
          for (let i = 0; i < this.list.length; i++) {
            this.list[i].c_timestamp = parseTime(this.list[i].c_timestamp)
            this.list[i].view_time = Math.ceil(this.list[i].view_time / 1000 / 60)
          }
        }
        this.form.generalData.video_time = Math.ceil(res.data.generalData.video_time / 1000 / 60)
      })
    },
    // 删除评论
    del(row) {
      const ids = []
      ids.push(row._id)
      this.$confirm('确定要删除【' + row.nick_name + '】吗？', '删除课程', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delete_evaluate({ ids: ids, lesson_id: row.lesson_id, lesson_type: row.lesson_type }).then(response => {
          this.$message.success('删除成功！')
          if ((this.list.length - 1) === 0) { // 如果当前页数据已删完，则去往上一页
            this.listQuery.currentPage -= 1
          }
          this.getLablesList()
        })
      }).catch(() => {})
    },
    // 转换上线时间
    parseTime(time) {
      return parseTime(time)
    },
    // 头像加载失败的回调
    avatarErrorHandler() {
      return true
    }
  }
}
</script>

<style scoped>
  .el-rate {
    height: 20px;
    line-height: 2;
  }
  .obj-name>p{
    margin-right:100px;
  }

  .star-box .el-rate{
    line-height: 3;
  }
  .star-box2>div{
    height:30px;
    display: flex;
    font-size: 16px;
  }
  .user-avatar{
    width:60px;
    height:60px;
    border-radius: 30px;
    display: block;
    margin:0 auto;
  }
  .listone{
    border-bottom:1px solid #e8e8e8;
    line-height: 60px;
    margin-top:20px;
  }
  .usersname{
    text-align: center;
  }
  .el-link.el-link--primary:after{
    display: none;
  }
  .el-link.el-link--primary {
    color: #666;
  }
  .saytalk{
    line-height: 20px;
  }
  a, a:focus, a:hover {
    cursor: default;
    color: inherit;
    text-decoration: none;
  }
  .tip_lable{
    margin-right: 5px;
  }
</style>
