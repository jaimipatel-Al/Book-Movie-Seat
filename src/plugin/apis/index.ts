const requests = {
  register: 'auth/register',
  login: 'auth/login',

  verifyToken: 'auth/verify-reset-token/',
  setPassword: 'auth/set-password',
  requestReset: 'auth/request-reset',

  theaterList: 'theaters',
  addTheater: 'auth/register-sub-admin',
  getTheaterDetails: 'theaters/get-detail-of-theater/', // add id
  editTheater: 'theaters/add-theater',

  getTheater: 'auth/profile',
  updateUserProfile: 'auth/update-profile',
}

export default requests
