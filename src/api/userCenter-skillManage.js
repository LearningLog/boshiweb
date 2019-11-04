/**
 * @Author: LiuYouyu
 * @Date: 2019/11/01
 * @Description: 用户中心-技能管理接口
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
// 获取技能列表
export function skillManagerList(data) {
  return request({
    url: '/system/skill/listV2',
    method: 'post',
    data
  })
}
// 单个技能详情 system/skill/one
export function getItem(data) {
  return request({
    url: '/system/skill/one',
    method: 'post',
    data
  })
}
// 修改技能
export function modifyItem(data) {
  return request({
    url: '/system/skill/update',
    method: 'post',
    data
  })
}

// 新增技能
export function addItem(data) {
  return request({
    url: '/system/skill/add',
    method: 'post',
    data
  })
}
// 删除技能
export function deleteItem(data) {
  return request({
    url: 'system/skill/delete',
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

