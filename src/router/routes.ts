export const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomePage.vue'),
    meta: { auth: false },
  },

  {
    path: '/auth/signup',
    name: 'signup',
    component: () => import('../views/auth/SignUp.vue'),
    meta: { header: false, auth: false },
  },
  {
    path: '/auth/login',
    name: 'login',
    component: () => import('../views/auth/LogIn.vue'),
    meta: { header: false, auth: false },
  },
  {
    path: '/auth/create-password',
    name: 'create-password',
    component: () => import('@/views/auth/CreatePassword.vue'),
    meta: { header: false, auth: false },
  },

  {
    path: '/theater',
    name: 'theater',
    component: () => import('@/views/theater/TheaterList.vue'),
  },
  {
    path: '/theater/add-theater',
    name: 'add-theater',
    component: () => import('@/views/theater/AddTheater.vue'),
  },
  {
    path: '/theater/edit/:id',
    name: 'edit-theater',
    component: () => import('@/views/theater/EditTheater.vue'),
  },
  {
    path: '/theater/:id',
    name: 'view-theater',
    component: () => import('@/views/theater/ViewTheater.vue'),
  },

  {
    path: '/user/profile',
    name: 'profile',
    component: () => import('../views/user/UserProfile.vue'),
  },
]
