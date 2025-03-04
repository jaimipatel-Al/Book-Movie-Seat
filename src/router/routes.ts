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
    path: '/theaters',
    name: 'theater',
    component: () => import('@/views/theater/TheaterList.vue'),
  },
  {
    path: '/theater/add-theater',
    name: 'add-owner',
    component: () => import('@/views/theater/AddTheaters.vue'),
  },
  {
    path: '/theater/edit/:id',
    name: 'edit-theater',
    component: () => import('@/views/theater/EditTheater.vue'),
  },
  {
    path: '/theater/:id',
    name: 'view-theater',
    component: () => import('@/views/owner/ViewOwner.vue'),
  },

  {
    path: '/user/profile',
    name: 'profile',
    component: () => import('../views/user/UserProfile.vue'),
  },




  {
    path: '/theater/add',
    name: 'add-theater',
    component: () => import('@/views/theater/AddTheater.vue'),
    meta: { header: false },
  },

  // Owner

  {
    path: '/owner',
    name: 'owner',
    component: () => import('../views/owner/OwnerList.vue'),
  },
  {
    path: '/owner/add',
    name: 'add-owner',
    component: () => import('../views/owner/AddOwner.vue'),
  },
  {
    path: '/owner/:id',
    name: 'owner-detail',
    component: () => import('../views/owner/ViewOwner.vue'),
  },
]
