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
    url: '/system/userV2/listUser',
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
// 修改用户
export function updateUser(data) {
  return request({
    url: '/system/userV2/updateUser',
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

// 生效/失效
export function updateUserStatus(data) {
  return request({
    url: '/system/userV2/updateUserStatus',
    method: 'post',
    data
  })
}

// 导入模板
export function leadingIn(data) {
  return request({
    url: 'system/userImport/importUsersV2',
    method: 'post',
    data
  })
}

// 批量分配角色
export function batchAssignRole(data) {
  return request({
    url: '/system/userV2/saveRole',
    method: 'post',
    data
  })
}

// 批量管理小组
export function batchGroupsManage(data) {
  return request({
    url: '/system/user/saveEmployeeGroup',
    method: 'post',
    data
  })
}
