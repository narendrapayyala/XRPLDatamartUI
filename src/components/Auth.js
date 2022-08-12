import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setUserData } from '../store/auth/store/userSlice';
import SplashScreen from './splash/SplashScreen';
import { onAuthStateChanged } from 'firebase/auth';
import { AUTH } from '../configurations/config';
import history from '../configurations/@history';
import axios from '../configurations/axiosConfig';
// ----------------------------------------------------------------------

const AuthComp = (props) => {
  const [waitAuthCheck, setWaitAuthCheck] = useState(true);
  const dispatch = useDispatch();

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
    isPublic: false
  };

  const authCheck = useCallback(() => {
    return onAuthStateChanged(AUTH, (res) => {
      if (res) {
        axios.defaults.headers.common.token = res.accessToken;
        const role = 'user';
        const userData = {
          role: [role], // guest
          data: {
            ...fieldList,
            id: res?.uid,
            email: res?.email,
            photoURL: res?.photoURL || '',
            displayName: res?.displayName || '',
            phoneNumber: res?.phoneNumber || ''
          },
          user: { ...res },
          redirectUrl: '/home',
          loginStatus: true
        };
        dispatch(setUserData(userData));
        setWaitAuthCheck(false);
        history.push(userData.redirectUrl);
      } else {
        axios.defaults.headers.common.token = null;
        const userData = {
          role: [], // guest
          data: fieldList,
          redirectUrl: '/login',
          user: null,
          loginStatus: false
        };
        dispatch(setUserData(userData));
        setWaitAuthCheck(false);
      }
    });
  });

  useEffect(() => {
    authCheck();
  }, []);

  const { children } = props;

  return waitAuthCheck ? <SplashScreen /> : <>{children}</>;
};

export default AuthComp;
