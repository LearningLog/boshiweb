/**
* @Author: YanHuaKang
* @Date: 2019/11/8
* @Description: 试卷管理接口
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

// 试卷列表
export function evaluationPaperList(data) {
  return request({
    url: '/evaluation/examinationpaper/listV2',
    method: 'post',
    data
  })
}

// 新增试卷
export function addTestPaper(data) {
  return request({
    url: '/evaluation/examinationpaper/add',
    method: 'post',
    data
  })
}

// 删除试卷
export function delPaper(data) {
  return request({
    url: '/evaluation/examinationpaper/del',
    method: 'post',
    data
  })
}
// 导入试卷
export function importTopics(data) {
  return request({
    url: '/evaluation/topicImport/importTopics',
    method: 'post',
    data
  })
}
// 试卷详情
export function paperDetail(data) {
  return request({
    url: '/evaluation/examinationpaper/one',
    method: 'post',
    data
  })
}
// 修改试卷
export function testPaperUpdata(data) {
  return request({
    url: 'evaluation/examinationpaper/update',
    method: 'post',
    data
  })
}
// 发布试卷
export function publish(data) {
  return request({
    url: '/evaluation/examinationpaper/publish/exam',
    method: 'post',
    data
  })
}
// 获取考试人员数据
export function getExamUserInfo(data) {
  return request({
    url: 'evaluation/user/addexam/userinfo',
    method: 'post',
    data
  })
}
// 智能添加试题接口
export function intelligence(data) {
  return request({
    url: '/evaluation/examinationpaper/intelligence',
    method: 'post',
    data
  })
}
// 根据标签和技能刷新数据接口，获取当前可用题数
export function getTopicCount(data) {
  return request({
    url: '/evaluation/automatic/select',
    method: 'post',
    data
  })
}

// 试卷生成导出文档
export function generateExportPaper(data) {
  return request({
    url: '/evaluation/paper/manage/export',
    method: 'post',
    data
  })
}
// 导出单个试卷
export function exportPaperOne(data) {
  var url = process.env.VUE_APP_BASE_API + '/evaluation/paper/manage/downloadword'
  return service({
    url,
    method: 'post',
    responseType: 'blob',
    data
  })
}
// 导出多个文件
export function exportPaperMore(data) {
  var url = process.env.VUE_APP_BASE_API + '/evaluation/paper/manage/downloadzip'
  return service({
    url,
    method: 'post',
    responseType: 'blob',
    data
  })
}
