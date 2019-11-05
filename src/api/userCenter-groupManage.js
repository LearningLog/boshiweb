/**
 * @Author: LiuYouyu
 * @Date: 2019/11/01
 * @Description: 用户中心-分组管理接口
 * @remarks:
 */
import request from '@/utils/request'

// 所属租户列表
export function getCustomManageList() {
  return request({
    url: '/system/customV2/getCustomManageList',
    method: 'post',
    data: {}
  })
}
// 获取分组列表
export function findEmployeeGroupList(data) {
  return request({
    url: 'system/employeeGroupV2/findEmployeeGroupList',
    method: 'post',
    data
  })
}
// 获取所有小组列表
export function getAllEmployeeGroup(data) {
  return request({
    url: 'system/employeeGroup/getAllEmployeeGroup',
    method: 'post',
    data
  })
}
// 获取所有小组列表
export function getUserEgroupInfo(data) {
  return request({
    url: 'system/user/getUserEgroupInfo',
    method: 'post',
    data
  })
}
// 单个分组详情 system/skill/one
export function getItem(data) {
  return request({
    url: '/system/employeeGroup/findEmployeeGroupById',
    method: 'post',
    data
  })
}
// 修改分组
export function modifyItem(data) {
  return request({
    url: '/system/employeeGroup/upateEmployeeGroup',
    method: 'post',
    data
  })
}

// 新增分组
export function addItem(data) {
  return request({
    url: '/system/employeeGroup/addEmployeeGroup',
    method: 'post',
    data
  })
}
// 删除分组
export function deleteItem(data) {
  return request({
    url: 'system/employeeGroup/deleteEmployeeGroup',
    method: 'post',
    data
  })
}
// 穿穿梭框技能接口
export function egroupskill(data) {
  return request({
    url: 'system/skill/egroupskill',
    method: 'post',
    data
  })
}
export function saveGroupSkill(data) {
  return request({
    url: '/system/employeeGroup/groupskill',
    method: 'post',
    data
  })
}

// /////////////////////////////
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

