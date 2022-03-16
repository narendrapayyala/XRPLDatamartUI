import React, { useEffect, useState } from 'react';
// import { Auth } from 'aws-amplify';
import { useDispatch } from 'react-redux';
import { setUserData } from '../store/auth/store/userSlice';
import SplashScreen from './splash/SplashScreen';
// import history from '../configurations/@history';
// import { fetchUserService } from '../services/default/defaultService';

const AuthComp = (props) => {
  const [waitAuthCheck, setWaitAuthCheck] = useState(true);
  const dispatch = useDispatch();

  const fieldList = {
    displayName: '',
    photoURL: '',
    email: '',
    name: '',
    org_name: ''
  };
  const authCheck = () =>
    new Promise((resolve) => {
      // Auth.currentAuthenticatedUser()
      //   .then(async (res) => {
      //     const response = await fetchUserService();
      //     // console.log(response);
      //     if (response && response.status) {
      //       const identities = res.attributes.identities
      //         ? JSON.parse(res.attributes.identities)
      //         : null;
      //       let photoURL = null;
      //       if (identities && identities[0].providerName === 'Google') {
      //         photoURL = res.attributes.picture;
      //       } else if (identities && identities[0].providerName === 'Facebook') {
      //         const picture = JSON.parse(res.attributes.picture);
      //         photoURL = picture.data.url;
      //       }
      //       const role =
      //         response.user.user_roles_data[0].role_id === 1
      //           ? 'admin'
      //           : response.user.user_roles_data[0].role_id === 2
      //           ? 'owner'
      //           : 'user';
      //       const userData = {
      //         role: [role], // guest
      //         data: {
      //           ...fieldList,
      //           displayName: res.attributes.name,
      //           photoURL,
      //           email: res.attributes.email
      //         },
      //         user: { ...response.user },
      //         redirectUrl:
      //           response.user.user_roles_data[0].role_id === 1
      //             ? '/admin'
      //             : response.user.user_roles_data[0].role_id === 2
      //             ? '/home'
      //             : '/user',
      //         loginStatus: true
      //       };
      //       dispatch(setUserData(userData));
      //       setWaitAuthCheck(false);
      //       resolve();
      //       history.push(userData.redirectUrl);
      //     } else {
      //       const userData = {
      //         role: [], // guest
      //         data: fieldList,
      //         redirectUrl: '/login',
      //         user: null,
      //         loginStatus: false
      //       };
      //       dispatch(setUserData(userData));
      //       setWaitAuthCheck(false);
      //       resolve();
      //     }
      //   })
      //   .catch(() => {
      //     const userData = {
      //       role: [], // guest
      //       data: fieldList,
      //       redirectUrl: '/login',
      //       user: null,
      //       loginStatus: false
      //     };
      //     dispatch(setUserData(userData));
      //     setWaitAuthCheck(false);
      //     resolve();
      //   });

      const userData = {
        role: [], // guest
        data: fieldList,
        redirectUrl: '/home',
        user: null,
        loginStatus: true
      };
      dispatch(setUserData(userData));
      setWaitAuthCheck(false);
      resolve();

      return Promise.resolve();
    });

  useEffect(() => {
    authCheck();
  }, [authCheck]);

  const { children } = props;

  return waitAuthCheck ? <SplashScreen /> : <>{children}</>;
};

export default AuthComp;
