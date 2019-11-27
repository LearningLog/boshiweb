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

// 小组数
export function getAllEmployeeGroup(data) {
  return request({
    url: '/system/employeeGroupV2/getAllEmployeeGroup',
    method: 'post',
    data
  })
}

// 学习排行榜
export function getUserListTrainDataByTime(data) {
  return request({
    url: '/companyUserStatisticsData/userListTrainDataByTime',
    method: 'post',
    data
  })
}

// 课程发布榜
export function getGroupListPublishTrainDataByTime(data) {
  return request({
    url: '/companyGroupStatisticsData/groupListPublishTrainDataByTime',
    method: 'post',
    data
  })
}

// 员工画像概览
export function getUserListCompareData(data) {
  return request({
    url: '/companyUserStatisticsData/userListCompareData',
    method: 'post',
    data
  })
}

// 员工活跃度
export function getVisitUserCountGroupByTime(data) {
  return request({
    url: '/companyStatisticsData/visitUserCountGroupByTime',
    method: 'post',
    data
  })
}

// 考试合格率和参考员工率
export function getGroupListExamDataByTime(data) {
  return request({
    url: '/companyGroupStatisticsData/groupListExamDataByTime',
    method: 'post',
    data
  })
}
// 学习热度榜、发布课程榜（不传小组参数）
export function getGroupListPublishTrainDataByTime2(data) {
  return request({
    url: '/companyGroupStatisticsData/groupListPublishTrainDataByTime',
    method: 'post',
    data
  })
}

// 考试详情中的个人排行榜
export function getUserListExamQualifiedByTime(data) {
  return request({
    url: '/companyUserStatisticsData/userListExamQualifiedByTime',
    method: 'post',
    data
  })
}

// 获取导出exceltoken
export function getToken(data) {
  return request({
    url: '/api/downloadStatisticsData/getToken',
    method: 'post',
    data
  })
}

// 下载excel
export function getDownloadExcelFile(data) {
  return request({
    url: '/api/downloadStatisticsData/downloadExcelFile',
    method: 'get',
    data
  })
}
