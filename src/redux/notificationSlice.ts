import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface NotificationState {
    unreadCount: number;
}

const initialState: NotificationState = {
    unreadCount: 0,
};

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        setUnreadCount: (state, action: PayloadAction<number>) => {
            state.unreadCount = action.payload;
        },
        incrementUnreadCount: (state) => {
            state.unreadCount += 1;
        },
        decrementUnreadCount: (state) => {
            state.unreadCount = Math.max(0, state.unreadCount - 1);
        },
        resetUnreadCount: (state) => {
            state.unreadCount = 0;
        },
    },
});

export const {
    setUnreadCount,
    incrementUnreadCount,
    decrementUnreadCount,
    resetUnreadCount,
} = notificationSlice.actions;

export default notificationSlice.reducer; 