const state = {
  lastRoute: null,
  lastRouteDeleteme: null,
  settings: {
    showCurrencyExchange: false,
  },
}

const actions = {
  setLastRoute({ state, commit }, route) {
    commit('SET_LAST_ROUTE', route)
  },
  setSetting({ state, commit }, setting) {
    commit('SET_SETTING', { ...state.settings, ...setting })
  },
}

const mutations = {
  SET_LAST_ROUTE(state, route) {
    state.lastRoute = route.fullPath
  },

  SET_SETTING(state, setting) {
    state.settings = { ...setting }
  },
}

const getters = {
  lastRoute(state) {
    return { ...state.lastRoute }
  },

  settings(state) {
    return { ...state.settings }
  },
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
}
