import { configureStore } from '@reduxjs/toolkit';
import authReducer from './api/auth/authSlice';
import { teamApi } from './api/team/teamApi';
import { apiSlice } from './api/auth/apiSlice';
import { commonApi } from './api/common/commonApi';
import incidentReducer from './api/common/incidentSlice';
import storage from "redux-persist/lib/storage"; 
import { persistStore, persistReducer } from "redux-persist";

const persistConfig = {
  key: "incident",
  storage,
};

const persistedIncidentReducer = persistReducer(persistConfig, incidentReducer);

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    incident: persistedIncidentReducer, // Use persisted reducer here
    [teamApi.reducerPath]: teamApi.reducer,
    [commonApi.reducerPath]: commonApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
    }).concat(apiSlice.middleware, teamApi.middleware, commonApi.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
