import { combineReducers } from '@reduxjs/toolkit';
import user from './userSlice';
// import login from './loginSlice';
// import register from './registerSlice';
// import forgotPassword from './forgotPasswordSlice';

const authReducers = combineReducers({
  user
  // login,
  // register,
  // forgotPassword
});

export default authReducers;
