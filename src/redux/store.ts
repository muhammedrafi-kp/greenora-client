// import { configureStore ,combineReducers} from '@reduxjs/toolkit';
// import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
// import { persistReducer, persistStore } from 'redux-persist';
// import adminAuthReducer from './adminAuthSlice';


// const persistConfig = {
//   key: 'root',
//   storage,
// };

// const rootReducer = combineReducers({
//   adminAuth: adminAuthReducer,
// });

// const persistedReducer = persistReducer(persistConfig, rootReducer);

// export const store = configureStore({
//   reducer: persistedReducer
// });

// export const persistor = persistStore(store);

// export type RootState = ReturnType<typeof store.getState>;

// export type AppDispatch = typeof store.dispatch;



import { configureStore, combineReducers } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import adminAuthReducer from './adminAuthSlice';

const persistConfig = {
  key: 'root',
  storage,
};

const rootReducer = combineReducers({
  adminAuth: adminAuthReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
