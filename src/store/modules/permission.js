import { asyncRoutes, constantRoutes } from '@/router'

/**
 * 根据后端返回的路由表对比前端路由表，返回对应路由表
 * @param routes asyncRoutes
 * @param responseRoutes
 */
export function filterAsyncRoutes(routes, responseRoutes) {
  const res = []
  responseRoutes.forEach(resRoute => {
    const item = { ...resRoute }
    routes.forEach(route => {
      const tmp = { ...route }
      if (item.path === tmp.path) {
        if (item.children && item.children.length > 0) {
          tmp.children = filterAsyncRoutes(tmp.children, item.children)
        }
        res.push(tmp)
      }
    })
  })
  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, responseRoutes) {
    return new Promise(resolve => {
      const accessedRoutes = filterAsyncRoutes(asyncRoutes, responseRoutes)
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
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
