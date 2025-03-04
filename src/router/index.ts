import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { routes } from './routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_API_BASE_URL),
  routes,
})

const currentUser = () => {
  return new Promise((resolve) => {
    const authStore = useAuthStore()
    const token = authStore.userData?.token ?? ''
    resolve(token)
  })
}

router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => record?.meta?.auth ?? true)) {
    if (await currentUser()) next()
    else next('/auth/login')
  } else next()
})

export default router
