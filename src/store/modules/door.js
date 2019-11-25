/**
* @Author: YanHuaKang
* @Date: 2019/11/25
* @Description: 门户
* @remarks:
*/

const state = {
  keyword: '' // 关键词
}

const mutations = {
  SET_KEYWORD: (state, keyword) => {
    state.keyword = keyword
  }
}

const actions = {
  setKeyword({ commit }, keyword) {
    commit('SET_KEYWORD', keyword)
  }
}

export default {
  // 通过添加 namespaced: true,使模块具有更高的封装度和复用性，使其成为带命名空间的模块
  namespaced: true,
  state,
  mutations,
  actions
}
