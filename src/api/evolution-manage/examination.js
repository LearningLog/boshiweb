/**
* @Author: zhaoxiaoke
* @Date: 2019/11/09
* @Description: 考试管理接口
* @remarks:
*/

import request from '@/utils/request'
import axios from 'axios'
import { MessageBox } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
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

// 获取考试管理列表数据
export function getExaminationList(data) {
  return request({
    url: '/evaluation/examination/listV2',
    method: 'post',
    data
  })
}

// 删除考试接口
export function delExam(data) {
  return request({
    url: '/evaluation/examination/del',
    method: 'post',
    data
  })
}

// 发布考试
export function publishExam(data) {
  return request({
    url: 'evaluation/examinationpaper/add',
    method: 'post',
    data
  })
}
// 发布考试2 虚选择试卷
export function publishExam2(data) {
  return request({
    url: 'evaluation/examination/add',
    method: 'post',
    data
  })
}
// 考试详情
export function examDetail(data) {
  return request({
    url: '/evaluation/examination/one',
    method: 'post',
    data
  })
}
// 考试修改
export function examUpdate(data) {
  return request({
    url: '/evaluation/examination/update',
    method: 'post',
    data
  })
}
// 答题详情
export function answerInfo(data) {
  return request({
    url: '/evaluation/grade/answerinfo',
    method: 'post',
    data
  })
}
// 成绩统计
export function userGrade(data) {
  return request({
    url: '/evaluation/grade/user',
    method: 'post',
    data
  })
}
// 得分统计
export function topicGrade(data) {
  return request({
    url: '/evaluation/grade/topic',
    method: 'post',
    data
  })
}
// 个人答题统计
export function oneAnswerInfo(data) {
  return request({
    url: '/evaluation/grade/oneanswerinfo',
    method: 'post',
    data
  })
}

