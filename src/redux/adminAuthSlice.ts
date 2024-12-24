import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SliceState {
  accessToken: string;
}

const INITIAL_STATE: SliceState = {
  accessToken: '',
};

const adminAuthSlice = createSlice({
  name: 'adminAuth',
  initialState: INITIAL_STATE,
  reducers: {
    adminLogin: (state, action: PayloadAction<{ accessToken: string }>) => {
      state.accessToken = action.payload.accessToken;
    },

    adminLogout: (state) => {
      state.accessToken = '';
    },
  },
});

export const { adminLogin, adminLogout } = adminAuthSlice.actions;

export default adminAuthSlice.reducer;
