/**
* @Author: YanHuaKang
* @Date: 2019/11/5
* @Description: 题库管理
* @remarks:
*/

import request from '@/utils/request'
import axios from 'axios'
import { MessageBox } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

const service = axios.create({
  timeout: 20 * 1000 // request timeout
})
service.interceptors.request.use(
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
      MessageBox.confirm('登录信息已过期,请尝试重新登录。', '退出登录', {
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

// 题库列表
export function evaluationTopicList(data) {
  return request({
    url: '/evaluation/topic/listV2',
    method: 'post',
    data
  })
}

// 新增题库
export function addTopic(data) {
  return request({
    url: '/evaluation/topic/add',
    method: 'post',
    data
  })
}

// 删除试题
export function delTopic(data) {
  return request({
    url: '/evaluation/topic/del',
    method: 'post',
    data
  })
}
// 导入试题
export function importTopics(data) {
  return request({
    url: '/evaluation/topicImport/importTopics',
    method: 'post',
    data
  })
}
// 试题详情
export function topicDetil(data) {
  return request({
    url: '/evaluation/topic/findByIdV2',
    method: 'post',
    data
  })
}
// 修改试题
export function topicEdit(data) {
  return request({
    url: '/evaluation/topic/update',
    method: 'post',
    data
  })
}

// 从服务器获取缓存的试题
export function getCacheTopicFromServiceInterface(data) {
  return request({
    url: 'evaluation/topic/findTopicTempV2',
    method: 'post',
    data
  })
}

// 保存缓存试题到服务器
export function saveCacheTopicToServiceInterface(data) {
  return request({
    url: 'evaluation/topic/addTopicTempV2',
    method: 'post',
    data
  })
}

// 清除服务端缓存的试题
export function clearServiceCacheTopicInterface(data) {
  return request({
    url: 'evaluation/topic/deleteTopicTempV2',
    method: 'post',
    data
  })
}

// 从服务器删除某一题缓存
export function deleteOneCacheTopicFromServiceInterface(data) {
  return request({
    url: 'evaluation/topic/deleteTopicTempByIdV2',
    method: 'post',
    data
  })
}
// 下载Excel导入试题模板
export function exportExcelModel(data) {
  var url = process.env.VUE_APP_BASE_API + '/system/model/downloadModel?code=' + data.code
  return service({
    url,
    method: 'get',
    responseType: 'blob',
    data
  })
}
