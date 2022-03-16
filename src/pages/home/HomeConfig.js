import React from 'react';
import { authRoles } from '../../store/auth';

const HomeConfig = {
  settings: {
    layout: {
      config: {
        navbar: {
          display: true
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
      path: '/home',
      component: React.lazy(() => import('./Home'))
    }
  ]
};

export default HomeConfig;
