import { configureStore } from "@reduxjs/toolkit";
// import adminAuthReducer from "./adminAuthSlice";
import authReducer from "./authSlice";
// import collectorAuthReducer from "./collectorAuthSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    // collectorAuth: collectorAuthReducer,
    // adminAuth: adminAuthReducer
  },
});

export default store;
