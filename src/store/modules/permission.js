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
      if (flag) {
        homePath += tmp.path + '/'
      }
      if (item.menuurl === tmp.path) {
        tmp.meta.title = item.menuname
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

const state = {
  routes: [],
  addRoutes: [],
  currentSystem: Cookies.get('currentSystem') ? Cookies.get('currentSystem') : '',
  systemRoutes: [],
  backstageRoutes: [],
  homePath: Cookies.get('homePath') ? Cookies.get('homePath') : '',
  systemHomePath: Cookies.get('systemHomePath') ? Cookies.get('systemHomePath') : '',
  backstageHomePath: Cookies.get('backstageHomePath') ? Cookies.get('backstageHomePath') : '',
  allButtonPermission: Cookies.get('allButtonPermission') ? !!+JSON.parse(Cookies.get('allButtonPermission')) : '',
  currentButtonPermission: Cookies.get('currentButtonPermission') ? !!+JSON.parse(Cookies.get('currentButtonPermission')) : ''
}

const mutations = {
  // 设置权限路由
  SET_ROUTES: (state, routes) => {
    if (state.currentSystem === 'systemManage' && state.systemRoutes.length > 0) {
      state.addRoutes = state.systemRoutes
      state.routes = constantRoutes.concat(state.systemRoutes)
    } else if (state.currentSystem === 'backstageManage' && state.backstageRoutes.length > 0) {
      state.addRoutes = state.backstageRoutes
      state.routes = constantRoutes.concat(state.backstageRoutes)
    } else {
      state.addRoutes = routes
      state.routes = constantRoutes.concat(routes)
    }
  },
  // 设置系统管理路由
  SET_SYSTEM_ROUTES: (state, routes) => {
    state.systemRoutes = routes
  },
  // 设置后台管理路由
  SET_BACKSTAGE_ROUTES: (state, routes) => {
    state.backstageRoutes = routes
  },
  // 设置当前url是哪个系统
  SET_CURRENT_SYSTEM: (state, type) => {
    state.currentSystem = type
  },
  CLEAR_ROUTER: (state) => {
    state.addRoutes = []
    state.routes = []
  },

  SET_HOME_PATH: (state, path) => {
    state.homePath = path
    Cookies.set('homePath', path)
  },

  SET_SYSTEM_HOME_PATH: (state, path) => {
    state.systemHomePath = path
    Cookies.set('systemHomePath', path)
  },

  SET_BACKSTAGE__HOME_PATH: (state, path) => {
    state.backstageHomePath = path
    Cookies.set('backstageHomePath', path)
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
      const { systemRoutes, backstageRoutes } = responseRoutes
      const accessedRoutes1 = await filterAsyncRoutes(asyncRoutes, systemRoutes)
      commit('SET_SYSTEM_HOME_PATH', homePaths)
      homePath = ''
      flag = true
      const accessedRoutes2 = await filterAsyncRoutes(asyncRoutes, backstageRoutes)
      commit('SET_BACKSTAGE__HOME_PATH', homePaths)
      accessedRoutes1.push({ path: '*', redirect: '/404', hidden: true })
      accessedRoutes2.push({ path: '*', redirect: '/404', hidden: true })
      commit('SET_SYSTEM_ROUTES', accessedRoutes1)
      commit('SET_BACKSTAGE_ROUTES', accessedRoutes2)
      commit('SET_ROUTES', accessedRoutes2)

      resolve(accessedRoutes2)
    })
  },

  // 根据type设置路由及生成当前系统菜单
  set_permission_routes({ commit }, type) {
    if (type === 1) { // 系统管理
      commit('SET_CURRENT_SYSTEM', 'systemManage')
      Cookies.set('currentSystem', 'systemManage')
      commit('SET_ROUTES', state.systemRoutes)
    } else { // 后台管理
      commit('SET_CURRENT_SYSTEM', 'backstageManage')
      Cookies.set('currentSystem', 'backstageManage')
      commit('SET_ROUTES', state.backstageRoutes)
    }
  },

  clearPermissionRoutes({ commit }) {
    commit('CLEAR_ROUTER')
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
