import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

instance.interceptors.request.use((config) => {
  const authStore = useAuthStore()
  const token = authStore.userData?.token ?? null

  if (token) config.headers.Authorization = `Bearer ${token}`

  return config
})

// Response Interceptor (Handles 401 Errors)
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const authStore = useAuthStore()
      authStore.logOut()
    }
    return Promise.reject(error)
  },
)

export default instance
