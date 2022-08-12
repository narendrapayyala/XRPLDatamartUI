import React from 'react';
import { authRoles } from '../../../store/auth';

const ForgotPasswordConfig = {
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
      path: '/forgot-password',
      component: React.lazy(() => import('./ForgotPassword'))
    }
  ]
};

export default ForgotPasswordConfig;
