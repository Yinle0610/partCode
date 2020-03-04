const matter = {
  state: {
    titleName: 'name'
  },
  mutations: {
    GET_TITLE_NAME: (state, name) => {
      state.name = name
    }
  },
  actions: {
    getTitleName({ commit }, name) {
      commit('GET_TITLE_NAME', name)
    }
  }
}
export default matter
