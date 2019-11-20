/**
* @Author: YanHuaKang
* @Date: 2019/11/19
* @Description: 老师端直播与点播
* @remarks:
*/

import request from '@/utils/request'

// 课堂信息
export function findDetailInfoById(data) {
  return request({
    url: 'api/cr/chapter/findDetailInfoById/' + data.id + '/123',
    method: 'post',
    data
  })
}

// 成员数据
export function getUserList(data) {
  return request({
    url: 'api/cr/chapter/userList',
    method: 'post',
    data
  })
}

// 移除，加入, 禁言，发言
export function updateUser(data) {
  return request({
    url: 'api/cr/chapter/updateUser',
    method: 'post',
    data
  })
}

// 课程设置
export function updatePartInfo(data) {
  return request({
    url: 'cr/chapter/updatePartInfo',
    method: 'post',
    data
  })
}

// 直播设置
export function broadcastOperate(data) {
  return request({
    url: 'cr/chapter/broadcastOperate',
    method: 'post',
    data
  })
}

// 获取评论
export function getComments(data) {
  return request({
    url: 'api/cr/discuss/findPageV2',
    method: 'post',
    data
  })
}
