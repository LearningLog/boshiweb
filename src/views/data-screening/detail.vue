<template>
  <div class="app-dataScreening-container">
    <!--时间搜索-->
    <div class="app-dataScreening-item app-dataScreening-timeWrapper">
      <div class="app-dataScreening-timeTags">
        <!--<span class="app-dataScreening-timeTags-item">今日</span><span class="app-dataScreening-timeTags-item">近一周</span><span class="app-dataScreening-timeTags-item">近一个月</span><span class="app-dataScreening-timeTags-item">近三个月</span><span class="app-dataScreening-timeTags-item">近半年</span>-->
        <span v-for="(item,index) in filterData.timeTab" :key="index" class="app-dataScreening-timeTags-item" :class="{'active':currentSort==index}" @click="active(index)">{{item.name}}</span>
        <el-date-picker
          v-model="dateValue"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd">
        </el-date-picker>
      </div>
    </div>
    <!--员工数据面板-->
    <div class="app-dataScreening-item app-dataScreening-staffWrapper clearfix">
      <div class="app-dataScreening-staffItem" @click="studyDetail">
        <div class="app-dataScreening-staffItem-decs">
          <span>学习员工数</span>
        </div>
        <div class="app-dataScreening-staffItem-info">
          <div class="app-dataScreening-staffItem-info-detail">
            <div class="app-dataScreening-staffItem-info-number">
              <b>{{staffData.trainUserCount}}</b>人
            </div>
            <p>
              <span class="time-range">2019-11-14 - 2019-11-20</span>
              <span class="blank">|</span>
              <span class="time-desc">当前是近7天的数据</span>
            </p>
          </div>
          <div class="app-dataScreening-staffItem-info-img">
            <img src="@/assets/images/data-screening/learning_staff.jpg" alt="">
          </div>
        </div>
      </div>
      <div class="app-dataScreening-staffItem" @click="testDetail">
        <div class="app-dataScreening-staffItem-decs">
          <span>考试员工数</span>
        </div>
        <div class="app-dataScreening-staffItem-info">
          <div class="app-dataScreening-staffItem-info-detail">
            <div class="app-dataScreening-staffItem-info-number">
              <b>{{staffData.examUserCount}}</b>人
            </div>
            <p>
              <span class="time-range">2019-11-14 - 2019-11-20</span>
              <span class="blank">|</span>
              <span class="time-desc">当前是近7天的数据</span>
            </p>
          </div>
          <div class="app-dataScreening-staffItem-info-img">
            <img src="@/assets/images/data-screening/examination_staff.jpg" alt="">
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
              <b>{{staffData.examQualified}}</b>%
            </div>
            <p>
              <span class="time-range">2019-11-14 - 2019-11-20</span>
              <span class="blank">|</span>
              <span class="time-desc">当前是近7天的数据</span>
            </p>
          </div>
          <div class="app-dataScreening-staffItem-info-img">
            <img src="@/assets/images/data-screening/examination_pass.jpg" alt="">
          </div>
        </div>
      </div>
    </div>
    <!--排行榜面板-->
    <div class="app-dataScreening-item app-dataScreening-listWrapper">

    </div>
    <!--数据统计面板-->
    <div class="app-dataScreening-item app-dataScreening-statisticWrapper">
      123
    </div>
  </div>

</template>
<script>
  import { getTrainUserCount,getExamUserCount,getExamQualified } from '@/api/data-screening/data-screening'
  export default {
    data() {
      return {
        // 日期选择器
        dateValue: [],
        // 时间搜索
        filterData:{
          timeTab:[{
            name:'今日',
            type:'Today'
          },{
            name:'近一周',
            type:'OneWeek'
          },{
            name:'近一个月',
            type:'OneMonth'
          },{
            name:'近三个月',
            type:'ThreeMonth'
          },{
            name:'近半年',
            type:'HalfYear'
          }]
        },
        currentSort:1,
        // 员工数据面板
        staffData:{
          trainUserCount:0,//学习用户数
          examUserCount:0,//考试员工数
          examQualified:0,//考试合格率
        }

      };
    },
    created() {
      this.setDate(1);//近一周
    },
    methods: {
      // 初始化日期选择器
      // 获取今日日期
      // 设置日期（）
      setDate(index) {
        var tempType = this.filterData.timeTab[index].type;
        if(tempType == 'OneWeek'){
          // 近一周
          var startTime = this.getDate(-7);
          var endTime = this.getDate(0);
          this.dateValue = [startTime,endTime];
          this.initData(startTime,endTime);
        }else if(tempType == 'Today'){
          var startTime = this.getDate(0);
          var endTime = this.getDate(0);
          this.dateValue = [startTime,endTime]
        }else if(tempType == 'OneMonth'){
          var startTime = this.getDate(-30);
          var endTime = this.getDate(0);
          this.dateValue = [startTime,endTime]
        }else if(tempType == 'ThreeMonth'){
          var startTime = this.getDate(-90);
          var endTime = this.getDate(0);
          this.dateValue = [startTime,endTime]
        }else if(tempType == 'HalfYear'){
          var startTime = this.getDate(-180);
          var endTime = this.getDate(0);
          this.dateValue = [startTime,endTime]
        }

      },
      // 获取对应的开始日期和结束日期
      getDate(day) {
        var today = new Date();
        var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
        today.setTime(targetday_milliseconds); //注意，这行是关键代码
        var tYear = today.getFullYear();
        var tMonth = today.getMonth();
        var tDate = today.getDate();
        tMonth = this.doHandleMonth(tMonth + 1);
        tDate = this.doHandleMonth(tDate);
        return tYear + "-" + tMonth + "-" + tDate;
      },
      doHandleMonth(month) {
        var m = month;
        if (month.toString().length == 1) {
          m = "0" + month;
        }
        return m;
      },
      // 初始化数据
      initData(startTime,endTime) {
        this.initTrainUserCountData(startTime,endTime);
        this.initExamUserCountData(startTime,endTime);
        this.initExamQualifiedData(startTime,endTime);
      },
      // 初始化学习员工数
      initTrainUserCountData(startTime,endTime) {
        getTrainUserCount({startTime:startTime,endTime:endTime}).then(response => {
          this.staffData.trainUserCount = response.data.trainUserCount;
        })
      },
      // 初始化考试员工数
      initExamUserCountData(startTime,endTime) {
        getExamUserCount({startTime:startTime,endTime:endTime}).then(response => {
          this.staffData.examUserCount = response.data.examUserCount;
        })
      },
      // 初始化考试合格率
      initExamQualifiedData(startTime,endTime) {
        getExamQualified({startTime:startTime,endTime:endTime}).then(response => {
          this.staffData.examQualified = !response.data.examQualified ? 0 : response.data.examQualified;

        })
      },
      // 学习详情
      studyDetail() {
        this.$router.push({path:'/data-screening/study-detail'})
      },
      // 考试详情
      testDetail() {
        this.$router.push({path:'/data-screening/test-detail'})
      },
      active(index) {
        this.currentSort  =  index;
        this.setDate(index);
      }
    }

  };
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
    min-height:400px;
  }
  /*数据统计面板*/
  .app-dataScreening-statisticWrapper{
    box-shadow: 0px 0px 15px 0px rgba(0,58,112,0.05);
    width:100%;
    background: rgba(255,255,255,1);
    min-height: 500px;
    margin-bottom: 0px;
  }

</style>
