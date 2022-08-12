import { createSlice } from '@reduxjs/toolkit';
import { showMessage } from '../../messageSlice';
import history from '../../../configurations/@history';
import { startLoading1, clearLoading1 } from '../../loaderSlice';
import { AUTH } from '../../../configurations/config';
import { sendPasswordResetEmail } from 'firebase/auth';

export const forgotPassword =
  ({ email }) =>
  async (dispatch) => {
    dispatch(startLoading1());
    try {
      await sendPasswordResetEmail(AUTH, email);
      dispatch(clearLoading1());
      dispatch(showMessage({ message: 'Password reset link sent!', variant: 'success' }));
      dispatch(forgotPasswordSuccess());
      history.push('/login');
    } catch (err) {
      dispatch(clearLoading1());
      dispatch(showMessage({ message: err.message, variant: 'error' }));
      dispatch(forgotPasswordError(err));
    }
  };

const initialState = {
  success: false,
  error: {
    username: null,
    password: null
  }
};

const forgotPasswordSlice = createSlice({
  name: 'auth/forgotPassword',
  initialState,
  reducers: {
    forgotPasswordSuccess: (state) => {
      state.success = true;
    },
    forgotPasswordError: (state, action) => {
      state.success = false;
      state.error = action.payload;
    }
  },
  extraReducers: {}
});

export const { forgotPasswordSuccess, forgotPasswordError } = forgotPasswordSlice.actions;

export default forgotPasswordSlice.reducer;
