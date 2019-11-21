<template>
  <div class="app-dataScreening-container">
    <!--时间搜索-->
    <div class="app-dataScreening-item app-dataScreening-timeWrapper">
      <div class="app-dataScreening-timeTags">
        <span class="app-dataScreening-timeTags-item">今日</span><span class="app-dataScreening-timeTags-item">近一周</span><span class="app-dataScreening-timeTags-item">近一个月</span><span class="app-dataScreening-timeTags-item">近三个月</span><span class="app-dataScreening-timeTags-item">近半年</span>
        <el-date-picker
          v-model="value1"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </div>
    </div>
    <!--员工数据面板-->
    <div class="app-dataScreening-item app-dataScreening-staffWrapper clearfix">
      <div class="app-dataScreening-staffItem">
        <div class="app-dataScreening-staffItem-decs">
          <span>学习员工数</span>
        </div>
        <div class="app-dataScreening-staffItem-info">
          <div class="app-dataScreening-staffItem-info-detail">
            <div class="app-dataScreening-staffItem-info-number">
              <b>1</b>人
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
      <div class="app-dataScreening-staffItem">
        <div class="app-dataScreening-staffItem-decs">
          <span>考试员工数</span>
        </div>
        <div class="app-dataScreening-staffItem-info">
          <div class="app-dataScreening-staffItem-info-detail">
            <div class="app-dataScreening-staffItem-info-number">
              <b>0</b>人
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
              <b>0</b>%
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
    <div class="app-dataScreening-item app-dataScreening-listWrapper" />
    <!--数据统计面板-->
    <div class="app-dataScreening-item app-dataScreening-statisticWrapper">
      123
    </div>
  </div>

</template>
<script>
export default {
  data() {
    return {
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      value1: '',
      value2: ''
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
  }

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

  .app-dataScreening-listWrapper{
    box-shadow: 0px 0px 15px 0px rgba(0,58,112,0.05);
    width:100%;
    background: rgba(255,255,255,1);
    min-height:400px;
  }

  .app-dataScreening-statisticWrapper{
    box-shadow: 0px 0px 15px 0px rgba(0,58,112,0.05);
    width:100%;
    background: rgba(255,255,255,1);
    min-height: 500px;
    margin-bottom: 0px;
  }

</style>
