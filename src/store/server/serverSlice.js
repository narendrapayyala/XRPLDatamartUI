import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { showMessage } from '../messageSlice';
import { startLoading1, clearLoading1, startLoading3, clearLoading3 } from '../loaderSlice';
import {
  fetchServerService,
  createServerService,
  updateServerService
} from '../../services/server/serverService';

export const getServerList = createAsyncThunk('reports/getServerList', async (id, { dispatch }) => {
  dispatch(startLoading3());
  try {
    const response = await fetchServerService();
    // console.log(response);
    if (response.status) {
      dispatch(clearLoading3());
      return response.config;
    }
    dispatch(clearLoading3());
    if (response.error) {
      response.error.message &&
        dispatch(showMessage({ message: response.error.message, variant: 'error' }));
    } else {
      response.message && dispatch(showMessage({ message: response.message, variant: 'error' }));
    }
    return {};
  } catch (error) {
    dispatch(clearLoading3());
    error.message && dispatch(showMessage({ message: error.message, variant: 'error' }));
    return {};
  }
});

export const createServer = createAsyncThunk('reports/createServer', async (data, { dispatch }) => {
  dispatch(startLoading1());
  try {
    const response = await createServerService(data);
    // console.log(response);
    if (response.status) {
      dispatch(clearLoading1());
      dispatch(showMessage({ message: 'Server data created successfully', variant: 'success' }));
      dispatch(getServerList());
      return {};
    }
    dispatch(clearLoading1());
    if (response.error) {
      response.error.message &&
        dispatch(showMessage({ message: response.error.message, variant: 'error' }));
    } else {
      response.message && dispatch(showMessage({ message: response.message, variant: 'error' }));
    }
    return {};
  } catch (error) {
    dispatch(clearLoading1());
    error.message && dispatch(showMessage({ message: error.message, variant: 'error' }));
    return {};
  }
});

export const updateServer = createAsyncThunk('reports/updateServer', async (data, { dispatch }) => {
  dispatch(startLoading1());
  try {
    const response = await updateServerService(data);
    // console.log(response);
    if (response.status) {
      dispatch(clearLoading1());
      dispatch(showMessage({ message: 'Server data updated successfully', variant: 'success' }));
      dispatch(getServerList());
      return {};
    }
    dispatch(clearLoading1());
    if (response.error) {
      response.error.message &&
        dispatch(showMessage({ message: response.error.message, variant: 'error' }));
    } else {
      response.message && dispatch(showMessage({ message: response.message, variant: 'error' }));
    }
    return {};
  } catch (error) {
    dispatch(clearLoading1());
    error.message && dispatch(showMessage({ message: error.message, variant: 'error' }));
    return {};
  }
});

const serverSlice = createSlice({
  name: 'server',
  initialState: {
    serverList: {}
  },
  reducers: {},
  extraReducers: {
    [getServerList.fulfilled]: (state, action) => {
      return { ...state, serverList: action.payload };
    },
    [createServer.fulfilled]: (state) => {
      return { ...state };
    },
    [updateServer.fulfilled]: (state) => {
      return { ...state };
    }
  }
});

// export const { } = serverSlice.actions;

export default serverSlice.reducer;
