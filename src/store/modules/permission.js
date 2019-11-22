import { asyncRoutes, constantRoutes } from '@/router'
import Cookies from 'js-cookie'

/**
 * 根据后端返回的路由表对比前端路由表，返回对应路由表
 * @param routes asyncRoutes
 * @param responseRoutes
 */
let homePath = ''
let homePaths = ''
let flag = true
export function filterAsyncRoutes(routes, responseRoutes) {
  const res = []
  responseRoutes.forEach((resRoute, index) => {
    const item = { ...resRoute }
    routes.forEach((route, index2) => {
      const tmp = { ...route }
      // if (flag) {
      //   homePath += tmp.path + '/'
      // }
      if (item.menuurl === tmp.path) {
        if (flag) {
          homePath += tmp.path + '/'
        }
        tmp.meta.title = item.menuname
        tmp.meta.icon = item.imagename
        if (item.children && item.children.length > 0) {
          tmp.children = filterAsyncRoutes(tmp.children, item.children)
        } else if (homePath.indexOf(tmp.path) > -1) {
          flag = false
          homePaths = homePath.slice(0, homePath.length - 1)
        }
        tmp.buttonPermission = item.buttonPermission
        res.push(tmp)
      } else if (homePath) {
        homePath = ''
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

export function getCurrentSystem(path) {
  if (path) {
    const pathArr = path.split('/')
    return pathArr[1]
  }
  return []
}

const state = {
  routes: [], // 当前完整路由
  addRoutes: [], // 当前权限路由
  homePath: '', // 后台首页
  allPermissionCode: Cookies.get('allPermissionCode') ? JSON.parse(Cookies.get('allPermissionCode')) : '', // 系统设置的所有权限code
  userPermission: Cookies.get('userPermission') ? JSON.parse(Cookies.get('userPermission')) : '', // 当前用户的身份权限信息
  userPermissionDetailList: Cookies.get('userPermissionDetailList') ? JSON.parse(Cookies.get('userPermissionDetailList')) : '' // 当前用户所拥有的所有权限
}

const mutations = {
  // 设置权限路由
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
  // 设置后台首页
  SET_HOME_PATH: (state, homePath) => {
    state.homePath = homePath
  },
  // 设置当前url是哪个系统
  SET_CURRENT_SYSTEM: (state, type) => {
    state.currentSystem = type
  },

  // 登出清除路由
  CLEAR_ROUTER: (state) => {
    state.addRoutes = []
    state.routes = []
  },

  // 系统设置的所有按钮code
  SET_ALL_PERMISSION_CODE: (state, allPermissionCode) => {
    state.allPermissionCode = allPermissionCode
    Cookies.set('allPermissionCode', JSON.stringify(allPermissionCode))
  },

  // 当前用户的身份权限信息
  SET_USER_PERMISSION_INFO: (state, userPermission) => {
    state.allPermissionCode = userPermission
    Cookies.set('userPermission', JSON.stringify(userPermission))
  },

  // 当前用户所拥有的所有权限
  SET_USER_HAS_PERMISSION_LIST: (state, userPermissionDetailList) => {
    state.allPermissionCode = userPermissionDetailList
    Cookies.set('userPermissionDetailList', JSON.stringify(userPermissionDetailList))
  }
}

const actions = {
  generateRoutes({ commit }, responseRoutes) {
    return new Promise(async resolve => {
      const accessedRoutes = await filterAsyncRoutes(asyncRoutes, responseRoutes)
      accessedRoutes.push({ path: '*', redirect: '/404', hidden: true })
      commit('SET_ROUTES', accessedRoutes)
      commit('SET_HOME_PATH', homePaths)
      resolve(accessedRoutes)
    })
  },

  clearPermissionRoutes({ commit }) {
    commit('CLEAR_ROUTER')
  },

  setAllBtnMermission({ commit }, allButtonPermission) {
    commit('SET_ALL_PERMISSION_CODE', allButtonPermission.allPermissionCode)
    commit('SET_USER_PERMISSION_INFO', allButtonPermission.userPermission)
    commit('SET_USER_HAS_PERMISSION_LIST', allButtonPermission.userPermissionDetailList)
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
