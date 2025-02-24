import { configureStore } from '@reduxjs/toolkit';
import authReducer from './api/auth/authSlice';
import { teamApi } from './api/team/teamApi';
import { apiSlice } from './api/auth/apiSlice';
import { commonApi } from './api/common/commonApi';
import incidentReducer from './api/common/incidentSlice';

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    incident: incidentReducer,
    [teamApi.reducerPath]: teamApi.reducer,
    [commonApi.reducerPath]: commonApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware,teamApi.middleware,commonApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
