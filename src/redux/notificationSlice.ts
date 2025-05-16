// import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// interface NotificationState {
//     unreadCount: number;
// }

// const initialState: NotificationState = {
//     unreadCount: 0,
// };

// const notificationSlice = createSlice({
//     name: 'notification',
//     initialState,
//     reducers: {
//         setUnreadCount: (state, action: PayloadAction<number>) => {
//             state.unreadCount = action.payload;
//         },
//         incrementUnreadCount: (state) => {
//             state.unreadCount += 1;
//         },
//         decrementUnreadCount: (state) => {
//             state.unreadCount = Math.max(0, state.unreadCount - 1);
//         },
//         resetUnreadCount: (state) => {
//             state.unreadCount = 0;
//         },
//     },
// });

// export const {
//     setUnreadCount,
//     incrementUnreadCount,
//     decrementUnreadCount,
//     resetUnreadCount,
// } = notificationSlice.actions;

// export default notificationSlice.reducer; 

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Role = 'user' | 'collector' | 'admin';

interface NotificationState {
  unreadCount: {
    user: number;
    collector: number;
    admin: number;
  };
}

const initialState: NotificationState = {
  unreadCount: {
    user: 0,
    collector: 0,
    admin: 0,
  },
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setUnreadCount: (
      state,
      action: PayloadAction<{ role: Role; count: number }>
    ) => {
      state.unreadCount[action.payload.role] = action.payload.count;
    },
    incrementUnreadCount: (state, action: PayloadAction<Role>) => {
      state.unreadCount[action.payload] += 1;
    },
    decrementUnreadCount: (state, action: PayloadAction<Role>) => {
      const role = action.payload;
      state.unreadCount[role] = Math.max(0, state.unreadCount[role] - 1);
    },
    resetUnreadCount: (state, action: PayloadAction<Role>) => {
      state.unreadCount[action.payload] = 0;
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
