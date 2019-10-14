import request from '@/utils/request'
// 资讯类别
// 列表
export function newscategory_list(data) {
  return request({
    url: '/system/newscategory/list',
    method: 'post',
    data
  })
}
// 添加
export function newscategory_add(data) {
  return request({
    url: '/system/newscategory/add',
    method: 'post',
    data
  })
}
// 修改
export function newscategory_edit(data) {
  return request({
    url: '/system/newscategory/one',
    method: 'post',
    data
  })
}
// 删除
export function newscategory_delet(data) {
  return request({
    url: '/system/newscategory/delete',
    method: 'post',
    data
  })
}
// 类别详情
export function newscategory_det(data) {
  return request({
    url: '/system/newscategory/det',
    method: 'post',
    data
  })
}
// 修改类别获取原始值
export function newscategory_one(data) {
  return request({
    url: '/system/newscategory/one',
    method: 'post',
    data
  })
}
// 网站管理列表
export function net_list(data) {
  return request({
    url: '/system/website/list',
    method: 'post',
    data
  })
}
// 网站管理添加
export function net_add(data) {
  return request({
    url: '/system/website/add',
    method: 'post',
    data
  })
}
// 网站管理修改
export function net_edit(data) {
  return request({
    url: '/system/website/update',
    method: 'post',
    data
  })
}
// 网站管理删除
export function net_delet(data) {
  return request({
    url: '/system/website/delete',
    method: 'post',
    data
  })
}