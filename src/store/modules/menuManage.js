/**
* @Author: YanHuaKang
* @Date: 2019/10/11
* @Description: 菜单管理
* @remarks:
*/
const state = {
  // 菜单类型
  menuType: [{
    id: 'default',
    name: '系统后台'
  },
  {
    id: 'tAdmin',
    name: '租户后台'
  },
  {
    id: 'tenement',
    name: '租户前台'
  }]
}

export default {
  // 通过添加 namespaced: true,使模块具有更高的封装度和复用性，使其成为带命名空间的模块
  namespaced: true,
  state
}
