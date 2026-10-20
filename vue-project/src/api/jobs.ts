import apiClient from './client'
import type { Job } from '../types/job'

/**
 * Получить список всех вакансий
 */
export async function getJobs(): Promise<Job[]> {
  const response = await apiClient.get<Job[]>('/jobs')
  return response.data
}

/**
 * Получить информацию об одной вакансии по её идентификатору
 */
export async function getJobById(id: string): Promise<Job> {
  const response = await apiClient.get<Job>(`/jobs/${id}`)
  return response.data
}

