import React from 'react';
import { authRoles } from '../../store/auth';

const ServerConfig = {
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
      path: '/server',
      component: React.lazy(() => import('./Server'))
    }
  ]
};

export default ServerConfig;
