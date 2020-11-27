import Vue from 'vue'
import Vuex from 'vuex'
import { v4 as uuidv4 } from 'uuid'
import * as base64 from 'byte-base64'

Vue.use(Vuex)

export default {
  namespaced: true,
  state: {
    agents: {},
    agent: {
      handle: '',
      avatar: ''
    },
    conductor: {
      uuid: '2deb6610-911c-4cfc-b3c4-d89af573fa58',
      name: "Phil's Developer Conductor"
    }
  },
  actions: {
    fetchAgents ({ rootState, commit }, payload) {
      const conductor = { ...payload }
      rootState.db.agents
        .where('parent')
        .equals(conductor.uuid)
        .toArray(agents => {
          commit('setAgents', agents)
        })
    },
    async saveAgent ({ rootState, commit }, payload) {
      const agent = { ...payload.agent, parent: payload.conductor.uuid }
      rootState.db.agents.put(agent).then(() => {
        if (payload.action === 'create') {
          commit('createAgent', agent)
          console.log('createAgent', agent)
        } else {
          commit('updateAgent', agent)
        }
      })
    },
    deleteAgent ({ rootState, commit }, payload) {
      const agent = { ...payload }
      rootState.db.agents.delete(agent.uuid).then(() => {
        commit('deleteAgent', agent)
      })
    },
    async generateAgentKey ({ rootState, commit }, payload) {
      const agent = payload.agent
      const agentPubKey = await rootState.hcClient.admin.generateAgentPubKey()
      agent.agentPubKey = base64.bytesToBase64(agentPubKey)
      commit('updateAgent', agent)
      rootState.db.agents.put(agent)
    },
    async installDna ({ rootState, commit }, payload) {
      const agent = payload.agent
      if (!agent.agentPubKey) {
        const agentPubKey = await rootState.hcClient.admin.generateAgentPubKey()
        agent.agentPubKey = base64.bytesToBase64(agentPubKey)
      }
      const APP_ID = uuidv4()
      const app = await rootState.hcClient.admin.installApp({
        installed_app_id: APP_ID,
        agent_key: base64.base64ToBytes(agent.agentPubKey),
        dnas: [
          {
            path: '/Users/philipbeadle/holochain/applications/kanban/dna/kanban.dna.gz',
            nick: 'Kanban'
          }
        ]
      })
      agent.cellId = base64.bytesToBase64(app.cell_data[0][0][0])
      rootState.hcClient.admin.activateApp({ installed_app_id: APP_ID })
      commit('updateAgent', agent)
      rootState.db.agents.put(agent)
    }
  },
  mutations: {
    setAgents (state, payload) {
      state.agents = payload
    },
    createAgent (state, payload) {
      state.agents.push(payload)
    },
    updateAgent (state, payload) {
      state.agents = state.agents.map(a =>
        a.uuid !== payload.uuid ? a : { ...a, ...payload }
      )
    },
    deleteAgent (state, payload) {
      state.agents = state.agents.filter(a => a.uuid !== payload.uuid)
    },
    setAgent (state, payload) {
      state.agent = payload
    }
  },
  modules: {}
}
