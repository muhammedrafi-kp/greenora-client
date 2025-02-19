import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthSliceState {
    isLoggedIn: boolean;
    token: string;
    role: string;
}

const INITIAL_STATE: AuthSliceState = {
    isLoggedIn: !!localStorage.getItem('accessToken'),
    token: localStorage.getItem('accessToken') || '',
    role: localStorage.getItem('role') || '',
}

const authSlice = createSlice({
    name: 'auth',
    initialState: INITIAL_STATE,
    reducers: {
        loginSuccess: (state, action: PayloadAction<{ token: string, role: string }>) => {
            localStorage.setItem('accessToken', action.payload.token);
            localStorage.setItem('role', action.payload.role);
            state.isLoggedIn = true;
            state.token = action.payload.token;
            state.role = action.payload.role;
        },

        Logout: (state) => {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('role');
            state.isLoggedIn = false;
            state.token = '';
            state.role = '';
        }
    }
});

export const { loginSuccess, Logout } = authSlice.actions;

export default authSlice.reducer;
