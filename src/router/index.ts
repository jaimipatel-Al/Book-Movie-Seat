import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomePage.vue'),
    },

    {
      path: '/auth',
      component: () => import('../views/auth/AuthLayout.vue'),
      children: [
        {
          path: 'signUp',
          name: 'signUp',
          component: () => import('../views/auth/SignUp.vue'),
        },
        {
          path: 'login',
          name: 'login',
          component: () => import('../views/auth/LogIn.vue'),
        },
      ],
    },

    {
      path: '/user',
      component: () => import('@/views/user/UserLayout.vue'),
      children: [
        {
          path: 'profile',
          name: 'profile',
          component: () => import('../views/user/UserProfile.vue'),
        },
      ],
    },
  ],
})

export default router
