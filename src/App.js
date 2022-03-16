import React from 'react';
import { createGenerateClassName, StylesProvider } from '@mui/styles';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import MomentUtils from '@date-io/moment';
import Provider from 'react-redux/es/components/Provider';
import { Router } from 'react-router-dom';
// import Amplify from 'aws-amplify';
// import awsconfig from './configurations/aws-exports';
import AppContext from './components/AppContext';
import routes from './configurations/routesConfig';
import history from './configurations/@history';
import store from './store';
import Layout from './components/layout/Layout';
import Authorization from './configurations/Authorization';
import Auth from './components/Auth';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

const theme = createTheme({
  // typography: {
  //   fontFamily: ['Chilanka', 'cursive'].join(','),
  // },
  palette: {
    primary: {
      light: '#006097',
      main: '#006097',
      dark: '#006097',
      contrastText: '#ffffff'
    },
    secondary: {
      light: '#00aae480',
      main: '#00aae4',
      dark: '#00aae4',
      contrastText: '#272727'
    },
    background: {
      paper: '#FFFFFF',
      default: '#F0F7F7'
    }
  }
});

const generateClassName = createGenerateClassName();
// Amplify.configure(awsconfig);

const App = () => (
  <AppContext.Provider value={{ routes }}>
    <StylesProvider generateClassName={generateClassName}>
      <Provider store={store}>
        <LocalizationProvider dateAdapter={MomentUtils}>
          <Auth>
            <Router history={history}>
              <Authorization>
                <ThemeProvider theme={theme}>
                  <Layout />
                </ThemeProvider>
              </Authorization>
            </Router>
          </Auth>
        </LocalizationProvider>
      </Provider>
    </StylesProvider>
  </AppContext.Provider>
);
export default App;
