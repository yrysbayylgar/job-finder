<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import type { RootState } from '../store'
import type { Job } from '../types/job'
import JobCard from '../components/JobCard.vue'
import JobFilters from '../components/JobFilters.vue'

const store = useStore<RootState>()

// Состояния фильтров
const search = ref('')
const position = ref('')
const employmentType = ref('')

// Данные из Vuex
const jobs = computed<Job[]>(() => store.state.jobs.items)
const loading = computed<boolean>(() => store.state.jobs.loading)
const error = computed<string | null>(() => store.state.jobs.error)

// Проверка избранного
const isFavorite = (jobId: string) => store.getters['favorites/isFavorite'](jobId)

// Lifecycle hook: загрузка вакансий при монтировании компонента
onMounted(() => {
  loadJobs()
})

async function loadJobs() {
  try {
    await store.dispatch('jobs/fetchJobs')
  } catch (err) {
    console.error('Ошибка загрузки вакансий:', err)
  }
}

// Computed: фильтрация и поиск
const filteredJobs = computed<Job[]>(() => {
  const query = search.value.trim().toLowerCase()

  return jobs.value.filter((job) => {
    // Поиск по названию вакансии и названию компании
    const matchesSearch =
      !query ||
      job.title.toLowerCase().includes(query) ||
      job.company.toLowerCase().includes(query)

    // Фильтр по должности
    const matchesPosition =
      !position.value || job.position.toLowerCase() === position.value.toLowerCase()

    // Фильтр по типу занятости
    const matchesType =
      !employmentType.value ||
      job.employmentType.toLowerCase() === employmentType.value.toLowerCase()

    return matchesSearch && matchesPosition && matchesType
  })
})

// Обработка Custom Event от карточки
function onToggleFavorite(job: Job) {
  store.dispatch('favorites/toggleFavorite', job)
}

// Сброс фильтров
function resetFilters() {
  search.value = ''
  position.value = ''
  employmentType.value = ''
}
</script>

<template>
  <main class="jobs-page">
    <div class="page-header">
      <h1 class="page-title">Каталог вакансий</h1>
      <p class="page-subtitle">Найдите работу мечты среди лучших IT-компаний</p>
    </div>

    <!-- Фильтры и поиск -->
    <JobFilters
      v-model:search="search"
      v-model:position="position"
      v-model:employmentType="employmentType"
      @reset="resetFilters"
    />

    <!-- Состояние: Загрузка -->
    <div v-if="loading" class="state-container loading-state">
      <div class="spinner"></div>
      <p class="state-title">Загрузка вакансий…</p>
      <p class="state-desc">Пожалуйста, подождите, мы получаем актуальные предложения.</p>
    </div>

    <!-- Состояние: Ошибка -->
    <div v-else-if="error" class="state-container error-state" role="alert">
      <div class="state-icon">⚠️</div>
      <h2 class="state-title">Не удалось загрузить вакансии</h2>
      <p class="state-desc">{{ error }}</p>
      <button type="button" class="retry-btn" @click="loadJobs">
        Повторить запрос
      </button>
    </div>

    <!-- Состояние: Ничего не найдено -->
    <div
      v-else-if="filteredJobs.length === 0"
      class="state-container empty-state"
    >
      <div class="state-icon">🔍</div>
      <h2 class="state-title">Ничего не найдено</h2>
      <p class="state-desc">
        По вашему запросу вакансий не найдено. Попробуйте изменить параметры поиска или сбросить фильтры.
      </p>
      <button type="button" class="reset-link-btn" @click="resetFilters">
        Сбросить все фильтры
      </button>
    </div>

    <!-- Список вакансий -->
    <div v-else class="jobs-container">
      <div class="results-info">
        Найдено вакансий: <strong>{{ filteredJobs.length }}</strong>
      </div>

      <div class="jobs-list">
        <JobCard
          v-for="job in filteredJobs"
          :key="job.id"
          :job="job"
          :is-favorite="isFavorite(job.id)"
          @toggle-favorite="onToggleFavorite"
        />
      </div>
    </div>
  </main>
</template>

<style scoped>
.jobs-page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 36px 24px 60px;
}

.page-header {
  margin-bottom: 24px;
}

.page-title {
  margin: 0 0 6px;
  font-size: 32px;
  font-weight: 800;
  color: #0f172a;
}

.page-subtitle {
  margin: 0;
  color: #64748b;
  font-size: 16px;
}

.jobs-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.results-info {
  font-size: 14px;
  color: #64748b;
}

.results-info strong {
  color: #0f172a;
}

.jobs-list {
  display: grid;
  gap: 16px;
}

/* Состояния: Загрузка, Ошибка, Пусто */
.state-container {
  padding: 48px 24px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.state-icon {
  font-size: 40px;
  margin-bottom: 12px;
}

.state-title {
  margin: 0 0 8px;
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
}

.state-desc {
  margin: 0 0 20px;
  color: #64748b;
  max-width: 480px;
  line-height: 1.5;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.retry-btn {
  padding: 10px 22px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s ease;
}

.retry-btn:hover {
  background: #1d4ed8;
}

.reset-link-btn {
  padding: 10px 20px;
  background: #f1f5f9;
  color: #334155;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.reset-link-btn:hover {
  background: #e2e8f0;
}
</style>

