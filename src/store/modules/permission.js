import { asyncRoutes, constantRoutes } from '@/router'

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
  currentPath: '', // 当前path
  currentSystem: sessionStorage.getItem('currentSystem') ? sessionStorage.getItem('currentSystem') : '', // 当前所在系统
  systemRoutes: [], // 系统管理路由
  backstageRoutes: [], // 后台管理路由
  systemHomePath: sessionStorage.getItem('systemHomePath') ? sessionStorage.getItem('systemHomePath') : '', // 系统管理首页
  backstageHomePath: sessionStorage.getItem('backstageHomePath') ? sessionStorage.getItem('backstageHomePath') : '', // 后台管理首页
  allPermissionCode: sessionStorage.getItem('allPermissionCode') ? JSON.parse(sessionStorage.getItem('allPermissionCode')) : '', // 系统设置的所有权限code
  userPermission: sessionStorage.getItem('userPermission') ? JSON.parse(sessionStorage.getItem('userPermission')) : '', // 当前用户的身份权限信息
  userPermissionDetailList: sessionStorage.getItem('userPermissionDetailList') ? JSON.parse(sessionStorage.getItem('userPermissionDetailList')) : '' // 当前用户所拥有的所有权限
}

const mutations = {
  // 设置权限路由
  SET_ROUTES: (state, routes) => {
    if (!state.currentSystem && !sessionStorage.getItem('currentSystem')) {
      state.currentSystem = getCurrentSystem(state.currentPath)
      sessionStorage.setItem('currentSystem', state.currentSystem)
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
    } else {
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

  // 登出清除路由
  CLEAR_ROUTER: (state) => {
    state.addRoutes = []
    state.routes = []
  },

  // 设置当前组件path
  SET_CURREN_PATH: (state, path) => {
    state.currentPath = path
  },

  // 设置系统管理首页
  SET_SYSTEM_HOME_PATH: (state, path) => {
    state.systemHomePath = path
    sessionStorage.setItem('systemHomePath', path)
  },

  // 设置后台管理首页
  SET_BACKSTAGE__HOME_PATH: (state, path) => {
    state.backstageHomePath = path
    sessionStorage.setItem('backstageHomePath', path)
  },

  // 系统设置的所有按钮code
  SET_ALL_PERMISSION_CODE: (state, allPermissionCode) => {
    state.allPermissionCode = allPermissionCode
    sessionStorage.setItem('allPermissionCode', JSON.stringify(allPermissionCode))
  },

  // 当前用户的身份权限信息
  SET_USER_PERMISSION_INFO: (state, userPermission) => {
    state.allPermissionCode = userPermission
    sessionStorage.setItem('userPermission', JSON.stringify(userPermission))
  },

  // 当前用户所拥有的所有权限
  SET_USER_HAS_PERMISSION_LIST: (state, userPermissionDetailList) => {
    state.allPermissionCode = userPermissionDetailList
    sessionStorage.setItem('userPermissionDetailList', JSON.stringify(userPermissionDetailList))
  }
}

const actions = {
  generateRoutes({ commit }, responseRoutes) {
    return new Promise(async resolve => {
      const { systemRoutes, backstageRoutes, fullPath } = responseRoutes
      commit('SET_CURREN_PATH', fullPath)
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
      sessionStorage.setItem('currentSystem', 'systemManage')
      commit('SET_ROUTES', state.systemRoutes)
    } else { // 后台管理
      commit('SET_CURRENT_SYSTEM', 'backstageManage')
      sessionStorage.setItem('currentSystem', 'backstageManage')
      commit('SET_ROUTES', state.backstageRoutes)
    }
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
