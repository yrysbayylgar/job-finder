<script setup lang="ts">
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import type { User } from '../store/modules/auth'

const store = useStore()

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
      <span class="brand">JobFinder</span>

      <template v-if="user">
        <h1>Добро пожаловать, {{ user.name }}!</h1>
        <p>Вы вошли как {{ user.email }}</p>
        <p>После обновления страницы вход сохранится.</p>

        <button type="button" @click="logout">
          Выйти
        </button>
      </template>

      <template v-else>
        <h1>Вход в аккаунт</h1>
        <p>Войдите, чтобы откликаться на вакансии.</p>

        <form @submit.prevent="login">
          <label for="name">Имя</label>
          <input
            id="name"
            v-model="name"
            type="text"
            autocomplete="name"
            placeholder="Ваше имя"
            required
            maxlength="80"
          />

          <label for="email">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            autocomplete="email"
            placeholder="example@mail.com"
            required
          />

          <button type="submit" :disabled="isSubmitting">
            {{ isSubmitting ? 'Входим…' : 'Войти' }}
          </button>
        </form>

        <p class="hint">
          Учебный вход: используйте имя и email. Пароль не требуется.
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
  max-width: 420px;
  padding: 32px;
  box-sizing: border-box;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  background: white;
}

.brand {
  color: #2563eb;
  font-size: 22px;
  font-weight: 700;
}

h1 {
  margin: 24px 0 12px;
  font-size: 28px;
}

p {
  color: #64748b;
  line-height: 1.6;
  overflow-wrap: anywhere;
}

form {
  display: flex;
  flex-direction: column;
  margin-top: 24px;
}

label {
  margin-bottom: 8px;
  font-weight: 600;
}

input {
  min-width: 0;
  padding: 12px 14px;
  margin-bottom: 20px;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  font: inherit;
}

input:focus {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

button {
  padding: 13px 20px;
  border: none;
  border-radius: 10px;
  background: #2563eb;
  color: white;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

button:disabled {
  opacity: 0.6;
  cursor: wait;
}

.hint {
  margin-top: 20px;
  font-size: 13px;
}

.error {
  color: #b91c1c;
}
</style>