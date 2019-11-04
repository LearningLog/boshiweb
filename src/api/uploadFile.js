/**
* @Author: YanHuaKang
* @Date: 2019/10/15
* @Description: 文件上传
* @remarks:
*/

import request from '@/utils/request'
import axios from 'axios'

// 租户logo上传
export function uploadFile(data) {
  return request({
    url: '/system/file/upload/',
    method: 'post',
    data
  })
}

// 大文件上传，校验接口
export function fileUpload(data, baseUrl) {
  return axios({
    url: baseUrl + '/fileUploadCheck',
    method: 'post',
    data
  })
}

// 工作台文件上传接口
export function deskAddFile(data) {
  return request({
    url: '/workDeskFileList/addFile',
    method: 'post',
    data
  })
}

// 知识库文件上传接口
export function knowledgeCreateFile(data) {
  return request({
    url: '/knowledgeDirFile/createFile',
    method: 'post',
    data
  })
}
