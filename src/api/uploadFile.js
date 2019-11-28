/**
* @Author: YanHuaKang
* @Date: 2019/10/15
* @Description: 文件上传
* @remarks:
*/

import request from '@/utils/request'
import axios from 'axios'
import { MessageBox } from 'element-ui'
import store from '@/store'

// create an axios instance
const service = axios.create({
  timeout: 5000 // request timeout
})

service.interceptors.request.use(
  config => {
    return config
  },
  error => {
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

/**
 * 响应拦截器
 * 我们可以在这里对一些公共的业务进行处理
 * 例如需要对每个接口进行 403 权限认证判断
 * 如果本地响应的数据是 403 ，则我们提示用户：你没有权限执行该操作
 */
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    // const res = response.data
    return response
  },
  error => {
    // 29999: 非法token;  30000: Token 过期;
    if (error.response.data.code === 29999) {
      // to re-login
      MessageBox.confirm('您尚未登陆，请登录。', '退出登录', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
      })
    }
    if (error.response.data.code === 30000) {
      // to re-login
      MessageBox.confirm('令牌已失效，请您重新登陆。', '退出登录', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
      })
    }
    return Promise.reject(error)
  }
)

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
  return service({
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
