import { getToken } from '@/utils/auth'
const myWebsocket = process.env.VUE_APP_WebSocket_BASE_API
import store from '@/store'
import { MessageBox } from 'element-ui'

class Websocket {
  message = (msg) => {
    store.dispatch('realTimeMessage/currentMsg', msg)
  }
  opts = {
    query: {},
    id: '' // 课程id
  }
  hbHandler = {}
  constructor(url, autoConnect) {
    this.url = myWebsocket
  }

  //  初始化
  init() {
    if (typeof (WebSocket) === 'undefined') {
      MessageBox.alert('您的浏览器不支持socket！', '提示', {
        confirmButtonText: '确定',
        callback: action => {

        }
      })
    } else {
      this._on('open', this._connectHandler)
        ._on('message', this._messageHandler)
        ._on('close', this._disconnectHandler)
        ._on('error', this._errorHandler)
    }
  }

  //  打开WebSocket的按钮
  open(id) {
    this.opts.id = id
    this.setOpenQuery({
      Authorization: getToken()
    })
    this.$io = new WebSocket(this._wsUrl())
    this.init()
  }

  // 关闭WebSocket的按钮
  close() {
    this.closeWs()
  }

  closeWs() {
    if (this.$io) {
      this.$io.close()
      clearInterval(this.hbHandler) //  定时器要关掉
      this._off('open', this._connectHandler)
        ._off('message', this._messageHandler)
        ._off('close', this._disconnectHandler)
        ._off('error', this._errorHandler)
    }
  }

  //  向服务端传信息，这里只用作心跳包
  commit(data) {
    this.$io && (this.$io.readyState === 1) && this.$io.send(JSON.stringify(data))
    if ((this.$io && (this.$io.readyState === 2)) || (this.$io && (this.$io.readyState === 3))) {
      this.close()
    }
  }

  _on(eventName, handler) {
    this.$io.addEventListener(eventName, handler)
    return this
  }

  _off(eventName, handler) {
    this.$io.removeEventListener(eventName, handler)
    return this
  }

  // token
  setOpenQuery(query = {}) {
    this.resetOptions({ query })
  }

  resetOptions(opts) {
    Object.assign(this.opts, opts)
  }

  _wsUrl() { //  这里拼接的，很low
    return myWebsocket + 'api/websocket/' + this.opts.id + '/' + this.getUuid(16, 16)
  }

  // 生成uuid
  getUuid(len, radix) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
    var uuid = []
    var i
    radix = radix || chars.length
    if (len) {
      for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix]
    } else {
      var r
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
      uuid[14] = '4'
      for (i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | Math.random() * 16
          uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r]
        }
      }
    }
    return uuid.join('')
  }

  _connectHandler = (event) => {
    console.log('连接->正常')
    this._heartBeat()
  }

  //  心跳包
  _heartBeat() {
    this.hbHandler = setInterval(() => {
      this.commit('heartbeat')
    }, 10000)
  }

  _messageHandler = (event) => { // 接收到的信息
    const meg = JSON.parse(event.data)
    if (meg) {
      console.log('msg', meg.msg)
      store.dispatch('realTimeMessage/currentMsg', meg)
    }
    // meg && this.message(meg) // 这里是执行的事件，需要传进来
    // console.log('msg', meg.msg)
  }

  //  断开
  _disconnectHandler = (event) => {
    this.close()
  }

  //  连接错误
  _errorHandler = () => {
    this.close()
  }
}
export default {
  install(Vue, options) { // 自己个挂的插件
    Vue.prototype.$ws = new Websocket(myWebsocket)
  }
}
