import { asyncRoutes, constantRoutes } from '@/router'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  // const router = [
  //   {
  //     path: '/nested',
  //     redirect: '/nested/menu1',
  //     name: 'Nested',
  //     meta: {
  //       title: 'Nested',
  //       icon: 'nested'
  //     },
  //     children: [
  //       {
  //         path: 'menu1',
  //         name: 'Menu1',
  //         meta: { title: 'Menu1' },
  //         children: [
  //           {
  //             path: 'menu1-1',
  //             name: 'Menu1-1',
  //             meta: { title: 'Menu1-1' }
  //           },
  //           {
  //             path: 'menu1-2',
  //             name: 'Menu1-2',
  //             meta: { title: 'Menu1-2' },
  //             children: [
  //               {
  //                 path: 'menu1-2-1',
  //                 name: 'Menu1-2-1',
  //                 meta: { title: 'Menu1-2-1' }
  //               },
  //               {
  //                 path: 'menu1-2-2',
  //                 name: 'Menu1-2-2',
  //                 meta: { title: 'Menu1-2-2' }
  //               }
  //             ]
  //           },
  //           {
  //             path: 'menu1-3',
  //             name: 'Menu1-3',
  //             meta: { title: 'Menu1-3' }
  //           }
  //         ]
  //       },
  //       {
  //         path: 'menu2',
  //         meta: { title: 'menu2' }
  //       }
  //     ]
  //   },
  //
  //   {
  //     path: 'external-link',
  //     children: [
  //       {
  //         path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
  //         meta: { title: 'External Link', icon: 'link' }
  //       }
  //     ]
  //   },
  //
  //   // 404 page must be placed at the end !!!
  //   { path: '*', redirect: '/404', hidden: true }
  // ]
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    debugger
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
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
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      // let accessedRoutes
      // if (roles.includes('admin')) {
      //   accessedRoutes = asyncRoutes || []
      // } else {
      //   accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      // }
      const accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
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
