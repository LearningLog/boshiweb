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

// 获取所有角色
export function getAllRoles() {
  return request({
    url: '/system/roleV2/findRoleListV2',
    method: 'post',
    data: {}
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

// 获取应用信息
export function getUserApplicationInfo() {
  return request({
    url: '/system/user/getUserApplicationInfo',
    method: 'post',
    data: {}
  })
}

// 根据小组获取小组成员（用户）
export function getUserByGroupIds(data) {
  return request({
    url: '/evaluation/automatic/userList',
    method: 'post',
    data
  })
}

// 用户修改密码
export function updatePassword(data) {
  return request({
    url: 'system/user/updatePassword',
    method: 'post',
    data
  })
}
