import Cookies from 'js-cookie'
import { get, getExcel } from '../../utils/request'
import { postSvg } from "@/utils/request";

const app = {
  state: {
    sidebar: {
      opened: !+Cookies.get('sidebarStatus'),
      withoutAnimation: false
    },
    device: 'desktop',
    language: Cookies.get('language') || 'en',
    brand: !+Cookies.get('sidebarStatus') ? require('@/assets/images/desktop/brand-big.png') : require('@/assets/images/desktop/brand-mini.png'),
    globalSearch: '',
    ifShowInput: false,

    // 全尺寸 logo 显示的地址
    fullLogoPath: '',
    // 全尺寸 logo 预览data
    fullLogoData: '',
    // 小尺寸 logo 显示的地址
    smallLogoPath: '',
    // 小尺寸 logo 预览data
    smallLogoData: '',

    svgToken: null
  },
  mutations: {
    TOGGLE_SIDEBAR: state => {
      if (state.sidebar.opened) {
        Cookies.set('sidebarStatus', 1)
      } else {
        Cookies.set('sidebarStatus', 0)
      }
      state.sidebar.opened = !state.sidebar.opened
      state.sidebar.withoutAnimation = false
      if (state.sidebar.opened) {
        // state.brand = require('@/assets/images/desktop/brand-big.png')
        // 设置 全尺寸logo
        if (state.fullLogoData !== "") {
          state.brand = state.fullLogoData
        } else {
          state.brand = require('@/assets/images/desktop/brand-big.png')
        }
      } else {
        // state.brand = require('@/assets/images/desktop/brand-mini.png')
        // 设置 小尺寸logo
        if (state.smallLogoData !== "") {
          state.brand = state.smallLogoData
        } else {
          state.brand = require('@/assets/images/desktop/brand-mini.png')
        }
      }
    },
    // 设置 logo
    SET_BrandLogo: (state) => {
      if (state.sidebar.opened) {
        // 设置 全尺寸logo
        if (state.fullLogoData !== "") {
          state.brand = state.fullLogoData
        } else {
          state.brand = require('@/assets/images/desktop/brand-big.png')
        }
      } else {
        // 设置 小尺寸logo
        if (state.smallLogoData !== "") {
          state.brand = state.smallLogoData
        } else {
          state.brand = require('@/assets/images/desktop/brand-mini.png')
        }
      }
    },
    CLOSE_SIDEBAR: (state, withoutAnimation) => {
      Cookies.set('sidebarStatus', 1)
      state.sidebar.opened = false
      state.sidebar.withoutAnimation = withoutAnimation
    },
    TOGGLE_DEVICE: (state, device) => {
      state.device = device
    },
    SET_LANGUAGE: (state, language) => {
      state.language = language
      Cookies.set('language', language)
    },
    SET_GLOBALSEARCH: (state, globalSearch) => {
      state.globalSearch = globalSearch
      Cookies.set('globalSearch', globalSearch)
    },
    SET_IFSHOWINPUT: (state, ifShowInput) => {
      state.ifShowInput = ifShowInput
      Cookies.set('ifShowInput', ifShowInput)
    },
    SET_FullLogoPath: (state, fullLogoPath) => {
      state.fullLogoPath = fullLogoPath
    },
    SET_FullLogoData: (state, fullLogoData) => {
      state.fullLogoData = fullLogoData
    },
    SET_SmallLogoPath: (state, smallLogoPath) => {
      state.smallLogoPath = smallLogoPath
    },
    SET_SmallLogoData: (state, smallLogoData) => {
      state.smallLogoData = smallLogoData
    },
    SET_svgToken: (state, svgToken) => {
      state.svgToken = svgToken
    }
  },
  actions: {
    toggleSideBar({ commit }) {
      commit('TOGGLE_SIDEBAR')
    },
    closeSideBar({ commit }, { withoutAnimation }) {
      commit('CLOSE_SIDEBAR', withoutAnimation)
    },
    toggleDevice({ commit }, device) {
      commit('TOGGLE_DEVICE', device)
    },
    setLanguage({ commit }, language) {
      commit('SET_LANGUAGE', language)
    },
    setGlobalSearch({ commit }, globalSearch) {
      commit('SET_GLOBALSEARCH', globalSearch)
    },
    setIfShowInput({ commit }, ifShowInput) {
      commit('SET_IFSHOWINPUT', ifShowInput)
    },
    // 系统参数 - 获取全尺寸logo地址（仅供页面显示的地址） /sys/param/fullLogoPath
    getFullLogoPath({ commit, dispatch }) {
      return new Promise((resolve, reject) => {
        get('/sys/param/fullLogoPath').then((res) => {
          // console.log(res, 'fullLogoPath')
          if (res.code === 10000 && res.success === true) {
            commit('SET_FullLogoPath', res.data)
            dispatch('getFullLogoData')
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 全尺寸LOGO /sys/param/fullLogo.png （全尺寸logo图片真实数据，供预览使用）
    getFullLogoData({ commit }) {
      return new Promise((resolve, reject) => {
        getExcel('/sys/param/fullLogo.png').then((res) => {
          // console.log(res, 'fullLogo data')
          if (res.size !== undefined) {
            let blob = res;
            let imgUrl = URL.createObjectURL(blob);
            console.log(imgUrl, 'imgUrl big data')
            commit('SET_FullLogoData', imgUrl)
            // 设置 logo
            commit('SET_BrandLogo')
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 系统参数 - 获取小尺寸logo地址（仅供页面显示的地址） /sys/param/smallLogoPath
    getSmallLogoPath({ commit, dispatch }) {
      return new Promise((resolve, reject) => {
        get('/sys/param/smallLogoPath').then((res) => {
          // console.log(res, 'smallLogoPath')
          if (res.code === 10000 && res.success === true) {
            commit('SET_SmallLogoPath', res.data)
            dispatch('getSmallLogoData')
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 小尺寸LOGO /sys/param/smallLogo.png （小尺寸logo图片真实数据，供预览使用）
    getSmallLogoData({ commit }) {
      return new Promise((resolve, reject) => {
        getExcel('/sys/param/smallLogo.png').then((res) => {
          // console.log(res, 'smallLogo data')
          if (res.size !== undefined) {
            let blob = res;
            let imgUrl = URL.createObjectURL(blob);
            console.log(imgUrl, 'imgUrl small data')
            commit('SET_SmallLogoData', imgUrl)
            // 设置 logo
            commit('SET_BrandLogo')
          }
        }).catch(error => {
          reject(error)
        })
      })
    },

    // svg 登录
    svgLogin({ commit }) {
      postSvg('/api/RaaS/raas/login', {
        user: 'ADMIN',
        password: 'compass2018'
      }).then((res) => {
        console.log(res)
        if (res.status === 200) {
          console.log('svg 登录成功')
          commit('SET_svgToken', true)
          Cookies.set('svgToken', true)
        }
      })
    }
  }
}

export default app
