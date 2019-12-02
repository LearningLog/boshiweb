/**
 * @Author: JiMei
 * @Date: 2019/11/6
 * @Description: 在线课堂接口
 * @remarks:
 */

import request from '@/utils/request'

// 获取课堂列表
export function chapetrList(data) {
  return request({
    url: '/cr/chapter/findPageV2',
    method: 'post',
    data
  })
}
// 删除课堂
export function chapetr_del(data) {
  return request({
    url: '/cr/chapter/delete',
    method: 'post',
    data
  })
}
// 新增课堂
export function chapetr_add(data) {
  return request({
    url: '/cr/chapter/createV2',
    method: 'post',
    data
  })
}
// 修改课堂
export function chapetr_edit(data) {
  return request({
    url: '/cr/chapter/update',
    method: 'post',
    data
  })
}
// 单个课堂详情
export function getOneChapter(data) {
  return request({
    url: '/cr/chapter/findById',
    method: 'post',
    data
  })
}
// 更新课堂
export function chapetrUpdate(data) {
  return request({
    url: '/cr/chapter/updateV2',
    method: 'post',
    data
  })
}
