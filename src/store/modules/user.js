import { login, logout, getInfo, getMenuList } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import Cookies from 'js-cookie'
import store from '../index'
const qs = require('querystring')

import defaultSettings from '@/settings'

const { logo_name } = defaultSettings
/**
 * 退出登录，清除cookie
 */
export function clearCookie() {
  Cookies.remove('homePath')
  Cookies.remove('systemHomePath')
  Cookies.remove('backstageHomePath')
  Cookies.remove('allButtonPermission')
  Cookies.remove('currentButtonPermission')
  // Cookies.remove('currentSystem')
}

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  logo: '',
  logo_name: logo_name
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
    state.logo_name = logo_name
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
          const { logo, userInfo } = res.data
          if (logo.platform_url) {
            commit('SET_LOGO', logo.platform_url)
          }
          if (logo.logo_name) {
            commit('SET_LOGO_NAME', logo.logo_name)
          }
          if (logo.user_img) {
            commit('SET_AVATAR', userInfo.user_img)
          }
          commit('SET_NAME', userInfo.nickname)
        })
        const routes = {}
        routes.systemRoutes = response.data.systemMenus
        routes.backstageRoutes = response.data.tenementMenus
        routes.allButtonPermission = response.data.allButtonPermission ? response.data.allButtonPermission : {}

        // const allButtonPermission = {
        //   example: {
        //     del: true,
        //     add: false
        //   }
        // }
        // const data = { systemRoutes: [
        //   {
        //     name: '系统设置',
        //     path: '/systemManage', // 组件路径
        //     children: [ // 子菜单
        //       {
        //         name: '菜单管理',
        //         path: 'menuManage'
        //       },
        //       {
        //         name: '租户管理',
        //         path: 'tenantManage'
        //       },
        //       {
        //         name: '文件来源',
        //         path: 'sourceFile'
        //       }
        //     ]
        //   }
        // ],
        // backstageRoutes: [
        //   {
        //     path: '/nested', // 组件路径
        //     children: [ // 子菜单
        //       {
        //         path: 'menu1',
        //         children: [
        //           {
        //             path: 'menu1-1',
        //             buttonPermission: {
        //               del: true,
        //               add: false
        //             }
        //           },
        //           {
        //             path: 'menu1-2',
        //             children: [
        //               {
        //                 path: 'menu1-2-1'
        //               },
        //               {
        //                 path: 'menu1-2-2'
        //               }
        //             ]
        //           },
        //           {
        //             path: 'menu1-3'
        //           }
        //         ]
        //       },
        //       {
        //         path: 'menu2'
        //       }
        //     ]
        //   },
        //
        //   {
        //     path: 'external-link',
        //     children: [
        //       {
        //         path: 'https://panjiachen.github.io/vue-element-admin-site/#/'
        //       }
        //     ]
        //   }
        // ], allButtonPermission: allButtonPermission }

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
        clearCookie()
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

