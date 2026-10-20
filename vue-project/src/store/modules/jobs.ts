import type { Module } from 'vuex'
import type { Job } from '../../types/job'
import { getJobs } from '../../api/jobs'

export interface JobsState {
  items: Job[]
  loading: boolean
  error: string | null
}

const jobs: Module<JobsState, unknown> = {
  namespaced: true,

  state: (): JobsState => ({
    items: [],
    loading: false,
    error: null,
  }),

  getters: {
    items: (state) => state.items,
    allJobs: (state) => state.items,
    isLoading: (state) => state.loading,
    error: (state) => state.error,
    jobById: (state) => (id: string) =>
      state.items.find((job) => String(job.id) === String(id)),
  },

  mutations: {
    SET_JOBS(state, items: Job[]) {
      state.items = items
    },
    SET_LOADING(state, loading: boolean) {
      state.loading = loading
    },
    SET_ERROR(state, error: string | null) {
      state.error = error
    },
  },

  actions: {
    async fetchJobs({ commit }) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)

      try {
        const data = await getJobs()
        commit('SET_JOBS', data)
        return data
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Не удалось загрузить список вакансий'
        commit('SET_ERROR', message)
        throw err
      } finally {
        commit('SET_LOADING', false)
      }
    },
  },
}

export default jobs

