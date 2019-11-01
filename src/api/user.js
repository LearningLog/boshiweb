/**
* @Author: YanHuaKang
* @Date: 2019/10/15
* @Description:
* @remarks:
*/

import request from '@/utils/request'

// 用户登录
export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}
// 获取用户信息
export function getInfo() {
  return request({
    url: '/system/user/onloadByUser',
    method: 'post',
    data: {}
  })
}
// 获取权限路由菜单
export function getMenuList() {
  return request({
    url: '/system/menuV2/initmenu',
    method: 'post',
    data: {}
  })
}
// 登出
export function logout() {
  return request({
    url: '/logout',
    method: 'get'
  })
}

// 获取所有小组
export function getAllEgroup() {
  return request({
    url: '/system/user/getUserEgroupInfo',
    method: 'post',
    data: {}
  })
}
