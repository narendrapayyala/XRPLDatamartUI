import React from 'react';
import { authRoles } from '../../store/auth';

const LandingConfig = {
  settings: {
    layout: {
      config: {
        navbar: {
          display: false
        },
        toolbar: {
          display: true
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
      path: '/dashboard',
      component: React.lazy(() => import('./Landing'))
    }
  ]
};

export default LandingConfig;
