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
  const { responseRoutes } = await store.dispatch('user/getInfo')

  const accessRoutes = await store.dispatch('permission/generateRoutes', responseRoutes)
  // 生成菜单前先初始化router
  resetRouter()
  // 动态添加可访问路由
  router.addRoutes(accessRoutes)
}
