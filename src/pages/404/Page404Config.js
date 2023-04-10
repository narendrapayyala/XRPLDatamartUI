import React from 'react';
import { authRoles } from '../../store/auth';

const Page404Config = {
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
  auth: authRoles.user,
  routes: [
    {
      path: '/404',
      component: React.lazy(() => import('./Page404'))
    }
  ]
};

export default Page404Config;
