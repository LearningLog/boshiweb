/**
* @Author: YanHuaKang
* @Date: 2019/10/15
* @Description: 租户管理
* @remarks:
*/

import request from '@/utils/request'

// 获取所有租户列表
export function getAllTenantList(data) {
  return request({
    url: '/system/customV2/findCustomList',
    method: 'post',
    data
  })
}
// 新增租户
export function addTenant(data) {
  return request({
    url: '/system/customV2/addcustom',
    method: 'post',
    data
  })
}
// 获取单个租户详情
export function getOneTenant(data) {
  return request({
    url: '/system/customV2/findCustomById',
    method: 'post',
    data
  })
}
// 编辑租户
export function editTenant(data) {
  return request({
    url: '/system/customV2/updatecustom',
    method: 'post',
    data
  })
}
// 删除租户
export function delTenant(data) {
  return request({
    url: '/system/customV2/deletecustom',
    method: 'post',
    data
  })
}
// 批量删除租户
export function batchDelTenant(data) {
  return request({
    url: '/system/customV2/deleteMultiCustom',
    method: 'post',
    data
  })
}
// 设置租户状态
export function setCustomStatus(data) {
  return request({
    url: '/system/customV2/setCustomStatus',
    method: 'post',
    data
  })
}
// 获取资讯数据
export function getInformationList(data) {
  return request({
    url: 'system/newscategory/all',
    method: 'post',
    data
  })
}
// 设置资讯
export function setInformation(data) {
  return request({
    url: 'system/custom/saveCustomCategory',
    method: 'post',
    data
  })
}
// 设置租户
export function setTenant(data) {
  return request({
    url: '/system/user/upload',
    method: 'post',
    data
  })
}
// 获取单个租户详情
export function getTenant(data) {
  return request({
    url: '/system/user/onload',
    method: 'post',
    data
  })
}