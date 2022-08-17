import { createSlice } from '@reduxjs/toolkit';
import { setInitialSettings } from '../../settingsSlice';
import history from '../../../configurations/@history';
import { AUTH } from '../../../configurations/config';
import { signOut } from 'firebase/auth';
import { userLogoutService } from '../../../services/default/defaultService';

const initialState = {
  role: [], // guest
  data: {
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
    user_id: null
  },
  user: null,
  loginStatus: false
};

const userSlice = createSlice({
  name: 'auth/user',
  initialState,
  reducers: {
    setUser: (state, action) => ({ ...state, ...action.payload }),
    updateUserData: (state, action) => ({ ...state, user: action.payload }),
    userLoggedOut: (state) => ({ ...state, ...initialState })
  },
  extraReducers: {}
});

export const { setUser, updateUserData, userLoggedOut } = userSlice.actions;

export const logoutUser = () => async (dispatch, getState) => {
  const state = getState();
  const userData = state.auth.user.data;
  return await signOut(AUTH)
    .then(async () => {
      const data = await userLogoutService({ id: userData.user_id, email: userData.email });
      if (data.status) {
        localStorage.clear();
        await dispatch(userLoggedOut());
        await dispatch(setInitialSettings());
        history.push('/login');
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

export const setUserData = (user) => (dispatch) => {
  if (user.redirectUrl && !user.loginStatus) {
    localStorage.clear();
  }
  dispatch(setUser(user));
};

export default userSlice.reducer;
