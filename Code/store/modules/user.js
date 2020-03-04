import { loginByUsername, getUserInfo, logout } from '@/api/login'
import { StandardsView } from '@/api/standardsView'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { parseAjaxResponse } from '@/utils/request'
import Cookies from 'js-cookie'

const user = {
  state: {
    user: '',
    status: '',
    code: '',
    token: getToken(),
    name: '',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    introduction: '',
    roles: ['admin'],
    permissions: [],
    routes: [],
    setting: {
      articlePlatform: []
    },
    canAccessToDmac: false,
    canAccessToDsms: false,
    canAccessToDqms: false,
    // userMsg: [{
    userName: '',
    passWord: '',
    userMsg: Cookies.get('userMsg') ? Cookies.get('userMsg') : ''
    // }]
  },

  mutations: {
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    },
    SET_ROUTES: (state, routes) => {
      state.routes = routes
    },
    // SET_USERMSG: (state, userName) => {
    //   state.userName = userName
    // },
    SET_USERMSG: (state, userMsg) => {
      state.userMsg = userMsg
      Cookies.set('userMsg', userMsg)
    },
    SET_ACCESS_TO_DMAC: (state, canAccessToDmac) => {
      state.canAccessToDmac = canAccessToDmac;
    },
    SET_ACCESS_TO_DSMS: (state, canAccessToDsms) => {
      state.canAccessToDsms = canAccessToDsms;
    },
    SET_ACCESS_TO_DQMS: (state, canAccessToDqms) => {
      state.canAccessToDqms = canAccessToDqms;
    }
  },

  actions: {
    // 用户名登录
    LoginByUsername({ commit }, userInfo) {
      const username = userInfo.userId.trim()
      return new Promise((resolve, reject) => {
        loginByUsername(username, userInfo.password).then(res => {
          let data = res
          parseAjaxResponse(res, () => {
            let token = data.extras['X-Token']
            commit('SET_TOKEN', token)
            setToken(token)
          })
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getUserInfo().then(response => {
          const data = response.data
          const name = data.userName
          commit('SET_NAME', name)
          commit('SET_PERMISSIONS', data.permissions)
          commit('SET_ROUTES', data.routes)
          commit('SET_ACCESS_TO_DMAC', data.canAccessToDmac)
          commit('SET_ACCESS_TO_DSMS', data.canAccessToDsms)
          commit('SET_ACCESS_TO_DQMS', data.canAccessToDqms)
          resolve(data.routes)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 第三方验证登录
    // LoginByThirdparty({ commit, state }, code) {
    //   return new Promise((resolve, reject) => {
    //     commit('SET_CODE', code)
    //     loginByThirdparty(state.status, state.email, state.code).then(response => {
    //       commit('SET_TOKEN', response.data.token)
    //       setToken(response.data.token)
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout().then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_PERMISSIONS', [])
          commit('SET_NAME', '')
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        commit('SET_PERMISSIONS', [])
        commit('SET_NAME', '')
        removeToken()
        resolve()
      })
    },
    // 获取标准概览数据
    StandardsView() {
      return new Promise((resolve, reject) => {
        StandardsView().then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    setUserMsg({ commit }, userMsg) {
      commit('SET_USERMSG', userMsg)
    }
    // 动态修改权限
    // ChangeRoles({ commit }, role) {
    //   return new Promise(resolve => {
    //     commit('SET_TOKEN', role)
    //     setToken(role)
    //     getUserInfo(role).then(response => {
    //       const data = response.data
    //       commit('SET_ROLES', data.roles)
    //       commit('SET_NAME', data.name)
    //       commit('SET_AVATAR', data.avatar)
    //       commit('SET_INTRODUCTION', data.introduction)
    //       resolve()
    //     })
    //   })
    // }
  }
}

export default user
