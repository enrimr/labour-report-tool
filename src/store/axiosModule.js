import axios from 'axios'
import store from '../store'

function getAuthorizationToken() {
  const accessToken = store.getters['auth/accessToken']
  // debugger // eslint-disable-line
  return accessToken
}

const instance = axios.create({
  baseURL: 'http://localhost:5001/v1/',
  timeout: 10000,
})

// Set the AUTH token for any request
instance.interceptors.request.use(config => {
  const token = getAuthorizationToken()
  if (token) config.headers.Authorization = `JWT ${token}`
  return config
})

const state = {
  axios,
}

const actions = {
  init({ state, commit }) {
    // debugger // eslint-disable-line
    commit('INIT_AXIOS', instance)
  },
}

const mutations = {
  INIT_AXIOS(state, instance) {
    // debugger // eslint-disable-line
    state.axios = instance
  },
}

const getters = {
  instance() {
    return state.axios
  },
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
}
