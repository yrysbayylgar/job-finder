import type { Module } from 'vuex'

export interface User {
  name: string
  email: string
}

export interface AuthState {
  user: User | null
}

const STORAGE_KEY = 'jobfinder-user'

function restoreUser(): User | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)

    if (!saved) return null

    const user = JSON.parse(saved)

    if (
      typeof user?.name === 'string' &&
      typeof user?.email === 'string' &&
      user.name.trim() &&
      user.email.trim()
    ) {
      return {
        name: user.name,
        email: user.email,
      }
    }

    return null
  } catch {
    return null
  }
}

const auth: Module<AuthState, unknown> = {
  namespaced: true,

  state: (): AuthState => ({
    user: restoreUser(),
  }),

  getters: {
    isAuthenticated: (state) => state.user !== null,
    currentUser: (state) => state.user,
  },

  mutations: {
    SET_USER(state, user: User | null) {
      state.user = user
    },
  },

  actions: {
    login({ commit }, credentials: User) {
      const user: User = {
        name: credentials.name.trim(),
        email: credentials.email.trim().toLowerCase(),
      }

      if (!user.name) {
        throw new Error('Введите имя')
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
        throw new Error('Введите корректный email')
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
      commit('SET_USER', user)
    },

    logout({ commit }) {
      localStorage.removeItem(STORAGE_KEY)
      commit('SET_USER', null)
    },
  },
}

export default auth