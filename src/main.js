import 'babel-polyfill'
import Vue from 'vue'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import './styles/element-variables.scss'

import '@/styles/index.scss' // global css
import '@/assets/fonts/iconfont.css' // iconfont css
import '@/assets/fonts/iconfont.js' // iconfont js

import App from './App'
import store from './store'
import router from './router'

import i18n from './lang' // internationalization

// 生成二维码
import VueQriously from 'vue-qriously'

import '@/icons' // icon
import '@/permission' // permission control
import ws from '@/utils/myWebsocket'

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

// 加载 Websocket 插件
// 我们在该插件中为 Vue 原型对象扩展了一个成员 $ws
// 然后我们就可以在任何组件通过使用 this.$ws 来发起请求了
Vue.use(ws)

Vue.use(VueQriously)

Vue.use(ElementUI, {
  size: 'small', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})

// 提交以后禁用按钮一段时间，防止重复提交
Vue.directive('noMoreClick', {
  inserted(el, binding) {
    el.addEventListener('click', e => {
      el.classList.add('is-disabled')
      el.disabled = true
      setTimeout(() => {
        el.disabled = false
        el.classList.remove('is-disabled')
      }, 2000)
    })
  }
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
