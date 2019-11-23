<template>
  <div class="tenant-list-box">
    <div class="obj-box">
      <div class="obj-name">
        <p><span>课程名称：</span><span>{{ listQuery.cname }}</span></p>
        <p><span>总时长：</span><span>{{ generalData.video_time }}分钟</span></p>
      </div>
      <div class="star-box">
        <div class="star-box1">
          <span>整体评价</span>
          <el-rate
            v-model="generalData.general_level"
            disabled
            show-score
            text-color="#ff9900"
            score-template="{value}"
          />
        </div>
        <div class="star-box2">
          <div class="star-box2-1">
            <span>课程内容</span>
            <el-rate
              v-model="generalData.content_level"
              disabled
              show-score
              text-color="#ff9900"
              score-template="{value}"
            />
          </div>
          <div class="star-box2-2">
            <span>上课体验</span>
            <el-rate
              v-model="generalData.experience_level"
              disabled
              show-score
              text-color="#ff9900"
              score-template="{value}"
            />
          </div>
        </div>
        <div />
      </div>
    </div>
    <div class="evaluate-list">
      <el-table
        :data="list"
        style="width: 100%"
      >
        <el-table-column align="center" label="名称" min-width="150" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-avatar class="user-avatar" :src="avatar || avatar1" @error="avatarErrorHandler">
              <img :src="avatar1">
            </el-avatar>
            <el-link type="primary">{{ scope.row.nick_name }}</el-link>
          </template>
        </el-table-column>
        <el-table-column align="center" label="评价" min-width="400" show-overflow-tooltip>
          <template slot-scope="scope">
            <div>
              <el-link type="primary">{{ scope.row.appraise_text }}</el-link>
            </div>

            <div>
              <el-link type="primary">观看时间 : {{ scope.row.view_time }}分钟</el-link>
              <el-button size="mini">标签1</el-button>
              <el-button size="mini">标签2</el-button>
            </div>

          </template>
        </el-table-column>
        <el-table-column align="center" label="星星" min-width="200" show-overflow-tooltip>
          <template slot-scope="scope">
            <div class="star-box1">
              <el-rate
                v-if="scope.row.general_level"
                v-model="scope.row.general_level"
                disabled
                show-score
                text-color="#ff9900"
              />
              <el-button size="mini" @click="del(scope.row)"><i class="iconfont iconshanchu" />删除</el-button>
            </div>

            <el-link value-format="yyyy-MM-dd" type="primary">{{ scope.row.c_timestamp }}</el-link>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="getLablesList" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import avatar1 from '@/assets/images/avatar.png'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { parseTime } from '@/utils/index'
import { label_evaluate } from '@/api/onlineclass-label-manage'
export default {
  name: 'Evaluate',
  components: { Pagination },
  data() {
    return {
      avatar1,
      total: 0, // 总条数
      listQuery: {
        cname: '', // 课程名称
        selectCompanyId: '',
        currentPage: 1, // 当前页
        pageSize: 1, //
        type: ''
      },
      generalData: {}, // 总体评价和时长
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
    this.listQuery.cname = this.$route.query.cname
    this.getLablesList()
  },
  methods: {
    // 获取标签list
    getLablesList() {
      label_evaluate({ lesson_id: this.listQuery.selectCompanyId, lesson_type: this.listQuery.type }).then(res => {
        console.log(res)
        this.generalData = res.data.generalData
        this.listQuery.currentPage = res.data.appraiseList.currentPage
        this.listQuery.pageSize = res.data.appraiseList.pageSize
        this.list = res.data.appraiseList.list
        this.total = res.data.appraiseList.totalCount
        for (let i = 0; i < this.list.length; i++) {
          this.list[i].c_timestamp = parseTime(this.list[i].c_timestamp)
          this.list[i].view_time = Math.ceil(this.list[i].view_time / 1000 / 60)
        }
        this.generalData.video_time = Math.ceil(res.data.generalData.video_time / 1000 / 60)
      })
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
	.obj-name{
		display: flex;
	}
	.obj-name>p{
		margin-right:100px;
	}
	.star-box{
		display: flex;
	}
	.star-box>div{
		height: 60px;
		font-size: 18px;
		margin-right: 50px;
	}
	.star-box1{
		line-height: 60px;
		align-items: center;
		display: flex;
		font-size:18px;
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
	.star-box1{
		display: flex;
		justify-content: space-around;
	}
</style>
