(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-f6a758d8"],{"3e7f":function(e,n,t){"use strict";var s=t("5c22"),r=t.n(s);r.a},"5c22":function(e,n,t){},afa7:function(e,n,t){"use strict";t.r(n);var s=function(){var e=this,n=e.$createElement,t=e._self._c||n;return t("div",{staticClass:"form-edit"},[t("el-form",{ref:"form",staticClass:"form",attrs:{model:e.form,"label-width":"120px"}},[t("el-form-item",{attrs:{label:"权限名称："}},[t("span",[e._v(e._s(e.form.permissionname))])]),e._v(" "),t("el-form-item",{attrs:{label:"权限标识："}},[t("span",[e._v(e._s(e.form.permissionmark))])]),e._v(" "),t("el-form-item",{attrs:{label:"权限code："}},[t("span",[e._v(e._s(e.form.permissioncode))])]),e._v(" "),t("el-form-item",{attrs:{label:"权限描述："}},[t("span",[e._v(e._s(e.form.permissiondesc))])]),e._v(" "),t("el-form-item",{attrs:{label:"所属菜单："}},[t("span",[e._v(e._s(e.form.permissionbelongmenuname))])]),e._v(" "),t("el-form-item",{attrs:{label:"权限类别："}},[t("span",[e._v(e._s(e.form.manageName))])])],1),e._v(" "),t("div",{attrs:{id:"btnGroup"}},[t("el-button",{attrs:{type:"primary"},on:{click:e.onSubmit}},[e._v("确定")])],1)],1)},r=[],i=t("ea8f"),o={data:function(){return{form:{permissionname:"",permissionmark:"",permissioncode:"",permissiondesc:"",permissionmanage:"",permissionbelongmenuname:"",manageName:""},manage_type:[],query_param:""}},created:function(e){this.query_param=this.$route.query.ids,this.get_permission_manage_type(),this.get_det()},methods:{get_det:function(){var e=this,n={};n._id=this.query_param,Object(i["c"])(n).then(function(n){var t=n.data.permission;e.form.permissionname=t.permissionname,e.form.permissionmark=t.permissionmark,e.form.permissioncode=t.permissioncode,e.form.permissiondesc=t.permissiondesc,e.form.permissionbelongmenuname=t.permissionbelongmenuname,e.form.manageName=t.manageName}).catch(function(e){console.log(e)})},get_permission_manage_type:function(){var e=this,n={};Object(i["f"])(n).then(function(n){e.manage_type=n.data})},onSubmit:function(){this.$router.push({path:"/systemManage/permissionManage"})}}},a=o,m=(t("3e7f"),t("2877")),u=Object(m["a"])(a,s,r,!1,null,"a4175edc",null);n["default"]=u.exports},ea8f:function(e,n,t){"use strict";t.d(n,"e",function(){return r}),t.d(n,"g",function(){return i}),t.d(n,"f",function(){return o}),t.d(n,"a",function(){return a}),t.d(n,"d",function(){return m}),t.d(n,"b",function(){return u}),t.d(n,"c",function(){return f});var s=t("b775");function r(e){return Object(s["a"])({url:"/system/permissionV2/findPermissionList",method:"post",data:e})}function i(e){return Object(s["a"])({url:"/system/menuV2/findAllMenus",method:"post",data:e})}function o(e){return Object(s["a"])({url:"/system/permissionV2/getDefaultManage",method:"post",data:e})}function a(e){return Object(s["a"])({url:"/system/permissionV2/addPermissionInfo",method:"post",data:e})}function m(e){return Object(s["a"])({url:"/system/permissionV2/updatePermissionInfo",method:"post",data:e})}function u(e){return Object(s["a"])({url:"/system/permissionV2/deletePermissionInfo",method:"post",data:e})}function f(e){return Object(s["a"])({url:"/system/permissionV2/findPermissionById",method:"post",data:e})}}}]);