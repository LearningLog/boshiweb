import { asyncRoutes, constantRoutes } from '@/router'
import Cookies from 'js-cookie'

/**
 * 根据后端返回的路由表对比前端路由表，返回对应路由表
 * @param routes asyncRoutes
 * @param responseRoutes
 */
let homePath = ''
let flag = true
export function filterAsyncRoutes(routes, responseRoutes) {
  const res = []
  responseRoutes.forEach((resRoute, index) => {
    const item = { ...resRoute }
    routes.forEach((route, index2) => {
      const tmp = { ...route }
      if (flag) {
        homePath += tmp.path + '/'
      }
      if (item.path === tmp.path) {
        if (item.children && item.children.length > 0) {
          tmp.children = filterAsyncRoutes(tmp.children, item.children)
        } else if (homePath.indexOf(tmp.path) > -1) {
          flag = false
          homePath = homePath.slice(0, homePath.length - 1)
        }
        tmp.buttonPermission = item.buttonPermission
        res.push(tmp)
      }
    })
  })

  // for (let i = 0, len = responseRoutes.length; i < len; i++) {
  //   const item = responseRoutes[i]
  //   for (let j = 0, len = routes.length; j < len; j++) {
  //     const tmp = routes[j]
  //     if (flag) {
  //       homePath += tmp.path + '/'
  //     }
  //     if (item.path === tmp.path) {
  //       if (item.children && item.children.length > 0) {
  //         tmp.children = filterAsyncRoutes(tmp.children, item.children)
  //       } else if (homePath.indexOf(tmp.path) > -1) {
  //         flag = false
  //         homePath = homePath.slice(0, homePath.length - 1)
  //       }
  //       res.push(tmp)
  //     }
  //   }
  // }

  return res
}

const state = {
  routes: [],
  addRoutes: [],
  homePath: Cookies.get('homePath') ? !!+Cookies.get('homePath') : '',
  allButtonPermission: Cookies.get('allButtonPermission') ? !!+JSON.parse(Cookies.get('allButtonPermission')) : '',
  currentButtonPermission: Cookies.get('currentButtonPermission') ? !!+JSON.parse(Cookies.get('currentButtonPermission')) : ''
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
  SET_HOME_PATH: (state, path) => {
    state.homePath = path
    Cookies.set('homePath', path)
  },

  SET_ALL_CURRENT_BTN_PERMISSION: (state, allButtonPermission) => {
    state.allButtonPermission = JSON.stringify(allButtonPermission)
    Cookies.set('allButtonPermission', JSON.stringify(allButtonPermission))
  },

  SET_CURRENT_BTN_PERMISSION: (state, currentButtonPermission) => {
    state.currentButtonPermission = JSON.stringify(currentButtonPermission)
    Cookies.set('currentButtonPermission', JSON.stringify(currentButtonPermission))
  }
}

const actions = {
  generateRoutes({ commit }, responseRoutes) {
    return new Promise(async resolve => {
      const accessedRoutes = await filterAsyncRoutes(asyncRoutes, responseRoutes)
      accessedRoutes.push({ path: '*', redirect: '/404', hidden: true })
      commit('SET_ROUTES', accessedRoutes)
      commit('SET_HOME_PATH', homePath)
      resolve(accessedRoutes)
    })
  },

  setAllCurrentBtnMermission({ commit }, allButtonPermission) {
    commit('SET_ALL_CURRENT_BTN_PERMISSION', allButtonPermission)
  },

  setCurrentBtnMermission({ commit }, currentButtonPermission) {
    commit('SET_CURRENT_BTN_PERMISSION', currentButtonPermission)
  }
}

export default {
  // 通过添加 namespaced: true,使模块具有更高的封装度和复用性，使其成为带命名空间的模块
  namespaced: true,
  state,
  mutations,
  actions
}
