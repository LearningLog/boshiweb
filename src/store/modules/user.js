import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import Cookies from 'js-cookie'
import store from '../index'
const qs = require('querystring')

/**
 * 退出登录，清除cookie
 */
export function clearCookie() {
  Cookies.remove('homePath')
  Cookies.remove('allButtonPermission')
  Cookies.remove('currentButtonPermission')
  Cookies.remove('currentSystem')
}

const state = {
  token: getToken(),
  name: '',
  avatar: ''
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
      // getInfo(state.token).then(response => {
      //   const { data } = response
      //
      //   if (!data) {
      //     reject('Verification failed, please Login again.')
      //   }
      //
      //   const { name, avatar, logo } = data
      //
      //
      //   commit('SET_NAME', name)
      //   commit('SET_AVATAR', avatar)
      //   commit('SET_LOGO', logo)
      //   resolve(data)
      // }).catch(error => {
      //   reject(error)
      // })

      commit('SET_NAME', 'yanhukang')
      commit('SET_AVATAR', 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif')
      const allButtonPermission = {
        example: {
          del: true,
          add: false
        }
      }
      const data = { systemRoutes: [
        {
          name: '系统设置',
          path: '/systemManage', // 组件路径
          children: [ // 子菜单
            {
              name: '菜单管理',
              path: 'menuManage'
            },
            {
              path: 'tenantManage'
            }
          ]
        }
      ],
      backstageRoutes: [
        {
          path: '/nested', // 组件路径
          children: [ // 子菜单
            {
              path: 'menu1',
              children: [
                {
                  path: 'menu1-1',
                  buttonPermission: {
                    del: true,
                    add: false
                  }
                },
                {
                  path: 'menu1-2',
                  children: [
                    {
                      path: 'menu1-2-1'
                    },
                    {
                      path: 'menu1-2-2'
                    }
                  ]
                },
                {
                  path: 'menu1-3'
                }
              ]
            },
            {
              path: 'menu2'
            }
          ]
        },

        {
          path: 'external-link',
          children: [
            {
              path: 'https://panjiachen.github.io/vue-element-admin-site/#/'
            }
          ]
        }
      ], allButtonPermission: allButtonPermission }
      resolve(data)
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

