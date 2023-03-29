import { createSlice } from '@reduxjs/toolkit';
import { showMessage } from '../../messageSlice';
import history from '../../../configurations/@history';
import { startLoading1, clearLoading1 } from '../../loaderSlice';
import { AUTH, DB } from '../../../configurations/config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import { setUserData } from './userSlice';
import { loginSuccess } from './loginSlice';
import { setUserTokenService } from '../../../services/default/defaultService';

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
    registerSuccess: (state) => {
      state.success = true;
    },
    registerError: (state, action) => {
      state.success = false;
      state.error = action.payload;
    }
  },
  extraReducers: {}
});

export const { registerSuccess, registerError } = registerSlice.actions;

export const submitRegister =
  ({ email, password, name }) =>
  async (dispatch) => {
    dispatch(startLoading1());
    try {
      const res = await createUserWithEmailAndPassword(AUTH, email, password);
      if (res) {
        const user = res.user;
        const data = await setUserTokenService({
          name: user.name || user.displayName || '',
          email: user.email,
          token: user.accessToken,
          user: user,
          register: true,
          login: false
        });
        if (data?.status) {
          dispatch(clearLoading1());
          await addDoc(collection(DB, 'users'), {
            uid: user.uid,
            name,
            displayName: name,
            authProvider: 'local',
            email
          });
          const role = data.user.user_type;
          const userData = {
            role: [role], // guest
            data: {
              id: res.user?.uid,
              email: res.user?.email,
              photoURL: res.user?.photoURL,
              displayName: res.user?.displayName || name,
              phoneNumber: res.user?.phoneNumber,
              user_type: data.user.user_type,
              user_id: data.user.id
            },
            user: { ...res.user },
            redirectUrl: '/home',
            loginStatus: true
          };
          await dispatch(registerSuccess({ ...res }));
          await dispatch(loginSuccess());
          await dispatch(setUserData(userData));
          history.push(userData.redirectUrl);
        }
      }
    } catch (error) {
      dispatch(clearLoading1());
      dispatch(showMessage({ message: error.message, variant: 'error' }));
      dispatch(registerError(error));
    }
  };

// export const confirmSignUp =
//   ({ username, code }) =>
//   async (dispatch) => {
//     dispatch(startLoading1());
//     return Auth.confirmSignUp(username, code)
//       .then((user) => {
//         dispatch(clearLoading1());
//         dispatch(showMessage({ message: 'Registration success', variant: 'success' }));
//         history.push('/login');
//         return user;
//       })
//       .catch((error) => {
//         dispatch(clearLoading1());
//         dispatch(showMessage({ message: error.message, variant: 'error' }));
//         dispatch(registerError(error));
//       });
//   };

// export const resendConfirmationCode = (username) => async (dispatch) => {
//   dispatch(startLoading1());
//   return Auth.resendSignUp(username)
//     .then((user) => {
//       dispatch(clearLoading1());
//       dispatch(showMessage({ message: 'Code resent successfully', variant: 'success' }));
//       return user;
//     })
//     .catch((error) => {
//       dispatch(clearLoading1());
//       dispatch(showMessage({ message: error.message, variant: 'error' }));
//     });
// };

export default registerSlice.reducer;
