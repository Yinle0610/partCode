
import store from '@/store'

export default{
  inserted(el, binding, vnode) {
    const { value } = binding
    const permissions = store.getters && store.getters.permissions
    let hasPermission = permissions.includes(value)
    if (hasPermission) {
      el.parentNode && el.parentNode.removeChild(el)
    }
  }
}
