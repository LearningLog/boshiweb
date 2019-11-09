/**
* @Author: YanHuaKang
* @Date: 2019/11/9
* @Description: 新增试卷，跳页缓存数据
* @remarks:
*/

const state = {
  testPaper: {} // 新增试卷，跳页缓存的试卷数据
}

const mutations = {
  SET_TEST_PAPER_TEPORARY_STORAGE: (state, testPaper) => {
    state.testPaper = testPaper
  }
}

const actions = {
  temporaryStorage({ commit }, testPaper) {
    commit('SET_TEST_PAPER_TEPORARY_STORAGE', testPaper)
  }
}

export default {
  // 通过添加 namespaced: true,使模块具有更高的封装度和复用性，使其成为带命名空间的模块
  namespaced: true,
  state,
  mutations,
  actions
}
