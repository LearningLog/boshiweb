/**
* @Author: YanHuaKang
* @Date: 2019/10/12
* @Description: 更新菜单及路由
* @remarks: 主要用于系统管理中的菜单管理操作
*/

import router from '@/router'
import store from '@/store'
import { resetRouter } from '@/router'

export async function updateMenuRoute() {
  const { systemRoutes, backstageRoutes } = await store.dispatch('user/getInfo')

  // const accessRoutes = await store.dispatch('permission/generateRoutes', { systemRoutes, backstageRoutes })
  await store.dispatch('permission/generateRoutes', { systemRoutes, backstageRoutes })

  // 动态添加可访问路由
  // router.addRoutes(accessRoutes)
  // 生成菜单前先初始化router
  resetRouter()
  router.addRoutes(store.state.permission.systemRoutes)
  await store.dispatch('permission/set_permission_routes', 1)
}
