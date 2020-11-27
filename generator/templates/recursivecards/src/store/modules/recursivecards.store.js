import Vue from 'vue'
import Vuex from 'vuex'
import * as base64 from 'byte-base64'

Vue.use(Vuex)

export default {
  namespaced: true,
  state: {
    agentPubKey: '',
    cellId: '',
    cards: [],
    columns: [],
    treeItems: [],
    selectedColumn: {},
    fieldNames: [
      {
        uuid: 'f6e97297-ec9e-4b6e-bb29-13a83c7a9066',
        name: 'Full Name',
        ui: 'text-field'
      },
      {
        uuid: '43d60501-295c-4e21-b82f-4965d14fae36',
        name: 'Avatar',
        ui: 'thumbnail'
      },
      {
        uuid: 'a9a814d6-ec81-4613-9fa3-614ed45bd6ce',
        name: 'Bio',
        ui: 'text-area'
      },
      {
        uuid: 'b24da2ce-b0c0-4c5e-8894-41b9bf1088c2',
        name: 'Handle',
        ui: 'text-field'
      },
      {
        uuid: '9a23b8d6-fc2d-4f45-a81b-4e416083aeda',
        name: 'Profile Picture',
        ui: 'image'
      }
    ]
  },
  actions: {
    async initialise ({ commit }) {
      commit('agentPubKey', base64.base64ToBytes(localStorage.getItem('agentPubKey')))
      commit('cellId', [base64.base64ToBytes(localStorage.getItem('cellId')), base64.base64ToBytes(localStorage.getItem('agentPubKey'))])
    },
    async getTreeRootColumns ({ rootState, commit }) {
      return new Promise(resolve => {
        rootState.db.cards.where({ parentColumn: '/' }).toArray(entries => {
          const treeItems = entries.map(entry => {
            if (entry.cardType === 'column') {
              entry.children = []
            }
            return entry
          })
          commit('treeItems', treeItems)
          resolve()
        })
      })
    },
    setSelectedColumn ({ rootState, commit }, payload) {
      const parentColumn = `${payload.parentColumn}${payload.name}/`
      rootState.db.cards.where({ parentColumn }).toArray(entries => {
        payload.children = entries.map(entry => {
          entry.key = `${entry.uuid}`
          if (entry.type === 'column') {
            entry.children = []
          }
          return entry
        })
        commit('setSelectedColumn', payload)
      })
    },
    saveColumn ({ rootState, commit, dispatch }, payload) {
      const column = payload.column
      column.cardType = 'column'
      column.preview = ''
      column.parent = 'Cards'
      rootState.db.cards.put(column)
      if (payload.action === 'create') {
        commit('createColumn', column)
      } else {
        commit('updateColumn', column)
      }
      dispatch('holochainSaveCard', { card: column })
    },
    fetchCards ({ rootState, state, commit }) {
      rootState.db.cards.toArray(cards => {
        commit('setCards', cards)
        rootState.hcClient
          .callZome({
            cap: null,
            cell_id: state.cellId,
            zome_name: 'recursivecards',
            fn_name: 'list_cards',
            provenance: state.agentPubKey,
            payload: { parent: 'Cards' }
          })
          .then(result => {
            result.cards.forEach(card => {
              rootState.db.cards.put(card).then((result) => console.log(result))
            })
            commit('setCards', result.cards)
          })
      })
    },
    saveCard ({ rootState, state, commit, dispatch }, payload) {
      const card = payload.card
      card.cardType = 'card'
      card.parent = 'Cards'
      rootState.db.cards.put(card)
      if (payload.action === 'create') {
        commit('createCard', card)
      } else {
        commit('updateCard', card)
      }
      dispatch('holochainSaveCard', { card })
    },
    holochainSaveCard ({ rootState, state, commit }, payload) {
      const card = payload.card
      if (card.entryHash) {
        rootState.hcClient
          .callZome({
            cap: null,
            cell_id: state.cellId,
            zome_name: 'recursivecards',
            fn_name: 'delete_card',
            provenance: state.agentPubKey,
            payload: card
          })
      }
      rootState.hcClient
        .callZome({
          cap: null,
          cell_id: state.cellId,
          zome_name: 'recursivecards',
          fn_name: 'create_card',
          provenance: state.agentPubKey,
          payload: card
        })
        .then(committedCard => {
          rootState.db.cards.put(committedCard)
          if (payload.action === 'create') {
            commit('createCard', committedCard)
          } else {
            commit('updateCard', committedCard)
          }
        })
    },
    deleteCard ({ rootState, state, commit }, payload) {
      const card = payload.card
      console.log(card)
      rootState.db.cards.delete(card.uuid)
      commit('deleteCard', card)
      rootState.hcClient
        .callZome({
          cap: null,
          cell_id: state.cellId,
          zome_name: 'recursivecards',
          fn_name: 'delete_card',
          provenance: state.agentPubKey,
          payload: card
        })
    }
  },
  mutations: {
    agentPubKey (state, payload) {
      state.agentPubKey = payload
    },
    cellId (state, payload) {
      state.cellId = payload
    },
    treeItems (state, payload) {
      state.treeItems = payload
    },
    setSelectedColumn (state, payload) {
      state.selectedColumn = payload
      state.columns = payload.children.filter(i => i.cardType === 'column').sort((a, b) => a.order < b.order)
    },
    createColumn (state, payload) {
      state.columns.push(payload)
    },
    updateColumn (state, payload) {
      state.columns = state.columns.map(column =>
        state.columns.uuid !== payload.uuid ? column : { ...column, ...payload }
      )
    },
    setCards (state, payload) {
      const cards = payload.cards
      const columnUuid = payload.columnUuid
      state[columnUuid] = cards
    },
    createCard (state, payload) {
      state.cards.splice(0, 0, payload)
    },
    updateCard (state, payload) {
      state.cards = state.cards.map(card =>
        card.uuid !== payload.uuid ? card : { ...card, ...payload }
      )
    },
    deleteCard (state, payload) {
      state.cards = state.cards.filter(c => c.uuid !== payload.uuid)
    }
  },
  modules: {}
}
