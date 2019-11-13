/**
 * @Author: zhaoxiaoke
 * @Date: 2019/11/12
 * @Description: 个人工作台
 * @remarks:
 */
import request from '@/utils/request'
import axios from 'axios'
import { MessageBox } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

axios.interceptors.request.use(
  config => {
    config.headers['Authorization'] = getToken()
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
axios.interceptors.response.use(
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
  var url = process.env.VUE_APP_BASE_API + '/api/workDeskFile/downloadFile?fileId=' + data.fileId
  return request({
    url,
    method: 'get',
    responseType: 'blob',
    data
  })
}

//获取下载token信息
export function getDownloadToken(data) {
  return request({
    url: 'workDeskFileList/getToken',
    method: 'post',
    data
  })
}

// 批量下载文件
export function batchDownload(data) {
  return request({
    url: 'api/workDeskFile/downloadZipFile',
    method: 'post',
    data
  })
}
