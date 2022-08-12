import React from 'react';
import { authRoles } from '../../../store/auth';

const SignupConfig = {
  settings: {
    layout: {
      config: {
        navbar: {
          display: false
        },
        toolbar: {
          display: false
        },
        footer: {
          display: false
        },
        leftSidePanel: {
          display: false
        },
        rightSidePanel: {
          display: false
        }
      }
    }
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: '/signup',
      component: React.lazy(() => import('./Signup'))
    }
  ]
};

export default SignupConfig;
