/**
* @Author: YanHuaKang
* @Date: 2019/11/1
* @Description: 所有小组
* @remarks:
*/

import { getAllEgroup } from '@/api/user'

const state = {
  // 所有小组
  allEgroup: []
}

const mutations = {
  SET_ALL_EGROUP: (state, allEgroup) => {
    state.allEgroup = allEgroup
  }
}

const actions = {
  // 获取所有小组
  getAllEgroup({ commit }) {
    getAllEgroup().then(res => {
      commit('SET_ALL_EGROUP', res.data.manageEgroupInfo)
    })
  }
}

export default {
  // 通过添加 namespaced: true,使模块具有更高的封装度和复用性，使其成为带命名空间的模块
  namespaced: true,
  state,
  mutations,
  actions
}
