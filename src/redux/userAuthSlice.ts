import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SliceState {
    isLoggedIn: boolean;
    token: string;
}

const INITIAL_STATE: SliceState = {
    isLoggedIn: !!localStorage.getItem('userToken'),
    token: localStorage.getItem('userToken') || '',
}

const userAuthSlice = createSlice({
    name: 'userAuth',
    initialState: INITIAL_STATE,
    reducers: {
        userLogin: (state, action: PayloadAction<{ token: string }>) => {
            localStorage.setItem('userToken', action.payload.token);
            state.isLoggedIn = true;
            state.token = action.payload.token;
        },

        userLogout: (state) => {
            localStorage.removeItem('userToken');
            state.isLoggedIn = false;
            state.token = '';
        },
    },
});

export const { userLogin, userLogout } = userAuthSlice.actions;

export default userAuthSlice.reducer;
