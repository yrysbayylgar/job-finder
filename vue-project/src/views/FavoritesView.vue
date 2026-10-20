<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import type { RootState } from '../store'
import type { Job } from '../types/job'
import JobCard from '../components/JobCard.vue'

const store = useStore<RootState>()

const jobs = computed<Job[]>(() => store.state.favorites.items)
const count = computed(() => store.getters['favorites/count'])

function toggleFavorite(job: Job) {
  store.dispatch('favorites/toggleFavorite', job)
}
</script>

<template>
  <main class="favorites-page">
    <div class="page-header">
      <h1 class="page-title">Избранные вакансии</h1>
      <p class="subtitle">Сохранено: {{ count }}</p>
    </div>

    <!-- Пустой список -->
    <div v-if="jobs.length === 0" class="empty-state">
      <div class="empty-icon">⭐</div>
      <h2 class="empty-title">Пока здесь пусто</h2>
      <p class="empty-desc">Добавьте понравившиеся вакансии из каталога, чтобы вернуться к ним позже.</p>
      <RouterLink to="/jobs" class="catalog-link">
        Перейти в каталог вакансий →
      </RouterLink>
    </div>

    <!-- Список избранных вакансий через переиспользуемый JobCard -->
    <div v-else class="jobs-list">
      <JobCard
        v-for="job in jobs"
        :key="job.id"
        :job="job"
        :is-favorite="true"
        @toggle-favorite="toggleFavorite"
      />
    </div>
  </main>
</template>

<style scoped>
.favorites-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 24px 60px;
}

.page-header {
  margin-bottom: 24px;
}

.page-title {
  margin: 0 0 8px;
  font-size: 32px;
  font-weight: 800;
  color: #0f172a;
}

.subtitle {
  color: #64748b;
  margin: 0;
  font-size: 16px;
}

.jobs-list {
  display: grid;
  gap: 16px;
}

.empty-state {
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

.empty-icon {
  font-size: 44px;
  margin-bottom: 12px;
}

.empty-title {
  margin: 0 0 8px;
  font-size: 22px;
  color: #0f172a;
}

.empty-desc {
  color: #64748b;
  margin: 0 0 24px;
  max-width: 440px;
  line-height: 1.5;
}

.catalog-link {
  display: inline-flex;
  padding: 10px 20px;
  background: #2563eb;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: background 0.15s ease;
}

.catalog-link:hover {
  background: #1d4ed8;
}
</style>
