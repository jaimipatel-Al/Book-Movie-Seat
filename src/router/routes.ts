export const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomePage.vue'),
    meta: { auth: false },
  },

  // Auth

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

  // User

  {
    path: '/user/profile',
    name: 'profile',
    component: () => import('../views/user/UserProfile.vue'),
  },

  // Owner

  {
    path: '/owner',
    name: 'owner',
    component: () => import('../views/admin/owner/OwnerList.vue'),
  },
  {
    path: '/owner/add',
    name: 'add-owner',
    component: () => import('../views/admin/owner/AddOwner.vue'),
  },
  {
    path: '/owner/view/:id',
    name: 'owner-detail',
    component: () => import('../views/admin/owner/ViewOwner.vue'),
  },

  // Theater

  {
    path: '/theater',
    name: 'theater',
    component: () => import('../views/sub-admin/theater/TheaterList.vue'),
  },
  {
    path: '/theater/add',
    name: 'add-theater',
    component: () => import('../views/sub-admin/theater/AddEditTheater.vue'),
  },
  {
    path: '/theater/edit/:id',
    name: 'edit-theater',
    component: () => import('../views/sub-admin/theater/AddEditTheater.vue'),
  },
  {
    path: '/theater/view/:id',
    name: 'owner-theater-view',
    component: () => import('../views/sub-admin/theater/ViewTheater.vue'),
  },
  {
    path: '/theater/detail/:id',
    name: 'admin-theater-detail',
    component: () => import('../views/admin/theater/ViewTheater.vue'),
  },

  // screen

  {
    path: '/screen/add',
    name: 'add-screen',
    component: () => import('../views/sub-admin/screen/AddEditScreen.vue'),
  },
  {
    path: '/screen/edit/:id',
    name: 'edit-screen',
    component: () => import('../views/sub-admin/screen/AddEditScreen.vue'),
  },
  {
    path: '/screen/view/:id',
    name: 'view-screen',
    component: () => import('../views/sub-admin/screen/ViewScreen.vue'),
  },

  // Movie

  {
    path: '/movie',
    name: 'movie',
    component: () => import('@/views/movie/MovieList.vue'),
  },
  {
    path: '/movie/:id',
    name: 'movie-detail',
    component: () => import('@/views/movie/MovieListDetail.vue'),
  },
  {
    path: '/movie-list/:filter',
    name: 'movie-filter-list',
    component: () => import('@/views/movie/MovieFilterList.vue'),
  },

  // Shows

  {
    path: '/show/add',
    name: 'add-show',
    component: () => import('../views/show/AddEditShow.vue'),
  },
  {
    path: '/show',
    name: 'show-list',
    component: () => import('../views/show/ShowList.vue'),
  },
  {
    path: '/show/edit/:id',
    name: 'edit-show',
    component: () => import('../views/show/AddEditShow.vue'),
  },





  {
    path: '/ticket',
    name: 'buy-tickets',
    component: () => import('@/views/ticket/BuyTickets.vue'),
  },
]
