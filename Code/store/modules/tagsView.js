const tagsView = {
  state: {
    visitedViews: [],
    cachedViews: [],
    visitedTime: {},
    removedViews: [],
    removedKeys: []
  },
  mutations: {
    ADD_VISITED_VIEWS: (state, view) => {
      if (state.visitedViews.some(v => v.path === view.path)) return
      let route = Object.assign({}, view, {
        title: view.meta.title || 'no-name'
      })
      state.visitedViews.push(route)
      state.visitedViews = state.visitedViews.filter(v => v.name)
      if (!view.meta.noCache) {
        state.cachedViews.push(view.name)
        state.visitedTime = Object.assign({}, state.visitedTime, {
          [view.name]: new Date().getTime()
        })
      }
    },
    ADD_NEED_CACHED_MODULE: (state, name) => {
      // 初始化需要缓存的二级菜单的路由
      state.cachedViews.push(name)
    },
    DEL_VISITED_VIEWS: (state, view) => {
      for (const [i, v] of state.visitedViews.entries()) {
        if (v.path === view.path) {
          state.visitedViews.splice(i, 1)
          break
        }
      }
      for (const i of state.cachedViews) {
        if (i === view.name) {
          const index = state.cachedViews.indexOf(i)
          state.cachedViews.splice(index, 1)

          // 缓存待删除的组件
          let arr = view.meta.namespace.split(',')
          state.removedViews = arr.splice(1, arr.length)
          break
        }
      }
    },
    ADD_NO_CACHED_KEYS: (state, key) => {
      state.removedKeys.push(key)
    },
    DEL_NO_CACHED_KEYS: (state, key) => {
      let index = state.removedKeys.indexOf(key)
      if (index > -1) {
        state.removedKeys.splice(index, 1)
      }
    },
    DEL_OTHERS_VIEWS: (state, view) => {
      for (const [i, v] of state.visitedViews.entries()) {
        if (v.path === view.path) {
          state.visitedViews = state.visitedViews.slice(i, i + 1)
          break
        }
      }
      for (const i of state.cachedViews) {
        if (i === view.name) {
          const index = state.cachedViews.indexOf(i)
          state.cachedViews = state.cachedViews.slice(index, index + 1)
          break
        }
      }
    },
    DEL_ALL_VIEWS: (state) => {
      state.visitedViews = []
      state.cachedViews = []
    }
  },
  actions: {
    addVisitedViews({ commit }, view) {
      commit('ADD_VISITED_VIEWS', view)
    },
    addNeedCachedModule({ commit }, name) {
      commit('ADD_NEED_CACHED_MODULE', name)
    },
    addNoCachedKeys({ commit }, key) {
      commit('ADD_NO_CACHED_KEYS', key)
    },
    delNoCachedKeys({ commit }, key) {
      commit('DEL_NO_CACHED_KEYS', key)
    },
    delVisitedViews({ commit, state }, view) {
      return new Promise((resolve) => {
        commit('DEL_VISITED_VIEWS', view)
        resolve([...state.visitedViews])
      })
    },
    delOthersViews({ commit, state }, view) {
      return new Promise((resolve) => {
        commit('DEL_OTHERS_VIEWS', view)
        resolve([...state.visitedViews])
      })
    },
    delAllViews({ commit, state }) {
      return new Promise((resolve) => {
        commit('DEL_ALL_VIEWS')
        resolve([...state.visitedViews])
      })
    }
  }
}

export default tagsView
