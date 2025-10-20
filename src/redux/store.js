import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import customersReducer from './customersSlice';
import leadsReducer from './leadsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    customers: customersReducer,
    leads: leadsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

