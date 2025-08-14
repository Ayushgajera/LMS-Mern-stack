import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '@/features/authslice';
import { authApi } from '@/features/api/authApi';
import { courseApi } from '@/features/api/courseApi';
import { courseProgressApi } from '@/features/api/courseProgressApi';
import { paymentApi } from '@/features/api/paymentApi';

const rootReducer = combineReducers({
  auth: authReducer,
  [authApi.reducerPath]: authApi.reducer,
  [courseApi.reducerPath]: courseApi.reducer,
  [courseProgressApi.reducerPath]: courseProgressApi.reducer,
  [paymentApi.reducerPath]: paymentApi.reducer
});

export default rootReducer;