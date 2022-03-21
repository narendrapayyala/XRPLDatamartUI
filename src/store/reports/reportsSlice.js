import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { showMessage } from '../messageSlice';
import { startLoading1, clearLoading1, startLoading3, clearLoading3 } from '../loaderSlice';
import {
  fetchEntityService,
  fetchFieldsListService,
  fetchFiltersListService,
  createReportService
} from '../../services/reports/reportService';
import history from '../../configurations/@history';

export const getEntityList = createAsyncThunk('reports/getEntityList', async (id, { dispatch }) => {
  dispatch(startLoading3());
  try {
    const response = await fetchEntityService();
    // console.log(response);
    if (response.status) {
      dispatch(clearLoading3());
      return response.entities;
    }
    dispatch(clearLoading3());
    if (response.error) {
      response.error.message &&
        dispatch(showMessage({ message: response.error.message, variant: 'error' }));
    } else {
      response.message && dispatch(showMessage({ message: response.message, variant: 'error' }));
    }
    return [];
  } catch (error) {
    dispatch(clearLoading3());
    error.message && dispatch(showMessage({ message: error.message, variant: 'error' }));
    return [];
  }
});

export const getFieldsList = createAsyncThunk(
  'reports/getFieldsList',
  async (data, { dispatch, getState }) => {
    const state = getState().reports;
    const entityList = state.entityList;
    const entityData = entityList.find((res) => res.method === data.entity_type);
    dispatch(startLoading1());
    try {
      const response = await fetchFieldsListService(entityData);
      // console.log(response);
      if (response.status) {
        dispatch(clearLoading1());
        return response.entity_model;
      }
      dispatch(clearLoading1());
      if (response.error) {
        response.error.message &&
          dispatch(showMessage({ message: response.error.message, variant: 'error' }));
      } else {
        response.message && dispatch(showMessage({ message: response.message, variant: 'error' }));
      }
      return [];
    } catch (error) {
      dispatch(clearLoading1());
      error.message && dispatch(showMessage({ message: error.message, variant: 'error' }));
      return [];
    }
  }
);

export const getFiltersList = createAsyncThunk(
  'reports/getFiltersList',
  async (data, { dispatch, getState }) => {
    const state = getState().reports;
    const entityList = state.entityList;
    const entityData = entityList.find((res) => res.method === data.entity_type);
    dispatch(startLoading1());
    try {
      const response = await fetchFiltersListService(entityData);
      // console.log(response);
      if (response.status) {
        dispatch(clearLoading1());
        return response.req_parameters;
      }
      dispatch(clearLoading1());
      if (response.error) {
        response.error.message &&
          dispatch(showMessage({ message: response.error.message, variant: 'error' }));
      } else {
        response.message && dispatch(showMessage({ message: response.message, variant: 'error' }));
      }
      return [];
    } catch (error) {
      dispatch(clearLoading1());
      error.message && dispatch(showMessage({ message: error.message, variant: 'error' }));
      return [];
    }
  }
);

export const createReport = createAsyncThunk(
  'reports/createReport',
  async (data, { dispatch, getState }) => {
    const state = getState().reports;
    const entityList = state.entityList;
    const entityData = entityList.find((res) => res.method === data.entity_type);
    dispatch(startLoading1());
    try {
      const response = await createReportService(entityData, data);
      // console.log(response);
      if (response.status) {
        dispatch(clearLoading1());
        dispatch(
          showMessage({ message: 'Report template created successfully', variant: 'success' })
        );

        return history.push('/');
      }
      dispatch(clearLoading1());
      if (response.error) {
        response.error.message &&
          dispatch(showMessage({ message: response.error.message, variant: 'error' }));
      } else {
        response.message && dispatch(showMessage({ message: response.message, variant: 'error' }));
      }
      return null;
    } catch (error) {
      dispatch(clearLoading1());
      error.message && dispatch(showMessage({ message: error.message, variant: 'error' }));
      return null;
    }
  }
);

const reportsSlice = createSlice({
  name: 'reports',
  initialState: {
    entityList: [],
    fieldsList: [],
    filterParams: []
  },
  reducers: {},
  extraReducers: {
    [getEntityList.fulfilled]: (state, action) => {
      return { ...state, entityList: action.payload };
    },
    [getFieldsList.fulfilled]: (state, action) => {
      return { ...state, fieldsList: action.payload };
    },
    [getFiltersList.fulfilled]: (state, action) => {
      return { ...state, filterParams: action.payload };
    },
    [createReport.fulfilled]: (state) => {
      return { ...state };
    }
  }
});

// export const {} = reportsSlice.actions;

export default reportsSlice.reducer;
