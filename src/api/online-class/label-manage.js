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
// 获取标签列表，不分页（用于查询条件）
export function getLabelListNoPagination(data) {
  return request({
    url: 'cr/label/findAllLabel',
    method: 'post',
    data
  })
}
// 修改标签
export function label_edit(data) {
  return request({
    url: '/cr/label/update',
    method: 'post',
    data
  })
}
// 删除标签
export function label_delete(data) {
  return request({
    url: '/cr/label/delete',
    method: 'post',
    data
  })
}
// 单个标签详情
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
// 评价标签
export function label_evaluate(data) {
  return request({
    url: '/cr/appraise/findAppraiseList',
    method: 'post',
    data
  })
}
// 删除评价
export function delete_evaluate(data) {
  return request({
    url: '/cr/appraise/deleteAppraiseByIds',
    method: 'post',
    data
  })
}
