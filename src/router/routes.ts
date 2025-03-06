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

  // user

  {
    path: '/user/profile',
    name: 'profile',
    component: () => import('../views/user/UserProfile.vue'),
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
    path: '/owner/view/:id',
    name: 'owner-detail',
    component: () => import('../views/owner/ViewOwner.vue'),
  },

  // Theater

  {
    path: '/theater',
    name: 'theater',
    component: () => import('../views/theater/TheaterList.vue'),
  },
  {
    path: '/theater/add',
    name: 'add-theater',
    component: () => import('../views/theater/AddEditTheater.vue'),
  },
  {
    path: '/theater/edit/:id',
    name: 'edit-theater',
    component: () => import('../views/theater/AddEditTheater.vue'),
  },
  {
    path: '/theater/view/:id',
    name: 'theater-view',
    component: () => import('../views/theater/OwnerViewTheater.vue'),
  },
  {
    path: '/theater/detail/:id',
    name: 'theater-detail',
    component: () => import('../views/theater/DetailTheater.vue'),
  },

  // screen

  {
    path: '/screen/add',
    name: 'add-screen',
    component: () => import('../views/screen/AddEditScreen.vue'),
  },
  {
    path: '/screen/edit/:id',
    name: 'edit-screen',
    component: () => import('../views/screen/AddEditScreen.vue'),
  },
]
