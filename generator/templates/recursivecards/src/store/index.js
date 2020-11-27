import Vue from 'vue'
import Vuex from 'vuex'
import modules from './modules'
import Dexie from 'dexie'
import { AppWebsocket } from '@holochain/conductor-api'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    hcClient: {}
  },
  actions: {
    initialiseStore ({ state, commit }) {
      state.db = new Dexie('recursivecards')
      state.db.version(1).stores({
        cards: 'uuid,[parentColumn+name],parentColumn'
      })
      state.db.open().catch(function (e) {
        console.error('Open failed: ' + e)
      })
      AppWebsocket.connect(`ws://localhost:${localStorage.getItem('port')}`)
        .then(socket => {
          commit('hcClient', socket)
        })
    }
  },
  mutations: {
    hcClient (state, payload) {
      state.hcClient = payload
    }
  },
  modules
})
