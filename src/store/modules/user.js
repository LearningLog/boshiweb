import { login, logout, getInfo, getMenuList, getAllRolesNoPage, getAllEgroup, getUserApplicationInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import store from '../index'
const qs = require('querystring')

import defaultSettings from '@/settings'

const { logo_name } = defaultSettings
/**
 * 退出登录，清除cookie
 */
export function clear() {
  sessionStorage.clear()
}

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  logo: '',
  logo_name: logo_name,
  userSystemInfo: {}, // 当前用户和系统信息
  allRoles: [], // 所有角色
  allEgroup: {}, // 所有小组
  manageEgroupInfo: {}, // 管理的小组
  applicationInfo: {}, // 应用信息
  userPermission: {}, // 用户权限
  isSystemManage: false
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_LOGO: (state, logo) => {
    state.logo = logo
  },
  SET_LOGO_NAME: (state, logo_name) => {
    state.logo_name = logo_name || defaultSettings.logo_name
  },
  SET_USER_SYSTEM_INFO: (state, userSystemInfo) => {
    state.userSystemInfo = userSystemInfo
  },
  SET_ALL_ROLES: (state, allRoles) => {
    state.allRoles = allRoles
  },
  SET_ALL_EGROUP: (state, allEgroup) => {
    state.allEgroup = allEgroup
    var manageEgroupInfo = {}
    allEgroup.manageEgroupInfo = allEgroup.manageEgroupInfo || []
    allEgroup.manageEgroupInfo.forEach(item => {
      manageEgroupInfo[item.inc] = item
    })
    state.manageEgroupInfo = manageEgroupInfo
  },
  APPLICATION_INFO: (state, applicationInfo) => {
    state.applicationInfo = applicationInfo
  },
  IS_SYSTEN_MANAGE: (state, userPermission) => {
    state.userPermission = userPermission
    if (userPermission.manageType === 1) {
      state.isSystemManage = true
    } else {
      state.isSystemManage = false
    }
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login(qs.stringify({ username: username.trim(), password: password, logintype: 1 })).then(response => {
        if (response.code === 0) {
          const { data } = response
          commit('SET_TOKEN', data)
          setToken(data)
        }
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getMenuList().then(async response => {
        if (!response.data) {
          reject('验证失败，请再次登录')
        }
        await getInfo().then(res => {
          if (!res.data) {
            reject('验证失败，请再次登录')
          }
          let { logo, userInfo } = res.data
          logo = logo || {}
          userInfo = userInfo || {}
          commit('SET_LOGO', logo.platform_url)
          commit('SET_LOGO_NAME', logo.logo_name)
          commit('SET_AVATAR', userInfo.avatarUrl)
          commit('SET_NAME', userInfo.nickname)
          commit('SET_USER_SYSTEM_INFO', res.data)
        })
        const routes = {}
        response.data = response.data || {}
        routes.responseRoutes = response.data.tenementMenus.concat(response.data.systemMenus)
        commit('IS_SYSTEN_MANAGE', response.data.userPermission)
        routes.allButtonPermission = {
          allPermissionCode: response.data.allPermissionCode,
          userPermission: response.data.userPermission,
          userPermissionDetailList: response.data.userPermissionDetailList
        }
        resolve(routes)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        store.dispatch('permission/clearPermissionRoutes')
        removeToken()
        resetRouter()
        clear()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  },

  // 获取所有角色
  getAllRoles({ commit }) {
    getAllRolesNoPage().then(res => {
      commit('SET_ALL_ROLES', res.data)
    })
  },

  // 获取所有小组
  getAllEgroup({ commit }) {
    getAllEgroup().then(res => {
      commit('SET_ALL_EGROUP', res.data)
    })
  },

  // 获取应用信息
  getUserApplicationInfo({ commit }) {
    getUserApplicationInfo().then(res => {
      commit('APPLICATION_INFO', res.data)
    })
  },

  // 设置系统logo和名称
  setLogo_Name({ commit }, data) {
    commit('SET_LOGO', data.platform_url)
    commit('SET_LOGO_NAME', data.logo_name)
  }
}

export default {
  // 通过添加 namespaced: true,使模块具有更高的封装度和复用性，使其成为带命名空间的模块
  // 当模块被注册后，它的所有 getter、action 及 mutation 都会自动根据模块注册的路径调整命名。
  namespaced: true,
  state,
  mutations,
  actions
}

