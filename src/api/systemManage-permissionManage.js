import request from '@/utils/request'
// 获取列表
export function permission_list(data) {
  return request({
    url: '/system/permissionV2/findPermissionList',
    method: 'post',
    data
  })
}
// 获取菜单
export function permission_menu(data) {
  return request({
    url: '/system/menuV2/findAllMenus',
    method: 'post',
    data
  })
}
// 获取管理类别
export function permission_manage_type(data) {
  return request({
    url: '/system/permissionV2/getDefaultManage',
    method: 'post',
    data
  })
}
// 添加
export function permission_add(data) {
  return request({
    url: '/system/permissionV2/addPermissionInfoo',
    method: 'post',
    data
  })
}
// 修改
export function permission_edit(data) {
  return request({
    url: '/system/permission/updatePermissionInfo',
    method: 'post',
    data
  })
}
// 删除
export function permission_delet(data) {
  return request({
    url: '/system/permissionV2/deletePermissionInfo',
    method: 'post',
    data
  })
}
// 查看暂定
export function permission_det(data) {
  return request({
    url: '/system/permissionV2/findPermissionById',
    method: 'post',
    data
  })
}
