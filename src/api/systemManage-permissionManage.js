/**
 * @Author: WangLiMei
 * @Date: 2019/10/14
 * @Description: 权限管理的所有接口
 * @remarks:
 */
import request from '@/utils/request'
// 获取列表
export function permission_list(data) {
  return request({
    url: '/system/permissionV2/findPermissionList',
    method: 'post',
    data
  })
}
// 获取所有菜单
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
// 权限添加
export function permission_add(data) {
  return request({
    url: '/system/permissionV2/addPermissionInfo',
    method: 'post',
    data
  })
}
// 权限修改
export function permission_edit(data) {
  return request({
    url: '/system/permissionV2/updatePermissionInfo',
    method: 'post',
    data
  })
}
// 权限删除
export function permission_delet(data) {
  return request({
    url: '/system/permissionV2/deletePermissionInfo',
    method: 'post',
    data
  })
}
// 权限详情
export function permission_det(data) {
  return request({
    url: '/system/permissionV2/findPermissionById',
    method: 'post',
    data
  })
}
