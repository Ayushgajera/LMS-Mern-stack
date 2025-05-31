import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authslice";
import rootreducer from "./rootReducer";
import { authApi } from "@/features/api/authApi";
export const appStore = configureStore({
    reducer: rootreducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([authApi.middleware]),
});
const initializeApp = async () => {
  const state = appStore.getState();
  const token = state.auth.token;  // Assuming auth slice stores token here

  if(token) {
    await appStore.dispatch(authApi.endpoints.loaduser.initiate({}, { forceRefetch: true }));
  }
};
initializeApp();
