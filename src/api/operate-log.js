/**
* @Author: zhaoxiaoke
* @Date: 2019/11/07
* @Description: 操作日志接口
* @remarks:
*/

import request from '@/utils/request'

// 获取操作日志列表
export function getNoticeList(data) {
  return request({
    url: '/notice/noticeList',
    method: 'post',
    data
  })
}

// 获取操作日志人员详情
export function getNoticeDetail(data) {
  return request({
    url: '/notice/smsList',
    method: 'post',
    data
  })
}
