const getters = {
  sidebar: state => state.app.sidebar,
  language: state => state.app.language, // 语言国际化
  device: state => state.app.device,
  token: state => state.user.token,
  logo: state => state.user.logo,
  logo_name: state => state.user.logo_name,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  homePath: state => state.permission.homePath,
  systemHomePath: state => state.permission.systemHomePath,
  backstageHomePath: state => state.permission.backstageHomePath,
  currentSystem: state => state.permission.currentSystem, // 当前所在系统
  systemRoutes: state => state.permission.systemRoutes, // 系统管理权限
  backstageRoutes: state => state.permission.backstageRoutes, // 后台管理权限
  permission_routes: state => state.permission.routes, // 当前登录对象拥有的所有权限
  allButtonPermission: state => state.permission.allButtonPermission,
  currentButtonPermission: state => state.permission.currentButtonPermission
}
export default getters
