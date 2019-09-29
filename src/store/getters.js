const getters = {
  sidebar: state => state.app.sidebar,
  language: state => state.app.language, // 语言国际化
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  homePath: state => state.permission.homePath,
  permission_routes: state => state.permission.routes // 当前登录对象拥有的所有权限
}
export default getters
