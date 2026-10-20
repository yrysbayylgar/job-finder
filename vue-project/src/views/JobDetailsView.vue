<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import type { RootState } from '../store'
import type { Job } from '../types/job'
import type { Application } from '../types/application'
import { getJobById } from '../api/jobs'
import { submitApplication } from '../api/applications'
import ApplicationForm from '../components/ApplicationForm.vue'

const route = useRoute()
const store = useStore<RootState>()

const jobId = computed(() => String(route.params.id))
const job = ref<Job | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

// Авторизованный пользователь
const user = computed(() => store.state.auth.user)
const isAuthenticated = computed(() => store.getters['auth/isAuthenticated'])

// Статус избранного
const isFavorite = computed(() => {
  if (!job.value) return false
  return store.getters['favorites/isFavorite'](job.value.id)
})

// Состояние отправки отклика
const isSubmitting = ref(false)
const submitSuccess = ref(false)
const submitError = ref<string | null>(null)

onMounted(() => {
  loadJob()
})

async function loadJob() {
  loading.value = true
  error.value = null

  try {
    const data = await getJobById(jobId.value)
    job.value = data
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Не удалось загрузить данные о вакансии'
    error.value = message
  } finally {
    loading.value = false
  }
}

function toggleFavorite() {
  if (job.value) {
    store.dispatch('favorites/toggleFavorite', job.value)
  }
}

function formatSalary(salary: number): string {
  return new Intl.NumberFormat('ru-RU').format(salary)
}

// Обработка Custom Event submit-application от дочернего компонента ApplicationForm
async function handleSubmitApplication(formData: {
  name: string
  email: string
  coverLetter: string
}) {
  if (!job.value) return

  isSubmitting.value = true
  submitError.value = null

  const applicationData: Application = {
    jobId: job.value.id,
    jobTitle: job.value.title,
    name: formData.name,
    email: formData.email,
    coverLetter: formData.coverLetter,
  }

  try {
    // Axios POST запрос к MockAPI
    await submitApplication(applicationData)
    submitSuccess.value = true
  } catch (err) {
    submitError.value =
      err instanceof Error ? err.message : 'Не удалось отправить отклик. Попробуйте снова.'
  } finally {
    isSubmitting.value = false
  }
}

function resetApplicationState() {
  submitSuccess.value = false
  submitError.value = null
}
</script>

<template>
  <main class="job-details-page">
    <!-- Навигация назад -->
    <div class="navigation-bar">
      <RouterLink to="/jobs" class="back-link">
        ← Назад к списку вакансий
      </RouterLink>
    </div>

    <!-- Состояние: Загрузка -->
    <div v-if="loading" class="state-container loading-state">
      <div class="spinner"></div>
      <p class="state-title">Загрузка информации о вакансии…</p>
    </div>

    <!-- Состояние: Ошибка / Вакансия не найдена -->
    <div v-else-if="error || !job" class="state-container error-state" role="alert">
      <div class="state-icon">⚠️</div>
      <h2 class="state-title">Вакансия не найдена</h2>
      <p class="state-desc">{{ error || 'Запрошенная вакансия не существует или была удалена.' }}</p>
      <div class="error-actions">
        <button type="button" class="btn btn-primary" @click="loadJob">
          Повторить попытку
        </button>
        <RouterLink to="/jobs" class="btn btn-secondary">
          Перейти в каталог
        </RouterLink>
      </div>
    </div>

    <!-- Детальная информация о вакансии -->
    <div v-else class="job-details-layout">
      <!-- Основной контент вакансии -->
      <section class="job-main-card">
        <div class="header-section">
          <div class="title-meta">
            <h1 class="job-title">{{ job.title }}</h1>
            <p class="company-city">{{ job.company }} · {{ job.city }}</p>
          </div>

          <button
            type="button"
            class="favorite-btn"
            :class="{ active: isFavorite }"
            @click="toggleFavorite"
          >
            <span>{{ isFavorite ? '★ В избранном' : '☆ В избранное' }}</span>
          </button>
        </div>

        <div class="salary-block">
          <span class="salary-value">{{ formatSalary(job.salary) }} ₸</span>
          <span class="salary-label">в месяц на руки</span>
        </div>

        <div class="tags-row">
          <span class="tag-badge position-badge">{{ job.position }}</span>
          <span class="tag-badge type-badge">{{ job.employmentType }}</span>
          <span class="tag-badge city-badge">📍 {{ job.city }}</span>
        </div>

        <hr class="divider" />

        <div class="content-block">
          <h2 class="section-title">О вакансии и компании</h2>
          <p class="section-text">{{ job.description }}</p>
        </div>

        <div class="content-block">
          <h2 class="section-title">Требования к кандидату</h2>
          <p class="section-text requirements-text">{{ job.requirements }}</p>
        </div>
      </section>

      <!-- Блок отклика на вакансию -->
      <aside class="application-sidebar">
        <!-- Успешная отправка отклика -->
        <div v-if="submitSuccess" class="success-card">
          <div class="success-icon">✅</div>
          <h3 class="success-title">Отклик отправлен!</h3>
          <p class="success-desc">
            Ваше резюме и сопроводительное письмо успешно отправлены в компанию <strong>{{ job.company }}</strong>.
          </p>
          <button type="button" class="btn btn-outline" @click="resetApplicationState">
            Отправить ещё один отклик
          </button>
        </div>

        <!-- Авторизован: форма отклика -->
        <template v-else-if="isAuthenticated">
          <ApplicationForm
            :initial-name="user?.name || ''"
            :initial-email="user?.email || ''"
            :is-submitting="isSubmitting"
            @submit-application="handleSubmitApplication"
          />

          <p v-if="submitError" class="submit-error" role="alert">
            {{ submitError }}
          </p>
        </template>

        <!-- Гость: приглашение войти -->
        <div v-else class="guest-card">
          <div class="guest-icon">🔒</div>
          <h3 class="guest-title">Хотите откликнуться?</h3>
          <p class="guest-desc">
            Для отправки отклика и резюме на эту вакансию необходимо войти в систему.
          </p>
          <RouterLink
            :to="{ path: '/login', query: { redirect: `/jobs/${job.id}` } }"
            class="btn btn-primary login-btn"
          >
            Войти в аккаунт
          </RouterLink>
          <p class="guest-note">
            Учебная авторизация: пароль не требуется, достаточно указать имя и email.
          </p>
        </div>
      </aside>
    </div>
  </main>
</template>

<style scoped>
.job-details-page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 32px 24px 64px;
}

.navigation-bar {
  margin-bottom: 24px;
}

.back-link {
  color: #2563eb;
  font-weight: 600;
  text-decoration: none;
  font-size: 15px;
  display: inline-flex;
  align-items: center;
  transition: color 0.15s ease;
}

.back-link:hover {
  color: #1d4ed8;
  text-decoration: underline;
}

.job-details-layout {
  display: grid;
  grid-template-columns: 1.6fr 1.2fr;
  gap: 28px;
  align-items: start;
}

@media (max-width: 860px) {
  .job-details-layout {
    grid-template-columns: 1fr;
  }
}

.job-main-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02);
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 20px;
}

.title-meta {
  flex: 1;
}

.job-title {
  margin: 0 0 8px;
  font-size: 26px;
  font-weight: 800;
  color: #0f172a;
}

.company-city {
  margin: 0;
  font-size: 16px;
  color: #64748b;
}

.favorite-btn {
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  border: 1px solid #cbd5e1;
  background: #f8fafc;
  color: #475569;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s ease;
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

.salary-block {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 20px;
}

.salary-value {
  font-size: 28px;
  font-weight: 800;
  color: #0f172a;
}

.salary-label {
  font-size: 14px;
  color: #64748b;
}

.tags-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 24px;
}

.tag-badge {
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 13px;
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

.divider {
  border: none;
  border-top: 1px solid #f1f5f9;
  margin: 24px 0;
}

.content-block {
  margin-bottom: 28px;
}

.content-block:last-child {
  margin-bottom: 0;
}

.section-title {
  margin: 0 0 12px;
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
}

.section-text {
  margin: 0;
  color: #334155;
  font-size: 15px;
  line-height: 1.65;
}

.requirements-text {
  background: #f8fafc;
  padding: 18px;
  border-radius: 12px;
  border-left: 4px solid #2563eb;
}

/* Сайдбар */
.application-sidebar {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.guest-card,
.success-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 32px 24px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02);
}

.guest-icon,
.success-icon {
  font-size: 42px;
  margin-bottom: 12px;
}

.guest-title,
.success-title {
  margin: 0 0 8px;
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
}

.guest-desc,
.success-desc {
  margin: 0 0 20px;
  color: #64748b;
  font-size: 14px;
  line-height: 1.5;
}

.guest-note {
  margin: 16px 0 0;
  font-size: 12px;
  color: #94a3b8;
  line-height: 1.4;
}

.submit-error {
  margin-top: 10px;
  padding: 12px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #b91c1c;
  border-radius: 10px;
  font-size: 14px;
}

/* Кнопки */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 11px 20px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.15s ease;
}

.btn-primary {
  background: #2563eb;
  color: white;
  border: none;
}

.btn-primary:hover {
  background: #1d4ed8;
}

.btn-secondary {
  background: #f1f5f9;
  color: #334155;
  border: 1px solid #cbd5e1;
}

.btn-secondary:hover {
  background: #e2e8f0;
}

.btn-outline {
  background: white;
  border: 1px solid #cbd5e1;
  color: #334155;
}

.btn-outline:hover {
  background: #f8fafc;
}

.login-btn {
  width: 100%;
}

/* Состояния */
.state-container {
  padding: 60px 24px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  text-align: center;
}

.state-icon {
  font-size: 42px;
  margin-bottom: 12px;
}

.state-title {
  margin: 0 0 8px;
  font-size: 22px;
  color: #0f172a;
}

.state-desc {
  margin: 0 0 20px;
  color: #64748b;
}

.error-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.spinner {
  width: 44px;
  height: 44px;
  border: 4px solid #e2e8f0;
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>

