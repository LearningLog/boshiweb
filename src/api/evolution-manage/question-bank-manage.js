/**
* @Author: YanHuaKang
* @Date: 2019/11/5
* @Description: 题库管理
* @remarks:
*/

import request from '@/utils/request'

// 题库列表
export function evaluationTopicList(data) {
  return request({
    url: '/evaluation/topic/listV2',
    method: 'post',
    data
  })
}

// 新增题库
export function addTopic(data) {
  return request({
    url: '/evaluation/topic/add',
    method: 'post',
    data
  })
}

// 删除试题
export function delTopic(data) {
  return request({
    url: '/evaluation/topic/del',
    method: 'post',
    data
  })
}
// 导入试题
export function importTopics(data) {
  return request({
    url: '/evaluation/topicImport/importTopics',
    method: 'post',
    data
  })
}
// 试题详情
export function topicDetil(data) {
  return request({
    url: '/evaluation/topic/findByIdV2',
    method: 'post',
    data
  })
}
// 修改试题
export function topicEdit(data) {
  return request({
    url: '/evaluation/topic/update',
    method: 'post',
    data
  })
}