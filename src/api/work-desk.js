/**
 * @Author: zhaoxiaoke
 * @Date: 2019/11/12
 * @Description: 个人工作台
 * @remarks:
 */
import request from '@/utils/request'

// 获取管理员文件列表
export function getFileListManage(data) {
  return request({
    url: '/workDeskFileList/fileListManage',
    method: 'post',
    data
  })
}

// 获取普通成员文件列表
export function getFileList(data) {
  return request({
    url: '/workDeskFileList/fileList',
    method: 'post',
    data
  })
}

// 文件详情
export function findFileById(data) {
  return request({
    url: '/workDeskFileList/findFileById',
    method: 'post',
    data
  })
}

// 根据租户获取用户列表
export function findUserListByGroupId(data) {
  return request({
    url: '/system/userV2/findUserListByGroupId',
    method: 'post',
    data
  })
}

// 删除文件 支持批量
export function del(data) {
  return request({
    url: '/workDeskFileList/deleteFile',
    method: 'post',
    data
  })
}

// 获取下载token信息
export function getDownloadToken(data) {
  return request({
    url: 'workDeskFileList/getToken',
    method: 'post',
    data
  })
}

// 推送至知识库
export function pushToKnowledge(data) {
  return request({
    url: '/workDeskPushFile/pushFileToKnowledgeLib',
    method: 'post',
    data
  })
}
