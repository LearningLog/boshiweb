/**
* @Author: YanHuaKang
* @Date: 2019/11/20
* @Description: Websocket实时数据传递
* @remarks:
*/

const state = {
  realTimeMessage: {} // 实时消息
}

const mutations = {
  CURRENT_MESSAGE: (state, msg) => {
    state.realTimeMessage = msg
  }
}

const actions = {
  currentMsg({ commit }, msg) {
    commit('CURRENT_MESSAGE', msg)
  }
}

export default {
  // 通过添加 namespaced: true,使模块具有更高的封装度和复用性，使其成为带命名空间的模块
  namespaced: true,
  state,
  mutations,
  actions
}
