(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-37847933"],{"04a8":function(e,t,n){},"1af6":function(e,t,n){var o=n("63b6");o(o.S,"Array",{isArray:n("9003")})},"333d":function(e,t,n){"use strict";var o=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"pagination-container",class:{hidden:e.hidden}},[n("el-pagination",e._b({attrs:{background:e.background,"current-page":e.currentPage,"page-size":e.pageSize,layout:e.layout,"page-sizes":e.pageSizes,total:e.total},on:{"update:currentPage":function(t){e.currentPage=t},"update:current-page":function(t){e.currentPage=t},"update:pageSize":function(t){e.pageSize=t},"update:page-size":function(t){e.pageSize=t},"size-change":e.handleSizeChange,"current-change":e.handleCurrentChange}},"el-pagination",e.$attrs,!1))],1)},i=[];n("c5f6");Math.easeInOutQuad=function(e,t,n,o){return e/=o/2,e<1?n/2*e*e+t:(e--,-n/2*(e*(e-2)-1)+t)};var a=function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||function(e){window.setTimeout(e,1e3/60)}}();function s(e){document.documentElement.scrollTop=e,document.body.parentNode.scrollTop=e,document.body.scrollTop=e}function r(){return document.documentElement.scrollTop||document.body.parentNode.scrollTop||document.body.scrollTop}function l(e,t,n){var o=r(),i=e-o,l=20,u=0;t="undefined"===typeof t?500:t;var c=function e(){u+=l;var r=Math.easeInOutQuad(u,o,i,t);s(r),u<t?a(e):n&&"function"===typeof n&&n()};c()}var u={name:"Pagination",props:{total:{required:!0,type:Number},page:{type:Number,default:1},limit:{type:Number,default:10},pageSizes:{type:Array,default:function(){return[10,20,30,50]}},layout:{type:String,default:"total, sizes, prev, pager, next, jumper"},background:{type:Boolean,default:!0},autoScroll:{type:Boolean,default:!0},hidden:{type:Boolean,default:!1}},computed:{currentPage:{get:function(){return this.page},set:function(e){this.$emit("update:page",e)}},pageSize:{get:function(){return this.limit},set:function(e){this.$emit("update:limit",e)}}},methods:{handleSizeChange:function(e){this.$emit("pagination",{page:this.currentPage,limit:e}),this.autoScroll&&l(0,800)},handleCurrentChange:function(e){this.$emit("pagination",{page:e,limit:this.pageSize}),this.autoScroll&&l(0,800)}}},c=u,d=(n("7b5a"),n("2877")),p=Object(d["a"])(c,o,i,!1,null,"f7f8da82",null);t["a"]=p.exports},"549b":function(e,t,n){"use strict";var o=n("d864"),i=n("63b6"),a=n("241e"),s=n("b0dc"),r=n("3702"),l=n("b447"),u=n("20fd"),c=n("7cd6");i(i.S+i.F*!n("4ee1")(function(e){Array.from(e)}),"Array",{from:function(e){var t,n,i,d,p=a(e),f="function"==typeof this?this:Array,m=arguments.length,h=m>1?arguments[1]:void 0,g=void 0!==h,b=0,v=c(p);if(g&&(h=o(h,m>2?arguments[2]:void 0,2)),void 0==v||f==Array&&r(v))for(t=l(p.length),n=new f(t);t>b;b++)u(n,b,g?h(p[b],b):p[b]);else for(d=v.call(p),n=new f;!(i=d.next()).done;b++)u(n,b,g?s(d,h,[i.value,b],!0):i.value);return n.length=b,n}})},"54a1":function(e,t,n){n("6c1c"),n("1654"),e.exports=n("95d5")},6691:function(e,t,n){"use strict";var o=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",[e.isSystemManage?n("el-form-item",{attrs:{label:"所属租户"}},[n("el-select",{attrs:{placeholder:"请选择所属租户",clearable:"",filterable:""},on:{change:e.changeCompany},model:{value:e.companyIds,callback:function(t){e.companyIds=t},expression:"companyIds"}},e._l(e.custom_list,function(e){return n("el-option",{key:e._id,attrs:{label:e.customname,value:e._id}})}),1)],1):e._e(),e._v(" "),e.isRenderGroup?n("el-form-item",{attrs:{label:"小组"}},[n("el-select",{attrs:{placeholder:"请选择小组",clearable:"",filterable:""},on:{change:e.changeGroup},model:{value:e.groupId,callback:function(t){e.groupId=t},expression:"groupId"}},e._l(e.groupList,function(e){return n("el-option",{key:e.inc,attrs:{label:e.groupName,value:e.inc}})}),1)],1):e._e(),e._v(" "),e.isRenderRole?n("el-form-item",{attrs:{label:"角色"}},[n("el-select",{attrs:{placeholder:"请选择角色",clearable:"",filterable:""},on:{change:e.changeRole},model:{value:e.roleId,callback:function(t){e.roleId=t},expression:"roleId"}},e._l(e.roleList,function(e){return n("el-option",{key:e._id,attrs:{label:e.rolename,value:e._id}})}),1)],1):e._e()],1)},i=[],a=n("6de4"),s=n("cc66"),r={name:"TenantsGroupsRoles",props:{isRenderGroup:{type:Boolean,default:!0},isRenderRole:{type:Boolean,default:!0}},data:function(){return{isSystemManage:this.$store.state.user.isSystemManage,companyIds:"",groupId:"",roleId:"",custom_list:[],roleList:[],groupList:[]}},computed:{pageSize:{get:function(){return this.limit},set:function(e){this.$emit("update:limit",e)}}},created:function(){this.getCustomManageList(),this.getEgroups(),this.getAllRoles()},methods:{getCustomManageList:function(){var e=this;Object(a["d"])().then(function(t){e.custom_list=t.data})},getEgroups:function(){var e=this;Object(s["i"])({selectCompanyId:this.companyIds}).then(function(t){e.groupList=t.data.egroupInfo})},getAllRoles:function(){var e=this;Object(a["c"])({companyIds:this.companyIds?[this.companyIds]:[]}).then(function(t){e.roleList=t.data.allRoleList})},changeCompany:function(e){this.companyIds=e,this.getAllRoles(),this.getEgroups(),this.$emit("tenantsGroupsRolesVal",{companyIds:this.companyIds,egroupId:this.groupId,roleId:this.roleId})},changeGroup:function(e){this.groupId=e,this.$emit("tenantsGroupsRolesVal",{companyIds:this.companyIds,egroupId:this.groupId,roleId:this.roleId})},changeRole:function(e){this.roleId=e,this.$emit("tenantsGroupsRolesVal",{companyIds:this.companyIds,egroupId:this.groupId,roleId:this.roleId})}}},l=r,u=n("2877"),c=Object(u["a"])(l,o,i,!1,null,"68c757ce",null);t["a"]=c.exports},"6de4":function(e,t,n){"use strict";n.d(t,"j",function(){return i}),n.d(t,"c",function(){return a}),n.d(t,"d",function(){return s}),n.d(t,"g",function(){return r}),n.d(t,"e",function(){return l}),n.d(t,"i",function(){return u}),n.d(t,"h",function(){return c}),n.d(t,"a",function(){return d}),n.d(t,"f",function(){return p}),n.d(t,"b",function(){return f}),n.d(t,"k",function(){return m});var o=n("b775");function i(e){return Object(o["a"])({url:"/system/roleV2/findRoleList",method:"post",data:e})}function a(e){return Object(o["a"])({url:"system/roleV2/getAllRole",method:"post",data:e})}function s(){return Object(o["a"])({url:"/system/customV2/getCustomManageList",method:"post",data:{}})}function r(e){return Object(o["a"])({url:"/system/roleV2/addrole",method:"post",data:e})}function l(e){return Object(o["a"])({url:"/system/roleV2/findRoleById",method:"post",data:e})}function u(e){return Object(o["a"])({url:"/system/roleV2/upateRole",method:"post",data:e})}function c(e){return Object(o["a"])({url:"/system/roleV2/deleterole",method:"post",data:e})}function d(e){return Object(o["a"])({url:"/system/roleV2/deleteMultiRole",method:"post",data:e})}function p(){return Object(o["a"])({url:"/system/roleV2/getDefaultManage",method:"post",data:{}})}function f(e){return Object(o["a"])({url:"/system/roleV2/findAllMenus",method:"post",data:e})}function m(e){return Object(o["a"])({url:"/system/roleV2/saveMenu",method:"post",data:e})}},"774e":function(e,t,n){e.exports=n("d2d5")},"7b5a":function(e,t,n){"use strict";var o=n("ee9a"),i=n.n(o);i.a},"95d5":function(e,t,n){var o=n("40c3"),i=n("5168")("iterator"),a=n("481b");e.exports=n("584a").isIterable=function(e){var t=Object(e);return void 0!==t[i]||"@@iterator"in t||a.hasOwnProperty(o(t))}},a745:function(e,t,n){e.exports=n("f410")},a888:function(e,t,n){"use strict";n("a481"),n("6762"),n("2fdb");var o={bind:function(e,t,n){var o=e.querySelector(".el-dialog__header"),i=e.querySelector(".el-dialog");o.style.cssText+=";cursor:move;",i.style.cssText+=";top:0px;";var a=function(){return window.document.currentStyle?function(e,t){return e.currentStyle[t]}:function(e,t){return getComputedStyle(e,!1)[t]}}();o.onmousedown=function(e){var t=e.clientX-o.offsetLeft,s=e.clientY-o.offsetTop,r=i.offsetWidth,l=i.offsetHeight,u=document.body.clientWidth,c=document.body.clientHeight,d=i.offsetLeft,p=u-i.offsetLeft-r,f=i.offsetTop,m=c-i.offsetTop-l,h=a(i,"left"),g=a(i,"top");h.includes("%")?(h=+document.body.clientWidth*(+h.replace(/\%/g,"")/100),g=+document.body.clientHeight*(+g.replace(/\%/g,"")/100)):(h=+h.replace(/\px/g,""),g=+g.replace(/\px/g,"")),document.onmousemove=function(e){var o=e.clientX-t,a=e.clientY-s;-o>d?o=-d:o>p&&(o=p),-a>f?a=-f:a>m&&(a=m),i.style.cssText+=";left:".concat(o+h,"px;top:").concat(a+g,"px;"),n.child.$emit("dragDialog")},document.onmouseup=function(e){document.onmousemove=null,document.onmouseup=null}}}},i=function(e){e.directive("el-drag-dialog",o)};window.Vue&&(window["el-drag-dialog"]=o,Vue.use(i)),o.install=i;t["a"]=o},c55a:function(e,t,n){"use strict";var o=n("04a8"),i=n.n(o);i.a},c861:function(e,t,n){"use strict";n.r(t);var o=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"list-box"},[n("div",{attrs:{id:"topSearch"}},[n("el-input",{attrs:{placeholder:"请输入用户名称",clearable:""},nativeOn:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.topSearch(t)}},model:{value:e.listQuery.userName,callback:function(t){e.$set(e.listQuery,"userName",t)},expression:"listQuery.userName"}},[n("el-button",{attrs:{slot:"append",type:"primary",icon:"el-icon-search"},on:{click:e.topSearch},slot:"append"})],1),e._v(" "),n("span",{attrs:{slot:"reference",id:"advancedSearchBtn"},on:{click:function(t){e.popoverVisible=!e.popoverVisible}},slot:"reference"},[e._v("高级搜索"),n("i",{directives:[{name:"show",rawName:"v-show",value:e.popoverVisible,expression:"popoverVisible"}],staticClass:"el-icon-caret-bottom"}),n("i",{directives:[{name:"show",rawName:"v-show",value:!e.popoverVisible,expression:"!popoverVisible"}],staticClass:"el-icon-caret-top"})]),e._v(" "),n("transition",{attrs:{name:"fade-advanced-search"}},[n("el-row",{directives:[{name:"show",rawName:"v-show",value:e.popoverVisible,expression:"popoverVisible"}]},[n("el-card",{attrs:{id:"advancedSearchArea",shadow:"never"}},[n("el-form",{ref:"form",attrs:{model:e.listQuery,"label-width":"100px"}},[n("el-form-item",{attrs:{label:"用户昵称"}},[n("el-input",{attrs:{placeholder:"请输入用户昵称",clearable:""},nativeOn:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.topSearch(t)}},model:{value:e.listQuery.nickName,callback:function(t){e.$set(e.listQuery,"nickName",t)},expression:"listQuery.nickName"}})],1),e._v(" "),n("el-form-item",{attrs:{label:"手机号"}},[n("el-input",{attrs:{placeholder:"请输入手机号",clearable:""},nativeOn:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.topSearch(t)}},model:{value:e.listQuery.phone,callback:function(t){e.$set(e.listQuery,"phone",t)},expression:"listQuery.phone"}})],1),e._v(" "),n("el-form-item",{attrs:{label:"用户状态"}},[n("el-select",{attrs:{placeholder:"请选择用户状态",clearable:""},nativeOn:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.topSearch(t)}},model:{value:e.listQuery.userStatus,callback:function(t){e.$set(e.listQuery,"userStatus",t)},expression:"listQuery.userStatus"}},e._l(e.userStatus,function(e){return n("el-option",{key:e.id,attrs:{label:e.name,value:e.id}})}),1)],1),e._v(" "),n("tenants-groups-roles",{on:{tenantsGroupsRolesVal:e.tenantsGroupsRolesVal}})],1),e._v(" "),n("div",{attrs:{id:"searchPopoverBtn"}},[n("el-button",{attrs:{type:"primary"},on:{click:e.topSearch}},[e._v("搜索")]),e._v(" "),n("el-button",{attrs:{type:"primary",plain:""},on:{click:e.reset}},[e._v("重置")])],1)],1)],1)],1)],1),e._v(" "),n("div",{attrs:{id:"topBtn"}},[n("el-button",{attrs:{type:"primary"},on:{click:e.add}},[n("i",{staticClass:"iconfont iconjia"}),e._v("新增")])],1),e._v(" "),n("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.listLoading,expression:"listLoading"}],attrs:{data:e.list,"element-loading-text":"Loading",border:"",fit:"","highlight-current-row":""},on:{"selection-change":e.handleSelectionChange}},[n("el-table-column",{attrs:{type:"selection",width:"55",fixed:"",selectable:e.selectable}}),e._v(" "),n("el-table-column",{attrs:{align:"center",label:"用户名","min-width":"120","show-overflow-tooltip":""},scopedSlots:e._u([{key:"default",fn:function(t){return[n("span",{staticClass:"pointer",on:{click:function(n){return e.detail(t.row)}}},[e._v(e._s(t.row.username))])]}}])}),e._v(" "),n("el-table-column",{attrs:{label:"昵称","min-width":"100",align:"center","show-overflow-tooltip":"",prop:"nickname"}}),e._v(" "),n("el-table-column",{attrs:{label:"手机号","min-width":"80",align:"center","show-overflow-tooltip":"",prop:"phone"}}),e._v(" "),n("el-table-column",{attrs:{align:"center",label:"角色","min-width":"100","show-overflow-tooltip":""},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v("\n        "+e._s(t.row.bs_roles)+"\n      ")]}}])}),e._v(" "),n("el-table-column",{attrs:{align:"center",label:"组别","min-width":"100","show-overflow-tooltip":""},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v("\n        "+e._s(t.row.egroups)+"\n      ")]}}])}),e._v(" "),n("el-table-column",{attrs:{align:"center",label:"状态","min-width":"60","show-overflow-tooltip":""},scopedSlots:e._u([{key:"default",fn:function(t){return[1===t.row.userStatus?n("el-tag",{attrs:{type:"success"}},[e._v("生效")]):n("el-tag",{attrs:{type:"danger"}},[e._v("失效")])]}}])}),e._v(" "),n("el-table-column",{attrs:{label:"来源","min-width":"90",align:"center","show-overflow-tooltip":"",prop:"dataTypeName"}}),e._v(" "),n("el-table-column",{attrs:{"class-name":"status-col",label:"操作",width:"230",align:"center",fixed:"right","show-overflow-tooltip":""},scopedSlots:e._u([{key:"default",fn:function(t){return[t.row.auth?n("div",[n("el-button",{attrs:{size:"mini"},on:{click:function(n){return e.go_edit_fn(t.row)}}},[n("i",{staticClass:"iconfont iconxiugai"}),e._v("修改")]),e._v(" "),1===t.row.userStatus?n("el-button",{attrs:{size:"mini"},on:{click:function(n){return e.enable(t.row,2)}}},[n("i",{staticClass:"iconfont iconshixiao"}),e._v("失效")]):n("el-button",{attrs:{size:"mini"},on:{click:function(n){return e.enable(t.row,1)}}},[n("i",{staticClass:"iconfont iconshengxiao"}),e._v("生效")]),e._v(" "),n("el-button",{attrs:{size:"mini"},on:{click:function(n){return e.del(t.row)}}},[n("i",{staticClass:"iconfont iconshanchu"}),e._v("删除")])],1):n("div",[n("el-button",{attrs:{size:"mini",disabled:!0}},[n("i",{staticClass:"iconfont iconxiugai"}),e._v("修改")]),e._v(" "),1===t.row.userStatus?n("el-button",{attrs:{size:"mini",disabled:!0}},[n("i",{staticClass:"iconfont iconshixiao"}),e._v("失效")]):n("el-button",{attrs:{size:"mini",disabled:!0}},[n("i",{staticClass:"iconfont iconshengxiao"}),e._v("生效")]),e._v(" "),n("el-button",{attrs:{size:"mini",disabled:!0}},[n("i",{staticClass:"iconfont iconshanchu"}),e._v("删除")])],1)]}}])})],1),e._v(" "),n("pagination",{directives:[{name:"show",rawName:"v-show",value:e.total>0,expression:"total>0"}],attrs:{total:e.total,page:e.listQuery.currentPage,limit:e.listQuery.pageSize},on:{"update:page":function(t){return e.$set(e.listQuery,"currentPage",t)},"update:limit":function(t){return e.$set(e.listQuery,"pageSize",t)},pagination:e.get_list}}),e._v(" "),n("div",{attrs:{id:"bottomOperation"}},[n("a",{attrs:{href:"basicUser/img/import_user_ttemplates.xlsx",download:"企业员工导入模版.xlsx"}},[n("el-button",{directives:[{name:"show",rawName:"v-show",value:e.total>0,expression:"total>0"}],attrs:{type:"primary",plain:""}},[n("i",{staticClass:"iconfont iconwechaticon16"}),e._v("模板下载")])],1),e._v(" "),n("el-upload",{staticClass:"upload-demo",attrs:{action:e.uploadUrl(),headers:e.headers,accept:".xlsx,.xls","show-file-list":!1,"on-success":e.handleUploadSuccess}},[n("el-button",{directives:[{name:"show",rawName:"v-show",value:e.total>0,expression:"total>0"}],attrs:{type:"primary",plain:""}},[n("i",{staticClass:"iconfont iconziyuan"}),e._v("模板导入")])],1),e._v(" "),n("el-button",{directives:[{name:"show",rawName:"v-show",value:e.total>0,expression:"total>0"}],attrs:{type:"primary",plain:""},on:{click:e.assignRole}},[n("i",{staticClass:"iconfont icondaifenpeifuwushang"}),e._v("分配角色")]),e._v(" "),n("el-button",{directives:[{name:"show",rawName:"v-show",value:e.total>0,expression:"total>0"}],attrs:{type:"primary",plain:""},on:{click:e.groupsManage}},[n("i",{staticClass:"iconfont iconjia"}),e._v("小组管理")])],1),e._v(" "),n("el-dialog",{directives:[{name:"el-drag-dialog",rawName:"v-el-drag-dialog"}],staticClass:"setRolesDialog",attrs:{width:"650px",title:"分配角色",visible:e.setRolesDialogVisible},on:{"update:visible":function(t){e.setRolesDialogVisible=t}}},[n("el-transfer",{attrs:{data:e.noList,titles:["未分配角色","已分配角色"],props:e.defaultProps},on:{change:e.handleTransferChange},model:{value:e.roleIdList,callback:function(t){e.roleIdList=t},expression:"roleIdList"}}),e._v(" "),n("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[n("el-button",{attrs:{type:"primary"},on:{click:e.setRoles}},[e._v("确定")]),e._v(" "),n("el-button",{on:{click:function(t){e.setRolesDialogVisible=!1}}},[e._v("取 消")])],1)],1),e._v(" "),n("el-dialog",{directives:[{name:"el-drag-dialog",rawName:"v-el-drag-dialog"}],staticClass:"setRolesDialog",attrs:{width:"650px",title:"分配小组",visible:e.setEgroupsDialogVisible},on:{"update:visible":function(t){e.setEgroupsDialogVisible=t}}},[n("el-transfer",{staticClass:"setEgroups",attrs:{data:e.noList2,titles:["未分配小组","已分配小组"],props:e.defaultProps2},on:{change:e.handleTransferChange2},model:{value:e.einc,callback:function(t){e.einc=t},expression:"einc"}}),e._v(" "),n("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[n("el-button",{attrs:{type:"primary"},on:{click:e.setEgroups}},[e._v("确定")]),e._v(" "),n("el-button",{on:{click:function(t){e.setEgroupsDialogVisible=!1}}},[e._v("取 消")])],1)],1),e._v(" "),n("el-dialog",{directives:[{name:"el-drag-dialog",rawName:"v-el-drag-dialog"}],attrs:{title:"错误原因",visible:e.dialogVisible},on:{"update:visible":function(t){e.dialogVisible=t}}},[n("el-table",{staticStyle:{width:"100%"},attrs:{data:e.errorList}},[n("el-table-column",{attrs:{prop:"name",label:"姓名",align:"center","show-overflow-tooltip":"","min-width":"120"}}),e._v(" "),n("el-table-column",{attrs:{prop:"phone",label:"手机号",align:"center","show-overflow-tooltip":"","min-width":"80"}}),e._v(" "),n("el-table-column",{attrs:{prop:"egroup",label:"部门",align:"center","show-overflow-tooltip":"","min-width":"100"}}),e._v(" "),n("el-table-column",{attrs:{prop:"role",label:"角色",align:"center","show-overflow-tooltip":"","min-width":"100"}}),e._v(" "),n("el-table-column",{attrs:{prop:"error_log",label:"失败原因",align:"center","min-width":"100"}})],1)],1)],1)},i=[],a=(n("5df3"),n("4f7f"),n("a745")),s=n.n(a);function r(e){if(s()(e)){for(var t=0,n=new Array(e.length);t<e.length;t++)n[t]=e[t];return n}}var l=n("774e"),u=n.n(l),c=n("c8bb"),d=n.n(c);function p(e){if(d()(Object(e))||"[object Arguments]"===Object.prototype.toString.call(e))return u()(e)}function f(){throw new TypeError("Invalid attempt to spread non-iterable instance")}function m(e){return r(e)||p(e)||f()}n("ac6a");var h=n("e81f"),g=n("6de4"),b=n("cc66"),v=n("333d"),y=n("6691"),_=n("a888"),w=n("5f87"),k={components:{Pagination:v["a"],TenantsGroupsRoles:y["a"]},directives:{elDragDialog:_["a"]},data:function(){return{listLoading:!1,setRolesDialogVisible:!1,setEgroupsDialogVisible:!1,dialogVisible:!1,noList:[],roleIdList:[],noList2:[],einc:[],chargemanList:[],defaultProps:{key:"_id",label:"rolename"},defaultProps2:{key:"inc",label:"groupName"},headers:{Authorization:Object(w["a"])()},errorList:[],listQuery:{currentPage:1,pageSize:10,userName:"",selectCompanyId:"",nickName:"",phone:"",roleId:"",egroup:"",userStatus:null},userStatus:[{id:1,name:"生效"},{id:2,name:"失效"}],checkedList:[],list:null,total:0,popoverVisible:!1}},created:function(){this.get_list()},methods:{uploadUrl:function(){return"http://bs.yunshicloud.com/system/file/upload/"},topSearch:function(){this.get_list()},reset:function(){this.listQuery.userName="",this.listQuery.selectCompanyId="",this.listQuery.nickName="",this.listQuery.phone="",this.listQuery.roleId="",this.listQuery.egroup="",this.listQuery.userStatus=null,this.get_list()},get_list:function(){var e=this;this.listLoading=!0,Object(h["f"])(this.listQuery).then(function(t){e.listLoading=!1,e.list=t.data.page.list,e.total=t.data.page.totalCount})},tenantsGroupsRolesVal:function(e){this.listQuery.selectCompanyId=e.companyIds,this.listQuery.egroup=e.egroupId,this.listQuery.roleId=e.roleId},selectable:function(e,t){return e.auth},handleUploadSuccess:function(e){var t=this;Object(h["g"])({fileId:e.data.fileId,url:e.data.saveHttpPath}).then(function(e){e.data.importStatus?(t.$message.success("模板导入成功！"),t.get_list()):(t.$message.error("模板导入失败！"),t.errorList=e.data.data,t.dialogVisible=!0)})},detail:function(e){this.$router.push({path:"/user-center/user-manage/detail",query:{id:e._id}})},add:function(){this.$router.push({path:"/user-center/user-manage/add"})},enable:function(e,t){var n=this;2===t?this.$confirm("失效用户将不能进行所有本系统内的操作，请问是否对该用户失效？","失效用户",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){Object(h["h"])({_id:e._id,userStatus:t}).then(function(e){n.$message.success("失效用户成功！"),n.get_list()})}).catch(function(){}):Object(h["h"])({_id:e._id,userStatus:t}).then(function(e){n.$message.success("生效用户成功！"),n.get_list()})},del:function(e){var t=this;this.$confirm("确定要删除【"+e.username+"】吗？","删除用户",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){Object(h["d"])({_id:e._id}).then(function(e){t.$message.success("删除成功！"),t.list.length-1===0&&(t.listQuery.currentPage-=1),t.get_list()})}).catch(function(){})},go_edit_fn:function(e){this.$router.push({path:"/user-center/user-manage/edit",query:{id:e._id}})},handleSelectionChange:function(e){this.checkedList=e},assignRole:function(){var e=this;if(!this.checkedList.length)return this.$message.warning("请选择用户！"),!1;var t=[];this.checkedList.forEach(function(e){t.push(e.groupId)}),t=m(new Set(t)),Object(g["c"])({companyIds:t}).then(function(t){e.noList=t.data.allRoleList,e.setRolesDialogVisible=!0})},handleTransferChange:function(e,t,n){this.roleIdList=e},handleTransferChange2:function(e,t,n){this.einc=e},setRoles:function(){var e=this,t=[];this.checkedList.forEach(function(e){t.push(e._id)}),Object(h["a"])({roleIdList:this.roleIdList,_ids:t}).then(function(t){e.$message.success("批量分配角色成功！"),e.setRolesDialogVisible=!1})},groupsManage:function(){var e=this;if(!this.checkedList.length)return this.$message.warning("请选择用户！"),!1;var t=[];this.checkedList.forEach(function(e){t.push(e.groupId)}),t=m(new Set(t)),Object(b["f"])({}).then(function(t){e.noList2=t.data.allEmployeeGroupList,e.setEgroupsDialogVisible=!0})},setEgroups:function(){var e=this,t=[];this.checkedList.forEach(function(e){t.push(e._id)}),Object(h["b"])({einc:this.einc,_ids:t}).then(function(t){e.$message.success("批量分配小组成功！"),e.setEgroupsDialogVisible=!1})}}},I=k,x=(n("c55a"),n("2877")),S=Object(x["a"])(I,o,i,!1,null,"4bec1ed4",null);t["default"]=S.exports},c8bb:function(e,t,n){e.exports=n("54a1")},cc66:function(e,t,n){"use strict";n.d(t,"g",function(){return i}),n.d(t,"e",function(){return a}),n.d(t,"f",function(){return s}),n.d(t,"i",function(){return r}),n.d(t,"h",function(){return l}),n.d(t,"j",function(){return u}),n.d(t,"a",function(){return c}),n.d(t,"b",function(){return d}),n.d(t,"d",function(){return p}),n.d(t,"k",function(){return f}),n.d(t,"c",function(){return m});var o=n("b775");function i(){return Object(o["a"])({url:"/system/customV2/getCustomManageList",method:"post",data:{}})}function a(e){return Object(o["a"])({url:"system/employeeGroupV2/findEmployeeGroupList",method:"post",data:e})}function s(e){return Object(o["a"])({url:"system/employeeGroup/getAllEmployeeGroup",method:"post",data:e})}function r(e){return Object(o["a"])({url:"system/user/getUserEgroupInfo",method:"post",data:e})}function l(e){return Object(o["a"])({url:"/system/employeeGroup/findEmployeeGroupById",method:"post",data:e})}function u(e){return Object(o["a"])({url:"/system/employeeGroup/upateEmployeeGroup",method:"post",data:e})}function c(e){return Object(o["a"])({url:"/system/employeeGroup/addEmployeeGroup",method:"post",data:e})}function d(e){return Object(o["a"])({url:"system/employeeGroup/deleteEmployeeGroup",method:"post",data:e})}function p(e){return Object(o["a"])({url:"system/skill/egroupskill",method:"post",data:e})}function f(e){return Object(o["a"])({url:"/system/employeeGroup/groupskill",method:"post",data:e})}function m(e){return Object(o["a"])({url:"/system/roleV2/deleteMultiRole",method:"post",data:e})}},d2d5:function(e,t,n){n("1654"),n("549b"),e.exports=n("584a").Array.from},e81f:function(e,t,n){"use strict";n.d(t,"f",function(){return i}),n.d(t,"c",function(){return a}),n.d(t,"d",function(){return s}),n.d(t,"e",function(){return r}),n.d(t,"h",function(){return l}),n.d(t,"g",function(){return u}),n.d(t,"a",function(){return c}),n.d(t,"b",function(){return d});var o=n("b775");function i(e){return Object(o["a"])({url:"/system/userV2/listUser",method:"post",data:e})}function a(e){return Object(o["a"])({url:"/system/userV2/createUser",method:"post",data:e})}function s(e){return Object(o["a"])({url:"/system/userV2/deleteUser",method:"post",data:e})}function r(e){return Object(o["a"])({url:"/system/userV2/getUserById",method:"post",data:e})}function l(e){return Object(o["a"])({url:"/system/userV2/updateUserStatus",method:"post",data:e})}function u(e){return Object(o["a"])({url:"system/userImport/importUsersV2",method:"post",data:e})}function c(e){return Object(o["a"])({url:"/system/userV2/saveRole",method:"post",data:e})}function d(e){return Object(o["a"])({url:"/system/user/saveEmployeeGroup",method:"post",data:e})}},ee9a:function(e,t,n){},f410:function(e,t,n){n("1af6"),e.exports=n("584a").Array.isArray}}]);