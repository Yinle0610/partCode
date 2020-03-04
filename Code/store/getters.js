const getters = {
  sidebar: state => state.app.sidebar,
  brand: state => state.app.brand,
  language: state => state.app.language,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  removedViews: state => state.tagsView.removedViews,
  removedKeys: state => state.tagsView.removedKeys,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  status: state => state.user.status,
  roles: state => state.user.roles,
  setting: state => state.user.setting,
  permissions: state => state.user.permissions,
  accessToDmac: state => state.user.canAccessToDmac,
  accessToDsms: state => state.user.canAccessToDsms,
  accessToDqms: state => state.user.canAccessToDqms,
  permissionRouters: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  errorLogs: state => state.errorLog.logs,
  titleName: state => state.matter.titleName,
  globalSearch: state => state.app.globalSearch,
  ifShowInput: state => state.app.ifShowInput,
  userMsg: state => state.user.userMsg,
  // 全尺寸logo 显示地址
  fullLogoPath: state => state.app.fullLogoPath,
  // 全尺寸logo 预览数据
  fullLogoData: state => state.app.fullLogoData,
  // 小尺寸logo 显示地址
  smallLogoPath: state => state.app.smallLogoPath,
  // 小尺寸logo 预览数据
  smallLogoData: state => state.app.smallLogoData,
  // svg token 登录标识
  svgToken: state => state.app.svgToken
}
export default getters
