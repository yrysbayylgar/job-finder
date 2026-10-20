import { createStore } from 'vuex'
import auth from './modules/auth'
import favorites from './modules/favorites'

import type { AuthState } from './modules/auth'
import type { FavoritesState } from './modules/favorites'

export interface RootState {
  auth: AuthState
  favorites: FavoritesState
}

const store = createStore<RootState>({
  modules: {
    auth,
    favorites,
  },
})

export default store