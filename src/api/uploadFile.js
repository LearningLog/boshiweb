/**
* @Author: YanHuaKang
* @Date: 2019/10/15
* @Description: 文件上传
* @remarks:
*/

import request from '@/utils/request'

// 文件上传
export function uploadFile(data) {
  return request({
    url: '/system/file/upload/',
    method: 'post',
    // contentType: false,
    // processData: false,
    // headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data
  })
}
