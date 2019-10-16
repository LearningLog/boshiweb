<template>
  <div class="app-container">
    <div class="effectTime">
      <span>有效期：</span><span>{{ parseTime(form.startTime, '{y}-{m}-{d}') }}</span><span>&nbsp;至&nbsp;</span><span>{{ parseTime(form.endTime, '{y}-{m}-{d}') }}</span>
    </div>
    <div class="echartsDom">
      <div class="userCount echarts">
        <div class="userCountPercent percent">
          <span>{{ this.form.createdUserCount }}</span><span>/</span><span>{{ this.form.totalUserCount }}</span>
        </div>
        <div id="userCount" class="item" />
      </div>
      <div class="sms echarts">
        <div class="smsPercent percent">
          <span>{{ this.form.noticeTotalSms + this.form.codeTotalSms }}</span><span>/</span><span>{{ this.form.usedTotalSms }}</span>
        </div>
        <div id="sms" class="item" />
      </div>
      <div class="storageSpace echarts">
        <div class="storageSpacePercent percent">
          <span>{{ getFileShowSizeToG(this.form.usedStorageSpace) }}</span><span>/</span><span>{{ getFileShowSizeToG(this.form.totalStorageSpace) }}</span>
        </div>
        <div id="storageSpace" class="item" />
      </div>
    </div>
  </div>
</template>

<script>
import { getCustomResourceDetail } from '@/api/enterprise-data'
import { parseTime } from '@/utils/index'
import echarts from 'echarts' // 引入echarts
export default {
  data() {
    return {
      id: '', // 查询id
      form: {},
      userCountChart: {},
      smsChart: {},
      storageSpaceChart: {}
    }
  },
  mounted() {
    this.getInitData()
  },
  created() {
    this.id = this.$route.query._id
  },
  methods: {
    // 获取初始数据
    getInitData() {
      getCustomResourceDetail({ _id: this.id }).then(response => {
        this.form = response.data
        this.form.startTime = response.data.startTime || ''
        this.form.endTime = response.data.endTime || ''
        this.form.surplusSpace = response.data.totalStorageSpace - response.data.usedStorageSpace
        this.initCharts()
      })
    },
    initCharts() {
      this.userCountChart = echarts.init(document.getElementById('userCount'))
      this.smsChart = echarts.init(document.getElementById('sms'))
      this.storageSpaceChart = echarts.init(document.getElementById('storageSpace'))
      this.userCountChartOptions()
      this.smsChartOptions()
      this.storageSpaceChartOptions()
    },
    // 员工规模
    userCountChartOptions() {
      this.userCountChart.setOption({
        color: ['#20C7B2', '#ccc'], // 环形图每块的颜色
        title: {
          text: '员工规模（人）',
          x: 'left'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'horizontal',
          top: 'bottom',
          data: ['已创建用户', '最大用户数']
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: '55%',
            center: ['50%', '50%'],
            data: [
              { value: this.form.createdUserCount * 1, name: '已创建用户' },
              { value: (this.form.totalUserCount * 1) - (this.form.createdUserCount * 1), name: '最大用户数' }
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      })
    },
    // 短信使用
    smsChartOptions() {
      this.smsChart.setOption({
        color: ['#469BFA', '#F9B346', '#ccc'], // 环形图每块的颜色
        title: {
          text: '短信使用（条）',
          x: 'left'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'horizontal',
          top: 'bottom',
          data: ['通知类短信', '验证码短信', '剩余短信']
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: '55%',
            center: ['50%', '50%'],
            data: [
              { value: (this.form.noticeTotalSms * 1), name: '通知类短信' },
              { value: (this.form.codeTotalSms * 1), name: '验证码短信' },
              { value: (this.form.totalUserCount * 1) - (this.form.noticeTotalSms * 1) - (this.form.codeTotalSms * 1), name: '剩余短信' }
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      })
    },
    // 存储空间
    storageSpaceChartOptions() {
      this.storageSpaceChart.setOption({
        color: ['#F96146', '#F9B346', '#469BFA', '#20C7B3', '#8F63DE', '#ccc'], // 环形图每块的颜色
        title: {
          text: '存储空间（G）',
          x: 'left'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'horizontal',
          top: 'bottom',
          x: 'center',
          data: ['个人工作台', '企业知识库', '小组知识库', '在线课堂', '评测管理', '剩余空间']
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: ['36%', '56%'],
            center: ['50%', '50%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: true,
                position: 'outside'
              },
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            labelLine: {
              normal: {
                show: true,
                length: 20,
                length2: 20,
                lineStyle: {
                  color: '#333'
                }
              }
            },
            data: [
              { value: this.getFileShowSizeToG(this.form.workDeskStorageSpace), name: '个人工作台' },
              { value: this.getFileShowSizeToG(this.form.enterpriseKnowledgeLibStorageSpace), name: '企业知识库' },
              { value: this.getFileShowSizeToG(this.form.groupKnowledgeLibStorageSpace), name: '小组知识库' },
              { value: this.getFileShowSizeToG(this.form.classroomStorageSpace), name: '在线课堂' },
              { value: this.getFileShowSizeToG(this.form.evaluationStorageSpace), name: '评测管理' },
              { value: this.getFileShowSizeToG(this.form.surplusSpace), name: '剩余空间' }
            ]
          }
        ]
      })
    },
    // 确定
    confirm() {
      this.$router.push({ path: '/enterpriseData/list' })
    },
    parseTime(time, cFormat) {
      return parseTime(time, cFormat)
    },
    // 获取存储空间大小，G
    getFileShowSizeToG(fileSize) {
      if (fileSize) {
        var KLength = 1024
        var MLength = KLength * 1024
        var GLength = MLength * 1024

        var showStr = ''
        var G = 0
        G = fileSize / GLength

        G = parseInt(G.toFixed(2))
        G = fileSize / GLength
        showStr = G.toFixed(2) * 1

        return showStr
      } else {
        return 0
      }
    }
  }

}
</script>

<style lang="scss" scoped>
  .effectTime {
    padding-left: 30px;
    width: 100%;
    height: 50px;
    line-height: 50px;
    font-size: 16px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
  .echartsDom {
    width: 100%;
    margin-top: 20px;
    /*使用display: flex;将父元素设为伸缩盒子*/
    display: flex;
    justify-content: space-between; /*元素两端对齐，中间等分；*/

    & .echarts {
      position: relative;
      width: 32%;
      height: 300px;
      /*margin-right: 24px;*/
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      padding: 10px;
      /*box-sizing: content-box;*/
    }

    & .storageSpace {
      margin-right: 0;
    }
    & .percent {
      position: absolute;
      right: 10px;
      top: 10px;
      color: #999999;
    }
    & .item {
      width: 100%;
      height: 100%;
    }
  }
</style>
