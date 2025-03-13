const requests = {
  register: 'auth/register',
  login: 'auth/login',

  verifyToken: 'auth/verify-reset-token/', // Add Token
  setPassword: 'auth/set-password',
  requestReset: 'auth/request-reset',

  getUser: 'auth/profile',
  updateUserProfile: 'auth/update-profile',

  addOwner: 'auth/register-sub-admin',
  ownerList: 'auth/sub-admins',
  ownerTheater: 'theaters',
  toggleOwnerStatus: '/auth/owner-acc-status/', // Add Id

  addTheater: 'theaters/add-theater',
  theaterList: 'theaters',
  getTheaterDetails: 'theaters/get-detail-of-theater/', // Add Id
  updateTheater: 'theaters/update-theater/', // Add Id
  deleteTheater: '/theaters/delete-theater/', // Add Id
  toggleTheaterStatus: '/theaters/status/', // Add Id

  cityList: 'cities/list-cities',

  addScreen: 'screens/add-screen',
  screenList: 'screens/list/', // Add Theater Id
  getScreen: 'screens/get-screen-details/', // Add Id
  editScreen: 'screens/update-screen/', // Add Id
  deleteScreen: 'screens/delete-screen/', // Add Id
  toggleScreenStatus: 'screens/screen-status/', // Add Id

  listMovie: 'movies/list',
  movieSync: 'movies/sync-movies',
  getMovie: 'movies/', // Add Id
  addPoster :'/movies/update-movie/', // Add Id
}

export default requests
