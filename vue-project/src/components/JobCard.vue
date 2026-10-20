<script setup lang="ts">
import type { Job } from '../types/job'

interface Props {
  job: Job
  isFavorite?: boolean
}

defineProps<Props>()

defineEmits<{
  (e: 'toggle-favorite', job: Job): void
}>()

function formatSalary(salary: number): string {
  return new Intl.NumberFormat('ru-RU').format(salary)
}
</script>

<template>
  <article class="job-card">
    <div class="card-header">
      <div class="title-wrap">
        <h3 class="job-title">{{ job.title }}</h3>
        <p class="company-city">{{ job.company }} · {{ job.city }}</p>
      </div>

      <button
        type="button"
        class="favorite-btn"
        :class="{ active: isFavorite }"
        :title="isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'"
        @click="$emit('toggle-favorite', job)"
      >
        <span class="star-icon">{{ isFavorite ? '★' : '☆' }}</span>
        <span>{{ isFavorite ? 'В избранном' : 'В избранное' }}</span>
      </button>
    </div>

    <div class="card-body">
      <div class="salary">{{ formatSalary(job.salary) }} ₸ <span class="salary-period">/ месяц</span></div>

      <div class="tags">
        <span class="badge position-badge">{{ job.position }}</span>
        <span class="badge type-badge">{{ job.employmentType }}</span>
        <span class="badge city-badge">{{ job.city }}</span>
      </div>

      <p class="description-preview">{{ job.description }}</p>
    </div>

    <div class="card-footer">
      <RouterLink :to="`/jobs/${job.id}`" class="details-link">
        Подробнее о вакансии →
      </RouterLink>
    </div>
  </article>
</template>

<style scoped>
.job-card {
  padding: 24px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.job-card:hover {
  border-color: #cbd5e1;
  box-shadow: 0 4px 20px rgba(15, 23, 42, 0.06);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.title-wrap {
  flex: 1;
}

.job-title {
  margin: 0 0 6px 0;
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
}

.company-city {
  margin: 0;
  color: #64748b;
  font-size: 15px;
}

.favorite-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 10px;
  border: 1px solid #cbd5e1;
  background: #f8fafc;
  color: #475569;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.favorite-btn:hover {
  background: #eff6ff;
  border-color: #93c5fd;
  color: #2563eb;
}

.favorite-btn.active {
  background: #fef2f2;
  border-color: #fecaca;
  color: #dc2626;
}

.star-icon {
  font-size: 16px;
  line-height: 1;
}

.salary {
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 12px;
}

.salary-period {
  font-size: 14px;
  font-weight: 400;
  color: #64748b;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.position-badge {
  background: #eff6ff;
  color: #1d4ed8;
}

.type-badge {
  background: #f0fdf4;
  color: #15803d;
}

.city-badge {
  background: #f8fafc;
  color: #475569;
  border: 1px solid #e2e8f0;
}

.description-preview {
  margin: 0;
  color: #475569;
  line-height: 1.55;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: 14px;
}

.card-footer {
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid #f1f5f9;
  display: flex;
  justify-content: flex-end;
}

.details-link {
  color: #2563eb;
  font-weight: 600;
  font-size: 14px;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.details-link:hover {
  text-decoration: underline;
  color: #1d4ed8;
}
</style>

