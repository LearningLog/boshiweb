<template>
  <div class="app-dataScreening-container">
    <!--时间搜索-->
    <div class="app-dataScreening-item app-dataScreening-timeWrapper">
      <div class="app-dataScreening-groupPicker">
        选择小组：
        <el-select v-model="groupValue" placeholder="请选择" @change="groupSelectChange(groupValue)">
          <el-option
            v-for="item in options"
            :key="item.label"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div class="app-dataScreening-timeTags">
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
      <div class="app-dataScreening-staffItem">
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
            <img src="@/assets/images/data-screening/renyuanguanli.png" alt="">
          </div>
        </div>
      </div>
      <div class="app-dataScreening-staffItem">
        <div class="app-dataScreening-staffItem-decs">
          <span>考试员工率</span>
        </div>
        <div class="app-dataScreening-staffItem-info">
          <div class="app-dataScreening-staffItem-info-detail">
            <div class="app-dataScreening-staffItem-info-number">
              <b>{{ staffData.examUserPercent }}</b>%
            </div>
            <p>
              <span class="time-range">{{ startTime }} - {{ endTime }}</span>
              <span class="blank">|</span>
              <span class="time-desc">当前是{{ staffData.desc }}的数据</span>
            </p>
          </div>
          <div class="app-dataScreening-staffItem-info-img">
            <img src="@/assets/images/data-screening/bili.png" alt="">
          </div>
        </div>
      </div>
      <div class="app-dataScreening-staffItem">
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
            <img src="@/assets/images/data-screening/xueyuan_kaoshi.png" alt="">
          </div>
        </div>
      </div>
    </div>
    <!--排行榜面板-->
    <div class="app-dataScreening-item app-dataScreening-listWrapper">
      <!--小组排行榜-->
      <div class="fl app-dataScreening-groupListWrapper">
        <div class="app-dataScreening-head">
          小组排行榜
        </div>
        <div class="app-dataScreening-body">
          <el-table
            :data="groupListTableData"
            style="width: 100%;cursor: pointer"
            height="370"
            :default-sort="{prop:'examUserPercent',order:'descending'}"
            :row-class-name="tableRowClassName"
            @row-click="clickRow"
          >
            <el-table-column
              type="index"
              label="排名"
              width="100"
            >
              <template slot-scope="scope">
                <img v-if="scope.$index == 0" src="@/assets/images/data-screening/one.png" alt="">
                <img v-if="scope.$index == 1" src="@/assets/images/data-screening/two.png" alt="">
                <img v-if="scope.$index == 2" src="@/assets/images/data-screening/three.png" alt="">
                <span v-if="scope.$index >= 3">{{ scope.$index }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="groupName"
              label="小组"
            />
            <el-table-column
              sortable
              prop="examUserPercent"
              label="考试员工率"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.examUserPercent }}</span>%
              </template>
            </el-table-column>
            <el-table-column
              sortable
              prop="examQualified"
              label="考试合格率"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.examQualified }}</span>%
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <!--个人排行榜-->
      <div class="fr app-dataScreening-personListWrapper">
        <div class="app-dataScreening-head">
          个人排行榜
        </div>
        <div class="app-dataScreening-body">
          <el-table
            :data="personListTableData"
            style="width: 100%"
            height="370"
            :default-sort="{prop:'averageScore',order:'descending'}"
          >
            <el-table-column
              type="index"
              label="排名"
              width="100"
            >
              <template slot-scope="scope">
                <img v-if="scope.$index == 0" src="@/assets/images/data-screening/one.png" alt="">
                <img v-if="scope.$index == 1" src="@/assets/images/data-screening/two.png" alt="">
                <img v-if="scope.$index == 2" src="@/assets/images/data-screening/three.png" alt="">
                <span v-if="scope.$index >= 3">{{ scope.$index }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="userName"
              label="姓名"
            />
            <el-table-column
              prop="groupDesc"
              label="小组"
            />
            <el-table-column
              sortable
              prop="averageScore"
              label="考试平均分"
              width="130"
            />
            <el-table-column
              sortable
              prop="examQualified"
              label="考试合格率"
              width="200"
            >
              <template slot-scope="scope">
                <div style="width:70%;display: inline-block">
                  <el-progress :text-inside="true" :stroke-width="20" :percentage="scope.row.examQualified" :show-text="false" :color="customColor1" />
                </div>
                <div style="width:20%;display: inline-block;line-height: 26px;text-align: left; vertical-align:text-bottom">{{ scope.row.examQualified }}%</div>
              </template>
            </el-table-column>
            <el-table-column
              sortable
              prop="taskPartInQualified"
              label="考试参与度"
              width="200"
            >
              <template slot-scope="scope">
                <div style="width:70%;display: inline-block">
                  <el-progress :text-inside="true" :stroke-width="20" :percentage="scope.row.taskPartInQualified" :show-text="false" :color="customColor2" />
                </div>
                <div style="width:20%;display: inline-block;line-height: 26px;text-align: left; vertical-align:text-bottom">{{ scope.row.taskPartInQualified }}%</div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>

</template>
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
  .app-dataScreening-groupPicker{
    margin-left:20px;
    font-size: 14px;
  }
  .app-dataScreening-timeTags{
    font-size: 14px;
    position: absolute;
    right:20px;
    top:0px;
  }
  .app-dataScreening-timeTags-item{
    margin-right: 40px;
    cursor: pointer;
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
  .app-dataScreening-head{
    height: 70px;
    line-height: 70px;
    font-size: 22px;
  }
  /*排行榜面板*/
  .app-dataScreening-listWrapper{
    box-shadow: 0px 0px 15px 0px rgba(0,58,112,0.05);
    width:100%;
    min-height:540px;
  }
  .app-dataScreening-groupListWrapper,
  .app-dataScreening-personListWrapper{
    width: 49.5%;
    background: #FFF;
    padding: 0 10px;
    padding-bottom:20px;
  }

</style>
<script>
import { getAllEmployeeGroup, getExamUserCount, getGroupListExamDataByTime, getUserListExamQualifiedByTime } from '@/api/data-screening/data-screening'
export default {
  data() {
    return {
      customColor1: '#20C7B2',
      customColor2: '#FAB446',
      /* 日期选择器*/
      dateValue: [],
      startTime: '',
      endTime: '',
      /* 时间过滤*/
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
      /* 小组选择器*/
      options: [{
        value: '',
        label: '全部'
      }],
      groupValue: '',
      selectId: '',
      // 员工数据面板
      staffData: {
        examUserCount: 0, // 考试员工数
        examUserPercent: 0, // 考试员工率
        examQualified: 0, // 考试合格率
        desc: ''// 数据描述
      },
      // 小组排行榜数据
      groupListTableData: [
        //   {
        //   groupName:'',
        //   trainUserPercent:'',
        //   averageTrainViewTime:'',
        // }
      ],
      // 个人排行榜数据
      personListTableData: []
    }
  },
  created() {
    this.currentSort = sessionStorage.getItem('data-screening-currentSort') * 1
    this.dateValue = JSON.parse(sessionStorage.getItem('data-screening-time'))
    if (this.dateValue) {
      this.timeChange(this.dateValue)
    } else {
      this.setDate(this.currentSort > -1 ? this.currentSort : 1)// 近一周
    }
  },
  methods: {
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
        this.initData(this.selectedId, this.startTime, this.endTime)
        this.staffData.desc = '最近7天'
      } else if (tempType === 'Today') {
        this.startTime = this.getDate(0)
        this.endTime = this.getDate(0)
        this.dateValue = [this.startTime, this.endTime]
        this.initData(this.selectedId, this.startTime, this.endTime)
        this.staffData.desc = '最近1天'
      } else if (tempType === 'OneMonth') {
        this.startTime = this.getDate(-29)
        this.endTime = this.getDate(0)
        this.dateValue = [this.startTime, this.endTime]
        this.initData(this.selectedId, this.startTime, this.endTime)
        this.staffData.desc = '最近30天'
      } else if (tempType === 'ThreeMonth') {
        this.startTime = this.getDate(-89)
        this.endTime = this.getDate(0)
        this.dateValue = [this.startTime, this.endTime]
        this.initData(this.selectedId, this.startTime, this.endTime)
        this.staffData.desc = '最近90天'
      } else if (tempType === 'HalfYear') {
        this.startTime = this.getDate(-179)
        this.endTime = this.getDate(0)
        this.dateValue = [this.startTime, this.endTime]
        this.initData(this.selectedId, this.startTime, this.endTime)
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
    initData(groupValue, startTime, endTime) {
      this.initAllEmployeeGroupData()
      this.initExamUserCountData(groupValue, this.startTime, this.endTime)
      this.initGroupListExamDataByTime(startTime, endTime)
      this.initUserListExamQualifiedByTime(groupValue, this.startTime, this.endTime)
    },
    // 初始化小组列表
    initAllEmployeeGroupData() {
      this.options = [{
        value: '',
        label: '全部'
      }]
      getAllEmployeeGroup({}).then(response => {
        response.data.allEmployeeGroupList.forEach(function(currentValue, index, arr) {
          var tempObj = {}
          tempObj.value = currentValue.inc
          tempObj.label = currentValue.groupName
          this.options.push(tempObj)
        }, this)
      })
    },

    // 初始化考试详情中的面板数据
    initExamUserCountData(groupId, startTime, endTime) {
      var tempGroupId
      if (!groupId) {
        tempGroupId = null
      } else {
        tempGroupId = [groupId]
      }
      getExamUserCount({ groupIdList: tempGroupId, startTime: startTime, endTime: endTime }).then(response => {
        this.staffData.examUserCount = response.data.examUserCount
        this.staffData.examUserPercent = response.data.examUserPercent
        this.staffData.examQualified = response.data.examQualified
      })
    },

    // 初始化小组排行榜数据
    initGroupListExamDataByTime(startTime, endTime) {
      getGroupListExamDataByTime({ startTime: startTime, endTime: endTime }).then(response => {
        this.groupListTableData = []
        var tempArr = response.data.groupList
        tempArr.forEach(function(currentValue, index, arr) {
          var tempObj = {}
          tempObj.groupName = currentValue.groupName
          tempObj.examUserPercent = currentValue.groupData.examUserPercent
          tempObj.examQualified = currentValue.groupData.examQualified
          tempObj.groupId = currentValue.groupId
          this.groupListTableData.push(tempObj)
        }, this)
      })
    },

    // 初始化个人排行榜数据
    initUserListExamQualifiedByTime(groupId, startTime, endTime) {
      var tempGroupId
      if (!groupId) {
        tempGroupId = null
      } else {
        tempGroupId = [groupId]
      }
      getUserListExamQualifiedByTime({ groupIdList: tempGroupId, startTime: startTime, endTime: endTime }).then(response => {
        this.personListTableData = []
        var tempArr = response.data.userList
        tempArr.forEach(function(currentValue, index, arr) {
          var tempObj = {}
          tempObj.userName = currentValue.userName
          tempObj.groupDesc = currentValue.groupDesc
          tempObj.averageScore = currentValue.userData.averageScore
          tempObj.examQualified = currentValue.userData.examQualified
          tempObj.taskPartInQualified = currentValue.userData.taskPartInQualified
          this.personListTableData.push(tempObj)
        }, this)
      })
    },
    groupSelectChange(value) {
      // this.groupValue = value;
      if (value === '全部' || value === '' || !value) {
        /* 查全部*/
        this.initExamUserCountData(null, this.startTime, this.endTime)
        this.initUserListExamQualifiedByTime(null, this.startTime, this.endTime)
      } else {
        /* 查单个小组*/
        this.initExamUserCountData(value, this.startTime, this.endTime)
        this.initUserListExamQualifiedByTime(value, this.startTime, this.endTime)
      }
      this.initGroupListExamDataByTime(this.startTime, this.endTime)
    },

    // 监测日期选择器中的数据更改
    timeChange(value) {
      this.startTime = value[0]
      this.endTime = value[1]
      this.currentSort = -1
      var endTime = new Date(this.endTime).getTime() / 1000 - parseInt(new Date(this.startTime).getTime() / 1000)
      var timeDay = parseInt(endTime / 60 / 60 / 24)// 相差天数
      this.staffData.desc = timeDay + '天'
      this.initData(this.selectedId, this.startTime, this.endTime)
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
    tableRowClassName({ row }) {
      if (row.groupName === this.groupValue || row.groupId === this.groupValue) {
        return 'groupActive'
      }
      return ''
    },
    // 行点击事件
    clickRow(value) {
      this.selectedId = value.groupId
      this.groupValue = value.groupName
      this.groupSelectChange(value.groupId)
      // this.initData(value.groupId,this.startTime,this.endTime)
    },
    active(index) {
      this.currentSort = index
      this.setDate(index)
    }
  }

}
</script>

