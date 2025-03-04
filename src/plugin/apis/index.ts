const requests = {
  register: 'auth/register',
  login: 'auth/login',

  verifyToken: 'auth/verify-reset-token/',
  setPassword: 'auth/set-password',
  requestReset: 'auth/request-reset',

  theaterList: 'theaters',
  getTheaterDetails: 'theaters/get-detail-of-theater/', // add id

  getTheater: 'auth/profile',
  updateUserProfile: 'auth/update-profile',

  addTheater: 'theaters/add-theater',

  addOwner: 'auth/register-sub-admin',
  ownerList: 'auth/sub-admins',
  ownerTheater: 'theaters',
}

export default requests
