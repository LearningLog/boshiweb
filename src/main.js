import 'babel-polyfill'
import Vue from 'vue'
import Cookies from 'js-cookie'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import './styles/element-variables.scss'

import '@/styles/index.scss' // global css
import '@/assets/fonts/iconfont.css' // iconfont css

import App from './App'
import store from './store'
import router from './router'

import i18n from './lang' // internationalization

// 生成二维码
import VueQriously from 'vue-qriously'

import '@/icons' // icon
import '@/permission' // permission control

/**
 * 本地会启动一个 mock-server 来模拟数据
 * 如果你想启用纯前端 Mock，不使用 mock-server
 * 你可以直接调用 mockXHR()
 *
 * 当目前为开发环境时会使用 MockJs
 * 请在上线前注释掉此处！！！
 * 详情：https://panjiachen.gitee.io/vue-element-admin-site/zh/guide/essentials/mock-api.html，此版本为v4.2.1，
 */
// import { mockXHR } from '../mock'
// if (process.env.NODE_ENV === 'production') {
//   mockXHR()
// }

Vue.use(VueQriously)

Vue.use(ElementUI, {
  size: Cookies.get('size') || 'small', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
