import { createSlice } from '@reduxjs/toolkit';

const backdropSlice = createSlice({
  name: 'backdrop',
  initialState: {
    open: false,
    alertData: {
      open: false,
      varient: '',
      message: 'Sample Alert'
    }
  },
  reducers: {
    openBackdrop: (state) => {
      state.open = true;
    },
    clearBackdrop: (state) => {
      state.open = false;
    },
    setAlert: (state, action) => {
      state.alertData = { open: true, ...action.payload };
    },
    clearAlert: (state) => {
      state.alertData = {
        open: false,
        varient: '',
        message: ''
      };
    }
  }
});

export const { openBackdrop, clearBackdrop, setAlert, clearAlert } = backdropSlice.actions;

export default backdropSlice.reducer;
