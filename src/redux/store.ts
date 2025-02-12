import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import pickupReducer from "./pickupSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    pickup: pickupReducer,
  },

});

export default store;
