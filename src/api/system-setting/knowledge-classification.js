/**
* @Author: YanHuaKang
* @Date: 2019/11/22
* @Description: 知识分类
* @remarks:
*/

import request from '@/utils/request'

// 知识树获取租户所有树
export function getCompanyAllTree(data) {
  return request({
    url: 'classifyTree/getCompanyAllTree',
    method: 'post',
    data: '{}'
  })
}

// 知识树创建
export function createTree(data) {
  return request({
    url: '/classifyTree/createTree',
    method: 'post',
    data
  })
}

// 知识树节点创建
export function createNode(data) {
  return request({
    url: '/classifyTree/createNode',
    method: 'post',
    data
  })
}

// 知识树节点删除
export function deleteNode(data) {
  return request({
    url: '/classifyTree/deleteNode',
    method: 'post',
    data
  })
}

// 知识树节点更新名字
export function updateNodeName(data) {
  return request({
    url: '/classifyTree/updateNodeName',
    method: 'post',
    data
  })
}
