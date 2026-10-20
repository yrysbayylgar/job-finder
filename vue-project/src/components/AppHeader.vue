<script setup lang="ts">
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import type { RootState } from '../store'

const store = useStore<RootState>()
const router = useRouter()
const error = ref('')

const user = computed(() => store.state.auth.user)
const count = computed(() => store.getters['favorites/count'])

async function logout() {
  error.value = ''

  try {
    await store.dispatch('auth/logout')
    await router.push('/login')
  } catch {
    error.value = 'Не удалось выйти. Попробуйте ещё раз.'
  }
}
</script>

<template>
  <header class="header">
    <div class="header-content">
      <RouterLink to="/jobs" class="brand">
        💼 JobFinder
      </RouterLink>

      <nav aria-label="Основная навигация">
        <RouterLink to="/jobs" class="nav-link">
          Вакансии
        </RouterLink>

        <RouterLink to="/favorites" class="nav-link favorites-link">
          Избранное <span v-if="count > 0" class="badge-count">{{ count }}</span>
        </RouterLink>

        <template v-if="user">
          <span class="user-name" :title="user.email">👤 {{ user.name }}</span>
          <button type="button" class="logout-btn" @click="logout">
            Выйти
          </button>
        </template>

        <RouterLink v-else to="/login" class="login-link">
          Войти
        </RouterLink>
      </nav>
    </div>

    <p v-if="error" class="error" role="alert">{{ error }}</p>
  </header>
</template>

<style scoped>
.header {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  position: sticky;
  top: 0;
  z-index: 50;
}

.header-content {
  max-width: 1100px;
  margin: 0 auto;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
}

.brand {
  font-size: 22px;
  font-weight: 800;
  color: #2563eb;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

nav {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 18px;
}

.nav-link {
  color: #475569;
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
  transition: color 0.15s ease;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.nav-link:hover {
  color: #2563eb;
}

.nav-link.router-link-active {
  color: #2563eb;
  font-weight: 700;
}

.badge-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  background: #ef4444;
  color: white;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 700;
}

.user-name {
  color: #1e293b;
  font-weight: 600;
  font-size: 14px;
  background: #f1f5f9;
  padding: 6px 12px;
  border-radius: 20px;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.logout-btn {
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background: white;
  padding: 7px 14px;
  font: inherit;
  font-size: 14px;
  font-weight: 500;
  color: #475569;
  cursor: pointer;
  transition: all 0.15s ease;
}

.logout-btn:hover {
  background: #fee2e2;
  border-color: #fca5a5;
  color: #b91c1c;
}

.login-link {
  display: inline-flex;
  align-items: center;
  padding: 7px 16px;
  background: #2563eb;
  color: white;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.15s ease;
}

.login-link:hover {
  background: #1d4ed8;
}

.error {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 24px 12px;
  color: #b91c1c;
  font-size: 14px;
}
</style>
