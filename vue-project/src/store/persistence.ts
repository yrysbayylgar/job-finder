import store from './index'
import type { Job } from '../types/job'

const STORAGE_KEY = 'jobfinder-favorites'

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

export function setupPersistence() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)

    if (saved) {
      const parsed: unknown = JSON.parse(saved)

      if (Array.isArray(parsed)) {
        const jobs = parsed.filter(isJob)
        const uniqueJobs = [
          ...new Map(jobs.map((job) => [job.id, job])).values(),
        ]

        store.commit('favorites/SET_ITEMS', uniqueJobs)
      }
    }
  } catch (error) {
    console.error('Не удалось восстановить избранное:', error)
  }

  store.watch(
    (state) => state.favorites.items,
    (items) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
      } catch (error) {
        console.error('Не удалось сохранить избранное:', error)
      }
    },
    { deep: true },
  )
}