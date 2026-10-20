import apiClient from './client'
import type { Application } from '../types/application'

/**
 * Отправить отклик на вакансию в MockAPI
 */
export async function submitApplication(data: Application): Promise<Application> {
  const response = await apiClient.post<Application>('/applications', data)
  return response.data
}

