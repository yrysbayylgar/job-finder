<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import type { RootState } from '../store'
import type { Job } from '../types/job'

const store = useStore<RootState>()

const jobs = computed<Job[]>(() => store.state.favorites.items)
const count = computed(() => store.getters['favorites/count'])

function removeFavorite(id: string) {
  store.dispatch('favorites/removeFavorite', id)
}

function formatSalary(salary: number) {
  return new Intl.NumberFormat('ru-RU').format(salary)
}
</script>

<template>
  <section class="favorites-page">
    <h1>Избранные вакансии</h1>
    <p class="subtitle">Сохранено: {{ count }}</p>

    <div v-if="jobs.length === 0" class="empty">
      <h2>Пока здесь пусто</h2>
      <p>Добавьте понравившиеся вакансии из каталога.</p>
    </div>

    <div v-else class="job-list">
      <article v-for="job in jobs" :key="job.id" class="job-card">
        <h2>{{ job.title }}</h2>
        <p>{{ job.company }} · {{ job.city }}</p>
        <p class="salary">{{ formatSalary(job.salary) }} ₸ / месяц</p>
        <p>{{ job.position }} · {{ job.employmentType }}</p>

        <button type="button" @click="removeFavorite(job.id)">
          Удалить из избранного
        </button>
      </article>
    </div>
  </section>
</template>

<style scoped>
.favorites-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 24px;
}

h1 {
  margin-bottom: 8px;
}

.subtitle {
  color: #64748b;
  margin-bottom: 28px;
}

.job-list {
  display: grid;
  gap: 16px;
}

.job-card,
.empty {
  padding: 24px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
}

.job-card h2 {
  margin-top: 0;
}

.job-card p,
.empty p {
  color: #64748b;
}

.job-card .salary {
  color: #0f172a;
  font-weight: 700;
}

button {
  padding: 10px 16px;
  border: 1px solid #fecaca;
  border-radius: 8px;
  background: #fff1f2;
  color: #b91c1c;
  font: inherit;
  cursor: pointer;
}

.empty {
  text-align: center;
}
</style>