(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-3c77bda4"],{"32ed":function(e,t,r){"use strict";r.r(t);var n=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"form-edit"},[r("el-form",{ref:"form",staticClass:"form",attrs:{model:e.form,rules:e.rules,"status-icon":!0,"label-width":"120px"}},[r("el-form-item",{staticClass:"required",attrs:{label:"分组名称",prop:"groupName"}},[r("el-input",{attrs:{placeholder:"请输入分组名称",clearable:""},model:{value:e.form.groupName,callback:function(t){e.$set(e.form,"groupName",t)},expression:"form.groupName"}})],1),e._v(" "),r("el-form-item",{attrs:{label:"分组描述"}},[r("el-input",{attrs:{placeholder:"请输入分组描述",clearable:""},model:{value:e.form.desc,callback:function(t){e.$set(e.form,"desc",t)},expression:"form.desc"}})],1),e._v(" "),r("el-form-item",{attrs:{label:"分组排序",prop:"order"}},[r("el-input",{attrs:{placeholder:"请输入分组排序",clearable:""},model:{value:e.form.order,callback:function(t){e.$set(e.form,"order",e._n(t))},expression:"form.order"}})],1),e._v(" "),r("div",{attrs:{id:"btnGroup"}},[r("el-button",{directives:[{name:"no-more-click",rawName:"v-no-more-click"}],attrs:{type:"primary"},on:{click:function(t){return e.save("form")}}},[e._v("保存")]),e._v(" "),r("el-button",{attrs:{type:"primary",plain:""},on:{click:function(t){return e.cancel("form")}}},[e._v("取消")])],1)],1)],1)},o=[],a=r("cc66"),u={data:function(){return{dataIsChange:0,noLeaveprompt:!1,id:"",form:{skill_name:"",desc:"",groupId:""},custom_list:[],rules:{skill_name:[{required:!0,message:"请输入分组名称（长度在 2 到 20 个字符）",trigger:"blur"},{required:!0,message:"请输入分组名称（长度在 2 到 20 个字符）",trigger:"change"},{min:2,max:20,message:"长度在 2 到 20 个字符",trigger:"blur"},{min:2,max:20,message:"长度在 2 到 20 个字符",trigger:"change"}],order:[{required:!0,type:"number",message:"请输入数字",trigger:"blur"},{required:!0,type:"number",message:"请输入数字",trigger:"change"},{min:0,max:100,type:"number",message:"最大输入两位数",trigger:"blur"},{min:0,max:100,type:"number",message:"最大输入两位数",trigger:"change"}],groupId:[{required:!0,message:"请选择所属租户",trigger:"blur"},{required:!0,message:"请选择所属租户",trigger:"change"}]}}},watch:{form:{handler:function(e){e&&this.dataIsChange++},deep:!0}},created:function(){this.id=this.$route.query.id,this.getInitData()},methods:{getInitData:function(){var e=this;Object(a["h"])({_id:this.id}).then(function(t){e.form=t.data.employeeGroup,e.dataIsChange=-1})},save:function(e){var t=this;this.$refs[e].validate(function(e){e&&Object(a["j"])(t.form).then(function(e){t.$message.success("修改分组成功！"),t.noLeaveprompt=!0,t.$router.push({path:"/user-center/group-manage/detail",query:{id:t.id}})})})},cancel:function(e){this.$router.push({path:"/user-center/group-manage/list"})}},beforeRouteLeave:function(e,t,r){var n=this;this.dataIsChange&&!this.noLeaveprompt?setTimeout(function(){n.$confirm("您的数据尚未保存，是否离开？","离开页面",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){r()}).catch(function(){r(!1)})},200):r()}},s=u,i=(r("5fd0"),r("2877")),c=Object(i["a"])(s,n,o,!1,null,"60936aba",null);t["default"]=c.exports},"5fd0":function(e,t,r){"use strict";var n=r("b427"),o=r.n(n);o.a},b427:function(e,t,r){},cc66:function(e,t,r){"use strict";r.d(t,"g",function(){return o}),r.d(t,"e",function(){return a}),r.d(t,"f",function(){return u}),r.d(t,"i",function(){return s}),r.d(t,"h",function(){return i}),r.d(t,"j",function(){return c}),r.d(t,"a",function(){return l}),r.d(t,"b",function(){return m}),r.d(t,"d",function(){return d}),r.d(t,"k",function(){return p}),r.d(t,"c",function(){return f});var n=r("b775");function o(){return Object(n["a"])({url:"/system/customV2/getCustomManageList",method:"post",data:{}})}function a(e){return Object(n["a"])({url:"system/employeeGroupV2/findEmployeeGroupList",method:"post",data:e})}function u(e){return Object(n["a"])({url:"system/employeeGroup/getAllEmployeeGroup",method:"post",data:e})}function s(e){return Object(n["a"])({url:"system/user/getUserEgroupInfo",method:"post",data:e})}function i(e){return Object(n["a"])({url:"/system/employeeGroup/findEmployeeGroupById",method:"post",data:e})}function c(e){return Object(n["a"])({url:"/system/employeeGroup/upateEmployeeGroup",method:"post",data:e})}function l(e){return Object(n["a"])({url:"/system/employeeGroup/addEmployeeGroup",method:"post",data:e})}function m(e){return Object(n["a"])({url:"system/employeeGroup/deleteEmployeeGroup",method:"post",data:e})}function d(e){return Object(n["a"])({url:"system/skill/egroupskill",method:"post",data:e})}function p(e){return Object(n["a"])({url:"/system/employeeGroup/groupskill",method:"post",data:e})}function f(e){return Object(n["a"])({url:"/system/roleV2/deleteMultiRole",method:"post",data:e})}}}]);