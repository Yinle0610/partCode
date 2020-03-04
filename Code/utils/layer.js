import { Loading } from 'element-ui'

export function loading(text, target) {
  if (!target) {
    target = 'body'
  }
  return Loading.service({
    lock: true,
    text,
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)',
    target: target
  })
}
export function loadingStandard(text, target) {
  if (!target) {
    target = 'body'
  }
  return Loading.service({
    lock: true,
    text,
    customClass: 'master_loading',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)',
    target: target
  })
}

