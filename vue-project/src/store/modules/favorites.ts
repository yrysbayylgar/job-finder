import type { Module } from 'vuex'
import type { Job } from '../../types/job'

export interface FavoritesState {
  items: Job[]
}

const favorites: Module<FavoritesState, unknown> = {
  namespaced: true,

  state: (): FavoritesState => ({
    items: [],
  }),

  getters: {
    items: (state) => state.items,

    count: (state) => state.items.length,

    isFavorite: (state) => (id: string) =>
      state.items.some((job) => job.id === id),
  },

  mutations: {
    SET_ITEMS(state, items: Job[]) {
      state.items = items
    },

    ADD_ITEM(state, job: Job) {
      state.items.push(job)
    },

    REMOVE_ITEM(state, id: string) {
      state.items = state.items.filter((job) => job.id !== id)
    },

    CLEAR_ITEMS(state) {
      state.items = []
    },
  },

  actions: {
    toggleFavorite({ state, commit }, job: Job) {
      const exists = state.items.some((item) => item.id === job.id)

      if (exists) {
        commit('REMOVE_ITEM', job.id)
      } else {
        commit('ADD_ITEM', job)
      }
    },

    removeFavorite({ commit }, id: string) {
      commit('REMOVE_ITEM', id)
    },

    clearFavorites({ commit }) {
      commit('CLEAR_ITEMS')
    },
  },
}

export default favorites
