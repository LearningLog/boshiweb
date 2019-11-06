/**
* @Author: JiMei
* @Date: 2019/11/5
* @Description: 标签管理接口
* @remarks:
*/

import request from '@/utils/request'

// 获取标签列表
export function getLabelList(data) {
  return request({
    url: '/cr/label/findPageV2',
    method: 'post',
    data
  })
}
// 修改
export function label_edit(data) {
  return request({
    url: '/cr/label/update',
    method: 'post',
    data
  })
}
// 删除
export function label_delete(data) {
  return request({
    url: '/cr/label/delete',
    method: 'post',
    data
  })
}
// 单个分组详情
export function getOneLabel(data) {
  return request({
    url: '/cr/label/findById',
    method: 'post',
    data
  })
}
// 新增标签
export function label_add(data) {
  return request({
    url: '/cr/label/create',
    method: 'post',
    data
  })
}
