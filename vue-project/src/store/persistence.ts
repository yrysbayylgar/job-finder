import store from './index'
import type { Job } from '../types/job'

const BASE_STORAGE_KEY = 'jobfinder-favorites'

function getStorageKey(email?: string | null): string {
  if (email && email.trim()) {
    return `${BASE_STORAGE_KEY}_${email.trim().toLowerCase()}`
  }
  return `${BASE_STORAGE_KEY}_guest`
}

function isJob(value: unknown): value is Job {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const job = value as Record<string, unknown>

  return (
    typeof job.id === 'string' &&
    typeof job.title === 'string' &&
    typeof job.company === 'string' &&
    typeof job.city === 'string' &&
    typeof job.salary === 'number' &&
    typeof job.position === 'string' &&
    typeof job.employmentType === 'string' &&
    typeof job.description === 'string' &&
    typeof job.requirements === 'string'
  )
}

function loadFavoritesForUser(email?: string | null): Job[] {
  const key = getStorageKey(email)
  try {
    let saved = localStorage.getItem(key)

    // Миграция со старого единого ключа, если пользователь был авторизован
    if (!saved && email) {
      const legacy = localStorage.getItem(BASE_STORAGE_KEY)
      if (legacy) {
        saved = legacy
        localStorage.setItem(key, legacy)
        localStorage.removeItem(BASE_STORAGE_KEY)
      }
    }

    if (saved) {
      const parsed: unknown = JSON.parse(saved)

      if (Array.isArray(parsed)) {
        const jobs = parsed.filter(isJob)
        return [...new Map(jobs.map((job) => [job.id, job])).values()]
      }
    }
  } catch (error) {
    console.error('Не удалось восстановить избранное:', error)
  }

  return []
}

export function setupPersistence() {
  // 1. Восстановление избранного для текущего пользователя (или гостя) при запуске
  const currentUser = store.state.auth?.user
  const initialJobs = loadFavoritesForUser(currentUser?.email)
  store.commit('favorites/SET_ITEMS', initialJobs)

  // 2. Watcher за сменой пользователя (вход или выход из аккаунта)
  store.watch(
    (state) => state.auth.user,
    (newUser, oldUser) => {
      // Сохраняем текущие вакансии в профиль предыдущего пользователя
      if (oldUser?.email) {
        try {
          const oldKey = getStorageKey(oldUser.email)
          localStorage.setItem(oldKey, JSON.stringify(store.state.favorites.items))
        } catch (error) {
          console.error('Не удалось сохранить избранное пользователя:', error)
        }
      }

      // При выходе из аккаунта очищаем старый общий ключ и гостевой список
      if (!newUser) {
        localStorage.removeItem(BASE_STORAGE_KEY)
        localStorage.removeItem(`${BASE_STORAGE_KEY}_guest`)
      }

      // Загружаем избранное для нового пользователя (или пустой список для гостя)
      const newJobs = loadFavoritesForUser(newUser?.email)
      store.commit('favorites/SET_ITEMS', newJobs)
    },
  )

  // 3. Watcher для сохранения избранного в localStorage при добавлении/удалении вакансий
  store.watch(
    (state) => state.favorites.items,
    (items) => {
      try {
        const currentEmail = store.state.auth.user?.email
        const key = getStorageKey(currentEmail)
        localStorage.setItem(key, JSON.stringify(items))
      } catch (error) {
        console.error('Не удалось сохранить избранное:', error)
      }
    },
    { deep: true },
  )
}
