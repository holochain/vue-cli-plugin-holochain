import Vue from 'vue'
import Vuex from 'vuex'
import * as base64 from 'byte-base64'
import Dexie from 'dexie'
import { AppWebsocket } from '@holochain/conductor-api'

Vue.use(Vuex)

export default {
  namespaced: true,
  state: {
    agentPubKey: '',
    ledgerCellId: '',
    hcClient: {},
    consultantProfile: {
      uuid: '8a9849a3-48c3-4224-896a-387a00a9d4a8',
      agentPubKey: localStorage.getItem('agentPubKey'),
      billingEntity: '',
      billingEntityAddress: '',
      financialInstitution: '',
      bsb: '',
      acct: '',
      acctHolder: ''
    },
    clients: []
  },
  actions: {
    async initialise ({ state, commit, dispatch }) {
      commit('agentPubKey', base64.base64ToBytes(localStorage.getItem('agentPubKey')))
      commit('ledgerCellId', [base64.base64ToBytes(localStorage.getItem('ledgerCellId')), base64.base64ToBytes(localStorage.getItem('agentPubKey'))])
      state.db = new Dexie('ledger')
      state.db.version(1).stores({
        consultants: 'agentPubKey',
        clients: 'uuid'
      })
      state.db.open().catch(function (e) {
        console.error('Open failed: ' + e)
      })
      AppWebsocket.connect(`ws://localhost:${localStorage.getItem('port')}`)
        .then(socket => {
          commit('hcClient', socket)
          dispatch('ledger/fetchClients')
        })
      state.db.consultants
        .where('agentPubKey')
        .equals(localStorage.getItem('agentPubKey'))
        .first()
        .then(consultantProfile => {
          if (consultantProfile !== undefined) commit('setConsultantProfile', consultantProfile)
        })
    },
    saveConsultantProfile ({ state, commit, dispatch }, payload) {
      const consultantProfile = payload
      commit('setConsultantProfile', consultantProfile)
      state.db.consultants.put(consultantProfile)
      dispatch('fetchClients')
    },
    fetchClients ({ state, commit }) {
      state.db.clients.toArray(clients => {
        commit('setClients', clients)
        state.hcClient
          .callZome({
            cap: null,
            cell_id: state.ledgerCellId,
            zome_name: 'ledger',
            fn_name: 'list_clients',
            provenance: state.agentPubKey,
            payload: { path: 'Clients' }
          })
          .then(result => {
            result.clients.forEach(client => {
              state.db.clients.put(client).then((result) => console.log(result))
            })
            commit('setClients', result.clients)
          })
      })
    },
    saveClient ({ state, commit, dispatch }, payload) {
      const client = { ...payload.client, path: 'Clients' }
      state.db.clients.put(client)
      if (client.entryHash) {
        state.hcClient
          .callZome({
            cap: null,
            cell_id: state.ledgerCellId,
            zome_name: 'ledger',
            fn_name: 'delete_client',
            provenance: state.agentPubKey,
            payload: client
          })
      }
      state.hcClient
        .callZome({
          cap: null,
          cell_id: state.ledgerCellId,
          zome_name: 'ledger',
          fn_name: 'create_client',
          provenance: state.agentPubKey,
          payload: client
        })
        .then(committedClient => {
          committedClient.entryHash = base64.bytesToBase64(committedClient.entryHash)
          if (payload.action === 'create') {
            commit('createClient', committedClient)
          } else {
            commit('updateClient', committedClient)
          }
        })
    },
    deleteClient ({ state, commit }, payload) {
      const client = payload.client
      console.log(client)
      state.db.clients.delete(client.uuid)
      commit('deleteClient', client)
      state.hcClient
        .callZome({
          cap: null,
          cell_id: state.ledgerCellId,
          zome_name: 'ledger',
          fn_name: 'delete_client',
          provenance: state.agentPubKey,
          payload: client
        })
    }
  },
  mutations: {
    agentPubKey (state, payload) {
      state.agentPubKey = payload
    },
    ledgerCellId (state, payload) {
      state.ledgerCellId = payload
    },
    hcClient (state, payload) {
      state.hcClient = payload
    },
    setConsultantProfile (state, payload) {
      const consultantProfile = payload
      state.consultantProfile = consultantProfile
    },
    setClients (state, payload) {
      const clients = payload
      state.clients = clients
    },
    createClient (state, payload) {
      state.clients.splice(0, 0, payload)
    },
    updateClient (state, payload) {
      state.clients = state.clients.map(client =>
        client.uuid !== payload.uuid ? client : { ...client, ...payload }
      )
    },
    deleteClient (state, payload) {
      state.clients = state.clients.filter(c => c.uuid !== payload.uuid)
    }
  },
  modules: {}
}
