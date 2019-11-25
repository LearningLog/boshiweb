/**
* @Author: YanHuaKang
* @Date: 2019/11/25
* @Description: 门户
* @remarks:
*/

import request from '@/utils/request'

// 获取门户文件列表
export function knowledgeSearch(data) {
  return request({
    url: 'knowledgeSearch/list',
    method: 'post',
    data
  })
}

// 获取考试试题
export function getExams(data) {
  return request({
    url: 'api/evaluation/answer/exams',
    method: 'post',
    data
  })
}
