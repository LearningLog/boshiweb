<template>
  <div class="app-dataScreening-container">
    <!--时间搜索-->
    <div class="app-dataScreening-item app-dataScreening-timeWrapper">
      <div class="app-dataScreening-groupPicker">
        选择小组：
        <el-select v-model="value3" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="app-dataScreening-timeTags">
        <span v-for="(item,index) in filterData.timeTab" :key="index" class="app-dataScreening-timeTags-item" :class="{'active':currentSort==index}" @click="active(index)">{{item.name}}</span>
        <el-date-picker
          v-model="value1"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
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
              <b>1</b>人
            </div>
            <p>
              <span class="time-range">2019-11-14 - 2019-11-20</span>
              <span class="blank">|</span>
              <span class="time-desc">当前是近7天的数据</span>
            </p>
          </div>
          <div class="app-dataScreening-staffItem-info-img">
            <img src="@/assets/images/data-screening/lear1.png" alt="">
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
              <b>0</b>%
            </div>
            <p>
              <span class="time-range">2019-11-14 - 2019-11-20</span>
              <span class="blank">|</span>
              <span class="time-desc">当前是近7天的数据</span>
            </p>
          </div>
          <div class="app-dataScreening-staffItem-info-img">
            <img src="@/assets/images/data-screening/lear2.png" alt="">
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
            <img src="@/assets/images/data-screening/lear3.png" alt="">
          </div>
        </div>
      </div>
    </div>
    <!--排行榜面板-->
    <div class="app-dataScreening-item app-dataScreening-listWrapper">
      <!--小组排行榜-->
      <div class="fl app-dataScreening-groupListWrapper">1</div>
      <!--个人排行榜-->
      <div class="fr app-dataScreening-personListWrapper">2</div>
    </div>
  </div>

</template>
<script>
  export default {
    data() {
      return {
        /*日期选择器*/
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        value1: '',
        value2: '',
        /*时间过滤*/
        filterData:{
          timeTab:[{
            name:'今日'
          },{
            name:'近一周'
          },{
            name:'近一个月'
          },{
            name:'近三个月'
          },{
            name:'近半年'
          }]
        },
        currentSort:1,
        /*小组选择器*/
        options: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
        value3: '选项5'
      };
    },
    methods: {
      active(index) {
        this.currentSort  =  index;
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
    color: #009eef;
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
  /*排行榜面板*/
  .app-dataScreening-listWrapper{
    box-shadow: 0px 0px 15px 0px rgba(0,58,112,0.05);
    width:100%;
    min-height:400px;
  }
  .app-dataScreening-groupListWrapper,
  .app-dataScreening-personListWrapper{
    width: 49.5%;
    height:200px;
    background: #FFF;
    padding: 0 10px;
    overflow-x: auto;
  }



</style>

