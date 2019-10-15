/**
* @Author: YanHuaKang
* @Date: 2019/10/15
* @Description: 企业数据接口
* @remarks:
*/

import request from '@/utils/request'

// 获取企业数据列表
export function getCustomResourceList(data) {
  return request({
    url: '/system/customResource/findCustomResourceList',
    method: 'post',
    data
  })
}
// 获取单个企业资源详情
export function getCustomResourceDetail(data) {
  return request({
    url: '/system/customResource/getCustomResourceById',
    method: 'post',
    data
  })
}
// 修改企业资源
export function editCustomResource(data) {
  return request({
    url: '/system/customResource/setCustomResourceById',
    method: 'post',
    data
  })
}
