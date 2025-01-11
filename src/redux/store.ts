import { configureStore } from "@reduxjs/toolkit";
import adminAuthReducer from "./adminAuthSlice";
import userAuthReducer from "./userAuthSlice";
import collectorAuthReducer from "./collectorAuthSlice";

const store = configureStore({
  reducer: {
    userAuth: userAuthReducer,
    collectorAuth: collectorAuthReducer,
    adminAuth: adminAuthReducer
  },
});

export default store;
