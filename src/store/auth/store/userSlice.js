import { createSlice } from '@reduxjs/toolkit';
import { setInitialSettings } from '../../settingsSlice';
import history from '../../../configurations/@history';
import { AUTH } from '../../../configurations/config';
import { signOut } from 'firebase/auth';

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
    isPublic: false
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

export const logoutUser = () => (dispatch) => {
  return signOut(AUTH)
    .then(() => {
      localStorage.clear();
      dispatch(userLoggedOut());
      dispatch(setInitialSettings());
      history.push('/login');
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
