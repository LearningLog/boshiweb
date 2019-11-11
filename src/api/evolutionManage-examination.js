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

