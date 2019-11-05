(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-271cfb6a"],{"522d":function(t,e,a){},b6f3:function(t,e,a){"use strict";var s=a("522d"),o=a.n(s);o.a},ec5d:function(t,e,a){"use strict";a.d(e,"c",function(){return o}),a.d(e,"b",function(){return r}),a.d(e,"a",function(){return i});var s=a("b775");function o(t){return Object(s["a"])({url:"/system/customResource/findCustomResourceList",method:"post",data:t})}function r(t){return Object(s["a"])({url:"/system/customResource/getCustomResourceById",method:"post",data:t})}function i(t){return Object(s["a"])({url:"/system/customResource/setCustomResourceById",method:"post",data:t})}},ed08:function(t,e,a){"use strict";a.d(e,"b",function(){return o}),a.d(e,"a",function(){return r});a("28a5"),a("a481"),a("6b54");var s=a("7618");function o(t,e){if(0===arguments.length)return null;var a,o=e||"{y}-{m}-{d} {h}:{i}:{s}";"object"===Object(s["a"])(t)?a=t:("string"===typeof t&&/^[0-9]+$/.test(t)&&(t=parseInt(t)),"number"===typeof t&&10===t.toString().length&&(t*=1e3),a=new Date(t));var r={y:a.getFullYear(),m:a.getMonth()+1,d:a.getDate(),h:a.getHours(),i:a.getMinutes(),s:a.getSeconds(),a:a.getDay()},i=o.replace(/{(y|m|d|h|i|s|a)+}/g,function(t,e){var a=r[e];return"a"===e?["日","一","二","三","四","五","六"][a]:(t.length>0&&a<10&&(a="0"+a),a||0)});return i}function r(t){if(t){var e=1024,a=1024*e,s=1024*a,o=1024*s,r="",i=0,n=0,c=0,u=0;return i=t/o,n=t/s,c=t/a,i=parseInt(i.toFixed(2)),n=parseInt(n.toFixed(2)),c=parseInt(c.toFixed(2)),i>0?(i=t/o,r=i.toFixed(2)+"TB"):n>0?(n=t/s,r=n.toFixed(2)+"GB"):c>0?(c=t/a,r=c.toFixed(2)+"MB"):(u=t/e,r=parseInt(u)?parseInt(u)+"KB":"--"),r}return"--"}},ee2d:function(t,e,a){"use strict";a.r(e);var s=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"app-container"},[a("div",{staticClass:"effectTime"},[a("span",[t._v("有效期：")]),a("span",[t._v(t._s(t.parseTime(t.form.startTime,"{y}-{m}-{d}")))]),a("span",[t._v(" 至 ")]),a("span",[t._v(t._s(t.parseTime(t.form.endTime,"{y}-{m}-{d}")))])]),t._v(" "),a("div",{staticClass:"echartsDom"},[a("div",{staticClass:"userCount echarts"},[a("div",{staticClass:"userCountPercent percent"},[a("span",[t._v(t._s(t.form.createdUserCount))]),a("span",[t._v("/")]),a("span",[t._v(t._s(t.form.totalUserCount))])]),t._v(" "),a("div",{staticClass:"item",attrs:{id:"userCount"}})]),t._v(" "),a("div",{staticClass:"sms echarts"},[a("div",{staticClass:"smsPercent percent"},[a("span",[t._v(t._s(t.form.noticeTotalSms+t.form.codeTotalSms))]),a("span",[t._v("/")]),a("span",[t._v(t._s(t.form.usedTotalSms))])]),t._v(" "),a("div",{staticClass:"item",attrs:{id:"sms"}})]),t._v(" "),a("div",{staticClass:"storageSpace echarts"},[a("div",{staticClass:"storageSpacePercent percent"},[a("span",[t._v(t._s(t.getFileShowSizeToG(t.form.usedStorageSpace)))]),a("span",[t._v("/")]),a("span",[t._v(t._s(t.getFileShowSizeToG(t.form.totalStorageSpace)))])]),t._v(" "),a("div",{staticClass:"item",attrs:{id:"storageSpace"}})])])])},o=[],r=a("ec5d"),i=a("ed08"),n=a("313e"),c=a.n(n),u={data:function(){return{id:"",form:{},userCountChart:{},smsChart:{},storageSpaceChart:{}}},mounted:function(){this.getInitData()},created:function(){this.id=this.$route.query._id},methods:{getInitData:function(){var t=this;Object(r["b"])({_id:this.id}).then(function(e){t.form=e.data,t.form.startTime=e.data.startTime||"",t.form.endTime=e.data.endTime||"",t.form.surplusSpace=e.data.totalStorageSpace-e.data.usedStorageSpace,t.initCharts()})},initCharts:function(){this.userCountChart=c.a.init(document.getElementById("userCount")),this.smsChart=c.a.init(document.getElementById("sms")),this.storageSpaceChart=c.a.init(document.getElementById("storageSpace")),this.userCountChartOptions(),this.smsChartOptions(),this.storageSpaceChartOptions()},userCountChartOptions:function(){this.userCountChart.setOption({color:["#20C7B2","#ccc"],title:{text:"员工规模（人）",x:"left"},tooltip:{trigger:"item",formatter:"{a} <br/>{b} : {c} ({d}%)"},legend:{orient:"horizontal",top:"bottom",data:["已创建用户","最大用户数"]},series:[{name:"访问来源",type:"pie",radius:"55%",center:["50%","50%"],data:[{value:1*this.form.createdUserCount,name:"已创建用户"},{value:1*this.form.totalUserCount-1*this.form.createdUserCount,name:"最大用户数"}],itemStyle:{emphasis:{shadowBlur:10,shadowOffsetX:0,shadowColor:"rgba(0, 0, 0, 0.5)"}}}]})},smsChartOptions:function(){this.smsChart.setOption({color:["#469BFA","#F9B346","#ccc"],title:{text:"短信使用（条）",x:"left"},tooltip:{trigger:"item",formatter:"{a} <br/>{b} : {c} ({d}%)"},legend:{orient:"horizontal",top:"bottom",data:["通知类短信","验证码短信","剩余短信"]},series:[{name:"访问来源",type:"pie",radius:"55%",center:["50%","50%"],data:[{value:1*this.form.noticeTotalSms,name:"通知类短信"},{value:1*this.form.codeTotalSms,name:"验证码短信"},{value:1*this.form.totalUserCount-1*this.form.noticeTotalSms-1*this.form.codeTotalSms,name:"剩余短信"}],itemStyle:{emphasis:{shadowBlur:10,shadowOffsetX:0,shadowColor:"rgba(0, 0, 0, 0.5)"}}}]})},storageSpaceChartOptions:function(){this.storageSpaceChart.setOption({color:["#F96146","#F9B346","#469BFA","#20C7B3","#8F63DE","#ccc"],title:{text:"存储空间（G）",x:"left"},tooltip:{trigger:"item",formatter:"{a} <br/>{b}: {c} ({d}%)"},legend:{orient:"horizontal",top:"bottom",x:"center",data:["个人工作台","企业知识库","小组知识库","在线课堂","评测管理","剩余空间"]},series:[{name:"访问来源",type:"pie",radius:["36%","56%"],center:["50%","50%"],avoidLabelOverlap:!1,label:{normal:{show:!0,position:"outside"},emphasis:{shadowBlur:10,shadowOffsetX:0,shadowColor:"rgba(0, 0, 0, 0.5)"}},labelLine:{normal:{show:!0,length:20,length2:20,lineStyle:{color:"#333"}}},data:[{value:this.getFileShowSizeToG(this.form.workDeskStorageSpace),name:"个人工作台"},{value:this.getFileShowSizeToG(this.form.enterpriseKnowledgeLibStorageSpace),name:"企业知识库"},{value:this.getFileShowSizeToG(this.form.groupKnowledgeLibStorageSpace),name:"小组知识库"},{value:this.getFileShowSizeToG(this.form.classroomStorageSpace),name:"在线课堂"},{value:this.getFileShowSizeToG(this.form.evaluationStorageSpace),name:"评测管理"},{value:this.getFileShowSizeToG(this.form.surplusSpace),name:"剩余空间"}]}]})},confirm:function(){this.$router.push({path:"/enterpriseData/list"})},parseTime:function(t,e){return Object(i["b"])(t,e)},getFileShowSizeToG:function(t){if(t){var e=1024,a=1024*e,s=1024*a,o="",r=0;return r=t/s,r=parseInt(r.toFixed(2)),r=t/s,o=1*r.toFixed(2),o}return 0}}},m=u,d=(a("b6f3"),a("2877")),l=Object(d["a"])(m,s,o,!1,null,"6149270c",null);e["default"]=l.exports}}]);