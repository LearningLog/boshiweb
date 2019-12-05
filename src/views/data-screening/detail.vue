<template>
  <div class="app-dataScreening-container">
    <!--时间搜索-->
    <div class="app-dataScreening-item app-dataScreening-timeWrapper">
      <div class="app-dataScreening-timeTags">
        <!--<span class="app-dataScreening-timeTags-item">今日</span><span class="app-dataScreening-timeTags-item">近一周</span><span class="app-dataScreening-timeTags-item">近一个月</span><span class="app-dataScreening-timeTags-item">近三个月</span><span class="app-dataScreening-timeTags-item">近半年</span>-->
        <span v-for="(item,index) in filterData.timeTab" :key="index" class="app-dataScreening-timeTags-item" :class="{'active':currentSort==index}" @click="active(index)">{{ item.name }}</span>
        <el-date-picker
          v-model="dateValue"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          @change="timeChange(dateValue)"
        />
      </div>
    </div>
    <!--员工数据面板-->
    <div class="app-dataScreening-item app-dataScreening-staffWrapper clearfix">
      <el-tooltip class="item" effect="dark" content="点击查看详情" placement="top">
        <div class="app-dataScreening-staffItem" @click="studyDetail">
          <div class="app-dataScreening-staffItem-decs">
            <span>学习员工数</span>
          </div>
          <div class="app-dataScreening-staffItem-info">
            <div class="app-dataScreening-staffItem-info-detail">
              <div class="app-dataScreening-staffItem-info-number">
                <b>{{ staffData.trainUserCount }}</b>人
              </div>
              <p>
                <span class="time-range">{{ startTime }} - {{ endTime }}</span>
                <span class="blank">|</span>
                <span class="time-desc">当前是{{ staffData.desc }}的数据</span>
              </p>
            </div>
            <div class="app-dataScreening-staffItem-info-img">
              <img src="@/assets/images/data-screening/learning_staff.jpg" alt="">
            </div>
          </div>
        </div>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="点击查看详情" placement="top">
        <div class="app-dataScreening-staffItem" @click="testDetail">
          <div class="app-dataScreening-staffItem-decs">
            <span>考试员工数</span>
          </div>
          <div class="app-dataScreening-staffItem-info">
            <div class="app-dataScreening-staffItem-info-detail">
              <div class="app-dataScreening-staffItem-info-number">
                <b>{{ staffData.examUserCount }}</b>人
              </div>
              <p>
                <span class="time-range">{{ startTime }} - {{ endTime }}</span>
                <span class="blank">|</span>
                <span class="time-desc">当前是{{ staffData.desc }}的数据</span>
              </p>
            </div>
            <div class="app-dataScreening-staffItem-info-img">
              <img src="@/assets/images/data-screening/examination_staff.jpg" alt="">
            </div>
          </div>
        </div>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="点击查看详情" placement="top">
        <!--  （产品需求）考试员工数和考试合格率是同一个页面-->
        <div class="app-dataScreening-staffItem" @click="testDetail">
          <div class="app-dataScreening-staffItem-decs">
            <span>考试合格率</span>
          </div>
          <div class="app-dataScreening-staffItem-info">
            <div class="app-dataScreening-staffItem-info-detail">
              <div class="app-dataScreening-staffItem-info-number">
                <b>{{ staffData.examQualified }}</b>%
              </div>
              <p>
                <span class="time-range">{{ startTime }} - {{ endTime }}</span>
                <span class="blank">|</span>
                <span class="time-desc">当前是{{ staffData.desc }}的数据</span>
              </p>
            </div>
            <div class="app-dataScreening-staffItem-info-img">
              <img src="@/assets/images/data-screening/examination_pass.jpg" alt="">
            </div>
          </div>
        </div>
      </el-tooltip>
    </div>
    <!--排行榜面板-->
    <div class="app-dataScreening-item app-dataScreening-listWrapper">
      <!--头部-->
      <div class="app-dataScreening-head">
        <span class="app-dataScreening-head-title">排行榜</span>
        <el-select v-model="groupValue" placeholder="请选择" @change="listSelectChange(groupValue)">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-button type="success" class="btn-search app-dataScreening-export" @click="listExport"><i class="iconfont iconpilianngdaochu" />全部导出</el-button>
      </div>
      <!--标签-->
      <div class="app-dataScreening-listTags">
        <div class="app-dataScreening-listTagsBox clearfix">
          <div class="fl app-dataScreening-listTags-item" :class="{'listTagsActive':listSort == 0}" @click="listActive(0)">学习排行榜</div>
          <div class="fr app-dataScreening-listTags-item" :class="{'listTagsActive':listSort == 1}" @click="listActive(1)">课程发布榜</div>
        </div>
      </div>
      <!--内容-->
      <div class="app-dataScreening-listTable">
        <!--学习榜列表-->
        <div v-show="listSort == 0">
          <el-table
            :default-sort="{prop: 'studyTimeTotal', order: 'descending'}"
            :data="tableData"
            style="width: 100%"
            height="370"
          >
            <el-table-column
              label="序号"
              type="index"
              width="180"
            />
            <el-table-column
              prop="name"
              label="姓名"
            />
            <el-table-column
              prop="group"
              label="小组"
            />
            <el-table-column
              sortable
              prop="studyTimeTotal"
              label="学习总时长(分钟)"
              width="250"
            >
              <template slot-scope="scope">
                <div style="width:70%;display: inline-block">
                  <el-progress :text-inside="true" :stroke-width="10" :percentage="scope.row.progress1" :show-text="false" :color="customColor1" />
                </div>
                <div style="width:20%;display: inline-block;line-height: 26px;text-align: left; vertical-align:baseline;">{{ scope.row.studyTimeTotal }}</div>
              </template>
            </el-table-column>
            <el-table-column
              sortable
              prop="studyTimePercentDay"
              label="平均每天学习时长(分钟)"
              width="250"
            >
              <template slot-scope="scope">
                <div style="width:70%;display: inline-block">
                  <el-progress :text-inside="true" :stroke-width="10" :percentage="scope.row.progress2" :show-text="false" :color="customColor2" />
                </div>
                <div style="width:20%;display: inline-block;line-height: 26px;text-align: left;vertical-align: baseline;">{{ scope.row.studyTimePercentDay }}</div>
              </template>
            </el-table-column>
            <el-table-column
              sortable
              prop="studyTimePercentNum"
              label="平均每次学习时长(分钟)"
              width="250"
            >
              <template slot-scope="scope">
                <div style="width:70%;display: inline-block">
                  <el-progress :text-inside="true" :stroke-width="10" :percentage="scope.row.progress3" :show-text="false" :color="customColor3" />
                </div>
                <div style="width:20%;display: inline-block;line-height: 26px;text-align: left;vertical-align: baseline;">{{ scope.row.studyTimePercentNum }}</div>
              </template>
            </el-table-column>

          </el-table>
        </div>
        <!--课程发布榜列表-->
        <div v-show="listSort == 1">
          <el-table
            :default-sort="{prop: 'publishTrainCount', order: 'descending'}"
            :data="courseTableData"
            style="width: 100%"
            height="370"
          >
            <el-table-column
              label="序号"
              type="index"
              width="180"
            />
            <el-table-column
              prop="group"
              label="小组"
            />
            <el-table-column
              sortable
              prop="publishTrainCount"
              label="发布课程数"
            >
              <template slot-scope="scope">
                <div style="width:70%;display: inline-block">
                  <el-progress :text-inside="true" :stroke-width="10" :percentage="scope.row.progress1" :show-text="false" />
                </div>
                <div style="width:20%;display: inline-block;line-height: 26px;text-align: left;vertical-align: baseline;">{{ scope.row.publishTrainCount }}</div>
              </template>
            </el-table-column>
            <el-table-column
              sortable
              prop="trainUserPercent"
              label="学习人数占比"
              width="250"
            >
              <template slot-scope="scope">
                <div style="width:70%;display: inline-block">
                  <el-progress :text-inside="true" :stroke-width="10" :percentage="scope.row.trainUserPercent" :show-text="false" />
                </div>
                <div style="width:20%;display: inline-block;line-height: 26px;text-align: left;vertical-align: baseline;">{{ scope.row.trainUserPercent }}%</div>
              </template>
            </el-table-column>
            <el-table-column
              sortable
              prop="userAverageTrainViewCount"
              label="平均学习人次"
              width="250"
            >
              <template slot-scope="scope">
                <div style="width:70%;display: inline-block">
                  <el-progress :text-inside="true" :stroke-width="10" :percentage="scope.row.progress2" :show-text="false" />
                </div>
                <div style="width:20%;display: inline-block;line-height: 26px;text-align: left;vertical-align: baseline;">{{ scope.row.userAverageTrainViewCount }}</div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <!--数据统计面板-->
    <div class="app-dataScreening-item app-dataScreening-statisticWrapper">
      <!--头部-->
      <div class="app-dataScreening-head app-dataScreening-statistic-head">
        <span class="app-dataScreening-head-title">统计分析</span>
        <el-button type="success" class="btn-search app-dataScreening-export" @click="statisticExport"><i class="iconfont iconpilianngdaochu" />全部导出</el-button>
      </div>
      <!--内容-->
      <div class="app-dataScreening-statistic-body">
        <!--员工画像-->
        <div class="app-dataScreening-employeePortraitWrapper clearfix">
          <div class="app-dataScreening-head app-dataScreening-employeePortraitHead">
            <span class="app-dataScreening-head-title">员工画像概览</span>
            <el-select v-model="groupValue2" placeholder="请选择" @change="listSelectChange2(groupValue2)">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <div class="app-dataScreening-dataDesc">
              <span class="time-range">{{ startTime }} - {{ endTime }}</span>
              <span class="blank">|</span>
              <span class="time-desc">当前是{{ staffData.desc }}的数据</span>
            </div>

            <el-button type="success" class="btn-search app-dataScreening-export" @click="dialog=true"><i class="" />生成对比图</el-button>
          </div>
          <div class="fl w55 employeePortrait-eacharts">
            <!--员工画像概览-->
            <div id="employeePortraitData" style="width:100%;height:100%;position: relative" />
          </div>
          <div class="fr w45 employeePortrait-eacharts">
            <div id="compareData" style="width:100%;height:100%;position: relative" />
          </div>
          <!--对比弹框-->
          <div v-show="dialog" class="app-dataScreening-compare">
            <div class="app-dataScreening-compare-title">选择对象</div>
            <div class="clearfix">
              <div class="fl app-dataScreening-compare-select">
                <div class="app-dataScreening-compare-listHead">选择小组</div>
                <div class="app-dataScreening-compare-listBody">
                  <el-form ref="form" :model="form">
                    <el-checkbox-group v-model="form.type" :max="max">
                      <!--<el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>-->
                      <!--<el-checkbox label="地推活动" name="type"></el-checkbox>-->
                      <!--<el-checkbox label="线下主题活动" name="type"></el-checkbox>-->
                      <!--<el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>-->
                      <el-checkbox v-for="(item,index) in optionsGroupTableData" :key="index" class="app-dataScreening-compare-listItem" :label="item" name="type" @change="checkedGroupList">{{ item.groupName }}</el-checkbox>
                    </el-checkbox-group>
                  </el-form>

                </div>
              </div>
              <div class="fr app-dataScreening-compare-select">
                <div class="app-dataScreening-compare-listHead">选择人员</div>
                <div class="app-dataScreening-compare-listBody">
                  <el-form ref="form" :model="form">
                    <el-checkbox-group v-model="form.type" :max="max">
                      <el-checkbox v-for="(item,index) in optionsPersonTableData" :key="index" class="app-dataScreening-compare-listItem" :label="item" name="type" @change="checkedGroupList">{{ item.userName }}</el-checkbox>
                    </el-checkbox-group>
                  </el-form>
                </div>
              </div>
            </div>
            <div class="app-dataScreening-compare-btnGroups">
              <span class="app-dataScreening-compare-tips">可选择多个小组或多个人员，不超过6个小组或成员</span>
              <el-button class="btn-info btn-close btn" @click="dialog=false">关闭</el-button>
              <el-button class="btn-info btn-search" @click="addCompareChart">生成对比图</el-button>
            </div>
          </div>
        </div>
        <!--员工活跃度-->
        <div class="app-dataScreening-employeeActivityWrapper">
          <div class="app-dataScreening-head app-dataScreening-employeePortraitHead">
            <span class="app-dataScreening-head-title">员工活跃度</span>
            <div class="app-dataScreening-dataDesc">
              <span class="time-range">{{ startTime }} - {{ endTime }}</span>
              <span class="blank">|</span>
              <span class="time-desc">当前是{{ staffData.desc }}的数据</span>
            </div>
          </div>
          <div class="employeePortrait-eacharts" style="width:100%;">
            <div id="employeeActivityData" style="width:100%;height:100%;position: relative" />
          </div>
        </div>

        <div class="app-dataScreening-employeeActivityGroups clearfix">
          <!--考试合格率-->
          <div class="app-dataScreening-employeeActivityGroups-item">
            <div class="app-dataScreening-head app-dataScreening-employeePortraitHead">
              <span class="app-dataScreening-head-title">考试合格率</span>
              <div class="app-dataScreening-dataDesc">
                <span class="time-range">{{ startTime }} - {{ endTime }}</span>
                <span class="blank">|</span>
                <span class="time-desc">当前是{{ staffData.desc }}的数据</span>
              </div>
            </div>
            <div id="employeeActivityExamQualified" class="app-dataScreening-employeeActivityGroups-body" />
          </div>
          <!--学习热度榜-->
          <div class="app-dataScreening-employeeActivityGroups-item">
            <div class="app-dataScreening-head app-dataScreening-employeePortraitHead">
              <span class="app-dataScreening-head-title">学习热度榜</span>
              <div class="app-dataScreening-dataDesc">
                <span class="time-range">{{ startTime }} - {{ endTime }}</span>
                <span class="blank">|</span>
                <span class="time-desc">当前是{{ staffData.desc }}的数据</span>
              </div>
            </div>
            <div id="employeeActivityTrainViewTime" class="app-dataScreening-employeeActivityGroups-body" />
          </div>
          <!--发布课程榜-->
          <div class="app-dataScreening-employeeActivityGroups-item">
            <div class="app-dataScreening-head app-dataScreening-employeePortraitHead">
              <span class="app-dataScreening-head-title">发布课程榜</span>
              <div class="app-dataScreening-dataDesc">
                <span class="time-range">{{ startTime }} - {{ endTime }}</span>
                <span class="blank">|</span>
                <span class="time-desc">当前是{{ staffData.desc }}的数据</span>
              </div>
            </div>
            <div id="employeeActivityPublishTrainCount" class="app-dataScreening-employeeActivityGroups-body" />
          </div>
          <!--参考员工率-->
          <div class="app-dataScreening-employeeActivityGroups-item">
            <div class="app-dataScreening-head app-dataScreening-employeePortraitHead">
              <span class="app-dataScreening-head-title">参考员工率</span>
              <div class="app-dataScreening-dataDesc">
                <span class="time-range">{{ startTime }} - {{ endTime }}</span>
                <span class="blank">|</span>
                <span class="time-desc">当前是{{ staffData.desc }}的数据</span>
              </div>
            </div>
            <div id="employeeActivityExamUserPercent" class="app-dataScreening-employeeActivityGroups-body" />
          </div>
        </div>

      </div>
    </div>
  </div>
</template>
<script>
import { getTrainUserCount, getExamUserCount, getExamQualified, getAllEmployeeGroup, getUserListTrainDataByTime, getGroupListPublishTrainDataByTime, getUserListCompareData, getVisitUserCountGroupByTime, getGroupListExamDataByTime, getGroupListPublishTrainDataByTime2, getToken } from '@/api/data-screening/data-screening'
import echarts from 'echarts' // 引入echarts
export default {
  data() {
    /* 自定义表单校验*/
    // var validateAmount = (rule, value, callback) => {
    // }
    return {
      customColor1: '#20C7B2',
      customColor2: '#FAB446',
      customColor3: '#469BFA',
      // 日期选择器
      dateValue: [],
      startTime: '',
      endTime: '',

      // 时间搜索
      filterData: {
        timeTab: [{
          name: '今日',
          type: 'Today'
        }, {
          name: '近一周',
          type: 'OneWeek'
        }, {
          name: '近一个月',
          type: 'OneMonth'
        }, {
          name: '近三个月',
          type: 'ThreeMonth'
        }, {
          name: '近半年',
          type: 'HalfYear'
        }]
      },
      currentSort: 1,
      // 员工数据面板
      staffData: {
        trainUserCount: 0, // 学习用户数
        examUserCount: 0, // 考试员工数
        examQualified: 0, // 考试合格率
        desc: ''// 数据描述
      },
      // 小组数据下拉框
      options: [{
        value: '',
        label: '全部'
      }],
      // 小组多选表格数据
      optionsGroupTableData: [],
      // 员工多选表格数据
      optionsPersonTableData: [],
      groupValue: '', // 排行榜小组选择
      groupValue2: '', // 员工画像小组选择
      // 学习榜列表数据
      listSort: 0,
      tableData: [],
      studyTimeTotalMax: 0, // 学习总时长最大值
      studyTimePercentDayMax: 0, // 平均每天学习时长最大值
      studyTimePercentNumMax: 0, // 平均每次学习时长最大值
      // 课程发布榜
      courseTableData: [],
      publishTrainCountMax: 0, // 课程发布数最大值
      userAverageTrainViewCountMax: 0, // 平均学习人次最大值

      // 数据统计
      employeePortraitChart: {}, // 员工画像
      porObj: {},
      employeeActivityChart: {}, // 员工活跃度
      actObj: {},
      employeeActivityExamQualifiedChart: {}, // 考试合格率
      employeeActivityExamUserPercentChart: {}, // 参考员工率
      groupListExamObj: {},
      // 生成对比图多选表单
      form: {
        type: [], // 小组
        personType: []// 人员
      },
      max: 6,
      dialog: false

    }
  },
  created() {
    this.setDate(1)// 近一周
    sessionStorage.removeItem('data-screening-time')
    sessionStorage.setItem('data-screening-currentSort', 1)
  },
  mounted() {
    this.initCharts()
  },
  methods: {
    checkedGroupList(value) {},
    // 初始化日期选择器
    // 获取今日日期
    // 设置日期（）
    setDate(index) {
      var tempType = this.filterData.timeTab[index].type
      if (tempType === 'OneWeek') {
        // 近一周
        this.startTime = this.getDate(-6)
        this.endTime = this.getDate(0)
        this.dateValue = [this.startTime, this.endTime]
        this.initData(this.startTime, this.endTime)
        this.staffData.desc = '最近7天'
      } else if (tempType === 'Today') {
        this.startTime = this.getDate(0)
        this.endTime = this.getDate(0)
        this.dateValue = [this.startTime, this.endTime]
        this.initData(this.startTime, this.endTime)
        this.staffData.desc = '最近1天'
      } else if (tempType === 'OneMonth') {
        this.startTime = this.getDate(-29)
        this.endTime = this.getDate(0)
        this.dateValue = [this.startTime, this.endTime]
        this.initData(this.startTime, this.endTime)
        this.staffData.desc = '最近30天'
      } else if (tempType === 'ThreeMonth') {
        this.startTime = this.getDate(-89)
        this.endTime = this.getDate(0)
        this.dateValue = [this.startTime, this.endTime]
        this.initData(this.startTime, this.endTime)
        this.staffData.desc = '最近90天'
      } else if (tempType === 'HalfYear') {
        this.startTime = this.getDate(-179)
        this.endTime = this.getDate(0)
        this.dateValue = [this.startTime, this.endTime]
        this.initData(this.startTime, this.endTime)
        this.staffData.desc = '最近180天'
      }
    },
    // 获取对应的开始日期和结束日期
    getDate(day) {
      var today = new Date()
      var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day
      today.setTime(targetday_milliseconds) // 注意，这行是关键代码
      var tYear = today.getFullYear()
      var tMonth = today.getMonth()
      var tDate = today.getDate()
      tMonth = this.doHandleMonth(tMonth + 1)
      tDate = this.doHandleMonth(tDate)
      return tYear + '-' + tMonth + '-' + tDate
    },
    doHandleMonth(month) {
      var m = month
      if (month.toString().length === 1) {
        m = '0' + month
      }
      return m
    },
    // 初始化数据
    initData(startTime, endTime) {
      this.initTrainUserCountData(startTime, endTime)
      this.initExamUserCountData(startTime, endTime)
      this.initExamQualifiedData(startTime, endTime)
      this.initAllEmployeeGroupData()
      this.initUserListTrainDataByTimeData(null, startTime, endTime)
      this.initGroupListPublishTrainDataByTime(null, startTime, endTime)
      this.initUserListCompareData(null, startTime, endTime)
      this.initVisitUserCountGroupByTime(startTime, endTime)
      this.initGroupListExamDataByTime(startTime, endTime)
      this.initGroupListPublishTrainDataByTime2(startTime, endTime)
      this.initUserListCompare(startTime, endTime)
    },
    // 初始化学习员工数
    initTrainUserCountData(startTime, endTime) {
      getTrainUserCount({ startTime: startTime, endTime: endTime }).then(response => {
        this.staffData.trainUserCount = response.data.trainUserCount
      })
    },
    // 初始化考试员工数
    initExamUserCountData(startTime, endTime) {
      getExamUserCount({ startTime: startTime, endTime: endTime }).then(response => {
        this.staffData.examUserCount = response.data.examUserCount
      })
    },
    // 初始化考试合格率
    initExamQualifiedData(startTime, endTime) {
      getExamQualified({ startTime: startTime, endTime: endTime }).then(response => {
        this.staffData.examQualified = !response.data.examQualified ? 0 : response.data.examQualified
      })
    },
    // 监测日期选择器中的数据更改
    timeChange(value) {
      this.startTime = value[0]
      this.endTime = value[1]
      this.currentSort = -1
      var endTime = new Date(this.endTime).getTime() / 1000 - parseInt(new Date(this.startTime).getTime() / 1000)
      var timeDay = parseInt(endTime / 60 / 60 / 24)// 相差天数
      this.staffData.desc = timeDay + '天'
      sessionStorage.setItem('data-screening-currentSort', -1)
      sessionStorage.setItem('data-screening-time', JSON.stringify(value))
      this.initData(this.startTime, this.endTime)
    },

    resetDateFilter() {
      this.$refs.filterTable.clearFilter('date')
    },
    clearFilter() {
      this.$refs.filterTable.clearFilter()
    },
    formatter(row, column) {
      return row.address
    },
    filterTag(value, row) {
      return row.tag === value
    },
    filterHandler(value, row, column) {
      const property = column['property']
      return row[property] === value
    },

    // 初始化小组列表
    initAllEmployeeGroupData() {
      getAllEmployeeGroup({}).then(response => {
        this.options = [{
          value: '',
          label: '全部'
        }]
        response.data.allEmployeeGroupList.forEach(function(currentValue, index, arr) {
          var tempObj = {}
          var tempTableObj = {}
          tempObj.value = currentValue.inc
          tempObj.label = currentValue.groupName
          tempTableObj.groupName = currentValue.groupName
          tempTableObj.id = currentValue.inc
          tempTableObj.type = 'group'
          this.options.push(tempObj)
          this.optionsGroupTableData.push(tempTableObj)
        }, this)
      })
    },
    // 初始化学习排行榜数据
    initUserListTrainDataByTimeData(groupId, startTime, endTime) {
      var tempGroupId
      if (!groupId) {
        tempGroupId = null
      } else {
        tempGroupId = [groupId]
      }
      getUserListTrainDataByTime({ groupIdList: tempGroupId, startTime: startTime, endTime: endTime }).then(response => {
        this.tableData = []
        this.studyTimeTotalMax = 0
        this.studyTimePercentDayMax = 0
        this.studyTimePercentNumMax = 0
        // 求学习总时长的最大值
        // 平均每天学习总时长的最大值
        // 平均每次学习时长的最大值
        var tempArr = response.data.userList
        this.studyTimeTotalMax = tempArr[0].userData.trainViewTime
        this.studyTimePercentDayMax = tempArr[0].userData.dayAverageTrainViewTime
        this.studyTimePercentNumMax = tempArr[0].userData.averageTrainViewTime
        for (var i = 1; i < tempArr.length - 1; i++) {
          if (tempArr[i].userData.trainViewTime > this.studyTimeTotalMax) {
            this.studyTimeTotalMax = tempArr[i].userData.trainViewTime
          }
          if (tempArr[i].userData.dayAverageTrainViewTime > this.studyTimePercentDayMax) {
            this.studyTimePercentDayMax = tempArr[i].userData.dayAverageTrainViewTime
          }
          if (tempArr[i].userData.averageTrainViewTime > this.studyTimePercentNumMax) {
            this.studyTimePercentNumMax = tempArr[i].userData.averageTrainViewTime
          }
        }
        tempArr.forEach(function(currentValue, index, arr) {
          var tempObj = {}
          tempObj.name = currentValue.userName
          tempObj.group = currentValue.groupDesc
          tempObj.studyTimeTotal = Math.ceil(currentValue.userData.trainViewTime / 1000 / 60)
          tempObj.studyTimePercentDay = Math.ceil(currentValue.userData.dayAverageTrainViewTime / 1000 / 60)
          tempObj.studyTimePercentNum = Math.ceil(currentValue.userData.averageTrainViewTime / 1000 / 60)
          tempObj.progress1 = parseInt(tempObj.studyTimeTotal / (Math.ceil(this.studyTimeTotalMax / 1000 / 60)) * 100)
          tempObj.progress2 = parseInt(tempObj.studyTimePercentDay / (Math.ceil(this.studyTimePercentDayMax / 1000 / 60)) * 100)
          tempObj.progress3 = parseInt(tempObj.studyTimePercentNum / (Math.ceil(this.studyTimePercentNumMax / 1000 / 60)) * 100)
          tempObj.progress1 = !tempObj.progress1 ? 0 : tempObj.progress1
          tempObj.progress2 = !tempObj.progress2 ? 0 : tempObj.progress2
          tempObj.progress3 = !tempObj.progress3 ? 0 : tempObj.progress3

          this.tableData.push(tempObj)
        }, this)
      })
    },
    // 初始化课程发布榜数据
    initGroupListPublishTrainDataByTime(groupId, startTime, endTime) {
      var tempGroupId
      if (!groupId) {
        tempGroupId = null
      } else {
        tempGroupId = [groupId]
      }
      getGroupListPublishTrainDataByTime({ containsTrainUserCount: true, groupIdList: tempGroupId, startTime: startTime, endTime: endTime }).then(response => {
        this.courseTableData = []
        this.publishTrainCountMax = 0
        this.userAverageTrainViewCountMax = 0
        var tempArr = response.data.groupList
        this.publishTrainCountMax = tempArr[0].groupData.publishTrainCount
        this.userAverageTrainViewCountMax = tempArr[0].groupData.userAverageTrainViewCount
        for (var i = 1; i < tempArr.length - 1; i++) {
          if (tempArr[i].groupData.publishTrainCount > this.publishTrainCountMax) {
            this.publishTrainCountMax = tempArr[i].groupData.publishTrainCount
          }
          if (tempArr[i].groupData.userAverageTrainViewCount > this.userAverageTrainViewCountMax) {
            this.userAverageTrainViewCountMax = tempArr[i].groupData.userAverageTrainViewCount
          }
        }

        tempArr.forEach(function(currentValue, index, arr) {
          var tempObj = {}
          tempObj.group = currentValue.groupName
          tempObj.publishTrainCount = currentValue.groupData.publishTrainCount
          tempObj.trainUserPercent = currentValue.groupData.trainUserPercent
          tempObj.userAverageTrainViewCount = currentValue.groupData.userAverageTrainViewCount
          tempObj.progress1 = parseInt(tempObj.publishTrainCount / this.publishTrainCountMax * 100)
          tempObj.progress2 = parseInt(tempObj.userAverageTrainViewCount / this.userAverageTrainViewCountMax * 100)
          tempObj.progress1 = !tempObj.progress1 ? 0 : tempObj.progress1
          tempObj.progress2 = !tempObj.progress1 ? 0 : tempObj.progress2
          this.courseTableData.push(tempObj)
        }, this)
      })
    },
    // 排行榜的小组选择
    listSelectChange(value) {
      if (value === '全部' || value === '' || !value) {
        /* 查全部*/
        this.initUserListTrainDataByTimeData(null, this.startTime, this.endTime)
        this.initGroupListPublishTrainDataByTime(null, this.startTime, this.endTime)
      } else {
        /* 查单个小组*/
        this.initUserListTrainDataByTimeData(value, this.startTime, this.endTime)
        this.initGroupListPublishTrainDataByTime(value, this.startTime, this.endTime)
      }
      this.groupValue = value
    },
    // 员工画像概览小组选择
    listSelectChange2(value) {
      if (value === '全部' || value === '' || !value) {
        /* 查全部*/
        this.initUserListCompareData(null, this.startTime, this.endTime)
      } else {
        /* 查单个小组*/
        this.initUserListCompareData(value, this.startTime, this.endTime)
      }
      this.groupValue2 = value
      this.compareDataChart.clear()
      this.form.type = []
    },
    // 初始图表数据
    initCharts() {
      this.employeePortraitChart = echarts.init(document.getElementById('employeePortraitData'))
      this.employeeActivityChart = echarts.init(document.getElementById('employeeActivityData'))
      // this.employeeActivityExamQualifiedChart = echarts.init(document.getElementById('employeeActivityExamQualified'));
      // this.employeeActivityExamUserPercentChart = echarts.init(document.getElementById('employeeActivityExamUserPercent'));
      // this.employeeActivityTrainViewTimeChart = echarts.init(document.getElementById('employeeActivityTrainViewTime'));
      // this.employeeActivityPublishTrainCountChart = echarts.init(document.getElementById('employeeActivityPublishTrainCount'));
      this.compareDataChart = echarts.init(document.getElementById('compareData'))
    },
    // 初始化员工画像
    employeePortraitChartOptions(porObj) {
      this.employeePortraitChart.setOption({
        legend: {
          data: ['员工分布点'],
          bottom: 0,
          left: 60
        },

        xAxis: {
          type: 'value',
          scale: true,
          splitLine: {
            lineStyle: {
              type: 'solid'
            },
            show: true
          },
          name: '学习时长'

        },
        yAxis: {
          type: 'value',
          splitLine: {
            lineStyle: {
              type: 'solid'
            }
          },
          name: '考试成绩'
        },
        toolbox: {
          show: true,
          feature: {
            saveAsImage: {
              show: true,
              name: '员工画像概览-' + new Date().getDate()
            }
          }
        },
        grid: {
          left: '1%',
          right: '11%',
          bottom: '8%',
          containLabel: true
        },
        tooltip: {
          showDelay: 0,
          formatter: function(params) {
            if (params.value.length > 1) {
              return params.value[2] + '</br>' +
                  '学习时长：' + params.value[0] + ' 分钟</br>' +
                  '考试成绩：' + params.value[1] + '分'
            } else {
              return
            }
          },
          axisPointer: {
            show: true,
            type: 'cross',
            lineStyle: {
              type: 'solid',
              width: 1
            }
          }
        },
        series: {
          name: '员工分布点',
          symbolSize: 10,
          data: porObj.porList,
          type: 'scatter',
          color: 'green',
          markLine: {
            lineStyle: {
              normal: {
                type: 'dashed'
              }
            },
            data: [
              { type: 'average', name: '考试成绩平均值' },
              { xAxis: porObj.avgTime, name: '学习时长平均值' }
            ]

          }
        }
      })
    },
    // 初始化员工画像数据
    initUserListCompareData(groupId, startTime, endTime) {
      var tempId
      if (!groupId) {
        tempId = null
      } else {
        tempId = [groupId]
      }
      getUserListCompareData({ groupIdList: tempId, startTime: startTime, endTime: endTime }).then(response => {
        var tempDataArr = response.data.dataList
        var porList = []
        var allTime = 0
        for (let i = 0; i < tempDataArr.length; i++) {
          var porArray = []
          var learnTime = tempDataArr[i].entityData.trainViewTime
          var avgScore = tempDataArr[i].entityData.score
          var name = tempDataArr[i].name
          allTime += learnTime
          porArray.push(Math.ceil(learnTime / (1000 * 60)))
          porArray.push(avgScore)
          porArray.push(name)
          porList.push(porArray)
        }
        // 计算学习时长平均值
        var average_time = Math.ceil(allTime / (1000 * 60) / tempDataArr.length)
        this.porObj = { 'porList': porList, 'avgTime': average_time }
        this.employeePortraitChartOptions(this.porObj)
      })
    },

    // 初始化员工数
    initUserListCompare(startTime, endTime) {
      getUserListCompareData({ startTime: startTime, endTime: endTime }).then(response => {
        var tempDataArr = response.data.dataList

        tempDataArr.forEach(function(currentValue, index, arr) {
          var tempObj = {}
          tempObj.userName = currentValue.name
          tempObj.type = 'person'
          tempObj.id = currentValue.id
          this.optionsPersonTableData.push(tempObj)
        }, this)
      })
    },

    // 初始化员工活跃度数据
    initVisitUserCountGroupByTime(startTime, endTime) {
      getVisitUserCountGroupByTime({ startTime: startTime, endTime: endTime }).then(response => {
        var tempDataArr = response.data.visitTimeList
        this.actObj.dataTime = [tempDataArr[0].time]
        this.actObj.dataCount = [tempDataArr[0].count]
        for (var i in tempDataArr) {
          if (i < tempDataArr.length - 1) {
            this.actObj.dataTime.push(tempDataArr[Number(i) + 1].time)
            this.actObj.dataCount.push(tempDataArr[Number(i) + 1].count)
          }
        }
        this.employeeActivityChartOptions(this.actObj)
      })
    },
    // 初始化员工活跃度
    employeeActivityChartOptions(actObj) {
      var option = {
        toolbox: {
          feature: {
            saveAsImage: {
              show: true,
              name: '员工活跃度-' + new Date().getDate()
            }
          },
          right: 30
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'line' // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: '{a}{c}'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          splitLine: {
            show: false
          },
          data: (function() {
            var list = []
            for (var i = 1; i <= 16; i++) {
              list.push('11月' + i + '日')
            }
            return list
          }())
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value}人'
          }
        },
        series: [
          {
            name: '活跃人数：',
            type: 'line',
            data: []
          }
        ]
      }

      option.xAxis.data = actObj.dataTime
      option.series[0].data = actObj.dataCount
      this.employeeActivityChart.setOption(option)
    },

    // 初始化考试合格率和参考员工率数据
    initGroupListExamDataByTime(startTime, endTime) {
      getGroupListExamDataByTime({ startTime: startTime, endTime: endTime }).then(response => {
        if (response.data.groupList.length > 7) {
          this.setWidthEcharts(response.data.groupList, 'employeeActivityExamQualified')
          this.setWidthEcharts(response.data.groupList, 'employeeActivityExamUserPercent')
        }
        this.employeeActivityExamQualifiedChart = echarts.init(document.getElementById('employeeActivityExamQualified'))
        this.employeeActivityExamUserPercentChart = echarts.init(document.getElementById('employeeActivityExamUserPercent'))
        this.employeeActivityExamQualifiedChartOptions(response.data.groupList)
        this.employeeActivityExamUserPercentChartOptions(response.data.groupList)
      })
    },
    // 初始化考试合格率
    employeeActivityExamQualifiedChartOptions(data) {
      var yscale = '%'
      var option = this.barChart(yscale)
      var xAxisData = []
      var seriesData = []
      for (var i in data) {
        var groupName = data[i].groupName
        if (data[i].groupName.length > 5) {
          groupName = data[i].groupName.substr(0, 5) + '...'
        }
        xAxisData.push(groupName)
        seriesData.push(data[i].groupData.examQualified)
      }
      option.toolbox.feature.saveAsImage.name = '考试合格率-' + this.startTime + '-' + this.endTime // 下载文件名字
      option.xAxis[0].data = xAxisData
      option.series[0].data = seriesData
      // option.xAxis.data = xAxisData;
      // option.series[0].data = seriesData;

      option.series[0].color = '#fa6046'
      option.yAxis[0].name = '考试合格率'
      this.employeeActivityExamQualifiedChart.setOption(option)
    },
    // 初始化参考员工率
    employeeActivityExamUserPercentChartOptions(data) {
      var yscale = '%'
      var option = this.barChart(yscale)
      var xAxisData = []
      var seriesData = []
      for (var i in data) {
        var groupName = data[i].groupName
        if (data[i].groupName.length > 5) {
          groupName = data[i].groupName.substr(0, 5) + '...'
        }
        xAxisData.push(groupName)
        seriesData.push(data[i].groupData.examUserPercent)
      }
      option.toolbox.feature.saveAsImage.name = '参考员工率-' + this.startTime + '-' + this.endTime // 下载文件名字
      option.xAxis[0].data = xAxisData
      option.series[0].data = seriesData
      option.yAxis[0].name = '参考员工率'
      this.employeeActivityExamUserPercentChart.setOption(option)
    },

    // 初始化学习热度榜和发布课程榜（不传小组参数）
    initGroupListPublishTrainDataByTime2(startTime, endTime) {
      getGroupListPublishTrainDataByTime2({ startTime: startTime, endTime: endTime }).then(response => {
        if (response.data.groupList.length > 7) {
          this.setWidthEcharts(response.data.groupList, 'employeeActivityTrainViewTime')
          this.setWidthEcharts(response.data.groupList, 'employeeActivityPublishTrainCount')
        }

        this.employeeActivityTrainViewTimeChart = echarts.init(document.getElementById('employeeActivityTrainViewTime'))
        this.employeeActivityPublishTrainCountChart = echarts.init(document.getElementById('employeeActivityPublishTrainCount'))
        this.employeeActivityTrainViewTimeChartOptions(response.data.groupList)
        this.employeeActivityPublishTrainCountChartOptions(response.data.groupList)
      })
    },
    // 初始化学习热度榜
    employeeActivityTrainViewTimeChartOptions(data) {
      var yscale = ''
      var option = this.barChart(yscale)
      // 遍历出echarts 能用的数据
      var xAxisData = []
      var seriesData = []
      for (var i in data) {
        var groupName = data[i].groupName
        if (data[i].groupName.length > 5) {
          groupName = data[i].groupName.substr(0, 5) + '...'
        }
        xAxisData.push(groupName)
        seriesData.push(Math.ceil(data[i].groupData.trainViewTime / 1000 / 60))
      }
      option.toolbox.feature.saveAsImage.name = '学习热度榜-' + this.startTime + '-' + this.endTime // 下载文件名字
      option.xAxis[0].data = xAxisData
      option.series[0].data = seriesData
      option.series[0].color = '#20c7b2'
      option.yAxis[0].name = '学习时长(分钟)'
      this.employeeActivityTrainViewTimeChart.setOption(option)
    },
    // 初始化发布课程榜
    employeeActivityPublishTrainCountChartOptions(data) {
      var yscale = ''
      var option = this.barChart(yscale) // 获取初始化echarts的配置
      // 遍历出echarts 能用的数据
      var xAxisData = []
      var seriesData = []
      for (var i in data) {
        var groupName = data[i].groupName
        if (data[i].groupName.length > 5) {
          groupName = data[i].groupName.substr(0, 5) + '...'
        }
        xAxisData.push(groupName)
        seriesData.push(data[i].groupData.publishTrainCount)
      }
      option.toolbox.feature.saveAsImage.name = '发布课程榜-' + this.startTime + '-' + this.endTime // 下载文件名字
      option.xAxis[0].data = xAxisData
      option.series[0].data = seriesData
      // option.yAxis.axisLabel.formatter = '{value}节'
      option.series[0].color = '#fab446'
      option.yAxis[0].name = '发布课程数'
      this.employeeActivityPublishTrainCountChart.setOption(option)
    },

    // 生成对比图
    addCompareChart() {
      var tempArr = this.form.type
      var selectEntityList = []
      tempArr.forEach(function(currentValue, index, arr) {
        var tempObj = {}
        tempObj.type = currentValue.type
        tempObj.id = currentValue.id
        selectEntityList.push(tempObj)
      }, this)

      getUserListCompareData({ startTime: this.startTime, endTime: this.endTime, selectEntityList: selectEntityList }).then(response => {
        var comparisonData = response.data.dataList
        this.compareDataChart.clear()
        var allDataArray = []
        var scoreArray = []
        var trainTimeArray = []
        var nameArray = []
        for (let i = 0; i < comparisonData.length; i++) {
          nameArray.push(comparisonData[i].name)
          scoreArray.push(comparisonData[i].entityData.score)
          trainTimeArray.push(Math.ceil(comparisonData[i].entityData.trainViewTime / (1000 * 60)))
        }
        allDataArray.push(scoreArray)
        allDataArray.push(trainTimeArray)
        var data = {
          'nameArray': nameArray,
          'allDataArray': allDataArray
        }
        var option
        var seriesLabel = {
          normal: {
            show: true,
            textBorderColor: '#333',
            textBorderWidth: 2
          }
        }

        option = {
          title: {
            text: '对比图'
          },
          // legend: {
          //   data: ['考试成绩', '学习时长'],
          //   bottom: 20
          // },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            },
            formatter: function(params) {
              return '考试成绩:' + params[0].value + '分</br>学习时长:' + params[1].value + '分钟'
            }
          },
          legend: {
            data: data.nameArray, // ['City Alpha', 'City Beta', 'City Gamma']
            bottom: 20
          },
          grid: {
            left: 100
          },
          toolbox: {
            show: true,
            feature: {
              saveAsImage: {
                show: true,
                name: '员工画像对比图-' + new Date().getDate()
              }
            }
          },
          xAxis: {
            type: 'value',
            name: '数值'

          },
          yAxis: {
            type: 'category',
            inverse: true,
            data: data.nameArray,
            axisLabel: {
              // formatter: function(value) {
              //   if (value.length > 5) {
              //     value = value.substring(0, 5) + '\n' + value.substring(5)
              //   }
              //   return value
              // },
              margin: 20
            }
          },
          series: [
            {
              name: '考试成绩',
              type: 'bar',
              data: data.allDataArray[0], // [165, 170, 30],
              label: seriesLabel
            },
            {
              name: '学习时长',
              type: 'bar',
              label: seriesLabel,
              data: data.allDataArray[1] // [150, 105, 110]
            }
          ]
        }
        this.compareDataChart.setOption(option)
        this.dialog = false
      })
    },
    // 学习详情
    studyDetail() {
      this.$router.push({ path: '/data-screening/study-detail' })
    },
    // 考试详情
    testDetail() {
      this.$router.push({ path: '/data-screening/test-detail' })
    },
    // 时间搜索标签切换
    active(index) {
      this.currentSort = index
      sessionStorage.setItem('data-screening-currentSort', index)
      this.setDate(index)
    },
    // 排行榜标签切换
    listActive(index) {
      this.listSort = index
    },

    // 排行榜导出
    listExport() {
      var tempGroupId
      if (!this.groupValue || this.groupValue === '') {
        tempGroupId = null
      } else {
        tempGroupId = [this.groupValue]
      }
      getToken({ startTime: this.startTime, endTime: this.endTime, type: 'person', lastTime: false, groupInList: tempGroupId }).then(response => {
        var token = response.data.token
        const url = process.env.VUE_APP_BASE_API + '/api/downloadStatisticsData/downloadExcelFile?token=' + token
        const a = document.createElement('a')
        a.download = '数据导出.xls'
        a.href = url
        document.body.appendChild(a)
        a.click()
      })
    },
    statisticExport() {
      var tempGroupId
      if (!this.groupValue2 || this.groupValue2 === '') {
        tempGroupId = null
      } else {
        tempGroupId = [this.groupValue2]
      }
      getToken({ startTime: this.startTime, endTime: this.endTime, type: 'group', lastTime: false, groupInList: tempGroupId }).then(response => {
        var token = response.data.token
        const url = process.env.VUE_APP_BASE_API + '/api/downloadStatisticsData/downloadExcelFile?token=' + token
        const a = document.createElement('a')
        a.download = '数据导出.xls'
        a.href = url
        document.body.appendChild(a)
        a.click()
      })
    },
    // 获取初始化echarts的配置
    barChart(yscale) {
      return {
        toolbox: {
          feature: {
            saveAsImage: {
              show: true,
              name: '员工活跃度-' + new Date().getDate()
            }
          },
          right: 30
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '1%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            axisTick: {
              alignWithLabel: true
            },
            axisLabel: {
              interval: 0
            }
          }
        ],
        yAxis: [

          {
            name: yscale.name,

            type: 'value',
            axisLabel: {
              formatter: '{value}' + yscale
            }
          }
        ],
        series: [
          {
            name: '',
            type: 'bar',
            barWidth: '60%',
            data: [10, 52, 200, 334, 390, 330, 220],
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0,
                color: '#84C0F3' // 0% 处的颜色
              }, {
                offset: 1,
                color: '#469BFA' // 100% 处的颜色
              }],
              globalCoord: false // 缺省为 false
            }
          }
        ]
      }
    },

    // 设置echart的宽度
    setWidthEcharts(data, id) {
      var height = window.screen.width
      var oldWidth = height * 0.39
      var newWidth = oldWidth * Math.ceil(data.length / 7)
      document.getElementById(id).style.width = newWidth + 'px'
    }
  }

}
</script>

<style scoped>
  .app-dataScreening-container{
    margin:15px;
    background-color: #F5F5F5;
    /*height:calc(100vh - 130px);*/
    overflow: initial;
  }
  .app-dataScreening-item{
    margin-bottom:25px;
  }
  /*时间搜索*/
  .app-dataScreening-timeWrapper{
    overflow: hidden;
    height: 60px;
    background: rgba(255,255,255,1);
    box-shadow: 0px 0px 15px 0px rgba(0,58,112,0.05);
    line-height: 60px;
    position: relative;
  }
  .app-dataScreening-timeTags{
    font-size: 14px;
    margin-left:20px;
  }
  .app-dataScreening-timeTags-item{
    margin-right: 40px;
    cursor: pointer;
  }
  .app-dataScreening-timeTags-item:hover{
    color: rgba(32,199,178,1);
  }
  .active {
    color: rgba(32,199,178,1);
  }
  /*员工数据面板*/
  .app-dataScreening-staffItem{
    float: left;
    margin-right: 2.5%;
    width: 31.6%;
    background: rgba(255,255,255,1);
    box-shadow: 0px 0px 15px 0px rgba(0,58,112,0.05);
    cursor: pointer;
  }
  .app-dataScreening-staffItem:last-child{
    float: right;
    margin-right:0;
    width: 31.6%;
    background: rgba(255,255,255,1);
    box-shadow: 0px 0px 15px 0px rgba(0,58,112,0.05);
  }

  .app-dataScreening-staffItem-decs{
    margin-top: 20px;
    margin-left: 20px;
  }
  .app-dataScreening-staffItem-decs span {
    font-size: 16px;
    font-weight: 400;
    color: rgba(51,51,51,1);
  }

  .app-dataScreening-staffItem-info {
    position: relative;
    overflow: hidden;
    margin-left: 20px;
    margin-top: 30px;
    margin-right: 20px;
  }
  .app-dataScreening-staffItem-info-detail{
    float: left;
    margin-bottom: 20px;
    width: 80%;
  }
  .app-dataScreening-staffItem-info-number b{
    font-size: 45px;
    font-weight: normal;
    color: rgba(51,51,51,1);
  }
  .app-dataScreening-staffItem-info-detail p {
    margin-top: 15px;
    font-size: 12px;
    font-weight: 400;
    color: rgba(153,153,153,1);
  }
  .app-dataScreening-staffItem-info-img {
    position: absolute;
    right: 0;
    bottom: 20px;
    width: 55px;
  }
  .app-dataScreening-staffItem-info-img img{
    width:100%;
  }

  /*排行榜面板*/
  .app-dataScreening-listWrapper{
    box-shadow: 0px 0px 15px 0px rgba(0,58,112,0.05);
    width:100%;
    background: rgba(255,255,255,1);
    min-height:500px;
  }
  .app-dataScreening-head{
    /*width:100%;*/
    height:60px;
    padding:0 10px;
    margin:0 10px;
    position: relative;
  }
  .app-dataScreening-head-title{
    height:60px;
    line-height: 60px;
    margin-right: 30px;
    font-size: 18px;
  }
  .app-dataScreening-export{
    position: absolute;
    right:10px;
    top:15px;
  }
  .app-dataScreening-listTags{
    padding:0 20px;
    height: 42px;
  }
  .app-dataScreening-listTagsBox{
    border:1px solid #20C7B2;
  }
  .app-dataScreening-listTagsBox clearfix{
    height: 40px;
  }
  .app-dataScreening-listTags-item{
    width: 50%;
    height: 40px;
    line-height: 40px;
    text-align: center;
    font-size: 16px;
    color: #20C7B2;
    cursor: pointer;
  }
  .app-dataScreening-listTags-item.listTagsActive{
    background: #20C7B2;
    color: #fff;
    height: 40px;
  }
  .app-dataScreening-listTable{
    padding:0 20px;
  }

  /*数据统计面板*/
  .app-dataScreening-statisticWrapper{
    box-shadow: 0px 0px 15px 0px rgba(0,58,112,0.05);
    width:100%;
    background: rgba(255,255,255,1);
    min-height: 500px;
    margin-bottom: 0px;
  }
  .app-dataScreening-statistic-head{
    border-bottom:1px solid rgb(231, 234, 241);
  }
  .app-dataScreening-employeePortraitWrapper,
  .app-dataScreening-employeeActivityWrapper{
    position: relative;
    height: auto;
    overflow: hidden;
    /*margin-top: 35px;*/
    /*padding: 0 10px;*/
    background: rgba(255,255,255,1);
  }
  .app-dataScreening-dataDesc{
    display:inline-block;
    margin-left: 40px;
  }
  .app-dataScreening-dataDesc span{
    font-size: 12px;
    font-weight: 400;
    color: rgba(153,153,153,1);
  }
  .employeePortrait-eacharts{
    height:300px;
    padding:0 20px;
  }

  .app-dataScreening-employeeActivityGroups{
    overflow:hidden;
  }
  .app-dataScreening-employeeActivityGroups-item{
    overflow-x: auto;
    float: left;
    width: 49%;
    /*padding: 0 20px;*/
    height:400px;
  }
  .app-dataScreening-employeeActivityGroups-body{
    /*width: 2246.4px;*/
    /*width:100%;*/
    height:300px;
    -webkit-tap-highlight-color: transparent;
    user-select: none;
    /*position: relative;*/
  }

  .app-dataScreening-compare{
    position: absolute;
    top: 0px;
    left: 20%;
    width: 700px;
    height: 359px;
    background: rgba(255,255,255,1);
    box-shadow: 0px 0px 19px 1px rgba(0, 0, 0, 0.2);
    border-radius: 5px;
    padding: 15px 30px;
    z-index: 100;
  }
  .app-dataScreening-compare-title{
    height: 36px;
    font-size: 18px;
    line-height: 36px;
    text-align: center;
    margin-block-end: 10px;
  }
  .app-dataScreening-compare-select{
    width: 300px;
    height: 230px;
    background: rgba(255,255,255,1);
    border: 1px solid rgba(229, 229, 229, 1);
    border-radius: 2px;
    overflow-y: auto;
  }
  .app-dataScreening-compare-btnGroups{
    margin-top: 15px;
  }
  .app-dataScreening-compare-tips{
    font-size: 14px;
    vertical-align: middle;
    margin-right: 50px;
  }
  .app-dataScreening-compare-listHead{
    height: 40px;
    line-height: 40px;
    background: #E5E5E5;
    font-size: 16px;
    padding-left: 15px;
  }
  .app-dataScreening-compare-listBody{
    padding-left:15px;
  }
  .app-dataScreening-compare-listItem{
    display: block;
    padding:10px 0;
  }
  .btn-info{
    border: 1px solid #20C7B2;
    border-radius: 3px;
    font-size: 14px;
    font-weight: 400;
  }
  .btn-close{
    background: #fff;
    color: #20C7B2;
  }
  .btn-search{
    background-color: #20C7B2;
    color:#fff;
  }

  .w55{
    width:55%;
  }
  .w45{
    width:45%;
  }
  /deep/ .el-table .el-table__header thead tr th{
    background-color: #ffffff;
  }
</style>
