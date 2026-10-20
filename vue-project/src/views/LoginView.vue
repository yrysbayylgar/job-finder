<script setup lang="ts">
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import type { User } from '../store/modules/auth'

const store = useStore()
const route = useRoute()
const router = useRouter()

const name = ref('')
const email = ref('')
const error = ref('')
const isSubmitting = ref(false)

const user = computed<User | null>(
  () => store.getters['auth/currentUser'],
)

async function login() {
  error.value = ''
  isSubmitting.value = true

  try {
    await store.dispatch('auth/login', {
      name: name.value,
      email: email.value,
    })

    name.value = ''
    email.value = ''

    // Возвращение на страницу вакансии или в каталог после успешного входа
    const redirectPath = (route.query.redirect as string) || '/jobs'
    await router.push(redirectPath)
  } catch (err) {
    error.value =
      err instanceof Error ? err.message : 'Не удалось войти'
  } finally {
    isSubmitting.value = false
  }
}

async function logout() {
  error.value = ''

  try {
    await store.dispatch('auth/logout')
  } catch {
    error.value = 'Не удалось выйти. Попробуйте ещё раз.'
  }
}
</script>

<template>
  <main class="login-page">
    <section class="login-card">
      <RouterLink to="/jobs" class="brand">
        💼 JobFinder
      </RouterLink>

      <template v-if="user">
        <h1>Добро пожаловать, {{ user.name }}!</h1>
        <p>Вы вошли как <strong>{{ user.email }}</strong></p>
        <p class="status-tip">После обновления страницы вход автоматически восстанавливается из localStorage.</p>

        <div class="user-actions">
          <RouterLink
            :to="(route.query.redirect as string) || '/jobs'"
            class="primary-btn continue-link"
          >
            Продолжить поиск вакансий →
          </RouterLink>

          <button type="button" class="secondary-btn" @click="logout">
            Выйти из аккаунта
          </button>
        </div>
      </template>

      <template v-else>
        <h1>Вход в аккаунт</h1>
        <p>Войдите, чтобы откликаться на интересующие вакансии.</p>

        <form @submit.prevent="login">
          <label for="name">Ваше имя</label>
          <input
            id="name"
            v-model="name"
            type="text"
            autocomplete="name"
            placeholder="Например: Иван Иванов"
            required
            maxlength="80"
          />

          <label for="email">Электронная почта</label>
          <input
            id="email"
            v-model="email"
            type="email"
            autocomplete="email"
            placeholder="example@mail.kz"
            required
          />

          <button type="submit" class="primary-btn" :disabled="isSubmitting">
            {{ isSubmitting ? 'Входим…' : 'Войти' }}
          </button>
        </form>

        <p class="hint">
          ℹ️ Учебный вход: пароль не требуется. Достаточно указать имя и email.
        </p>
      </template>

      <p v-if="error" class="error" role="alert">
        {{ error }}
      </p>
    </section>
  </main>
</template>

<style scoped>
.login-page {
  min-height: calc(100vh - 90px);
  display: grid;
  place-items: center;
  padding: 24px;
  background: #f3f6fb;
}

.login-card {
  width: 100%;
  max-width: 440px;
  padding: 36px 32px;
  box-sizing: border-box;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  background: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
}

.brand {
  color: #2563eb;
  font-size: 22px;
  font-weight: 800;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

h1 {
  margin: 20px 0 10px;
  font-size: 26px;
  font-weight: 800;
  color: #0f172a;
}

p {
  color: #64748b;
  line-height: 1.6;
  overflow-wrap: anywhere;
  margin: 0 0 12px;
}

.status-tip {
  font-size: 13px;
  color: #10b981;
}

.user-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 24px;
}

form {
  display: flex;
  flex-direction: column;
  margin-top: 20px;
}

label {
  margin-bottom: 6px;
  font-weight: 600;
  font-size: 14px;
  color: #334155;
}

input {
  min-width: 0;
  padding: 12px 14px;
  margin-bottom: 18px;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  font: inherit;
  font-size: 14px;
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}

.primary-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 13px 20px;
  border: none;
  border-radius: 10px;
  background: #2563eb;
  color: white;
  font: inherit;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  text-decoration: none;
  transition: background 0.15s ease;
}

.primary-btn:hover:not(:disabled) {
  background: #1d4ed8;
}

.primary-btn:disabled {
  opacity: 0.65;
  cursor: wait;
}

.secondary-btn {
  padding: 11px 20px;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  background: white;
  color: #475569;
  font: inherit;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.secondary-btn:hover {
  background: #f8fafc;
  color: #0f172a;
}

.hint {
  margin-top: 20px;
  font-size: 13px;
  color: #94a3b8;
  line-height: 1.5;
}

.error {
  margin-top: 16px;
  padding: 10px 14px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: #b91c1c;
  font-size: 14px;
}
</style>
