import { combineReducers } from '@reduxjs/toolkit';
import loading from './loaderSlice';
import settings from './settingsSlice';
import backdrop from './backdropSlice';
import auth from './auth/store';
import message from './messageSlice';
import dialog from './dialogSlice';
import reports from './reports/reportsSlice';
import server from './server/serverSlice';

const createReducer = (asyncReducers) =>
  combineReducers({
    auth,
    settings,
    loading,
    message,
    backdrop,
    dialog,
    reports,
    server,
    ...asyncReducers
  });

export default createReducer;
