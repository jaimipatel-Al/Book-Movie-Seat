const requests = {
  register: 'auth/register',
  login: 'auth/login',

  verifyToken: 'auth/verify-reset-token/',
  setPassword: 'auth/set-password',
  requestReset: 'auth/request-reset',

  getUser: 'auth/profile',
  updateUserProfile: 'auth/update-profile',

  addOwner: 'auth/register-sub-admin',
  ownerList: 'auth/sub-admins',
  ownerTheater: 'theaters',
  toggleOwnerStatus: '/auth/owner-acc-status/', // Add id

  addTheater: 'theaters/add-theater',
  theaterList: 'theaters',
  getTheaterDetails: 'theaters/get-detail-of-theater/', // Add id
  updateTheater: 'theaters/update-theater/', // Add id
  deleteTheater: '/theaters/delete-theater/', // Add id
  toggleTheaterStatus: '/theaters/status/', // Add id

  cityList: 'cities/list-cities',
}

export default requests
