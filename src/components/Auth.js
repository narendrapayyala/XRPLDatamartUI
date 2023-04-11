import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUserData } from '../store/auth/store/userSlice';
import SplashScreen from './splash/SplashScreen';
import { onAuthStateChanged } from 'firebase/auth';
import { AUTH } from '../configurations/config';
// import history from '../configurations/@history';
import axios from '../configurations/axiosConfig';
import { setUserTokenService } from '../services/default/defaultService';

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
    isPublic: false,
    user_type: '',
    user_id: null
  };

  const authCheck = () =>
    new Promise((resolve) => {
      return onAuthStateChanged(AUTH, async (res) => {
        if (res) {
          const data = await setUserTokenService({
            // name: res.name || res.displayName || 'Nagireddy Mule',
            email: res.email,
            token: res.accessToken,
            user: res,
            register: false,
            login: true
          });
          if (data?.status) {
            axios.defaults.headers.common.token = res.accessToken;
            const role = data.user.user_type;
            const userData = {
              role: [role], // guest
              data: {
                ...fieldList,
                id: res?.uid,
                email: res?.email,
                photoURL: res?.photoURL || '',
                displayName: res?.displayName || data?.user?.name || '',
                phoneNumber: res?.phoneNumber || '',
                user_type: data.user.user_type,
                user_id: data.user.id
              },
              user: { ...res },
              redirectUrl: '/home',
              loginStatus: true
            };
            dispatch(setUserData(userData));
            setWaitAuthCheck(false);
            // history.push(userData.redirectUrl);
            resolve();
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
            resolve();
          }
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
          resolve();
        }
      });
    });

  useEffect(() => {
    authCheck();
  }, [authCheck]);

  const { children } = props;

  return waitAuthCheck ? <SplashScreen /> : <>{children}</>;
};

export default AuthComp;
