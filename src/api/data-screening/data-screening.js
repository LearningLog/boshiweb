/**
 * @Author: TengAnChao
 * @Date: 2019/11/21
 * @Description: 数据总览数据接口
 * @remarks:
 */

import request from '@/utils/request'

// 学习员工数
export function getTrainUserCount(data) {
  return request({
    url: '/companyStatisticsData/trainUserCount',
    method: 'post',
    data
  })
}

// 考试员工数
export function getExamUserCount(data) {
  return request({
    url: '/companyStatisticsData/examUserCount',
    method: 'post',
    data
  })
}

// 考试合格率
export function getExamQualified(data) {
  return request({
    url: '/companyStatisticsData/examQualified',
    method: 'post',
    data
  })
}
