const getters = {
  sidebar: state => state.app.sidebar,
  language: state => state.app.language, // 语言国际化
  device: state => state.app.device, // 登录系统的设备 （pc/移动）
  tableHeight: state => state.app.tableHeight,
  token: state => state.user.token,
  logo: state => state.user.logo,
  logo_name: state => state.user.logo_name,
  avatar: state => state.user.avatar,
  name: state => state.user.name, // 当前登录用户名
  homePath: state => state.permission.homePath, // 后台主页
  permission_routes: state => state.permission.routes, // 当前登录对象拥有的所有权限
  visibility: state => state.fileUpload.visibility, // 是否弹出上传组件
  isMinimality: state => state.fileUpload.isMinimality, // 控制最小化
  belongs: state => state.fileUpload.belongs, // 上传的文件所属 工作台还是知识库
  realTimeMessage: state => state.realTimeMessage.realTimeMessage, // 上传的文件所属 工作台还是知识库
  keyword: state => state.door.keyword // 门户关键词
}
export default getters
