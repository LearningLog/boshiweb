import request from '@/utils/request'
// 获取列表
export function permission_list(data) {
  return request({
    url: '/system/permission/findPermissionList',
    method: 'post',
    data
  })
}
// 添加
export function permission_add(data) {
  return request({
    url: '/system/permission/addPermissionInfo',
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
    url: '/system/permission/deletePermissionInfo',
    method: 'post',
    data
  })
}
// 查看暂定
export function permission_det(data) {
  return request({
    url: '/system/permission/findPermissionById',
    method: 'post',
    data
  })
}
