/**
* @Author: YanHuaKang
* @Date: 2019/11/21
* @Description: 学生端直播与点播
* @remarks:
*/

import request from '@/utils/request'

// 查询课程状态及禁言状态
export function queryStatus(data) {
  return request({
    url: 'api/cr/chapter/queryStatus',
    method: 'post',
    data
  })
}

// 获取评价标签
export function findLabel(data) {
  return request({
    url: 'cr/appraise/findLabel',
    method: 'post',
    data: '{}'
  })
}

// 添加评价
export function addOneAppraise(data) {
  return request({
    url: '/cr/appraise/addOneAppraise',
    method: 'post',
    data
  })
}
