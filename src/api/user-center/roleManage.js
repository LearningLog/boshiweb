/**
 * @Author: WangLiMei
 * @Date: 2019/10/14
 * @Description: 角色管理的所有接口
 * @remarks:
 */
import request from '@/utils/request'

// 获取角色列表
export function role_list(data) {
  return request({
    url: '/system/roleV2/findRoleListV2',
    method: 'post',
    data
  })
}
// 获取所有角色
export function getAllRole(data) {
  return request({
    url: 'system/roleV2/getAllRole',
    method: 'post',
    data
  })
}

// 获取所有角色
export function getAllQueryRole(data) {
  return request({
    url: '/system/roleV2/getAllQueryRole',
    method: 'post',
    data
  })
}

// 分配角色
export function saveRole(data) {
  return request({
    url: 'system/userV2/saveRole',
    method: 'post',
    data
  })
}
// 所属租户列表
export function getCustomManageList() {
  return request({
    url: '/system/customV2/getCustomManageList',
    method: 'post',
    data: {}
  })
}
// 添加
export function role_add(data) {
  return request({
    url: '/system/roleV2/addrole',
    method: 'post',
    data
  })
}
// 单个角色详情
export function getOneRole(data) {
  return request({
    url: '/system/roleV2/findRoleById',
    method: 'post',
    data
  })
}
// 修改
export function role_edit(data) {
  return request({
    url: '/system/roleV2/upateRole',
    method: 'post',
    data
  })
}
// 删除
export function role_delete(data) {
  return request({
    url: '/system/roleV2/deleterole',
    method: 'post',
    data
  })
}
// 批量删除
export function deleteMultiRole(data) {
  return request({
    url: '/system/roleV2/deleteMultiRole',
    method: 'post',
    data
  })
}

// 角色授权页面管理类型
export function get_role_manage_type() {
  return request({
    url: '/system/roleV2/getDefaultManage',
    method: 'post',
    data: {}
  })
}
// 获取角色授权菜单权限树
export function getAllMenus(data) {
  return request({
    url: '/system/roleV2/findAllMenus',
    method: 'post',
    data
  })
}
// 角色授权
export function setRoleAuthority(data) {
  return request({
    url: '/system/roleV2/saveMenu',
    method: 'post',
    data
  })
}
// 角色默认列表
export function setDefaultRole(data) {
  return request({
    url: '/system/roleV2/getDefaultRole',
    method: 'post',
    data
  })
}
// 设置默认角色
export function updateDefaul(data) {
  return request({
    url: '/system/roleV2/updateDefaultRole',
    method: 'post',
    data
  })
}

