/**
* @Author: YanHuaKang
* @Date: 2019/11/14
* @Description: 文件上传
* @remarks:
*/
const state = {
  visibility: { bottom: '-522px' }, // 是否弹出上传组件
}

const mutations = {
  SET_VISIBILITY: (state, isVisibility) => { // 1，弹出；2，关闭；3，最小化
    if (isVisibility === 1) {
      state.visibility = {
        visibility: 'visible',
        bottom: '0'
      }
    } else if (isVisibility === 2) {
      state.visibility = {
        bottom: '-522px',
        transition: '1s'
      }
    } else if (isVisibility === 3) {
      state.visibility = {
        bottom: '-483px',
        visibility: 'visible',
        transition: '1s'
      }
    }
  }
}

const actions = {
  isVisibility({ commit }, isVisibility) {
    commit('SET_VISIBILITY', isVisibility)
  },
  minimality({ commit }) {
    commit('SET_VISIBILITY')
  }
}

export default {
  // 通过添加 namespaced: true,使模块具有更高的封装度和复用性，使其成为带命名空间的模块
  namespaced: true,
  state,
  mutations,
  actions
}
