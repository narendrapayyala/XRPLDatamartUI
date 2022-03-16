import { createSlice } from '@reduxjs/toolkit';
import { Auth } from 'aws-amplify';
import { showMessage } from '../../messageSlice';
import history from '../../../configurations/@history';
import { startLoading1, clearLoading1 } from '../../loaderSlice';

const initialState = {
  success: false,
  userData: null,
  error: {
    username: null,
    password: null
  }
};

const registerSlice = createSlice({
  name: 'auth/register',
  initialState,
  reducers: {
    registerSuccess: (state, action) => {
      state.success = true;
      state.userData = {
        username: action.payload.user.username,
        destination: action.payload.codeDeliveryDetails
          ? action.payload.codeDeliveryDetails.Destination
          : ''
      };
    },
    registerError: (state, action) => {
      state.success = false;
      state.error = action.payload;
      state.userData = {
        codeDeliveryDetails: null,
        user: null
      };
    }
  },
  extraReducers: {}
});

export const { registerSuccess, registerError } = registerSlice.actions;

export const submitRegister =
  ({ name, password, email, org_name }) =>
  async (dispatch) => {
    dispatch(startLoading1());
    return Auth.signUp({
      username: email,
      password,
      attributes: { email, name },
      clientMetadata: { org_name: org_name }
    })
      .then((user) => {
        dispatch(clearLoading1());
        dispatch(registerSuccess({ ...user }));
        history.push('/mail-confirm');
        return user;
      })
      .catch((error) => {
        dispatch(clearLoading1());
        dispatch(showMessage({ message: error.message, variant: 'error' }));
        dispatch(registerError(error));
      });
  };

export const confirmSignUp =
  ({ username, code }) =>
  async (dispatch) => {
    dispatch(startLoading1());
    return Auth.confirmSignUp(username, code)
      .then((user) => {
        dispatch(clearLoading1());
        dispatch(showMessage({ message: 'Registration success', variant: 'success' }));
        history.push('/login');
        return user;
      })
      .catch((error) => {
        dispatch(clearLoading1());
        dispatch(showMessage({ message: error.message, variant: 'error' }));
        dispatch(registerError(error));
      });
  };

export const resendConfirmationCode = (username) => async (dispatch) => {
  dispatch(startLoading1());
  return Auth.resendSignUp(username)
    .then((user) => {
      dispatch(clearLoading1());
      dispatch(showMessage({ message: 'Code resent successfully', variant: 'success' }));
      return user;
    })
    .catch((error) => {
      dispatch(clearLoading1());
      dispatch(showMessage({ message: error.message, variant: 'error' }));
    });
};

export default registerSlice.reducer;
