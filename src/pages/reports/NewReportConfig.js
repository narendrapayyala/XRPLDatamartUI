import React from 'react';
import { authRoles } from '../../store/auth';

const NewReportConfig = {
  settings: {
    layout: {
      config: {
        navbar: {
          display: true
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
      path: '/new_report',
      component: React.lazy(() => import('./NewReport'))
    },
    {
      path: '/report/:id',
      component: React.lazy(() => import('./ReportView'))
    }
  ]
};

export default NewReportConfig;
