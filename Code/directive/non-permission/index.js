import permission from './permission'

const install = function(Vue) {
  Vue.directive('non-permission', permission)
}

if (window.Vue) {
  window['non-permission'] = permission
  Vue.use(install); // eslint-disable-line
}

permission.install = install
export default permission
