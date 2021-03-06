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
    url: '/evaluation/label/listV2',
    method: 'post',
    data
  })
}
// 修改标签
export function label_edit(data) {
  return request({
    url: '/evaluation/label/update',
    method: 'post',
    data
  })
}
// 删除标签
export function label_delete(data) {
  return request({
    url: '/evaluation/label/del',
    method: 'post',
    data
  })
}
// 单个标签详情
export function getOneLabel(data) {
  return request({
    url: '/evaluation/label/one',
    method: 'post',
    data
  })
}
// 新增标签
export function label_add(data) {
  return request({
    url: '/evaluation/label/add',
    method: 'post',
    data
  })
}

// 获取标签列表，不分组
export function labelAllList(data) {
  return request({
    url: '/evaluation/automatic/labelList',
    method: 'post',
    data
  })
}
