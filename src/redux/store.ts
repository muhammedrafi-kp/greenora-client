import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import pickupReducer from "./pickupSlice";
import notificationReducer from "./notificationSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    pickup: pickupReducer,
    notification: notificationReducer
  },

});

export default store;
