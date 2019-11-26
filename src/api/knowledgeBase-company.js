/**
 * @Author: LiuYouyu
 * @Date: 2019/11/24
 * @Description: 知识库-企业知识库接口
 * @remarks:
 */
import request from '@/utils/request'

// 所属租户列表
export function getCustomManageList() {
  return request({
    url: '/system/customV2/getCustomManageList',
    method: 'post',
    data: {}
  })
}

// 知识库目录列表
export function listDirFile(data) {
  return request({
    url: '/knowledgeDirFile/listDirFile',
    method: 'post',
    data
  })
}
// 知识库目录列表
export function updateDir(data) {
  return request({
    url: '/knowledgeDirFile/updateDir',
    method: 'post',
    data
  })
}

// 获取知识分类树
export function getCompanyAllTree(data) {
  return request({
    url: '/classifyTree/getCompanyAllTree',
    method: 'post',
    data
  })
}
// 加入知识分类
export function classifyFiles(data) {
  return request({
    url: '/knowledgeDirFile/classify',
    method: 'post',
    data
  })
}

// 获取技能列表
export function skillManagerList(data) {
  return request({
    url: '/system/skill/listV2',
    method: 'post',
    data
  })
}

// 获取所有技能列表
export function skillAllList(data) {
  return request({
    url: '/evaluation/automatic/skillList',
    method: 'post',
    data
  })
}
// 单个技能详情 system/skill/one
export function getItem(data) {
  return request({
    url: '/system/skill/one',
    method: 'post',
    data
  })
}
// 修改技能
export function modifyItem(data) {
  return request({
    url: '/system/skill/update',
    method: 'post',
    data
  })
}

// 新增技能
export function addItem(data) {
  return request({
    url: '/system/skill/add',
    method: 'post',
    data
  })
}
// 删除技能
export function deleteItem(data) {
  return request({
    url: 'system/skill/delete',
    method: 'post',
    data
  })
}
// 删除技能
export function deleteMulti(data) {
  return request({
    url: 'system/skill/deleteMulti',
    method: 'post',
    data
  })
}
