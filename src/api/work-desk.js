/**
 * @Author: zhaoxiaoke
 * @Date: 2019/11/12
 * @Description: 个人工作台
 * @remarks:
 */
import request from '@/utils/request'

// 获取文件列表
export function getFileList(data) {
  return request({
    url: '/workDeskFileList/fileListManage',
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

// 下载单个文件
export function download(data) {
  return request({
    url: '/api/workDeskFile/downloadFile',
    method: 'post',
    data
  })
}
// 批量下载文件
export function batch_download(data) {
  return request({
    url: '/api/workDeskFile/downloadZipFile',
    method: 'post',
    data
  })
}
