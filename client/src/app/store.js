import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import rootreducer from "./rootReducer";
import { authApi } from "@/features/api/authApi";

// Configure persist options
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'] // Only persist auth reducer
};

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootreducer);

export const appStore = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE']
        }
      }).concat([authApi.middleware]),
});

export const persistor = persistStore(appStore);

const initializeApp = async () => {
  const state = appStore.getState();
  const isAuthenticated = state.auth.isAuthenticated;

  if(isAuthenticated) {
    await appStore.dispatch(authApi.endpoints.loaduser.initiate(undefined, { forceRefetch: true }));
  }
};

initializeApp();
