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
import Page404Config from '../pages/404/Page404Config';

const routeConfigs = [
  LandingConfig,
  LoginConfig,
  ForgotPasswordConfig,
  SignupConfig,
  HomeConfig,
  NewReportConfig,
  ServerConfig,
  Page404Config
];

const routes = [
  ...Utils.generateRoutesFromConfigs(routeConfigs),
  {
    path: '/',
    exact: true,
    component: React.lazy(() => import('../pages/RootComponent')),
    // component: () => <Redirect to="/dashboard" />,
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
  },
  {
    path: '*',
    exact: true,
    component: () => <Redirect to="/404" />
  }
];

export default routes;
