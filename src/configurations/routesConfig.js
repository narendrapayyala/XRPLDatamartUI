import React from 'react';
import Utils from '../utils';
import HomeConfig from '../pages/home/HomeConfig';
import NewReportConfig from '../pages/reports/NewReportConfig';
import ServerConfig from '../pages/server/ServerConfig';
import { Redirect } from 'react-router-dom';
import LandingConfig from '../pages/landing/LandingConfig';
import LoginConfig from '../pages/auth/login/LoginConfig';
import SignupConfig from '../pages/auth/signup/SignupConfig';
import ForgotPasswordConfig from '../pages/auth/forgot-password/ForgotPasswordConfig';

const routeConfigs = [
  LandingConfig,
  LoginConfig,
  ForgotPasswordConfig,
  SignupConfig,
  HomeConfig,
  NewReportConfig,
  ServerConfig
];

const routes = [
  ...Utils.generateRoutesFromConfigs(routeConfigs),
  {
    path: '/',
    exact: true,
    // component: React.lazy(() => import('../pages/landing/Landing')),
    component: () => <Redirect to="/dashboard" />,
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
            display: true
          },
          leftSidePanel: {
            display: false
          },
          rightSidePanel: {
            display: false
          }
        }
      }
    }
  }
];

export default routes;
