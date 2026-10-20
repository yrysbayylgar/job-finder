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
      <span class="brand">JobFinder</span>

      <nav aria-label="Основная навигация">
        <RouterLink to="/favorites">
          Избранное ({{ count }})
        </RouterLink>

        <template v-if="user">
          <span class="user-name">{{ user.name }}</span>
          <button type="button" @click="logout">Выйти</button>
        </template>

        <RouterLink v-else to="/login">
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
}

.header-content {
  max-width: 1100px;
  margin: 0 auto;
  padding: 18px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
}

.brand {
  font-size: 24px;
  font-weight: 700;
  color: #2563eb;
}

nav {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

a {
  color: #475569;
  text-decoration: none;
}

a.router-link-active {
  color: #2563eb;
  font-weight: 700;
}

.user-name {
  overflow-wrap: anywhere;
}

button {
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background: white;
  padding: 8px 14px;
  font: inherit;
  cursor: pointer;
}

.error {
  padding: 0 24px 12px;
  color: #b91c1c;
}
</style>