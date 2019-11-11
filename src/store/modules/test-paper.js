/**
* @Author: YanHuaKang
* @Date: 2019/11/9
* @Description: 新增试卷，跳页缓存数据
* @remarks:
*/

const state = {
  testPaper: sessionStorage.getItem('testPaper') ? JSON.parse(sessionStorage.getItem('testPaper')) : {}, // 新增试卷，跳页缓存的试卷数据
  topics: sessionStorage.getItem('topics') ? JSON.parse(sessionStorage.getItem('topics')) : [] // 试题
}

const mutations = {
  SET_TEST_PAPER_TEPORARY_STORAGE: (state, testPaper) => {
    state.testPaper = testPaper
    sessionStorage.setItem('testPaper', JSON.stringify(testPaper))
  },
  SET_TOPICS_TEPORARY_STORAGE: (state, topics) => {
    state.topics = topics
    sessionStorage.setItem('topics', JSON.stringify(topics))
  }
}

const actions = {
  temporaryStorageTestPaper({ commit }, testPaper) {
    commit('SET_TEST_PAPER_TEPORARY_STORAGE', testPaper)
  },
  temporaryStorageTopics({ commit }, topics) {
    commit('SET_TOPICS_TEPORARY_STORAGE', topics)
  }
}

export default {
  // 通过添加 namespaced: true,使模块具有更高的封装度和复用性，使其成为带命名空间的模块
  namespaced: true,
  state,
  mutations,
  actions
}
