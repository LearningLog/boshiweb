/**
* @Author: YanHuaKang
* @Date: 2019/11/4
* @Description: 用户管理
* @remarks:
*/
import request from '@/utils/request'

// 获取用户列表
export function getUserList(data) {
  return request({
    url: '/system/user/listUserV2',
    method: 'post',
    data
  })
}

// 新增用户
export function createUser(data) {
  return request({
    url: '/system/userV2/createUser',
    method: 'post',
    data
  })
}

// 删除用户
export function deleteUser(data) {
  return request({
    url: '/system/userV2/deleteUser',
    method: 'post',
    data
  })
}

// 用户详情
export function getUserById(data) {
  return request({
    url: '/system/userV2/getUserById',
    method: 'post',
    data
  })
}
