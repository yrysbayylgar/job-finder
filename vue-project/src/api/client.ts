import axios from 'axios'
import { INITIAL_JOBS } from './mockData'
import type { Job } from '../types/job'
import type { Application } from '../types/application'

// Базовый URL для MockAPI (можно переопределить через переменную окружения VITE_API_URL)
const DEFAULT_API_URL = 'https://67b5e43a07ba6e59083efbe9.mockapi.io/api/v1'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || DEFAULT_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Локальное хранилище для откликов и вакансий при отсутствии/недоступности внешнего MockAPI
const STORAGE_APPLICATIONS_KEY = 'jobfinder-mock-applications'
const STORAGE_JOBS_KEY = 'jobfinder-mock-jobs'

function getLocalJobs(): Job[] {
  try {
    const raw = localStorage.getItem(STORAGE_JOBS_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch {
    // fallback below
  }
  localStorage.setItem(STORAGE_JOBS_KEY, JSON.stringify(INITIAL_JOBS))
  return INITIAL_JOBS
}

function getLocalApplications(): Application[] {
  try {
    const raw = localStorage.getItem(STORAGE_APPLICATIONS_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // fallback below
  }
  return []
}

function saveLocalApplication(app: Application): Application {
  const list = getLocalApplications()
  const savedApp: Application = {
    ...app,
    id: app.id || String(Date.now()),
    createdAt: app.createdAt || new Date().toISOString(),
  }
  list.unshift(savedApp)
  localStorage.setItem(STORAGE_APPLICATIONS_KEY, JSON.stringify(list))
  return savedApp
}

// Axios-перехватчик для надёжной работы:
// Если удалённый MockAPI возвращает 404 (ресурс ещё не создан) или ошибку сети,
// перехватчик корректно возвращает данные, имитируя MockAPI, чтобы приложение всегда оставалось работоспособным.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const config = error.config
    if (!config) return Promise.reject(error)

    const url = config.url || ''
    const method = (config.method || 'get').toLowerCase()

    console.warn(
      `[API Warning] Запрос к ${method.toUpperCase()} ${url} завершился с ошибкой (${error.message}). Используем локальный MockAPI fallback.`,
    )

    // GET /jobs
    if (method === 'get' && (url === '/jobs' || url.endsWith('/jobs'))) {
      const jobs = getLocalJobs()
      return Promise.resolve({
        data: jobs,
        status: 200,
        statusText: 'OK (Mock fallback)',
        headers: {},
        config,
      })
    }

    // GET /jobs/:id
    const jobMatch = url.match(/\/jobs\/([^/?#]+)/)
    if (method === 'get' && jobMatch) {
      const id = jobMatch[1]
      const jobs = getLocalJobs()
      const found = jobs.find((j) => String(j.id) === String(id))
      if (found) {
        return Promise.resolve({
          data: found,
          status: 200,
          statusText: 'OK (Mock fallback)',
          headers: {},
          config,
        })
      }
      return Promise.reject(new Error(`Вакансия с ID ${id} не найдена`))
    }

    // POST /applications
    if (method === 'post' && (url === '/applications' || url.endsWith('/applications'))) {
      let data: Application
      try {
        data = typeof config.data === 'string' ? JSON.parse(config.data) : config.data
      } catch {
        data = config.data
      }
      const saved = saveLocalApplication(data)
      return Promise.resolve({
        data: saved,
        status: 201,
        statusText: 'Created (Mock fallback)',
        headers: {},
        config,
      })
    }

    return Promise.reject(error)
  },
)

export default apiClient

