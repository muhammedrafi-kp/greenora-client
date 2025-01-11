import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SliceState {
  isLoggedIn: boolean;
  token: string;
}

const INITIAL_STATE: SliceState = {
  isLoggedIn: !!localStorage.getItem('collectorToken'),
  token: localStorage.getItem('collectorToken') || '',
};

const collectorAuthSlice = createSlice({
  name: 'collectorAuth',
  initialState: INITIAL_STATE,
  reducers: {
    collectorLogin: (state, action: PayloadAction<{ accessToken: string }>) => {
      console.log("action dispateched!!!!!!")
      localStorage.setItem('collectorToken', action.payload.accessToken);
      state.isLoggedIn = true;
      state.token = action.payload.accessToken;
    },

    collectorLogout: (state) => {
      localStorage.removeItem('collectorToken');
      state.isLoggedIn = false;
      state.token = '';
    },
  },
});

export const { collectorLogin,collectorLogout } = collectorAuthSlice.actions;

export default collectorAuthSlice.reducer;
