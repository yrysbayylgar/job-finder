import { createStore } from 'vuex'
import auth from './modules/auth'
import favorites from './modules/favorites'
import jobs from './modules/jobs'

import type { AuthState } from './modules/auth'
import type { FavoritesState } from './modules/favorites'
import type { JobsState } from './modules/jobs'

export interface RootState {
  auth: AuthState
  favorites: FavoritesState
  jobs: JobsState
}

const store = createStore<RootState>({
  modules: {
    auth,
    favorites,
    jobs,
  },
})

export default store
