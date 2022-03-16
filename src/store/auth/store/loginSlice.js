import { createSlice } from '@reduxjs/toolkit';
import { Auth } from 'aws-amplify';
import { showMessage } from '../../messageSlice';
import { startLoading1, clearLoading1 } from '../../loaderSlice';
import { setUserData } from './userSlice';
import { fetchUserService } from '../../../services/default/defaultService';
import history from '../../../configurations/@history';

const fieldList = {
  displayName: '',
  photoURL: '',
  email: '',
  name: '',
  org_name: ''
};

const initialState = {
  success: false,
  user: null,
  error: {
    code: null,
    message: null,
    name: null
  }
};

const loginSlice = createSlice({
  name: 'auth/login',
  initialState,
  reducers: {
    loginSuccess: (state) => {
      state.success = true;
    },
    loginError: (state, action) => {
      state.success = false;
      state.error = action.payload;
    },
    loginDefault: (state) => {
      state.success = false;
      state.error = {
        code: null,
        message: null,
        name: null
      };
      state.user = null;
    },
    setTempUser: (state, action) => {
      state.user = action.payload;
    }
  },
  extraReducers: {}
});

export const { loginSuccess, loginError, loginDefault, setTempUser } = loginSlice.actions;

export const submitLogin =
  ({ email, password }) =>
  async (dispatch) => {
    dispatch(startLoading1());
    return Auth.signIn(email, password)
      .then(async (user) => {
        if (user && user.challengeName === 'NEW_PASSWORD_REQUIRED') {
          dispatch(clearLoading1());
          dispatch(setTempUser(user));
          history.push({
            pathname: '/require-new-password'
          });
          return user;
        } else {
          if (user && user.attributes.email_verified) {
            const res = await fetchUserService();
            if (res && res.status) {
              dispatch(clearLoading1());
              const role =
                res.user.user_roles_data[0].role_id === 1
                  ? 'admin'
                  : res.user.user_roles_data[0].role_id === 2
                  ? 'owner'
                  : 'user';
              const userData = {
                role: [role], // guest
                data: {
                  ...fieldList,
                  displayName: user.attributes.name,
                  photoURL: '',
                  email: user.attributes.email
                },
                user: { ...res.user },
                redirectUrl:
                  res.user.user_roles_data[0].role_id === 1
                    ? '/admin'
                    : res.user.user_roles_data[0].role_id === 2
                    ? '/home'
                    : '/user',
                loginStatus: true
              };
              dispatch(setUserData(userData));
              dispatch(loginSuccess());
              return user;
            }
            return null;
          }
        }
        return null;
      })
      .catch((error) => {
        dispatch(clearLoading1());
        dispatch(
          showMessage({
            message: 'Incorrect username or password',
            variant: 'error'
          })
        );
        dispatch(loginError(error));
        localStorage.clear();
      });
  };

export const completeNewPassword =
  ({ password }) =>
  async (dispatch, getState) => {
    const user = getState().auth.login.user;
    dispatch(startLoading1());

    return Auth.completeNewPassword(user, password)
      .then(async (user) => {
        if (user && user.challengeParam.userAttributes.email_verified) {
          const res = await fetchUserService();
          if (res && res.status) {
            dispatch(clearLoading1());
            const role =
              res.user.user_roles_data[0].role_id === 1
                ? 'admin'
                : res.user.user_roles_data[0].role_id === 2
                ? 'owner'
                : 'user';
            const userData = {
              role: [role], // guest
              data: {
                ...fieldList,
                displayName: user.challengeParam.userAttributes.name,
                photoURL: '',
                email: user.challengeParam.userAttributes.email
              },
              user: { ...res.user },
              redirectUrl:
                res.user.user_roles_data[0].role_id === 1
                  ? '/admin'
                  : res.user.user_roles_data[0].role_id === 2
                  ? '/home'
                  : '/user',
              loginStatus: true
            };
            dispatch(setUserData(userData));
            dispatch(loginSuccess());
            dispatch(setTempUser(null));
            return user;
          }
          return null;
        }
        return null;
      })
      .catch((error) => {
        dispatch(clearLoading1());
        dispatch(
          showMessage({
            message: 'New Password Error',
            variant: 'error'
          })
        );
        dispatch(loginError(error));
        localStorage.clear();
      });
  };

export const federatedLogin = () => async (dispatch) =>
  Auth.currentAuthenticatedUser()
    .then((user) => {
      dispatch(loginSuccess());
      return user;
    })
    .catch((error) => {
      dispatch(showMessage({ message: error.message, variant: 'error' }));
      dispatch(loginError(error));
    });

export default loginSlice.reducer;
