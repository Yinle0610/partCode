import store from '@/store'

/**
 * 校验权限
 * @param {Array} value 所需的权限，指定多个时需同时满足
 * @returns {Boolean}
 * @example see @/views/permission/directive.vue
 */
export default function checkPermission(value) {
  if (value && value instanceof Array && value.length > 0) {
    const permissions = store.getters && store.getters.permissions
    return value.every(permission => permissions.includes(permission))
  } else {
    console.error(`need roles! Like v-permission="['admin','editor']"`)
    return false
  }
}

