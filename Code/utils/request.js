import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import qs from 'qs'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 50000, // 请求超时时间
  withCredentials: true // 跨域请求携带 cookies
})

const serviceByJson = axios.create({
  baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 50000, // 请求超时时间
  withCredentials: true // 跨域请求携带 cookies
})
// 下载时的 axios 实例
const serviceByDownLoad = axios.create({
  baseURL: process.env.BASE_API, // api 的 base_url
  // timeout: 60000, // 请求超时时间
  withCredentials: true // 跨域请求携带 cookies
})

// 配置表单提交
service.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
// 配置json提交
serviceByJson.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'
// 配置下载提交
serviceByDownLoad.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'

// service request 拦截器
service.interceptors.request.use(config => {
  if (config.method === 'post') {
    config.data = qs.stringify(config.data)
  }
  // Do something before request is sent
  if (store.getters.token) {
    // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
    config.headers['X-Token'] = getToken()
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// serviceByJson request 拦截器
serviceByJson.interceptors.request.use(config => {
  // Do something before request is sent
  if (store.getters.token) {
    // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
    config.headers['X-Token'] = getToken()
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})
// serviceByDownLoad request 拦截器
serviceByDownLoad.interceptors.request.use(config => {
  if (config.method === 'post') {
    config.data = qs.stringify(config.data)
  }
  // Do something before request is sent
  if (store.getters.token) {
    // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
    config.headers['X-Token'] = getToken()
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})
// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code !== 10000) {
      if (res.code === 10015 || res.code === 10017) {
        MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('FedLogOut').then(() => {
            location.reload() // 为了重新实例化vue-router对象 避免bug
          })
        })
      }
      return response
    } else {
      return response
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      // message: error.message,
      message: '服务器繁忙，请您稍后重试',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  })

// 响应拦截器
serviceByJson.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code !== 10000) {
      if (res.code === 10015 || res.code === 10017) {
        MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('FedLogOut').then(() => {
            location.reload() // 为了重新实例化vue-router对象 避免bug
          })
        })
      }
      return response
    } else {
      return response
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      // message: error.message,
      message: '服务器繁忙，请您稍后重试',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  })
// serviceByDownLoad 响应拦截器
serviceByDownLoad.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code !== 10000) {
      if (res.code === 10015 || res.code === 10017) {
        MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('FedLogOut').then(() => {
            location.reload() // 为了重新实例化vue-router对象 避免bug
          })
        })
      }
      return response
    } else {
      return response
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      // message: error.message,
      message: '服务器繁忙，请您稍后重试',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  })

export default service

// 封装get请求
export function get(url, params) {
  return service.request({
    url, params,
    method: 'get'
  }).then((res) => {
    return new Promise(resolve => {
      resolve(res.data)
    });
  })
}

/**
 * 下载文件
 * @param url
 * @param params
 * @param successCallback
 * @param failureCallback
 */
export function downloadFile(url, params, successCallback, failureCallback) {
  return serviceByDownLoad.request({
    url, params,
    responseType: 'blob',
    method: 'get'
  }).then((res) => {
    if (successCallback) {
      successCallback()
    }
    const link = document.createElement('a');
    let blob = new Blob([res.data]);
    link.style.display = 'none';
    link.href = URL.createObjectURL(blob);
    // 获取下载文件名，并解码
    let fileName = res.headers['content-disposition'].split('filename=')[1];
    link.download = decodeURIComponent(fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }).catch(() => {
    if (failureCallback) {
      failureCallback()
    } else {
      Message.error("服务器繁忙，请稍后重试")
    }
  })
}

// 导出excel
export function getExcel(url, params) {
  return serviceByDownLoad.request({
    url, params, responseType: 'blob',
    method: 'get'
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 封装post请求
export function post(url, data, baseURL) {
  if (baseURL) {
    return service.request({
      url, data, baseURL,
      method: 'post'
    }).then((res) => {
      return new Promise(resolve => {
        resolve(res.data)
      });
    })
  } else {
    return service.request({
      url, data,
      method: 'post'
    }).then((res) => {
      return new Promise(resolve => {
        resolve(res.data)
      });
    })
  }
}

// 封装post请求，通过 application/json 提交参数
export function postByJson(url, data, baseURL) {
  if (baseURL) {
    return serviceByJson.request({
      url, data, baseURL,
      method: 'post'
    }).then((res) => {
      return Promise.resolve(res.data)
    })
  } else {
    return serviceByJson.request({
      url, data,
      method: 'post'
    }).then((res) => {
      return Promise.resolve(res.data)
    })
  }
}

/**
 * 对ajax响应的统一处理
 * @param res              响应的数据
 * @param successCallback  成功回调
 * @param failureCallback  失败回调
 */
export function parseAjaxResponse(res, successCallback, failureCallback) {
  if (res) {
    if (res.code === 10000 && res.success === true) {
      if (successCallback) {
        successCallback()
      } else {
        Message.success(res.message)
      }
    } else {
      Message.error(res.message)
    }
  } else {
    if (failureCallback) {
      failureCallback()
    } else {
      Message.error("服务器繁忙，请稍后重试")
    }
  }
}

/*
  svg axios相关
*/
// 创建axios实例
const serviceSvg = axios.create({
  // baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 50000, // 请求超时时间
  headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
  withCredentials: true // 跨域请求携带 cookies
})
// serviceSvg request 拦截器
serviceSvg.interceptors.request.use(config => {
  if (config.method === 'post') {
    config.data = qs.stringify(config.data)
  }
  // Do something before request is sent
  if (store.getters.token) {
    // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
    config.headers['X-Token'] = getToken()
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})
// 响应拦截器
serviceSvg.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code !== 10000) {
      if (res.code === 10015 || res.code === 10017) {
        MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('FedLogOut').then(() => {
            location.reload() // 为了重新实例化vue-router对象 避免bug
          })
        })
      }
      return response
    } else {
      return response
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      // message: '服务器繁忙，请您稍后重试',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  })

// 封装 svg get请求
export function getSvg(url, params) {
  return serviceSvg.request({
    url, params,
    method: 'get'
  })
}
// 封装 svg post请求
export function postSvg(url, data, baseURL, body) {
  if (baseURL) {
    return serviceSvg.request({
      url, data, baseURL,
      method: 'post'
    })
  } else {
    return serviceSvg.request({
      url, data, body,
      method: 'post'
    })
  }
}
