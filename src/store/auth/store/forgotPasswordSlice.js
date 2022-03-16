import { Auth } from 'aws-amplify';
import { createSlice } from '@reduxjs/toolkit';
import { showMessage } from '../../messageSlice';
import history from '../../../configurations/@history';
import { startLoading1, clearLoading1 } from '../../loaderSlice';

export const forgotPassword = (username) => async (dispatch) => {
  dispatch(startLoading1());
  return Auth.forgotPassword(username)
    .then((user) => {
      dispatch(clearLoading1());
      dispatch(
        showMessage({
          message: `Code has been sent to ${user.CodeDeliveryDetails.Destination}`,
          variant: 'success'
        })
      );
      return user;
    })
    .catch((error) => {
      dispatch(clearLoading1());
      dispatch(showMessage({ message: error.message, variant: 'error' }));
    });
};

export const forgotPasswordSubmit =
  ({ email, code, new_password }) =>
  async (dispatch) => {
    dispatch(startLoading1());
    return Auth.forgotPasswordSubmit(email, code, new_password)
      .then((user) => {
        dispatch(clearLoading1());
        dispatch(showMessage({ message: 'Password reset successfully', variant: 'success' }));
        history.push('/login');
        return user;
      })
      .catch((error) => {
        dispatch(clearLoading1());
        dispatch(showMessage({ message: error.message, variant: 'error' }));
        dispatch(forgotPasswordError(error));
      });
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
