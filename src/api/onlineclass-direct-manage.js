/**
* @Author: JiMei
* @Date: 2019/11/6
* @Description: 在线课堂接口
* @remarks:
*/

import request from '@/utils/request'

// 获取标签列表
export function chapetrList(data){
  return request({
    url: '/cr/chapter/findPageV2',
    method: 'post',
    data
  })
}
//删除在线列表
export function chapetr_del(data){
  return request({
    url: '/cr/chapter/delete',
    method: 'post',
    data
  })
}
//新增在线列表
export function chapetr_add(data){
  return request({
    url: '/cr/chapter/create',
    method: 'post',
    data
  })
}
//修改课程
export function chapetr_edit(data){
  return request({
    url: '/cr/chapter/update',
    method: 'post',
    data
  })
}
// 单个课程详情
export function getOneChapter(data) {
  return request({
    url: '/cr/chapter/findById',
    method: 'post',
    data
  })
}