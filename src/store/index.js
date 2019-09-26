import Vue from 'vue'
import Vuex from 'vuex'
//import auth from './authModule'
import axios from './axiosModule'
import storage from './storageModule'
import app from './appModule'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  plugins: [
    createPersistedState({
      paths: ['storage', 'app.lastRoute'], //['auth.user', 'storage', 'app.lastRoute'],
    }),
  ],
  modules: {
    //auth,
    axios,
    storage,
    app,
  },
})

export default store
