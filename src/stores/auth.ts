import { ref } from 'vue'
import { defineStore } from 'pinia'

interface User {
  token?: string
  email?: string
  userId?: string
  role?: string
  name?: string
  isComplete?: boolean
}

export const useAuthStore = defineStore('user', () => {
  const userName = import.meta.env.VITE_API_USER_NAME

  const userData = ref<User>(JSON.parse(localStorage.getItem(userName) || '{}'))

  const loginUser = (credentials: User) => {
    userData.value = credentials
    localStorage.setItem(userName, JSON.stringify(userData.value))
  }

  const logOut = () => {
    userData.value = {}
    localStorage.removeItem(userName)
  }

  return { userData, loginUser, logOut }
})
