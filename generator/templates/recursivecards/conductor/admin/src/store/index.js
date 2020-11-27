import Vue from 'vue'
import Vuex from 'vuex'
import modules from './modules'
import Dexie from 'dexie'
import { AdminWebsocket } from '@holochain/conductor-api'

Vue.use(Vuex)

const HOLOCHAIN_ADMIN_PORT = 26970

export default new Vuex.Store({
  state: {
    socket: {},
    hcClient: {}
  },
  mutations: {
  },
  actions: {
    async initialiseStore ({ state }, payload) {
      state.db = new Dexie('holochain')
      state.db.version(1).stores({
        agents: 'uuid,name,parent'
      })
      state.hcClient.admin = await AdminWebsocket.connect(`ws://localhost:${HOLOCHAIN_ADMIN_PORT}`)
      state.hcClient.appInterface = await state.hcClient.admin.attachAppInterface({ port: 0 })
    }
  },
  modules
})
