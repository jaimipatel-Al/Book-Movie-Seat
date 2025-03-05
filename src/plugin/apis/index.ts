const requests = {
  register: 'auth/register',
  login: 'auth/login',

  verifyToken: 'auth/verify-reset-token/',
  setPassword: 'auth/set-password',
  requestReset: 'auth/request-reset',

  addOwner: 'auth/register-sub-admin',
  ownerList: 'auth/sub-admins',
  ownerTheater: 'theaters',
  toggleOwnerStatus: '/auth/owner-acc-status/', // Add id

  addTheater: 'theaters/add-theater',
  theaterList: 'theaters',
  getTheaterDetails: 'theaters/get-detail-of-theater/', // Add id
  updateTheater: 'theaters/update-theater/', // Add id
  deleteTheater: '/theaters/delete-theater/', // Add id
  toggleTheaterStatus: '/auth/owner-acc-status/', // Add id

  getUser: 'auth/profile',
  updateUserProfile: 'auth/update-profile',

  cityList: 'cities/list-cities',
}

export default requests
