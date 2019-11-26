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

// 获取租户所有树并按每层节点名聚合
export function getCompanyAllTreeFloorByName(data) {
  return request({
    url: '/classifyTree/getCompanyAllTreeFloorByName',
    method: 'post',
    data
  })
}

// 获取考试
export function getExams(data) {
  return request({
    url: '/api/evaluation/answer/examsV2',
    method: 'post',
    data
  })
}

// 获取单场试题
export function getOneExam(data) {
  return request({
    url: '/api/evaluation/answer/oneexam',
    method: 'post',
    data
  })
}

// 获取单场试题缓存
export function findTempAnswer(data) {
  return request({
    url: 'api/evaluation/answer/findTempAnswer',
    method: 'post',
    data
  })
}

// 设置单场试题缓存
export function saveTempAnswer(data) {
  return request({
    url: 'api/evaluation/answer/saveTempAnswer',
    method: 'post',
    data
  })
}

// 提交考试
export function answerCommit(data) {
  return request({
    url: '/api/evaluation/answer/commit',
    method: 'post',
    data
  })
}
