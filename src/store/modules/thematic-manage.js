/**
* @Author: YanHuaKang
* @Date: 2019/12/5
* @Description: 专题课堂管理
* @remarks:
*/

const state = {
  lessons: sessionStorage.getItem('lessons') ? JSON.parse(sessionStorage.getItem('lessons')) : {} // 已选择的课程
}

const mutations = {
  SET_LESSONS_TEPORARY_STORAGE: (state, lessons) => {
    state.lessons = lessons
    sessionStorage.setItem('lessons', JSON.stringify(lessons))
  }
}

const actions = {
  temporaryStorageLessons({ commit }, lessons) {
    commit('SET_LESSONS_TEPORARY_STORAGE', lessons)
  }
}

export default {
  // 通过添加 namespaced: true,使模块具有更高的封装度和复用性，使其成为带命名空间的模块
  namespaced: true,
  state,
  mutations,
  actions
}
