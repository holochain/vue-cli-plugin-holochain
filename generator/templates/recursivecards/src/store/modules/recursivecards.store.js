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
    selectedColumn: {}
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
      const parentColumn = `${payload.parentColumn}${payload.uuid}/`
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
      if (payload.action === 'create') {
        rootState.db.cards.put(column)
        commit('createColumn', column)
        dispatch('holochainSaveCard', { card: column })
      } else {
        rootState.db.cards.put(column)
        dispatch('holochainSaveCard', { card: column })
        // rootState.db.cards.get({ uuid: column.uuid })
        //   .then(col => {
        //     rootState.db.cards.put(column)
        //     console.log(`${col.parentColumn}${col.uuid}/`)
        //     rootState.db.cards.where('parentColumn').startsWith(`${col.parentColumn}${col.uuid}`).toArray(cards => {
        //       console.log('🚀 ~ file: recursivecards.store.js ~ line 93 ~ saveColumn ~ cards', cards)
        //       cards.forEach(card => {
        //         card.parentColumn = card.parentColumn.replace(`${col.parentColumn}${col.uuid}`, `${column.parentColumn}${column.uuid}`)
        //         console.log('🚀 ~ file: recursivecards.store.js ~ line 98 ~ rootState.db.cards.where ~ card', card)
        //         rootState.db.cards.put(card)
        //         dispatch('holochainSaveCard', { card: card })
        //         if (card.type === 'column') {
        //           commit('updateColumn', column)
        //         } else {
        //           commit('updateCard', card)
        //         }
        //       })
        //     })
        //   })
      }
    },
    fetchCards ({ rootState, state, commit }) {
      rootState.db.cards.toArray(cards => {
        commit('setCards', cards)
        const start = Date.now()
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
            console.log('time to list ', Date.now() - start)
            result.cards.forEach(card => {
              rootState.db.cards.put(card)
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
      dispatch('holochainSaveCard', { card })
    },
    holochainSaveCard ({ rootState, state, commit }, payload) {
      let start = Date.now()
      const card = payload.card
      if (card.entryHash) {
        console.log('delete start', Date.now())
        rootState.hcClient
          .callZome({
            cap: null,
            cell_id: state.cellId,
            zome_name: 'recursivecards',
            fn_name: 'delete_card',
            provenance: state.agentPubKey,
            payload: card
          })
          .then(() => console.log('time to delete ', Date.now() - start))
      }
      start = Date.now()
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
          console.log('🚀 ~ file: recursivecards.store.js ~ line 138 ~ holochainSaveCard ~ committedCard', committedCard)
          console.log('time to create ', Date.now() - start)
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
