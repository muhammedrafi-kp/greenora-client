import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SliceState {
  isLoggedIn: boolean;
  token: string;
}

const INITIAL_STATE: SliceState = {
  isLoggedIn: !!localStorage.getItem('adminToken'),
  token: localStorage.getItem('adminToken') || '',
};

const adminAuthSlice = createSlice({
  name: 'adminAuth',
  initialState: INITIAL_STATE,
  reducers: {
    adminLogin: (state, action: PayloadAction<{ accessToken: string }>) => {
      localStorage.setItem('adminToken', action.payload.accessToken);
      state.isLoggedIn = true;
      state.token = action.payload.accessToken;
    },

    adminLogout: (state) => {
      localStorage.removeItem('adminToken');
      state.isLoggedIn = false;
      state.token = '';
    },
  },
});

export const { adminLogin, adminLogout } = adminAuthSlice.actions;

export default adminAuthSlice.reducer;
