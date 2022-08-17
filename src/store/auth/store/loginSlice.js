import { createSlice } from '@reduxjs/toolkit';
import { showMessage } from '../../messageSlice';
import { startLoading1, clearLoading1 } from '../../loaderSlice';
import { setUserData } from './userSlice';
import { AUTH, DB } from '../../../configurations/config';
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { query, getDocs, collection, where, addDoc } from 'firebase/firestore';
import { setUserTokenService } from '../../../services/default/defaultService';

const googleProvider = new GoogleAuthProvider();

const fieldList = {
  id: '',
  email: '',
  photoURL: '',
  displayName: '',
  phoneNumber: '',
  country: '',
  address: '',
  state: '',
  city: '',
  zipCode: '',
  about: '',
  isPublic: false,
  user_type: '',
  user_id: null
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
    return await signInWithEmailAndPassword(AUTH, email, password)
      .then(async (res) => {
        const user = res.user;
        if (user) {
          const data = await setUserTokenService({
            name: user.name || user.displayName || '',
            email: user.email,
            token: user.accessToken,
            user: user,
            register: false,
            login: true
          });
          if (data.status) {
            dispatch(clearLoading1());

            const role = data.user.user_type;
            const userData = {
              role: [role], // guest
              data: {
                ...fieldList,
                id: user?.uid,
                email: user?.email,
                photoURL: user?.photoURL,
                displayName: user?.displayName,
                phoneNumber: user?.phoneNumber,
                user_type: data.user.user_type,
                user_id: data.user.id
              },
              user: { ...user },
              redirectUrl: '/home',
              loginStatus: true
            };
            dispatch(setUserData(userData));
            dispatch(loginSuccess());
          }
          return user;
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

// export const completeNewPassword =
//   ({ password }) =>
//   async (dispatch, getState) => {
//     const user = getState().auth.login.user;
//     dispatch(startLoading1());

//     return Auth.completeNewPassword(user, password)
//       .then(async (user) => {
//         if (user && user.challengeParam.userAttributes.email_verified) {
//           const res = await fetchUserService();
//           if (res && res.status) {
//             dispatch(clearLoading1());
//             const role =
//               res.user.user_roles_data[0].role_id === 1
//                 ? 'admin'
//                 : res.user.user_roles_data[0].role_id === 2
//                 ? 'owner'
//                 : 'user';
//             const userData = {
//               role: [role], // guest
//               data: {
//                 ...fieldList,
//                 displayName: user.challengeParam.userAttributes.name,
//                 photoURL: '',
//                 email: user.challengeParam.userAttributes.email
//               },
//               user: { ...res.user },
//               redirectUrl:
//                 res.user.user_roles_data[0].role_id === 1
//                   ? '/admin'
//                   : res.user.user_roles_data[0].role_id === 2
//                   ? '/home'
//                   : '/user',
//               loginStatus: true
//             };
//             dispatch(setUserData(userData));
//             dispatch(loginSuccess());
//             dispatch(setTempUser(null));
//             return user;
//           }
//           return null;
//         }
//         return null;
//       })
//       .catch((error) => {
//         dispatch(clearLoading1());
//         dispatch(
//           showMessage({
//             message: 'New Password Error',
//             variant: 'error'
//           })
//         );
//         dispatch(loginError(error));
//         localStorage.clear();
//       });
//   };

export const federatedLogin = () => async (dispatch) => {
  try {
    const res = await signInWithPopup(AUTH, googleProvider);
    const user = res.user;
    if (user) {
      const data = await setUserTokenService({
        name: user.name || user.displayName || '',
        email: user.email,
        token: user.accessToken,
        user: user,
        register: false,
        login: true
      });
      if (data.status) {
        const q = query(collection(DB, 'users'), where('uid', '==', user.uid));
        const docs = await getDocs(q);
        if (docs.docs.length === 0) {
          await addDoc(collection(DB, 'users'), {
            uid: user.uid,
            name: user.displayName,
            authProvider: 'google',
            email: user.email
          });
        }
        await dispatch(loginSuccess());
      }
    }
  } catch (err) {
    dispatch(showMessage({ message: err.message, variant: 'error' }));
    dispatch(loginError(err));
  }
};

export default loginSlice.reducer;
