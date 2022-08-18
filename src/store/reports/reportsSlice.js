import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { showMessage } from '../messageSlice';
import {
  startLoading1,
  clearLoading1,
  startLoading2,
  clearLoading2,
  startLoading3,
  clearLoading3
} from '../loaderSlice';
import {
  fetchEntityService,
  fetchFieldsListService,
  fetchFiltersListService,
  createReportService,
  updateReportService,
  fetchTemplatesListService,
  generateReportService,
  downloadCSVReportService,
  dbTestConnectionService,
  databaseSyncService
} from '../../services/reports/reportService';
import history from '../../configurations/@history';

export const getTemplatesList = createAsyncThunk(
  'reports/getTemplatesList',
  async (id, { dispatch, getState }) => {
    const state = getState();
    const { data } = state.auth.user;
    dispatch(startLoading3());
    try {
      const response = await fetchTemplatesListService(data);
      // console.log(response);
      if (response.status) {
        dispatch(clearLoading3());
        return response.templates;
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
  }
);

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
    const auth = getState().auth;
    const { user_id } = auth.user.data.user_id;

    dispatch(startLoading1());
    try {
      const response = await createReportService(entityData, { ...data, created_by: user_id });
      // console.log(response);
      if (response.status) {
        dispatch(clearLoading1());
        dispatch(
          showMessage({ message: 'Report template created successfully', variant: 'success' })
        );

        return history.push('/home');
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

export const updateReport = createAsyncThunk(
  'reports/updateReport',
  async (data, { dispatch, getState }) => {
    const state = getState().reports;
    const entityList = state.entityList;
    const entityData = entityList.find((res) => res.method === data.entity_type);
    const auth = getState().auth;
    const { user_id } = auth.user.data.user_id;
    dispatch(startLoading1());
    try {
      const response = await updateReportService(entityData, { ...data, created_by: user_id });
      // console.log(response);
      if (response.status) {
        dispatch(clearLoading1());
        dispatch(showMessage({ message: 'Report updated successfully', variant: 'success' }));
        await dispatch(getTemplatesList());
        return history.push(`/report/${data.uuid}`);
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

export const generateReport = createAsyncThunk(
  'reports/generateReport',
  async (data, { dispatch, getState }) => {
    const state = getState().reports;
    const entityList = state.entityList;
    const entityData = entityList.find((res) => res.method === data.entity_type);
    dispatch(startLoading1());
    try {
      const response = await generateReportService(entityData, data);
      // console.log(response);
      if (response.status) {
        dispatch(clearLoading1());
        return response.report_data;
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

export const downloadCSVReport = createAsyncThunk(
  'reports/downloadCSVReport',
  async (data, { dispatch, getState }) => {
    const state = getState().reports;
    const entityList = state.entityList;
    const entityData = entityList.find((res) => res.method === data.entity_type);
    dispatch(startLoading1());
    try {
      const response = await downloadCSVReportService(entityData, data);
      // console.log(response);
      if (response) {
        dispatch(clearLoading1());
        return response;
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

export const dbTestConnection = createAsyncThunk(
  'reports/dbTestConnection',
  async (data, { dispatch }) => {
    dispatch(startLoading2());
    try {
      const response = await dbTestConnectionService(data);
      // console.log(response);
      if (response.status) {
        dispatch(clearLoading2());
        dispatch(showMessage({ message: 'Connection successful!', variant: 'success' }));

        return response;
      }
      dispatch(clearLoading2());
      if (response.error) {
        response.error.message &&
          dispatch(showMessage({ message: response.error.message, variant: 'error' }));
      } else {
        response.message && dispatch(showMessage({ message: response.message, variant: 'error' }));
      }
      return null;
    } catch (error) {
      dispatch(clearLoading2());
      error.message && dispatch(showMessage({ message: error.message, variant: 'error' }));
      return null;
    }
  }
);

export const databaseSync = createAsyncThunk(
  'reports/databaseSync',
  async (data, { dispatch, getState }) => {
    const state = getState().reports;
    const entityList = state.entityList;
    const entityData = entityList.find((res) => res.method === data.entity_type);
    dispatch(startLoading1());
    try {
      const response = await databaseSyncService(entityData, data);
      // console.log(response);
      if (response.status) {
        dispatch(clearLoading1());
        dispatch(showMessage({ message: 'Sync successfull', variant: 'success' }));
        return response;
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
    filterParams: [],
    templatesList: [],
    reportList: []
  },
  reducers: {
    clearReportList: (state) => {
      return { ...state, reportList: [] };
    }
  },
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
    },
    [updateReport.fulfilled]: (state) => {
      return { ...state };
    },
    [getTemplatesList.fulfilled]: (state, action) => {
      return { ...state, templatesList: action.payload };
    },
    [generateReport.fulfilled]: (state, action) => {
      return { ...state, reportList: action.payload };
    },
    [downloadCSVReport.fulfilled]: (state) => {
      return { ...state };
    },
    [dbTestConnection.fulfilled]: (state) => {
      return { ...state };
    },
    [databaseSync.fulfilled]: (state) => {
      return { ...state };
    }
  }
});

export const { clearReportList } = reportsSlice.actions;

export default reportsSlice.reducer;
