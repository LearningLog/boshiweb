/**
* @Author: YanHuaKang
* @Date: 2019/11/18
* @Description: 专题课程
* @remarks:
*/

import request from '@/utils/request'

// 专题课堂分页查询
export function getThematicClassList(data) {
  return request({
    url: '/cr/lesson/findPageV2',
    method: 'post',
    data
  })
}

// 删除专题课堂
export function deletethematicClass(data) {
  return request({
    url: '/cr/lesson/delete',
    method: 'post',
    data
  })
}

// 新建课堂
export function createThematicClass(data) {
  return request({
    url: '/cr/lesson/create',
    method: 'post',
    data
  })
}

// 专题课堂详情
export function thematicClassDetail(data) {
  return request({
    url: 'cr/lesson/findById',
    method: 'post',
    data
  })
}

// 修改课堂
export function updateThematicClass(data) {
  return request({
    url: '/cr/lesson/update',
    method: 'post',
    data
  })
}

// 专题管理列表
export function findChapterListForLesson(data) {
  return request({
    url: 'cr/lesson/findChapterListForLessonV2',
    method: 'post',
    data
  })
}

// 移除
export function removeOneChapterInLesson(data) {
  return request({
    url: 'cr/lesson/removeOneChapterInLesson',
    method: 'post',
    data
  })
}
