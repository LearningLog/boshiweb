/**
* @Author: zhaoxiaoke
* @Date: 2019/11/09
* @Description: 考试管理接口
* @remarks:
*/

import request from '@/utils/request'

// 获取自动发布考试列表数据
export function getAutomaticList(data) {
  return request({
    url: '/evaluation/automatic/listV2',
    method: 'post',
    data
  })
}

// 删除自动发布考试接口
export function delAuto(data) {
  return request({
    url: '/evaluation/automatic/del',
    method: 'post',
    data
  })
}

// 发布
export function publish(data) {
  return request({
    url: '/evaluation/automatic/publish',
    method: 'post',
    data
  })
}

// 暂停
export function stop(data) {
  return request({
    url: '/evaluation/automatic/stop',
    method: 'post',
    data
  })
}

// 保存
export function submit(data) {
  return request({
    url: '/evaluation/automatic/submit',
    method: 'post',
    data
  })
}

// 保存并发布
export function saveThenPublish(data) {
  return request({
    url: '/evaluation/automatic/saveThenPublish',
    method: 'post',
    data
  })
}

// 获取详情
export function getDetail(data) {
  return request({
    url: '/evaluation/automatic/update',
    method: 'post',
    data
  })
}

