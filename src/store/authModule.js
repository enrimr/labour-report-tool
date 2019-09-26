import firebase from 'firebase'
import 'firebase/auth'

const state = { user: null }

const actions = {
  updateUser({ state, commit }, user) {
    // debugger // eslint-disable-line
    commit('UPDATE_USER', user)
    /* return new Promise((resolve, reject) => {
    commit('UPDATE_USER', user)
    resolve()
  }) */
  },
  logout({ state, commit }) {
    commit('REMOVE_USER')
    firebase.auth().signOut()
  },
  removeUser({ state, commit }) {
    commit('REMOVE_USER')
  },
}

const mutations = {
  UPDATE_USER(state, user) {
    // debugger // eslint-disable-line
    state.user = {
      id: user.uid,
      name: user.displayName,
      email: user.email,
      emailVerified: user.emailVerified,
      isAnonymous: user.isAnonymous,
      photoURL: user.photoURL,
      phoneNumber: user.phoneNumber,
      refreshToken: user.refreshToken,
      providerData: user.providerData,
      accessToken: user.accessToken,
    }
  },
  REMOVE_USER(state) {
    state.user = null
  },
}

const getters = {
  isLogged(state) {
    return state.user
  },
  id(state) {
    return state.user && state.user.id
  },
  accessToken(state) {
    return state.user && state.user.accessToken
  },
  userName(state) {
    return state.user && state.user.name
  },
  userEmail(state) {
    return state.user && state.user.email
  },
  userPhoto(state) {
    return state.user && state.user.photoURL
  },
  userCapitalLetters(state) {
    return (
      state.user &&
      state.user.name &&
      state.user.name
        .split(' ')
        .map((n, i, a) => (i === 0 || i + 1 === a.length ? n[0] : null))
        .join('')
        .toUpperCase()
    )
  },
  userNotifications(state) {
    const min = 0
    const max = 3
    return Math.round(Math.random() * (max - min) + min)
  },
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
}
