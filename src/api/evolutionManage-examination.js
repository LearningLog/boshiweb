/**
* @Author: zhaoxiaoke
* @Date: 2019/11/09
* @Description: 考试管理接口
* @remarks:
*/

import request from '@/utils/request'

// 获取考试管理列表数据
export function getExaminationList(data) {
  return request({
    url: '/evaluation/examination/listV2',
    method: 'post',
    data
  })
}

// 删除考试接口
export function delExam(data) {
  return request({
    url: '/evaluation/examination/del',
    method: 'post',
    data
  })
}

// 发布考试
export function publishExam(data) {
  return request({
    url: 'evaluation/examinationpaper/add',
    method: 'post',
    data
  })
}
// 发布考试2 虚选择试卷
export function publishExam2(data) {
  return request({
    url: 'evaluation/examination/add',
    method: 'post',
    data
  })
}
// 考试详情
export function examDetail(data) {
  return request({
    url: '/evaluation/examination/one',
    method: 'post',
    data
  })
}
// 考试修改
export function examUpdate(data) {
  return request({
    url: '/evaluation/examination/update',
    method: 'post',
    data
  })
}

