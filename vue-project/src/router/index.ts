import { createRouter, createWebHistory } from 'vue-router'
import JobsView from '../views/JobsView.vue'
import JobDetailsView from '../views/JobDetailsView.vue'
import FavoritesView from '../views/FavoritesView.vue'
import LoginView from '../views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: '/',
      redirect: '/jobs',
    },
    {
      path: '/jobs',
      name: 'jobs',
      component: JobsView,
    },
    {
      path: '/jobs/:id',
      name: 'job-details',
      component: JobDetailsView,
    },
    {
      path: '/favorites',
      name: 'favorites',
      component: FavoritesView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/jobs',
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
