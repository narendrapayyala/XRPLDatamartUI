import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { showMessage } from '../messageSlice';
import { startLoading1, clearLoading1, startLoading3, clearLoading3 } from '../loaderSlice';
import { fetchEntityService, fetchFieldsListService } from '../../services/reports/reportService';

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

const reportsSlice = createSlice({
  name: 'reports',
  initialState: {
    entityList: [],
    fieldsList: []
  },
  reducers: {},
  extraReducers: {
    [getEntityList.fulfilled]: (state, action) => {
      return { ...state, entityList: action.payload };
    },
    [getFieldsList.fulfilled]: (state, action) => {
      return { ...state, fieldsList: action.payload };
    }
  }
});

// export const {} = reportsSlice.actions;

export default reportsSlice.reducer;
