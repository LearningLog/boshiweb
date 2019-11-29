/**
* @Author: YanHuaKang
* @Date: 2019/10/14
* @Description: 封装http请求
* @remarks:
*/

import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 20 * 1000 // request timeout
})

/**
 * 请求拦截器
 * 拦截器函数接收一个参数 config
 * config 就是你当前请求的配置对象
 * 当你使用 axios 发起请求的时候，那么就会先经过这个拦截器然后再发出请求
 * 也就是说在请求拦截器内部的请求还没有发出去
 * 我们可以在这里定制请求之前的行为
 */
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Authorization'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
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
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 0 && res.code !== 5001) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 29999: 非法token;  30000: Token 过期;
      if (res.code === 29999) {
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
      if (res.code === 30000) {
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
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
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

export default service
